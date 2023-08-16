import type { CryptocurrencyType } from "@/lib/types/currency"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"
import CurrencyForm from "./CurrencyForm"

export default function UpdateCurrency({ currency, done }: {currency: CryptocurrencyType, done?: (...arg: any) => void}) {
    const [currencyData, setCurrencyData] = useState({...currency})
    const [loading, setLoading] = useState(false)

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
                "_id",
                "name", "cid", "symbol", "decimals",
                "chainId", "address", "logoURI", "marketId"
            ]

            for (const field in requiredCurrencyFields) {
                if (!requiredCurrencyFields[field]) {
                    throw new Error(field + " is required")
                }
            }

            const response = await fetcher(replaceUrlParams(apiRoutes.updateCurrency, {
                currencyDocId: currencyData._id as any
            }), {
                method: "POST",
                body: JSON.stringify(currencyData)
            })

            if (response.success) {
                toast.success(response.message)
                done?.()
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

            <div className="flex flex-row gap-3 items-center">
                <Button
                    onClick={handleSubmit}
                    variant="secondary"
                    loading={loading}
                    disabled={loading}
                    rounded
                >
                    Submit
                </Button>
                {    

                    <Button
                        onClick={done}
                        rounded
                    >
                        Cancel
                    </Button>
                }

            </div>
        </div>
    )
}