"use client"
import { useAuthStatus } from "@/hooks/account"
import type { MarketOrdersProp } from "./types"
import type TokenPageProps from "@/components/TokenPage/types"
import { useTokenMarketOrderBids } from "@/hooks/fetch"
import ShowActiveOrder from "./ShowActiveOrder"
import ShowOrderHistory from "./ShowOrderHistory"
import ShowOrderBids from "./ShowOrderBids"
import OwnerSection from "./OwnerSection"
import PublicSection from "./PublicSection"

export default function MarketOrderPage(props: MarketOrdersProp & TokenPageProps) {
    const { session } = useAuthStatus()
    const tokenIsOwnedBySessionAccount = session && session?.user.address === props.token?.owner?.address
    const activeOrder = props.orders.find(order => order.status === "active" && ["auction", "fixed"].includes(order.saleType))
    const isAuction = activeOrder && activeOrder.saleType === "auction"
    const { marketOrderBids } = useTokenMarketOrderBids(isAuction ? activeOrder._id?.toString() : undefined)
  
    return (
        <div className="w-[320px] md:w-[420px] text-gray-900 dark:text-white">
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
                        />
                    }

                    <ShowOrderHistory 
                        orders={props.orders} 
                    />

                    <ShowOrderBids
                        bids={marketOrderBids || []}
                        order={activeOrder as any}
                    />
            </div>
        </div>
    )
}