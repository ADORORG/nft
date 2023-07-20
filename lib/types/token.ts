import type { Types } from 'mongoose';
import type { EthereumAddress } from "./common"
import type { AttributeType } from './common';
import type AccountType from './account';
import type CollectionType from './collection';
import type ContractType from './contract';

export default interface NftTokenType {
    _id?: Types.ObjectId | String;
    tokenId: string;
    supply?: number;
    name?: string;
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
    externalUrl?: string;
    backgroundColor?: string;
    redeemable?: boolean;
    redeemableContent?: string;
    attributes?: AttributeType[];
    tags?: string[];
    views?: number;
    royalty?: number;
    /**
     * The collection to which this token belongs.
     * 'collection' is a reserved keyword in Mongoose, hence, 'xcollection' is used
     */
    xcollection?: Types.ObjectId | String | CollectionType; 
    contract: Types.ObjectId | String | ContractType;
    owner: EthereumAddress | AccountType; 
    /**
     * For tokens that are minted elsewhere and imported to this app
     */
    createdAt?: number | Date;
    updatedAt?: number | Date;
}