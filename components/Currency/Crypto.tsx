import Image from "next/image"
import type { CryptocurrencyType } from "@/lib/types/currency"

type CurrencyDisplayProps = {
    currency: CryptocurrencyType
    amount: string
    width?: number
    height?: number
}

export default function CryptoCurrencyDisplay({currency, amount, width = 10, height = 10}: CurrencyDisplayProps) {
    const { symbol, logoURI, /* price */ } = currency
    
    return (
        <div 
            className="flex justify-start items-center"
            title={`${amount} ${symbol}`}
        >
            <Image 
                className={`w-[${width}px] mr-2`}
                src={logoURI}
                alt={symbol}
                width={width}
                height={height}
            />
            <span className="text-gray-900 dark:text-white tracking-wide">{amount} {symbol}</span>
        </div>
    )
}