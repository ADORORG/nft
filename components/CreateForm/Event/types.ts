import type NftContractSaleEventType from "@/lib/types/event"
import type NftContractType from "@/lib/types/contract"
import type { NftContractEditionType } from "@/lib/types/common"

export interface EventDataFormProps {
    eventData: Partial<NftContractSaleEventType>,
    contractData: Partial<NftContractType>,
    updateContractData?: (data: Partial<NftContractType>) => void
    updateEventData?: (data: Partial<NftContractSaleEventType>) => void
    eventMedia?: File | null,
    updateEventMedia?: (file: File | null) => void,
    tempMediaObjectUrl: string,
    className?: string
}

export interface CreateEventFormProps {
    nftEdition: Exclude<NftContractEditionType, "private">
}