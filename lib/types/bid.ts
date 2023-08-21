import { Types, Document } from 'mongoose';
import type { EthereumAddress } from './common'
import type AccountType from './account';
import type MarketOrderType from './market';

export default interface MarketBidType extends Partial<Document> {
    /** Market bid document _id */
    _id?: Types.ObjectId;
    /** A populated market order or market document _id to which this bid belongs. */
    marketOrder: Types.ObjectId | MarketOrderType;
    /** A populated bidder account or bidder document _id */
    bidder: EthereumAddress | AccountType;
    /** Bid price */
    price: string;
    /** On-chain transaction hash */
    txHash: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PopulatedMarketBidType extends MarketBidType {
    marketOrder: MarketOrderType
    bidder: AccountType
}