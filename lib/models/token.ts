import { Schema, model } from 'mongoose';
import { dbCollections } from '../app.config';
import type NftTokenType from '../types/token';

const { collections: xcollections, tokens, contracts, accounts } = dbCollections;

const TokenSchema = new Schema<NftTokenType>({
    tokenId: {type: String, required: true},
    supply: Number,
    name: String,
    description: String,
    image: String,
    media: String,
    mediaType: String,
    externalUrl: String,
    backgroundColor: String,
    redeemable: Boolean,
    redeemableContent: String,
    attributes: {type: Array, default: []},
    tags: [String],
    views: Number,
    royalty: Number,
    xcollection: {type: Schema.Types.ObjectId, ref: xcollections, index: true}, // 'collection' is a reserved keyword in Mongoose
    contract: {type: Schema.Types.ObjectId, ref: contracts, required: true, index: true},
    owner: {type: String, ref: accounts, required: true, index: true},    
    createdAt: {type: Date, get: (v: Date) => v.getTime()},
    updatedAt: {type: Date, get: (v: Date) => v.getTime()}
}, {
    collection: tokens,
    timestamps: true
});

export default model<NftTokenType>(tokens, TokenSchema);