import type { PopulatedNftContractEventType } from "@/lib/types/event"
import type CollectionType from "@/lib/types/collection"
import type NftContractType from "@/lib/types/contract"


export interface CreateEventFormProps {
    eventData: Partial<PopulatedNftContractEventType>,
    accountCollections?: CollectionType[],
    accountContracts?: NftContractType[],
}

export interface CreateEventSubComponentProps extends CreateEventFormProps {
    setEventData: (event: Partial<PopulatedNftContractEventType>) => void,
    saveEventData?: (event?: Partial<PopulatedNftContractEventType>) => Promise<PopulatedNftContractEventType | undefined>,
    nextSreen?: () => void,
    previousScreen?: () => void,
}
