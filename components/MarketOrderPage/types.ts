import type { PopulatedMarketOrderType } from "@/lib/types/market"
import type { PopulatedMarketBidType } from "@/lib/types/bid"

export interface MarketOrdersProp {
    orders: PopulatedMarketOrderType[],
    activeOrder?: PopulatedMarketOrderType
}

export interface MarketOrderProp {
    order: PopulatedMarketOrderType
}

export interface MarketOrderBids extends MarketOrderProp {
    bids: PopulatedMarketBidType[]
}

export interface MarketOrderBid extends MarketOrderProp {
    bid: PopulatedMarketBidType
}