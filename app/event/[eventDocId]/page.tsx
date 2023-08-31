import type { PopulatedNftContractEventType } from "@/lib/types/event"
import { EventMintExpanded } from "@/components/EventMint"

// server
import mongoooseConnectionPromise from "@/wrapper/mongoose_connect"
import { getEventById } from "@/lib/handlers"

async function getServerSideData({eventDocId}: {eventDocId: string}) {
    await mongoooseConnectionPromise
    return getEventById(eventDocId) as Promise<PopulatedNftContractEventType>
}

export default async function ViewSingleEvent({params}: {params: {eventDocId: string}}) {
    const eventData = await getServerSideData({eventDocId: params.eventDocId})
    return (
        <div>
            <EventMintExpanded eventData={eventData} />
        </div>
    )
}