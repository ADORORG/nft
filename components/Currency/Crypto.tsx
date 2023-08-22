"use client"
import Image from "next/image"
import type { CryptocurrencyType } from "@/lib/types/currency"

interface CurrencyDisplayProps extends React.HTMLAttributes<HTMLImageElement> {
    currency: CryptocurrencyType
    amount: string
    width?: number
    height?: number
}

export default function CryptoCurrencyDisplay({currency, amount, width = 10, height = 10, className}: CurrencyDisplayProps) {
    const { symbol, logoURI } = currency
    
    return (
        <div 
            className="flex justify-start items-center"
            title={`${amount} ${symbol}`}
        >
            <Image 
                className={`mr-2 ${className}`}
                src={logoURI}
                alt={symbol}
                width={width}
                height={height}
            />
            <span className={`tracking-wide`}>{amount} {symbol}</span>
        </div>
    )
}