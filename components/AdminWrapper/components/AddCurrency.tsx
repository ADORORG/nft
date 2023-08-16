import type { CryptocurrencyType } from "@/lib/types/currency"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import Button from "@/components/Button"
import CurrencyForm from "./CurrencyForm"
import apiRoutes from "@/config/api.route"

export default function AddCurrency() {
    const [currencyData, setCurrencyData] = useState<Partial<CryptocurrencyType>>({})
    const [loading, setLoading] = useState(false)
    const [currencyCreated, setCurrencyCreated] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type } = e.target
        if (type === "checkbox" && "checked" in e.target) {
			setCurrencyData({...currencyData, [name]: e.target.checked})
		} else {
            setCurrencyData({...currencyData, [name]: value})            
        }
    }

    const handleSubmit = async () => {
        try {
            setLoading(true)
            const requiredCurrencyFields = [
                "name", "cid", "symbol", "decimals",
                "chainId", "address", "logoURI", "marketId"
            ] as const
            // const allFieldFilled = requiredCurrencyFields.every(field => currencyData[field])            
            for (const field of requiredCurrencyFields) {
                if (!currencyData[field]) {
                    throw new Error(field + " is required")
                }
            }

            const response = await fetcher(apiRoutes.addNewCurrency, {
                method: "POST",
                body: JSON.stringify(currencyData)
            })

            if (response.success) {
                toast.success(response.message)
                setCurrencyCreated(true)
            }

        } catch (error: any) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    } 

    return (
        <div className="my-4">
            <CurrencyForm
                currency={currencyData}
                onChange={handleChange}
                containerClassName=""
            />
            <Button
                onClick={handleSubmit}
                variant="secondary"
                loading={loading}
                disabled={loading || currencyCreated}
                rounded
            >
                {currencyCreated ? "Currency added" : "Submit"}
            </Button>
        </div>
    )
}