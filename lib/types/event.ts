import type { Types } from 'mongoose';
import type { NftContractSaleEventType } from './common';
import type { PopulatedCollectionType } from './collection';
import type ContractType from './contract';

export default interface NftContractEventType extends ContractType {
    /** Payment Receiver Ethereum Address for this sale event*/
    feeRecipient: string; // Ethereum address
    /** Royalty Receiver Address for this nft contract*/
    royaltyReceiver: string; // Ethereum address
    /** Royalty Percentage */
    royaltyPercentage: number; // 0-100
    /** Maximum allowed purchase per wallet for this sale event */
    maxPurchasePerWallet: number;
    /** Is the nft token in this series transferrable? */
    transferrable: boolean;
    /** Start time of this sale event in unix timestamp seconds */
    start: number; // Unix timestamp seconds
    /** End time of this sale event in unix timestamp seconds */
    end: number; // Unix timestamp seconds
    /** Price of each nft token in this sale event in wei */
    price: number; // in wei
    /** The type of Nft in this sale event. Open, limited, one-of-one edition */
    saleEventType: NftContractSaleEventType;
    /** Total supply of nft tokens in this sale event. Unlimited for Open Edition */
    supply: number;
    /** Total nft tokens minted so far in this sale event */
    supplyMinted: number;
    /** Total wei raised so far in this sale event */
    weiRaised: number;
    /** The collection data or _id to which this nft tokens minted in this event belong */
    collection: Types.ObjectId | PopulatedCollectionType;
}

export interface PopulatedNftContractEventType extends NftContractEventType {
    collection: PopulatedCollectionType;
}