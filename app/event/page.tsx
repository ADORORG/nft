import type { PopulatedNftContractEventType } from "@/lib/types/event"
import { EventMintCollapsed } from "@/components/EventMint"
// server
import mongoooseConnectionPromise from "@/wrapper/mongoose_connect"
import { getEventsByQuery } from "@/lib/handlers"

async function getServerSideData() {
    await mongoooseConnectionPromise
    return getEventsByQuery({}, {}) as Promise<PopulatedNftContractEventType[]>
}

export default async function EventPage() {
    const saleEvents = await getServerSideData()

    return (
        <div className="flex flex-col flex-wrap md:flex-row justify-center items-center gap-6">
            {
                saleEvents.map((eventData) => (
                    <EventMintCollapsed key={eventData._id?.toString()} eventData={eventData} />
                ))
            }
        </div>
    )
}