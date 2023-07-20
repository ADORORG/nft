import { Schema, model } from 'mongoose';
import { dbCollections } from '../app.config';
import type ContractType from '../types/contract';

const { contracts, accounts } = dbCollections;

const ContractSchema = new Schema<ContractType>({
    contractAddress: {type: String, required: true, index: true},
    chainId: {type: Number, required: true},
    royalty: {type: Number, default: 0},
    schema: {type: String, required: true, enum: ['erc721', 'erc1155'], lowercase: true},
     // only require if not an imported contract
    version: {type: String, required: function() { return !(this as any).imported }},
    imported: {type: Boolean, default: false},
    owner: {type: String, ref: accounts, required: true, index: true},
    label: String,
    createdAt: {type: Date, get: (v: Date) => v.getTime()},
    updatedAt: {type: Date, get: (v: Date) => v.getTime()}
}, {
    collection: contracts,
    timestamps: true
});


export default model<ContractType>(contracts, ContractSchema);