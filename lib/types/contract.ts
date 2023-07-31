import { Types } from 'mongoose'
import type { EthereumAddress } from './common'
import type AccountType from './account';

export default interface ContractType {
    _id?: Types.ObjectId | String;
    contractAddress: EthereumAddress;
    chainId: number;
    royalty: number;
    schema: 'ERC721' | 'ERC1155'
    imported?: boolean;
    version: string; // version of our NFT contract
    owner?: EthereumAddress | AccountType;
    label?: string;
    createdAt?: number | Date;
    updatedAt?: number | Date;
}

export interface PopulatedContractType extends ContractType {
    owner: AccountType
}