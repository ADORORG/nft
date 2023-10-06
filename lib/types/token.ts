import type { Types, /* Document */ } from 'mongoose';
import type { AttributeType, EthereumAddress } from './common';
import type AccountType from './account';
import type CollectionType from './collection';
import type ContractType from './contract';

export default interface NftTokenType /* extends Partial<Document> */ {
    /** The document objectId */
    _id?: Types.ObjectId;
    /** NFT token id */
    tokenId: number;
    /** Token amount being held by this owner. Always 1 for erc721 */
    quantity?: number;
    /** 
     * @deprecated - This will be removed.
     * Token supply. Always 1 for erc721 */
    supply?: number;
    /** Name of the token */
    name?: string;
    /** Description of the token */
    description?: string;
    /**
     * @deprecated - Use `media` instead.
     * Ipfs hash or an absolute url if token is imported 
    */
    image?: string;
    /**
     * Token media. It could be an image/audio/video
     */
    media: string;
    /**
     * The type of media content if provided. Examples video/mp4, image/png
     */
    mediaType?: string;
    /** External URI to token details or resources */
    externalUrl?: string;
    /** Token background color, used if image isn't loaded */
    backgroundColor?: string;
    /** A boolean value to signify if token contain a redeemable content */
    redeemable?: boolean;
    /** Redeemable content if token has redeemable content */
    redeemableContent?: string;
    /** Token attribute */
    attributes?: AttributeType[];
    /** Comma or white-space separated token tags string */
    tags?: string;
    /** Number of views for this token */
    views?: number;
    /** Token royalty */
    royalty?: number;
    /** Is the nft token transferrable? Default to true */
    transferrable?: boolean;
    /**
     * The collection to which this token belongs.
     * 'collection' is a reserved keyword in Mongoose, hence, 'xcollection' is used
     */
    xcollection?: Types.ObjectId | CollectionType; 
    /** The contract to which this token belongs */
    contract: Types.ObjectId | ContractType;
    /** The current owner of this token */
    owner: EthereumAddress | AccountType; 
    /** The status of this token. True if minted on chain. Otherwise false */
    draft?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PopulatedNftTokenType extends NftTokenType {
    xcollection: CollectionType
    contract: ContractType
    owner: AccountType
}