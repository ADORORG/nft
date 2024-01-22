import type NftContractType from "@/lib/types/contract"
import type NftTokenType from "@/lib/types/token"

export interface ContractMetadataType extends Partial<NftContractType> {
    tokenURI?: string;
}

export interface ContractImportFormProps {
    importHandler: (contractAddress: string) => Promise<void>;
}

export interface TokenListProps {
    tokens: Partial<NftTokenType>[];
    nextHandler: (collection: string) => Promise<void>;
}

export interface TokenPreviewProps {
    token: Partial<NftTokenType>;
}