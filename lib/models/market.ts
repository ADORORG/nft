import { Schema, model } from 'mongoose';
import { dbCollections } from '../app.config';
import { MARKET_PERMIT_TYPES, MARKET_SALE_TYPES, MARKET_STATUS_TYPES } from '../types/common';
import type MarketOrderType from '../types/market';

const { marketOrders, tokens, accounts, currencies } = dbCollections;

const MarketOrderSchema = new Schema<MarketOrderType>({
    token: {type: Schema.Types.ObjectId, ref: tokens, required: true, index: true},
    price: {type: String, required: true},
    buyNowPrice: {type: String, required: function(this) { return (this as any).saleType === 'auction'}},
    soldPrice: {type: String},
    saleType: {type: String, required: true, enum: MARKET_SALE_TYPES},
    quantity: {type: Number, required: true},
    seller: {type: String, ref: accounts, required: true, index: true},
    buyer: {type: String, ref: accounts, index: true, required: function(this) { return (this as any).saleType === 'offer'}},
    permitType: {type: String, required: true, enum: MARKET_PERMIT_TYPES},
    status: {type: String, required: true, enum: MARKET_STATUS_TYPES},
    endsAt: {type: Date, get: (v: Date) => v.getTime(), required: function(this) { return (this as any).saleType !== 'fixed'}},
    currency: {type: Schema.Types.ObjectId, ref: currencies, required: true},
    listTxHash: {type: String, required: function(this) { return (this as any).permitType === 'onchain'}},
    saleTxHash: {type: String},
    cancelTxHash: {type: String},
    approvalSignature: {type: String, required: function(this) { return (this as any).permitType === 'offchain' && (this as any).saleType === 'fixed'}},
    orderSignature: {type: String, required: function(this) { return (this as any).permitType === 'offchain'}},
    orderDeadline: {type: String, required: function(this) { return (this as any).permitType === 'offchain'}},
    version: {type: String, required: true},
    createdAt: {type: Date, get: (v: Date) => v.getTime()},
    updatedAt: {type: Date, get: (v: Date) => v.getTime()}
}, {
    collection: marketOrders,
    timestamps: true
});

export default model<MarketOrderType>(marketOrders, MarketOrderSchema);