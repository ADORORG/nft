import Image from "next/image"
import type { CryptocurrencyType } from "@/lib/types/currency"

export default function CurrencyDisplay(
    {currency, amount}: 
    {currency: CryptocurrencyType, amount: string}) {

    const { symbol, logoURI, /* price */ } = currency
    
    return (
        <div 
            className="flex justify-start items-center"
            title={`${amount} ${symbol}`}
        >
            <Image 
                className="w-[18px] lg:w-[30px] mr-2"
                src={logoURI}
                alt={symbol}
                width={24}
                height={24}
            />
            <span className="text-gray-900 dark:text-white lg:text-3xl tracking-wide">{amount} {symbol}</span>
        </div>
    )
}