import type { MarketOrdersProp, MarketOrderProp } from "./types"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import { UserAccountAvatarWithLink } from "../UserAccountAvatar"

export default function ShowOrderHistory(props: MarketOrdersProp) {

    return (
        <div className="flex flex-col gap-2 mt-3">
            <h3 className="my-3">Order history</h3>
            {
                props.orders && 
                props.orders.length ?
                props.orders.map(order => (
                    <ShowSingleOrderHistory
                        key={order._id?.toString()}
                        order={order}
                    />
                ))
                :
                <p className="text-center py-2">No data</p>
            }
        </div>
    )
}

function ShowSingleOrderHistory(props: MarketOrderProp) {

    return (
        <div className="flex flex-wrap justify-between items-center py-1 border-b border-b-gray-100 dark:border-b-gray-900">
            <span>
                <UserAccountAvatarWithLink
                    account={props.order.saleType === "offer" ? props.order.buyer as any: props.order.seller}
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
            <span className="capitalize">
                {props.order.saleType}
            </span>
            <span className="capitalize">
                {props.order.status}
            </span>
            
        </div>
    )
}