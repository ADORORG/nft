import type { TotalMarketValueInDollarType } from "@/lib/types/common"
import { formatNumber } from "@/lib/utils/main"

type MarketValueSummaryProps = {
    marketValue: TotalMarketValueInDollarType
}

export default function MarketValueSummary({ marketValue: {dollarValue, orderCount} }: MarketValueSummaryProps) {
    return (
        <div className="bg-white dark:bg-gray-950 p-2">
            <div className="container px-6 py-16 mx-auto">
                <div className="flex flex-col md:flex-row gap-10 justify-center align-center">
                    <div className="text-center">
                        <h3 className="text-4xl md:text-5xl">{formatNumber(dollarValue)}k+</h3>
                        <span className="text-xl opacity-70">Market Value</span>
                    </div>
                    <div className="text-center">
                        <h3 className="text-4xl md:text-5xl">{orderCount}k+</h3>
                        <span className="text-xl opacity-70">Orders</span>
                    </div>
                </div>
            </div>
        </div>

    )
}