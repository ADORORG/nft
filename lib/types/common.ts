
export interface AttributeType {
    trait_type: string;
    value: string;
}

export const MARKET_SALE_TYPES = ['fixed', 'auction', 'offer'] as const
export const MARKET_PERMIT_TYPES = ['onchain', 'offchain'] as const
export const MARKET_STATUS_TYPES = ['active', 'sold', 'cancelled'] as const

export type MarketSaleType = typeof MARKET_SALE_TYPES[number];
export type MarketPermitType = typeof MARKET_PERMIT_TYPES[number]
export type MarketStatusType = typeof MARKET_STATUS_TYPES[number]

type FixedLengthString<L> = string & { __length__: never}
export type EthereumAddress = `0x${string}` | string // Needs to implement ETH address type
