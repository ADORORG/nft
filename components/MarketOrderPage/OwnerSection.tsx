import type { MarketOrdersProp } from "./types"
import type TokenPageProps from "@/components/TokenPage/types"
import ShowActiveOffers from "./ShowActiveOffers"
import AddTokenToMarket from "./AddTokenToMarket"
import CancelListingButton from "./CancelListingButton"

export default function OwnerSection(props: MarketOrdersProp & TokenPageProps) {
    if (props.activeOrder) {
        return (
            <CancelListingButton 
                order={props.activeOrder} 
            />
        )
    }
    // Get list of active offers
    const activeOffers = props.orders.filter(order => order.saleType === "offer" && order.status === "active")

    if (activeOffers.length) {
        return (
            <ShowActiveOffers 
                orders={activeOffers} 
            />
        )
    }
   
    return (
        <AddTokenToMarket 
            token={props.token}
        />
    )
}