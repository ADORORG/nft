import { Schema, model, models, type Model } from 'mongoose';
import { dbCollections } from '../app.config';
import type MarketBidType from '../types/bid';

const { bids, marketOrders, accounts } = dbCollections;

const MarketBidSchema = new Schema<MarketBidType>({
    marketOrder: {
        type: Schema.Types.ObjectId, 
        ref: marketOrders, 
        required: true,
        index: true
    },
    bidder: {type: String, ref: accounts, required: true, index: true},
    price: {type: String, required: true},
    txHash: {type: String, required: true},
    createdAt: {type: Date, get: (v: Date) => v.getTime()},
    updatedAt: {type: Date, get: (v: Date) => v.getTime()}
}, {
    collection: bids,
    timestamps: true
});

MarketBidSchema.set('toObject', {
    flattenMaps: true, 
    flattenObjectIds: true,
    versionKey: false
})

export default (models[bids] as Model<MarketBidType>) || model<MarketBidType>(bids, MarketBidSchema);

