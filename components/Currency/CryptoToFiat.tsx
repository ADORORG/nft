"use client"
import type { CryptocurrencyType } from "@/lib/types/currency"
import { ArrowRightShort } from "react-bootstrap-icons"
import { useAtom } from "jotai"
import { quoteCurrencyIso } from "@/store/common"
import { formatNumber } from "@/lib/utils/main"

interface CryptoToFiatProps {
    amount: string | number | undefined,
    currency: CryptocurrencyType,
    withIcon?: boolean,
    showZeroValue?: boolean
}

export default function CryptoToFiat(props: CryptoToFiatProps) {
    const [quoteCurrency] = useAtom(quoteCurrencyIso)
    const { amount = 0, currency, withIcon = false, showZeroValue = false } = props
    const price = currency ? currency.price : null
    const fiatValue = price ? Number(price[quoteCurrency]) * Number(amount) : 0

    if (!fiatValue && !showZeroValue) {
        return null
    }

    return (

        <span className="flex items-center">
            {
                withIcon ?
                <ArrowRightShort className="w-5" />
                :
                null
            }
            {
                formatNumber(fiatValue, {
                    currency: quoteCurrency.toUpperCase()
                })
            }
        </span>
    )
}