import { Types } from 'mongoose';
import type { EthereumAddress } from "./common"
import type AccountType from './account';
import type MarketOrderType from './market';

export default interface MarketBidType {
    _id?: Types.ObjectId | String;
    marketOrder: Types.ObjectId | string | MarketOrderType;
    bidder: EthereumAddress | AccountType;
    price: string;
    txHash: string;
    createdAt?: number | Date;
    updatedAt?: number | Date;
}

export interface PopulatedMarketBidType extends MarketBidType {
    marketOrder: MarketOrderType
    bidder: AccountType
}