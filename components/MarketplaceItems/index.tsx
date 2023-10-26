"use client"
import type { PopulatedMarketOrderType } from "@/lib/types/market"
import { useAtom } from "jotai"
import { marketFilterStore } from "@/store/form"
import { MarketListingCard } from "@/components/Card"
import Pagination from "@/components/Pagination"
import appRoutes from "@/config/app.route"

interface MarketplaceItems {
    orders: PopulatedMarketOrderType[],
    limit: number,
    currentPage: number
}

export default function MarketplaceItems(props: MarketplaceItems) {
    const [marketFilter] = useAtom(marketFilterStore)
    const { totalOrder, nftSchema, saleType, createdAt, category } = marketFilter
    const { limit, currentPage } = props

    return (
        <div className="flex flex-col gap-4 py-8 px-4">
            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-4">
                {
                    props.orders && props.orders.length > 0 ?
                    props.orders
                    // Not filter by nftSchema or nftSchema === "all" otherwise, filter nftSchema
                    .filter(o => (
                        // Filter nft schema
                        (!nftSchema || nftSchema === "all" || nftSchema === o.token.contract.nftSchema)
                        &&
                        // Filter by saleType
                        (!saleType || saleType === "all" || saleType === o.saleType)
                        &&
                        // Filter by category
                        (!category || category === "all" || category === o.token.xcollection.category)
                    ))
                    .sort((o1, o2) => (
                        Number(createdAt) === 1 ? 
                        o1.createdAt?.getTime() as number - (o2.createdAt?.getTime() as number)
                        :
                        o2.createdAt?.getTime() as number - (o1.createdAt?.getTime() as number)
                    ) )
                    .map((order) => (
                        <MarketListingCard
                            key={order._id?.toString()}
                            marketOrder={order}
                        />
                    ))
                    :
                    <div className="px-2 py-6">
                        <p className="">No orders found</p>
                    </div>
                }
            </div>
            <Pagination 
                totalDocument={totalOrder || 0}
                limitPerPage={limit}
                currentPage={currentPage}
                linkPrefix={appRoutes.marketplace}
            />
        </div>
    )
}