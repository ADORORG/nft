import type { CryptocurrencyType } from "@/lib/types/currency"
import { useState } from "react"
import { useAllCurrencies } from "@/hooks/fetch"
import { ListSkeleton } from "@/components/Skeleton"
import UpdateCurrency from "./UpdateCurrency"

export default function ViewCurrencies() {
    const { currencies, isLoading } = useAllCurrencies()
    const screen = currencies ? "currencies" : isLoading ? "isLoading" : "isError"

    const screenMap = {
        "isLoading": <ListSkeleton />,
        "isError": <div className="flex items-center justify-center py-8"><span>Error occurred</span></div>,
        "currencies": currencies?.map((currency: CryptocurrencyType) => <ViewCurrency key={currency._id?.toString()} currency={currency} />)
    }

    return (
        <div className="flex flex-col justify-center md:min-w-[400px]">
            {screenMap[screen]}
        </div>
    )
}

function ViewCurrency({currency}: {currency: CryptocurrencyType}) {
    const [screen, setScreen] = useState<"currency" | "updateCurrency">("currency")

    const updateDone = () => {
        setScreen("currency")
    }

    return (
        <div className="">
        {
            screen === "currency" ?
            <div 
                onClick={() => setScreen("updateCurrency")}
                className="cursor-pointer w-full flex flex-col md:flex-row justify-between gap-2 mx-2 my-2 p-2 rounded text-gray-950 bg-gray-100 dark:text-gray-100 dark:bg-gray-900"
            >
                <span className="flex" title="Name[chainId]">
                    {/* eslint-disable-next-line */}
                    <img 
                        src={currency.logoURI}
                        alt=""
                        className="h-5"
                    />&nbsp;
                    <span>{currency.name}[{currency.chainId}]</span>
                </span>
                <span title="Symbol">{currency.symbol}</span>
                <span title="Decimals">{currency.decimals}</span>
                <span title="Status">{currency.disabled ? "Disabled" : "In use"}</span>
            </div>
            :
            <div className="">
                <UpdateCurrency 
                    currency={currency} 
                    done={updateDone} 
                />
            </div>
        }

        </div>
        
    )
}