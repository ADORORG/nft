import type CollectionType from "@/lib/types/collection"
import { atomWithLocalStorage } from "./atom.local"


// Collection data store
export const collectionImageStore = atomWithLocalStorage("collectionImage", "")
export const collectionBannerStore = atomWithLocalStorage("collectionBanner", "")
export const collectionCreatedStore = atomWithLocalStorage("collectionCreated", true)
export const collectionDataStore = atomWithLocalStorage<CollectionType | undefined>("collectionData", undefined)

// Token data store


// Contract data store