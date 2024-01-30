import type { PageProps } from "../../types"
import type { PopulatedMarketOrderType } from "@/lib/types/market"
import MarketplaceTable from "@/components/Table/Marketplace"
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
        seller: address.toLowerCase(),
        saleType: "offer"
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
            <div className="flex px-4 py-6">
                <MarketplaceTable
                    marketOrder={marketOrders}
                />
            </div>

            <Pagination
                totalDocument={marketOrdersCount || 0}
                limitPerPage={DOCUMENT_BATCH}
                currentPage={Number(pageNumber)}
                linkPrefix={`${replaceUrlParams(appRoute.viewAccount, {address: address.toLowerCase()})}/offer_received`}
            />
        </div>
    )
}