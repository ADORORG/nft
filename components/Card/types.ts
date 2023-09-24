import type { PopulatedNftTokenType} from "@/lib/types/token"

export interface NftTokenProps {
    token: PopulatedNftTokenType, 
}

export type DropdownOptions = "transfer" | "sell" | "makeOffer" | "useAsProfilePic" | "copyLink" | ""

export interface TokenCardDropdownOptionProps extends NftTokenProps {
    whichAction: DropdownOptions,
    resetAction: () => void
}