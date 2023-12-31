"use client"
import { useAuthStatus } from "@/hooks/account"
import type { MarketOrdersProp, MarketOrderBids } from "./types"
import type TokenPageProps from "@/components/TokenPage/types"
// import { useTokenMarketOrderBids } from "@/hooks/fetch"
import ShowActiveOrder from "./ShowActiveOrder"
import ShowOrderHistory from "./ShowOrderHistory"
import ShowOrderBids from "./ShowOrderBids"
import OwnerSection from "./OwnerSection"
import PublicSection from "./PublicSection"

export default function MarketOrderPage(props: MarketOrdersProp & TokenPageProps & Partial<MarketOrderBids>) {
    const { session } = useAuthStatus()
    const tokenIsOwnedBySessionAccount = session && session?.user.address === props.token?.owner?.address
    const activeOrder = props.orders.find(order => order.status === "active" && ["auction", "fixed"].includes(order.saleType))
    // const isAuction = activeOrder && activeOrder.saleType === "auction"
    // const { marketOrderBids } = useTokenMarketOrderBids(isAuction ? activeOrder._id?.toString() : undefined)
  
    return (
        <div className="w-full text-gray-900 dark:text-gray-100 px-6">
            <div className="flex flex-col h-max">
                    {
                        activeOrder ?
                        <ShowActiveOrder 
                            order={activeOrder} 
                        />
                        :
                        null
                    }
                    {
                        tokenIsOwnedBySessionAccount ?
                        <OwnerSection 
                            orders={props.orders} 
                            token={props.token} 
                            activeOrder={activeOrder}
                        />
                        :
                        <PublicSection 
                            orders={props.orders} 
                            token={props.token} 
                            activeOrder={activeOrder}
                            bids={props.bids}
                        />
                    }

                    <ShowOrderHistory 
                        orders={props.orders} 
                    />

                    {
                        props.bids &&
                        props.bids.length ?
                        <ShowOrderBids
                            bids={props.bids}
                            order={activeOrder as any}
                        />
                        :
                        null
                    }        
            </div>
        </div>
    )
}