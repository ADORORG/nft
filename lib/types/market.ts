import { Types, /* Document */ } from 'mongoose';
import type { MarketSaleType, MarketPermitType, MarketStatusType, EthereumAddress } from './common';
import type { CryptocurrencyType } from './currency';
import type AccountType from './account';
import type { default as NftTokenType, PopulatedNftTokenType } from './token';

export default interface MarketOrderType /* extends Partial<Document> */ {
    /** Market order document _id */
    _id?: Types.ObjectId;
    /** Populated token or token document _id */
    token: Types.ObjectId | NftTokenType;
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
    /** Type of sale, one of 'fixed', 'auction' 'offer' */
    saleType: MarketSaleType;
    /** The amount being sold */
    quantity: number;
    /** A populated seller account or seller document _id */
    seller: EthereumAddress | AccountType;
    /** A populated buyer account or buyer document _id */
    buyer?: EthereumAddress | AccountType;
    /** 'Offchain' for off chain transaction and 'onchain' for on-chain transaction */
    permitType: MarketPermitType;
    /** Status of this order, 'active', 'sold', 'cancelled' */
    status: MarketStatusType;
    /**
     * Date and time when an auction will end
     */
    endsAt?: Date;
    /** A populated currency object for this order or the currency document _id */
    currency: Types.ObjectId | CryptocurrencyType;
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
     * Epoch timestamp in seconds for offchain order deadline.
     * The deadline for an offer and signature deadline for offchain order
     */
    orderDeadline?: number;
    /**
     * The version of marketplace contract for which this order is listed
     */
    version: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PopulatedMarketOrderType extends MarketOrderType {
    /** Populated nft token */
    token: PopulatedNftTokenType
    /** Populated seller account */
    seller: AccountType
    /** Populated buyer account */
    buyer?: AccountType
    /** The currency for listing */
    currency: CryptocurrencyType
}