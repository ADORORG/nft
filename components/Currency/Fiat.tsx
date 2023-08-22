import { formatNumber } from '@/lib/utils/main'

interface FiatCurrencyDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
    amount: string | number | bigint
}

export default function FiatCurrencyDisplay({amount, className}: FiatCurrencyDisplayProps) {
   
    return (
        <span className={`tracking-wide ${className}`}>
            {formatNumber(amount)}
        </span>
    )
}