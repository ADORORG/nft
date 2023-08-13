import { Schema, model, models, type Model } from 'mongoose';
import { dbCollections } from '../app.config';
import type NftTokenType from '../types/token';

const { collections: xcollections, tokens, contracts, accounts } = dbCollections;

const TokenSchema = new Schema<NftTokenType>({
    tokenId: {type: String, required: true, minlength: 1},
    supply: Number,
    name: String,
    description: String,
    image: String,
    media: String,
    mediaType: String,
    externalUrl: String,
    backgroundColor: String,
    redeemable: Boolean,
    redeemableContent: {type: String, required: function() { return (this as any).redeemable }},
    attributes: {type: Array, default: []},
    tags: String,
    views: Number,
    royalty: Number,
    xcollection: {type: Schema.Types.ObjectId, ref: xcollections, index: true}, // 'collection' is a reserved keyword in Mongoose
    contract: {type: Schema.Types.ObjectId, ref: contracts, required: true, index: true},
    owner: {type: String, ref: accounts, required: true, index: true},    
    createdAt: {type: Date},
    updatedAt: {type: Date}
}, {
    collection: tokens,
    timestamps: true
});

TokenSchema.post('find', function(docs: NftTokenType[]) {
    docs.forEach(function(doc) {
        doc?.toObject?.({
            flattenMaps: true,
            flattenObjectIds: true,
            versionKey: false
        })
    })
})

export default (models[tokens] as Model<NftTokenType>) || model<NftTokenType>(tokens, TokenSchema);