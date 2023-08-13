import type CollectionType from "@/lib/types/collection"
import type NftTokenType from "@/lib/types/token"
import type ContractType from "@/lib/types/contract"
import { atomWithLocalStorage } from "./atom.local"


// Collection data store
export const collectionImageStore = atomWithLocalStorage("collectionImage", "")
export const collectionBannerStore = atomWithLocalStorage("collectionBanner", "")
export const collectionCreatedStore = atomWithLocalStorage("collectionCreated", false)
export const collectionDataStore = atomWithLocalStorage<CollectionType | undefined>("collectionData", undefined)

// Token data store
export const nftTokenImageStore = atomWithLocalStorage("nftTokenImage", "")
export const nftTokenMediaStore = atomWithLocalStorage("nftTokenMedia", "")
export const nftTokenCreatedStore = atomWithLocalStorage("nftTokenCreated", false)
export const nftTokenUploadedStore = atomWithLocalStorage("nftTokenUploaded", false)
export const nftTokenDataStore = atomWithLocalStorage<NftTokenType | undefined>("nftTokenData", undefined)
export const nftTokenAttributeStore = atomWithLocalStorage<{trait_type: string, value: string}[]>("nftTokenAttribute", [{trait_type: "", value: ""}])

// Contract data store
export const nftContractDataStore = atomWithLocalStorage<ContractType | undefined>("nftContractData", undefined)
