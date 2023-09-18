import type { Types, /* Document */ } from 'mongoose'
import type { EthereumAddress } from './common'
import type AccountType from './account';

export default interface CollectionType /* extends Partial<Document> */ {
    /** The document objectId */
    _id?: Types.ObjectId;
    /** Name of the collection */
    name: string;
    /** A unique slug for this collection */
    slug: string;
    /** Description of the collection */
    description: string;
    /** 
     * @deprecated - Use `media`.
     * Collection image URI or ipfs hash */
    image?: string; // ipfs hash
    /** Collection media */
    media: string; // ipfs hash
    /** Collection media type */
    mediaType: string;
    /** Collection banner URI or ipfs hash */
    banner?: string; // ipfs hash
    /** Collection media type */
    bannerType?: string;
    /** Comma or white-space separated collection tags string */
    tags: string;
    /** Category of this collection */
    category: string;
    /** An external URI to this collection  */
    externalUrl?: string;
    /** Absolute Twitter URI */
    twitter?: string;
    /** Absolute Discord URI */
    discord?: string;
    /** Collection owner Account document or the Account document _id */
    owner: EthereumAddress | AccountType;
    /** Creation date */
    createdAt?: Date;
    /** Updated date */
    updatedAt?: Date;
}

export interface PopulatedCollectionType extends CollectionType {
    owner: AccountType
}