import type CollectionType from "@/lib/types/collection"
import type NftTokenType from "@/lib/types/token"
import type ContractType from "@/lib/types/contract"
import type NftContractSaleEventType from "@/lib/types/event"
import type { MarketFilterType, AttributeType } from "@/lib/types/common"
import { atomWithLocalStorage } from "./atom.local"
import { atom } from "jotai"

// Collection data store
export const collectionImageStore = atom<File | null>(null)
export const collectionBannerStore = atom<File | null>(null)
export const collectionCreatedStore = atom(false)
export const collectionDataStore = atom<Partial<CollectionType>>({})

// Token data store
export const nftTokenImageStore = atom<File | null>(null)
export const nftTokenMediaStore = atom<File | null>(null)
export const nftTokenCreatedStore = atomWithLocalStorage("nftTokenCreated", false)
export const nftTokenUploadedStore = atomWithLocalStorage("nftTokenUploaded", false)
export const nftTokenDataStore = atomWithLocalStorage<Partial<NftTokenType>>("nftTokenData", {})
export const nftTokenAttributeStore = atomWithLocalStorage<AttributeType[]>("nftTokenAttribute", [{trait_type: "", value: ""}])

// Nft contract sale event
export const nftSaleEventDataStore = atom<Partial<NftContractSaleEventType>>({})
export const nftSaleEventCreatedStore = atom(false)
export const nftEventContractDeployedStore = atom(false)
export const nftEventContractDataStore = atom<Partial<ContractType>>({})
export const nftEventContractMediaStore = atom<File | null>(null)

// Contract data store
export const nftContractDataStore = atom<Partial<ContractType>>({})

// Market order filter 
export const marketFilterStore = atom<Partial<MarketFilterType>>({createdAt: -1})