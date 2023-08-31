import type { Types } from 'mongoose'
import type AccountType from './account'

export interface AttributeType {
    trait_type: string;
    value: string;
}

/** Available sale type in the marketplace */
export const MARKET_SALE_TYPES = ['fixed', 'auction', 'offer'] as const
/** Marketplace order listing type. Offchain for atomic order matching. Applicable to 'fixed' sale type */
export const MARKET_PERMIT_TYPES = ['onchain', 'offchain'] as const
/** Marketplace order status */
export const MARKET_STATUS_TYPES = ['active', 'sold', 'cancelled'] as const
/** NFT contract schema type */
export const NFT_CONTRACT_SCHEMA = ['erc721', 'erc1155'] as const
/** NFT contract edition type */
export const NFT_CONTRACT_EDITION = ['open_edition', 'limited_edition', 'one_of_one', 'generative_series', 'private'] as const

/** Available sale type in the marketplace */
export type MarketSaleType = typeof MARKET_SALE_TYPES[number]
/** Marketplace order listing type. Offchain for atomic order matching. Applicable to 'fixed' sale type */
export type MarketPermitType = typeof MARKET_PERMIT_TYPES[number]
/** Marketplace order status */
export type MarketStatusType = typeof MARKET_STATUS_TYPES[number]
/** NFT contract schema type */
export type NftContractSchemaType = typeof NFT_CONTRACT_SCHEMA[number]
/** NFT contract edition type */
export type NftContractEditionType = typeof NFT_CONTRACT_EDITION[number]

/** Ethereum Address type. @todo - Needs to rewritten */
export type EthereumAddress = `0x${string}` | string // Needs to implement ETH address type

/** Trader account type */
export type TopTraderAccountType = {
    /** Dollar value of market order for this account */
    dollarValue: number,
    /** Account to which this value belongs */
    owner: AccountType
}

/** Total marketplace order value in cryptocurrency */
export type TotalMarketValueByCryptoCurrencyType = {
    /** Currency object _id */
    _id: Types.ObjectId,
    /** Amount in cryptocurrency */
    amount: number,
    /** Number of market orders for this currency */
    orderCount: number
}

/** Total marketplace order value in dollar type */
export type TotalMarketValueInDollarType = {
    /** Value in dollar (usd) */
    dollarValue: number,
    /** Number of market orders */
    orderCount?: number
}

/** The response type from /api fetch */
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

/** The req.body interface for finalising marketplace order */
export type FinaliseMarketOrderType = {
    /** The purchase transaction hash */
    saleTxHash: string,
    /** The _id of the buyer */
    buyerId: EthereumAddress,
    /** The price token was sold */
    soldPrice: string
}

/** Marketplace filter data interface  */
export type MarketFilterType = {
    saleType: MarketSaleType | 'all',
    nftSchema: NftContractSchemaType | 'all',
    createdAt: 1 | -1,
    totalOrder: number
}

export type OnchainMintResponse = {
    /** The minted token id */
    tokenId: number | string,
    /** The address that received the token */
    to: string,
    /** The quantity that was transferred to address. Always 1 for erc721 */
    quantity: number
}