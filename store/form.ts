import type CollectionType from "@/lib/types/collection"
import type { PopulatedNftTokenType } from "@/lib/types/token"
import type ContractType from "@/lib/types/contract"
import type NftContractSaleEventType from "@/lib/types/event"
import type { MarketFilterType } from "@/lib/types/common"
import { atomWithLocalStorage } from "./atom.local"
import { atom } from "jotai"

// Collection data store
export const collectionMediaStore = atom<File | null>(null)
export const collectionBannerStore = atom<File | null>(null)
export const collectionCreatedStore = atom(false)
export const collectionDataStore = atom<Partial<CollectionType>>({})

// Token data store
export const nftTokenMediaStore = atom<File | null>(null)
export const nftTokenDataStore = atomWithLocalStorage<Partial<PopulatedNftTokenType>>("nftTokenData", {})

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