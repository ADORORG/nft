import type { Types } from 'mongoose';
import type AccountType from './account';
import type CollectionType from './collection';
import type ContractType from './contract';
import type { EthereumAddress, AttributeType, NftContractEditionType } from './common'

export default interface NftContractSaleEventType {
    /** The document objectId */
    _id?: Types.ObjectId;
    /** Payment Receiver Ethereum Address for this sale event*/
    feeRecipient: EthereumAddress; // Ethereum address
    /** Maximum allowed purchase per wallet for this sale event */
    maxMintPerWallet: number;
    /** Start time of this sale event in unix timestamp seconds */
    start: number;
    /** End time of this sale event in unix timestamp milliseconds */
    end: number;
    /** Price of each nft token in this sale event in eth */
    price: number;
    /** Total supply of nft tokens in this sale event. Unlimited for Open Edition */
    supply: number;
    /** Total nft tokens minted so far in this sale event */
    supplyMinted: number;
    /** Total wei raised so far in this sale event */
    weiRaised: number;
     /** The creator of this sale event */
    owner: EthereumAddress | AccountType; 
    createdAt?: Date;
    updatedAt?: Date;

    // The following properties are passed to the contract when firstly deployed.
    // However, they are configurable by the contract owner.
    // When changed by the owner, these properties will be updated here but not in the contract.
    // This is because we could have multiple sale events for a single contract.
    
    /** Royalty for token minted in this sale event*/
    royalty: number;
    /** Royalty Receiver Address for the nft minted in this event*/
    royaltyReceiver: EthereumAddress;
     /** Edition of the nft token for this sale event. Open, limited, one-of-of.
      * It can't be 'private' because private edition can only be minted by the contract owner
      */
    nftEdition: Exclude<NftContractEditionType, 'private'>;

    // Token minted in this sale event will have the following properties.
    // These properties will be saved to the token model when a token is minted.
   
    /** Is the nft token from this sale event transferrable? */
    transferrable: boolean;
    /** Token attribute */
    attributes?: AttributeType[];
    /** Event Media. It could be an image/audio/video */
    media: string;
    /** The type of media content. Examples video/mp4, image/png */
    mediaType: string;
     /** The smart contract for this sale event.
      * It handles minting and fee payment */
    contract: Types.ObjectId | ContractType;
    /** 
     * The collection data or _id to which nft minted in this event are categorized. 
     * 'collection' is a reserved keyword in Mongoose, hence, 'xcollection' is used 
     */
    xcollection: Types.ObjectId | CollectionType;
}

export interface PopulatedNftContractEventType {
    xcollection: CollectionType;
    contract: ContractType
    owner: AccountType
}