import type { PopulatedNftContractEventType } from "@/lib/types/event"
import type { EventStatusType } from "../types"
import { EventMintCollapsedSmall } from "@/components/EventMint"
// server
import mongoooseConnectionPromise from "@/wrapper/mongoose_connect"
import { getEventsByQuery } from "@/lib/handlers"

async function getServerSideData(status: EventStatusType) {
    await mongoooseConnectionPromise

    const now = Date.now()
    const query: Record<string, unknown> = {draft: false}

    if (status === "minting_now") {
        query["start"] = {$lte: now}
        query["end"] = {$gte: now}

    } else if (status === "upcoming") {
        query["start"] = {$gte: now}

    } else if (status === "completed") {
        query["end"] = {$lte: now}
    }

    return getEventsByQuery(query, {limit: 25}) as Promise<PopulatedNftContractEventType[]>
}

export default async function EventPage({params}: {params: {status: EventStatusType}}) {
    const currentTab = params.status || "minting_now"
    const saleEvents = await getServerSideData(currentTab)

    return (
        <div className="flex flex-col justify-center items-center md:justify-start md:flex-wrap md:flex-row mx-8 gap-6">
            {   
                saleEvents.length > 0 ?
                saleEvents.map((eventData) => (
                    <EventMintCollapsedSmall key={eventData._id?.toString()} eventData={eventData} />
                ))
                :
                <p className="py-6">
                    No data found
                </p>
            }
        </div>
    )
}