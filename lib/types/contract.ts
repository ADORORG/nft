import { Types, Document } from 'mongoose'
import type { EthereumAddress, NftContractSchemaType } from './common'
import type AccountType from './account';

export default interface ContractType extends Partial<Document>{
    /** Contract document _id */
    _id?: Types.ObjectId;
    /** On-chain contract address */
    contractAddress: EthereumAddress;
    /** Contract Chain id */
    chainId: number;
    /** Default contract royalty */
    royalty: number;
    /** 
     * Contract nftSchema type. One of `erc721` and `erc1155` 
    */
    nftSchema: NftContractSchemaType;
    /** Signify if the contract is imported to this app */
    imported?: boolean;
    /** The version of our NFT contract */
    version: string;
    /** The account that deployed this contract */
    owner?: EthereumAddress | AccountType;
    /** An optional label for this contract */
    label?: string;
    symbol?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PopulatedContractType extends ContractType {
    owner: AccountType
}