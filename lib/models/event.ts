import { Schema } from 'mongoose';
import { dbCollections } from '../app.config';
/** 
 * Contract model is the base parent for this discriminator model.
 * This is the model for NFT Contract Sale Events where buyer pay to mint NFTs.
 * @note This does not refer to the NFT Contract Event (logs) in the smart contract.   
*/
import ContractModel from './contract';
import { NFT_CONTRACT_SALE_EVENT } from '../types/common';
import type NftContractEventType from '../types/event';

const {nftContractEvents} = dbCollections;

const NftContractEventSchema = new Schema<NftContractEventType>({
    feeRecipient: {type: String, required: true}, // Ethereum address
    royaltyReceiver: {type: String, required: true}, // Ethereum address
    royaltyPercentage: {type: Number, required: true}, // 0-100
    maxPurchasePerWallet: {type: Number, default: 0},
    transferrable: {type: Boolean, required: true},
    start: {type: Number, required: true}, // Unix timestamp seconds
    end: {type: Number, required: true}, // Unix timestamp seconds
    price: {type: Number, required: true}, // in wei
    saleEventType: {type: String, enum: NFT_CONTRACT_SALE_EVENT, required: true},
    supply: {type: Number, default: 0},
    supplyMinted: {type: Number},
    weiRaised: {type: Number, default: 0},
});

const NftContractEventModel = ContractModel.discriminators?.[nftContractEvents] || ContractModel.discriminator<NftContractEventType>(nftContractEvents, NftContractEventSchema);

export default NftContractEventModel;
