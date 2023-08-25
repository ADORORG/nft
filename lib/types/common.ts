import type { Types } from 'mongoose'
import type AccountType from './account'

export interface AttributeType {
    trait_type: string;
    value: string;
}

export const MARKET_SALE_TYPES = ['fixed', 'auction', 'offer'] as const
export const MARKET_PERMIT_TYPES = ['onchain', 'offchain'] as const
export const MARKET_STATUS_TYPES = ['active', 'sold', 'cancelled'] as const
export const NFT_CONTRACT_SCHEMA = ['erc721', 'erc1155'] as const
export const NFT_CONTRACT_SALE_EVENT = ['open_edition', 'limited_edition', 'one_of_one', 'generative_series'] as const

export type MarketSaleType = typeof MARKET_SALE_TYPES[number];
export type MarketPermitType = typeof MARKET_PERMIT_TYPES[number]
export type MarketStatusType = typeof MARKET_STATUS_TYPES[number]
export type NftContractSchemaType = typeof NFT_CONTRACT_SCHEMA[number]
export type NftContractSaleEventType = typeof NFT_CONTRACT_SALE_EVENT[number]

export type EthereumAddress = `0x${string}` | string // Needs to implement ETH address type

export type TopTraderAccountType = {
    /** Dollar value of market order for this account */
    dollarValue: number,
    /** Account to which this value belongs */
    owner: AccountType
}

export type TotalMarketValueByCryptoCurrencyType = {
    /** Currency object _id */
    _id: Types.ObjectId,
    /** Amount in cryptocurrency */
    amount: number,
    /** Number of market orders for this currency */
    orderCount: number
}

export type TotalMarketValueInDollarType = {
    /** Value in dollar (usd) */
    dollarValue: number,
    /** Number of market orders */
    orderCount?: number
}

export type AppRouterApiResponseType<T=any> = {
    /** Status of the api response */
    success: boolean,
    /** Data returned from the request */
    data: T,
    /** Message describing the status of the action */
    message: string,
    /** Http code */
    code: string | number
}

export type FinaliseMarketOrderType = {
    /** The purchase transaction hash */
    saleTxHash: string,
    /** The _id of the buyer */
    buyerId: EthereumAddress,
    /** The price token was sold */
    soldPrice: string
}

export type MarketFilterType = {
    saleType: MarketSaleType | 'all',
    nftSchema: NftContractSchemaType | 'all',
    createdAt: 1 | -1,
    totalOrder: number
}