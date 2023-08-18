import type { MarketOrderProp } from "./types"
import BidForm from "./BidForm"
import BuyButton from "./BuyButton"

export default function ShowBuyOrBidForm(props: MarketOrderProp) {
    const isAuction = props.order && props.order.saleType === "auction"
   
    return (
        <div className="flex flex-row justify-center items-center py-6">
            {
                isAuction ?
                <BidForm
                    order={props.order}
                />
                :
                <BuyButton
                    order={props.order}
                />
            }
        </div>
    )
}