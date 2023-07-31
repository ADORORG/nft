import { formatNumber } from '@/lib/utils/main'

type FiatCurrencyDisplayProps = {
    amount: string | number | bigint
}

export default function FiatCurrencyDisplay({amount}: FiatCurrencyDisplayProps) {
   
    return (
        <span className="text-gray-900 dark:text-white tracking-wide">
            {formatNumber(amount)}
        </span>
    )
}