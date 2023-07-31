import type { Types } from 'mongoose'
import type { EthereumAddress } from './common'
import type AccountType from './account';

export default interface CollectionType {
    /** The document objectId */
    _id?: Types.ObjectId | String;
    /** Name of the collection */
    name: string;
    /** A unique slug for this collection */
    slug: string;
    /** Description of the collection */
    description: string;
    /** Collection image URI or ipfs hash */
    image: string; // ipfs hash
    /** Collection banner URI or ipfs hash */
    banner: string; // ipfs hash
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
    createdAt?: number | Date;
    /** Updated date */
    updatedAt?: number | Date;
}

export interface PopulatedCollectionType extends CollectionType {
    owner: AccountType
}