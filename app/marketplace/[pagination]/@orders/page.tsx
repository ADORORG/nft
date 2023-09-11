import type { PopulatedMarketOrderType } from "@/lib/types/market"
import MarketplaceItems from "@/components/MarketplaceItems"
// Server
import mongoooseConnectionPromise from "@/wrapper/mongoose_connect"
import { getMarketOrdersByQuery } from "@/lib/handlers"

const ORDER_BATCH = 100

async function getServerSideData(pagination: number) {
    await mongoooseConnectionPromise
    return getMarketOrdersByQuery({status: "active"}, {
        limit: ORDER_BATCH, 
        sort: {createdAt: -1},
        skip: ORDER_BATCH * (pagination - 1)
    })
}

export default async function Page({params}: {params: {pagination: string}}) {
    const marketOrders = await getServerSideData(Number(params.pagination))

    return (
        // Market value and total orders are fetch in @filter
        // Total orders is passed to MarketplaceItems to determine if there's next page
        <MarketplaceItems
            orders={marketOrders as PopulatedMarketOrderType[]}
            limit={ORDER_BATCH}
            currentPage={Number(params.pagination)}
        />
    )
}