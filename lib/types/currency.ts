import { Types, Document } from 'mongoose'
import { EthereumAddress } from './common'

export interface FiatCurrencyDataType {
    name: string;
    iso: string;
    symbol: string;
    image: string;
}

export type IsoAsKeyDataType<T> =  T[keyof T];

export interface CryptocurrencyMarketDataType {
    [key: string]: string;
}

// Cryptocurrency data type
export interface CryptocurrencyType extends Partial<Document> {
    /** Currency document _id */
    _id?: Types.ObjectId;
    /** Name of the currency e.g 'Binance Coin', 'Ethereum' */
    name: string;
    /** Currency id e.g ethereum, bitcoin, binancecoin */
    cid: string;
    /** Symbol of the currency */
    symbol: string;
    /** Currency decimals */
    decimals: number;
    /** Chain id of the currency */
    chainId: number;
    /** Contract address of the currency. Zero address for chain coin like ETH on ETH blockchain, BNB on BSC blockchain */
    address: EthereumAddress;
    /** Logo URI, relative/absolute URI. */
    logoURI: string;
    /** Price object containing usd, gbp price and changes. */
    price?: Record<string, string>;
    /** Concatenation of cid and chainId */
    uid?: string;
    /** Market id on market cap */
    marketId?: string
}