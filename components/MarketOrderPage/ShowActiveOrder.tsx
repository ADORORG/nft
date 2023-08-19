import type { MarketOrderProp } from "./types"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import { dateToRelativeDayAndHour } from "@/utils/date"

export default function ShowActiveOrder(props: MarketOrderProp) {
    const isAuction = props.order.saleType === "auction"
    const auctionTimeLeft = dateToRelativeDayAndHour(new Date(props.order?.endsAt ?? new Date()))

    return (
        <div className="pt-8 pb-4 flex flex-col gap-4 justify-center items-center">
            <h2 className="text-2xl py-6">
                {
                    isAuction ?
                    <span>
                        Bid on {props.order.token.name}#{props.order.token.tokenId}
                    </span>
                    :
                    <span>
                        Buy {props.order.token.name}#{props.order.token.tokenId}
                    </span>
                }

            </h2>
            <div className="flex flex-row items-center text-xl md:text-2xl gap-2 justify-center">
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
                <span className="text-xl">
                    Auction {auctionTimeLeft.future ? "ends" : "ended"}: {auctionTimeLeft.days}, {(auctionTimeLeft.hours)}
                </span>
                :
                null
            }
        </div>
    )
}