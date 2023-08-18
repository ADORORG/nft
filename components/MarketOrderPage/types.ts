import type { PopulatedMarketOrderType } from "@/lib/types/market"
import type { PopulatedMarketBidType } from "@/lib/types/bid"

export interface MarketOrdersProp {
    readonly orders: PopulatedMarketOrderType[],
    readonly activeOrder?: PopulatedMarketOrderType
}

export interface MarketOrderProp {
    readonly order: PopulatedMarketOrderType
}

export interface MarketOrderBids extends MarketOrderProp {
    readonly bids: PopulatedMarketBidType[]
}

export interface MarketOrderBid extends MarketOrderProp {
    readonly bid: PopulatedMarketBidType
}