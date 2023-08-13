import { formatNumber } from '@/lib/utils/main'

interface FiatCurrencyDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
    amount: string | number | bigint
}

export default function FiatCurrencyDisplay({amount, className}: FiatCurrencyDisplayProps) {
   
    return (
        <span className={`text-gray-900 dark:text-white tracking-wide ${className}`}>
            {formatNumber(amount)}
        </span>
    )
}