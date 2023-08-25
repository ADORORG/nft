import { Schema, model, models, type Model } from 'mongoose';
import { dbCollections } from '../app.config';
import type ContractType from '../types/contract';
import { NFT_CONTRACT_SCHEMA } from '../types/common'

const { contracts, accounts } = dbCollections;

const ContractSchema = new Schema<ContractType>({
    contractAddress: {type: String, required: true, index: true},
    chainId: {type: Number, required: true},
    royalty: {type: Number, default: 0},
    nftSchema: {type: String, required: true, enum: NFT_CONTRACT_SCHEMA, lowercase: true},
     // only require if not an imported contract
    version: {type: String, required: function() { return !(this as any).imported }},
    imported: {type: Boolean, default: false},
    owner: {type: String, ref: accounts, required: true, index: true},
    label: String,
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