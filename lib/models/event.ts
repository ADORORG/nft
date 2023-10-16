import { Schema, model, models, type Model } from 'mongoose';
import { dbCollections } from '../app.config';
import { NFT_CONTRACT_EDITION, MARKET_SALE_TYPES } from '../types/common'
/** 
 * Contract model is the base parent for this discriminator model.
 * This is the model for NFT Contract Sale Events where buyer pay to mint NFTs.
 * @note This does not refer to the NFT Contract Event (logs) in the smart contract.   
*/
import type NftContractSaleEventType from '../types/event';

const { nftContractSaleEvents, currencies, collections: xcollections, contracts, accounts } = dbCollections;

const NftContractSaleEventSchema = new Schema<NftContractSaleEventType>({
    feeRecipient: {type: String, required: true}, // Ethereum address
    maxMintPerWallet: {type: Number, default: 0},
    start: {type: Number, required: true, index: true}, // Unix timestamp milliseconds
    end: {type: Number, required: true, index: true}, // Unix timestamp milliseconds
    price: {type: Number, required: true}, // in wei
    supply: {type: Number, default: 0},
    supplyMinted: {type: Number, default: 0},
    ethRaised: {type: Number, default: 0},
    owner: {type: String, ref: accounts, required: true, index: true},    
    partitionId: {type: Number, min: 1, required: function() { return ['generative_series', 'limited_edition', 'one_of_one'].includes((this as any).nftEdition) && !(this as any).draft }},
    draft: { type: Boolean },
    
    // The following properties are passed to the contract when firstly deployed.
    // However, they are configurable by the contract owner.
    // When changed by the owner, these properties will be updated here but not in the contract.
    // This is because we could have multiple sale events for a single contract.
    
    royalty: {type: Number, default: 0},
    royaltyReceiver: {type: String}, // Ethereum address
    nftEdition: {type: String, required: true, enum: NFT_CONTRACT_EDITION.filter(edition => edition !== 'private'), lowercase: true},
    // Token minted in this sale event will have the following properties.
    // These properties will be saved to the token model when a token is minted.
    tokenName: {type: String, required: true, index: true},
    tokenDescription: {type: String, required: true},
    redeemableContent: String,
    transferrable: {type: Boolean, default: true},
    media: {type: String},
    mediaType: {type: String},
    attributes: {type: Array, default: []},
    xcollection: {type: Schema.Types.ObjectId, ref: xcollections, index: true, required: true}, // 'collection' is a reserved keyword in Mongoose
    contract: {type: Schema.Types.ObjectId, ref: contracts, required: true, index: true},
    // The currency accepted for this sale event
    currency: {type: Schema.Types.ObjectId, ref: currencies, required: true},
    saleType: {type: String, required: true, enum: MARKET_SALE_TYPES.filter(t => t !== 'offer'), default: 'fixed'},
}, {
    collection: nftContractSaleEvents,
    timestamps: true
});

export default (models[nftContractSaleEvents] as Model<NftContractSaleEventType>) || model<NftContractSaleEventType>(nftContractSaleEvents, NftContractSaleEventSchema);