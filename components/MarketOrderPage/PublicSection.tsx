import type { MarketOrdersProp } from "./types"
import type TokenPageProps from "@/components/TokenPage/types"
import ShowBuyOrBidForm from "./ShowBuyOrBidForm"
import ShowOfferForm from "./ShowOfferForm"

export default function PublicSection(props: MarketOrdersProp & TokenPageProps) {
    if (props.activeOrder) {
        return (
            <ShowBuyOrBidForm 
                order={props.activeOrder} 
            />
        )
    }
    // By default, user should be able to post an offer
    // if the token is not on sale i.e no active order
    return (
        <ShowOfferForm 
            token={props.token} 
            orders={props.orders}
        />
    )
}