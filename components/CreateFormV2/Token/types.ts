import type { PopulatedNftTokenType } from "@/lib/types/token"
import type CollectionType from "@/lib/types/collection"
import type NftContractType from "@/lib/types/contract"


export interface CreateTokenFormProps {
    tokenData: Partial<PopulatedNftTokenType>,
    accountCollections?: CollectionType[],
    accountContracts?: NftContractType[],
}

export interface CreateTokenSubComponentProps extends CreateTokenFormProps {
    setTokenData: (token: Partial<PopulatedNftTokenType>) => void,
    saveTokenData?: (token?: Partial<PopulatedNftTokenType>) => Promise<PopulatedNftTokenType | undefined>,
    nextSreen?: () => void,
    previousScreen?: () => void,
}