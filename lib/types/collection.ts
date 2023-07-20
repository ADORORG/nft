import { Types } from 'mongoose'
import type { EthereumAddress } from './common'
import type AccountType from './account';

export default interface CollectionType {
    _id?: Types.ObjectId | String;
    name: string;
    slug: string;
    description: string;
    image: string; // ipfs hash
    banner: string; // ipfs hash
    tags: string[];
    category: string;
    externalUrl?: string;
    twitter?: string;
    discord?: string;
    owner: EthereumAddress | AccountType;
    createdAt?: number | Date;
    updatedAt?: number | Date;
}