import { Schema, model, models, type Model } from 'mongoose';
import { dbCollections } from '../app.config';
import type ContractType from '../types/contract';
import { NFT_CONTRACT_SCHEMA, NFT_CONTRACT_EDITION } from '../types/common'

const { contracts, accounts } = dbCollections;

const ContractSchema = new Schema<ContractType>({
    contractAddress: {type: String, index: true, lowercase: true, required: function() { return !(this as any).draft }},
    draft: { type: Boolean, default: true },
    chainId: {type: Number, required: true, min: 0},
    royalty: {type: Number, default: 0},
    royaltyReceiver: {type: String},
    nftSchema: {type: String, required: true, enum: NFT_CONTRACT_SCHEMA, lowercase: true},
    nftEdition: {type: String, required: true, enum: NFT_CONTRACT_EDITION, default: 'private', lowercase: true}, 
    // Required if not an imported contract
    version: {type: String, required: function() { return !(this as any).imported }},
    imported: {type: Boolean, default: false},
    owner: {type: String, ref: accounts, required: true, index: true},
    label: String,
    symbol: String,
    createdAt: {type: Date},
    updatedAt: {type: Date}
}, {
    collection: contracts,
    timestamps: true
});

/* ContractSchema.post('find', function(docs: ContractType[]) {
    docs.forEach(function(doc) {
        doc.toObject?.({
            flattenMaps: true,
            flattenObjectIds: true,
            versionKey: false
        })
    })
}) */

export default (models[contracts] as Model<ContractType>) || model<ContractType>(contracts, ContractSchema);