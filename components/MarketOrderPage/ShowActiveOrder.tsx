import type { MarketOrderProp } from "./types"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import { dateToRelativeDayAndHour } from "@/utils/date"

export default function ShowActiveOrder(props: MarketOrderProp) {
    const isAuction = props.order.saleType === "auction"
    const auctionTimeLeft = dateToRelativeDayAndHour(new Date(props.order?.endsAt ?? new Date()))

    return (
        <div>
            <div>
                <span>
                    Price: 
                </span>
                <CryptoCurrencyDisplay 
                    currency={props.order.currency} 
                    amount={props.order.price}
                />
            </div>
            {
                isAuction ? 
                <span>
                    Auction {auctionTimeLeft.future ? "ends" : "ended"}: {auctionTimeLeft.days}, {(auctionTimeLeft.hours)}
                </span>
                :
                null
            }
        </div>
    )
}