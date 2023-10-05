import type { Types, /* Document */ } from 'mongoose'
import type { EthereumAddress, NftContractSchemaType, NftContractEditionType } from './common'
import type AccountType from './account';

export default interface NftContractType /* extends Partial<Document> */ {
    /** Contract document _id */
    _id?: Types.ObjectId;
    /** On-chain contract address */
    contractAddress: EthereumAddress;
    /** Contract Chain id */
    chainId: number;
    /** Default contract royalty */
    royalty: number;
    /** Default Royalty Receiver Address for this nft contract*/
    royaltyReceiver?: EthereumAddress;
    /** 
     * Contract nftSchema type. One of `erc721` and `erc1155` 
    */
    nftSchema: NftContractSchemaType;
    /** Edition of this nft contract. Open, limited, one-of-of, private */
    nftEdition: NftContractEditionType;
    /** Signify if the contract is imported to this app */
    imported?: boolean;
    /** The version of this NFT contract as defined by this platform */
    version: string;
    /** The account that deployed this contract */
    owner?: EthereumAddress | AccountType;
    /** An optional label for this contract */
    label?: string;
    symbol?: string;
    /** The status of this contract. True if deployed on chain. Otherwise false */
    draft: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface PopulatedContractType extends NftContractType {
    owner: AccountType
}