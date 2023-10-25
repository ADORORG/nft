import { Schema, model, models, type Model } from 'mongoose';
import { dbCollections } from '../app.config';
import type NftTokenType from '../types/token';

const { collections: xcollections, tokens, contracts, accounts } = dbCollections;

const TokenSchema = new Schema<NftTokenType>({
    tokenId: {type: Number, min: 0, required: function() { return !(this as any).draft }},
    draft: { type: Boolean, default: function() { return !(this as any).tokenId }},
    supply: Number,
    name: String,
    description: String,
    image: String,
    media: {type: String},
    mediaType: {type: String},
    externalUrl: String,
    backgroundColor: String,
    redeemable: Boolean,
    redeemableContent: {type: String, required: function() { return (this as any).redeemable }},
    attributes: {type: Array, default: []},
    tags: String,
    views: Number,
    royalty: Number,
    transferrable: {type: Boolean, default: true},
    xcollection: {type: Schema.Types.ObjectId, ref: xcollections, required: true, index: true}, // 'collection' is a reserved keyword in Mongoose
    contract: {type: Schema.Types.ObjectId, ref: contracts, required: true, index: true},
    owner: {type: String, ref: accounts, required: true, index: true},  
    createdAt: {type: Date},
    updatedAt: {type: Date}
}, {
    collection: tokens,
    timestamps: true
});

/* TokenSchema.post('find', function(docs: NftTokenType[]) {
    docs.forEach(function(doc) {
        doc?.toObject?.({
            flattenMaps: true,
            flattenObjectIds: true,
            versionKey: false
        })
    })
}) */

export default (models[tokens] as Model<NftTokenType>) || model<NftTokenType>(tokens, TokenSchema);