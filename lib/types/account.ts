// import type { Document } from 'mongoose'
import type { EthereumAddress } from './common'

export default interface AccountType {
    /** Account document _id. Ethereum address are used as the _id */
    _id?: EthereumAddress;
    /** Ethereum address of this account. Same value as _id */
    address: EthereumAddress;
    /** Optional Account name. We use ENS name when account update their profile */
    name?: string;
    /** Optional verified Email address */
    email?: string;
    /** User email verification status */
    emailVerified?: boolean;
    /** Platform Verification status */
    verified?: boolean;
    /** Banned status */
    banned?: boolean;
    /** 
     * @deprecated - We are using `profileMedia` instead.
     * Ipfs hash for this account image */
    image?: string; // ipfs hash
    /** Profile media; ipfs hash or absolute url */
    profileMedia?: string;
    /** Profile media type. The data type of profileMedia  */
    profileMediaType?: string;
    /** Ipfs hash for this account banner */
    banner?: string; // ipfs hash
    /** A temporary role field to validate some actions. It's empty for ordinary account */
    roles?: string[];
    /** An optional Twitter absolute url to an account */
    twitter?: string;
    /** An optional Discord invite absolute url */
    discord?: string;
    /** Account Email Notification setting */
    notification?: AccountNotificationType;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface AccountNotificationType {
    newMintOnEvent: boolean;
    eventMintedOut: boolean;
    marketOrderCreated: boolean;
    marketOrderCancelled: boolean;
    marketOrderSold: boolean;
    offerReceivedOnToken: boolean;
    offerAcceptedOnToken: boolean;
    offerRejectedOnToken: boolean;
    marketAuctionEnded: boolean;
    newMarketBid: boolean;
}