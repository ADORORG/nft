import { Types, Document } from 'mongoose';
import type { EthereumAddress } from "./common"
import type { MarketSaleType, MarketPermitType, MarketStatusType } from './common';
import type { CryptocurrencyType } from './currency';
import type AccountType from './account';
import type { default as NftTokenType, PopulatedNftTokenType } from './token';

export default interface MarketOrderType extends Document {
    _id?: Types.ObjectId | String;
    token: Types.ObjectId | String | NftTokenType;
    /**
     * The price for fixed sale, starting price for auctions or offer price for an offer
     */
    price: string;
    /**
     * The price for which an auction can be bought instantly
     */
    buyNowPrice?: string;
    /**
     * Sold price for an item that was sold
     */
    soldPrice?: string;
    saleType: MarketSaleType;
    quantity: number;
    seller: EthereumAddress | AccountType;
    buyer?: EthereumAddress | AccountType;
    permitType: MarketPermitType;
    status: MarketStatusType;
    /**
     * Date and time when an auction will end
     */
    endsAt?: Date | number;
    currency: Types.ObjectId | string | CryptocurrencyType;
    /**
     * Transaction hash from market listing. It's not available for an offchain listing
     */
    listTxHash?: string;
    /**
     * Transaction hash for sold items
     */
    saleTxHash?: string;
    /**
     * Transaction hash for cancelled items
     */
    cancelTxHash?: string;
    /**
     * The approval signature for offchain order 
     */
    approvalSignature?: string;
    /**
     * The order signature for offchain order
     */
    orderSignature?: string;
    /**
     * Epoch timestamp for offchain order deadline
     */
    orderDeadline?: string;
    /**
     * The version of marketplace contract for this order
     */
    version: string;
    createdAt?: number | Date;
    updatedAt?: number | Date;
}

export interface PopulatedMarketOrderType extends MarketOrderType {
    token: PopulatedNftTokenType
    seller: AccountType
    buyer?: AccountType
}