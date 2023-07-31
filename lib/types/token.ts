import type { Types } from 'mongoose';
import type { EthereumAddress } from "./common"
import type { AttributeType } from './common';
import type AccountType from './account';
import type CollectionType from './collection';
import type ContractType from './contract';

export default interface NftTokenType {
    /** The document objectId */
    _id?: Types.ObjectId | String;
    /** NFT token id */
    tokenId: string;
    /** Token supply. Always 1 for erc721 */
    supply?: number;
    /** Name of the token */
    name?: string;
    /** Description of the token */
    description?: string;
    /**
     * Ipfs hash or an absolute url if token is imported 
    */
    image?: string;
    /**
     * Alternative media for token. It could be an image/audio/video
     */
    media?: string;
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
    /** Comma or white-space separated collection tags string */
    tags?: string;
    /** Number of views for this token */
    views?: number;
    /** Token royalty */
    royalty?: number;
    /**
     * The collection to which this token belongs.
     * 'collection' is a reserved keyword in Mongoose, hence, 'xcollection' is used
     */
    xcollection?: Types.ObjectId | String | CollectionType; 
    /** The contract to which this token belongs */
    contract: Types.ObjectId | String | ContractType;
    /** The current owner of this token */
    owner: EthereumAddress | AccountType; 
    /**
     * For tokens that are minted elsewhere and imported to this app
     */
    createdAt?: number | Date;
    updatedAt?: number | Date;
}

export interface PopulatedNftTokenType extends NftTokenType {
    xcollection: CollectionType
    contract: ContractType
    owner: AccountType
}