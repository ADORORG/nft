"use client"
import type { PopulatedMarketOrderType } from "@/lib/types/market"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { marketFilterStore } from "@/store/form"
import { MarketListingCard } from "@/components/Card"
import NavigationButton from "@/components/NavigationButton"

interface MarketplaceItems {
    orders: PopulatedMarketOrderType[],
    limit: number,
    currentPage: number
}

export default function MarketplaceItems(props: MarketplaceItems) {
    const router = useRouter()
    const [marketFilter] = useAtom(marketFilterStore)
    const { totalOrder, nftSchema, saleType, createdAt } = marketFilter
    const { limit, currentPage } = props

    const lastPage = totalOrder ? Math.ceil(totalOrder / limit) : 1
    const nextPage = lastPage > currentPage ? currentPage + 1 : 0
    const previousPage = currentPage > 1 ? currentPage - 1 : 0

    return (
        <div className="flex flex-col gap-4 py-8 px-4">
            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-4">
                {
                    props.orders
                    // Not filter by nftSchema or nftSchema === "all" otherwise, filter nftSchema
                    .filter(o => (
                        // Filter nft schema
                        (!nftSchema || nftSchema === "all" || nftSchema === o.token.contract.nftSchema)
                        &&
                        // Filter by saleType
                        (!saleType || saleType === "all" || saleType === o.saleType)
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
                }
            </div>
            <div className="flex flex-row gap-4 my-4 mx-4">
                <NavigationButton 
                    direction="left"
                    text="Previous Page"
                    disabled={!previousPage}
                    onClick={() => router.push(`/marketplace/${previousPage}`)}
                />
                <NavigationButton 
                    direction="right"
                    text="Next Page"
                    disabled={!nextPage}
                    onClick={() => router.push(`/marketplace/${nextPage}`)}
                />
            </div>
        </div>
    )
}