import type MarketOrderType from "@/lib/types/market"
import type { PopulatedMarketBidType } from "@/lib/types/bid"
import type { AppRouterApiResponseType } from "@/lib/types/common"
import { replaceUrlParams } from "@/utils/main"
import useSWR from "swr"
import apiRoutes from "@/config/api.route"

export function useTokenMarketOrders(tokenDocId: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<MarketOrderType[]>>(
        tokenDocId ? 
        replaceUrlParams(apiRoutes.getTokenMarketOrders, {tokenDocId})
        : null
    )

    return {
        marketOrders: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}

export function useTokenMarketOrderBids(marketOrderDocId?: string) {
    const { data, error, isLoading } = useSWR<AppRouterApiResponseType<PopulatedMarketBidType[]>>(
        marketOrderDocId ? 
        replaceUrlParams(apiRoutes.getTokenMarketOrderBids, {marketOrderDocId})
        : null
    )

    return {
        marketOrderBids: data ? data.data : undefined,
        isLoading,
        isError: !!error
    }
}