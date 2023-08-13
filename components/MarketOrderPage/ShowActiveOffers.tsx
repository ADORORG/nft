import type { MarketOrdersProp, MarketOrderProp } from "./types"
import Button from "@/components/Button"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import { AccountAvatar } from "../UserAccountAvatar"

export default function ShowActiveOffers(props: MarketOrdersProp) {

    return (
        <div className="my-4 drop-shadow-xl p-4 flex flex-col gap-4">
            <h5 className="my-3">Offer</h5>
            {
                props.orders.map((order) => (
                    <ShowSingleActiveOffer
                        key={order._id?.toString()}
                        order={order}
                    />
                ))
            }
        </div>
    )
}


function ShowSingleActiveOffer(props: MarketOrderProp) {

    return (
        <div className="flex flex-row justify-between items-center py-1">
            <span>
                <AccountAvatar
                    account={props.order.buyer}
                    height={24}
                />
            </span>
            <span>
                <CryptoCurrencyDisplay
                    currency={props.order.currency}
                    amount={props.order.price}
                    height={12}
                />
            </span>

            <div className="flex flex-wrap gap-2 justify-center">
                <Button
                    className="text-sm"
                    variant="secondary"
                    rounded
                >Accept</Button>
                
                <Button
                    className="text-sm"
                    variant="secondary"
                    inversed
                    rounded
                >
                    Reject</Button>
            </div>
        </div>
    )
}