import { Types } from 'mongoose'

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
export interface CryptocurrencyType {
    _id?: Types.ObjectId | String;
    name: string;
    cid: string; // we use coingecko id
    symbol: string;
    decimals: number;
    chainId: number;
    address: string;
    logoURI: string;
    price?: Record<string, string>;
}