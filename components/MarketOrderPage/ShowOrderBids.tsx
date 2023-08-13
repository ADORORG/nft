import type { MarketOrderBids, MarketOrderBid, MarketOrderProp } from "./types"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import { UserAccountAvatarWithLink } from "../UserAccountAvatar"

export default function ShowOrderBids(props: MarketOrderBids) {

    return (
        <div className="flex flex-col gap-2 mt-2">
            <h3 className="mt-4 mb-2">Order Bids</h3>
            {
                !props.order || 
                !props.bids || 
                !props.bids.length ?
                <p className="text-center py-2">No data</p>
                :
                props.bids.map(bid => (
                    <ShowSingleBid
                        key={bid._id?.toString()}
                        bid={bid}
                        order={props.order}
                    />
                ))
            }
        </div>
    )
}


function ShowSingleBid(props: MarketOrderBid & MarketOrderProp) {

    return (
        <div className="flex flex-wrap justify-between items-center py-1 border-b border-b-gray-50 dark:border-b-gray-900">
            <span>
                <UserAccountAvatarWithLink
                    account={props.bid.bidder}
                    height={24}
                    prefix={3}
                    suffix={2}
                />
            </span>
            <span>
                <CryptoCurrencyDisplay
                    currency={props.order.currency}
                    amount={props.order.price}
                    height={12}
                />
            </span>
        </div>
    )
}