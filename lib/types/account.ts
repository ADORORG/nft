// import type { Document } from 'mongoose'
import type { EthereumAddress } from './common'

export default interface AccountType {
    /** Account document _id. Ethereum address are used as the _id */
    _id?: EthereumAddress;
    /** Ethereum address of this account. Same value as _id */
    address: EthereumAddress;
    /** Optional Account name */
    name?: string,
    /** Optional verified Email address */
    email?: string;
    /** User email verification status */
    emailVerified?: boolean;
    /** Ipfs hash for this account image */
    image?: string; // ipfs hash
    /** Ipfs hash for this account banner */
    banner?: string; // ipfs hash
    /** A temporary role field to validate some actions. It's empty for ordinary account */
    roles?: string[];
    /** An optional Twitter absolute url to an account */
    twitter?: string;
    /** An optional Discord invite absolute url */
    discord?: string;
    /** An optional Telegram group/channel url */
    telegram?: string;
    createdAt?: Date;
    updatedAt?: Date;
}