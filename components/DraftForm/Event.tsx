"use client"
import type { PopulatedNftContractEventType } from "@/lib/types/event"
import { getEventContractEditionData } from "@/utils/contract"
import EventForm from "@/components/CreateFormV2/Event/CreateEventForm"

export default function DraftEventForm({ draftEvent }: { draftEvent: PopulatedNftContractEventType }) {
    return (
        <div className="flex flex-col">
            <h1 className="text-2xl text-center py-10 md:leading-4">
                Publish draft {getEventContractEditionData(draftEvent.nftEdition).contractStr}
            </h1>
            
            <EventForm
                eventData={draftEvent}
                accountCollections={draftEvent.xcollection ? [draftEvent.xcollection] : []}
                accountContracts={draftEvent.contract ? [draftEvent.contract] : []}
            />
        </div>
    )
}