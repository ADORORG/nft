import type { PageProps } from "../../types"
import type { PopulatedMarketOrderType } from "@/lib/types/market"
import { MarketListingCard } from "@/components/Card"
import Pagination from "@/components/Pagination"
import appRoute from "@/config/app.route"
import { replaceUrlParams } from "@/utils/main"

// Server
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import { getMarketOrdersByQuery, countMarketOrderByQuery } from "@/lib/handlers"

const DOCUMENT_BATCH = 25

async function getServerSideData({address, pageNumber}: {address: string, pageNumber: number}) {
    await mongoooseConnectionPromise
    
    const query = {
        $or: [{seller: address.toLowerCase()}, {buyer: address.toLowerCase()}]
    }

    const [ marketOrders, marketOrdersCount ] = await Promise.all([
        getMarketOrdersByQuery(query, {
            limit: DOCUMENT_BATCH, 
            skip: (pageNumber - 1) * DOCUMENT_BATCH
        }),
        countMarketOrderByQuery(query)
    ])
    return {
        marketOrders: marketOrders as PopulatedMarketOrderType[],
        marketOrdersCount
    } 
}

export default async function Page({address, pagination: pageNumber}: PageProps) {
    const {marketOrders, marketOrdersCount} = await getServerSideData({address, pageNumber: Number(pageNumber)})

    return (
        <div>
            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 px-4 pt-6 pb-12">
                {   
                    marketOrders &&
                    marketOrders.length ?
                    marketOrders.map(marketOrder => (
                        <MarketListingCard
                            key={marketOrder?._id?.toString()}
                            marketOrder={marketOrder}
                        />
                    ))
                    :
                    <p className="text-center">Nothing&apos;s here</p>
                }
            </div>

            <Pagination
                totalDocument={marketOrdersCount || 0}
                limitPerPage={DOCUMENT_BATCH}
                currentPage={Number(pageNumber)}
                linkPrefix={`${replaceUrlParams(appRoute.viewAccount, {address: address.toLowerCase()})}/marketplace`}
            />
        </div>
    )
}