import type { EthereumAddress } from "./common"

export default interface AccountType {
    _id?: EthereumAddress; // we use ethereum address
    address: EthereumAddress;
    name?: string,
    email?: string;
    emailVerified?: boolean;
    image?: string; // ipfs hash
    banner?: string; // ipfs hash
    twitter?: string;
    discord?: string;
    telegram?: string;
    createdAt?: number | Date;
    updatedAt?: number | Date;
}