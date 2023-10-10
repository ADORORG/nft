"use client"
import LoadingSpinner from "@/components/LoadingSpinner"
import { EventMintCardSmall } from "@/components/EventMint"
import { useAccountDraftEvent } from "@/hooks/fetch/draft"

export default function EventDraft({address}: {address?: string}) {
    const { draftEvents, isLoading } = useAccountDraftEvent(address)

    if (isLoading) {
        return (
            <div className="">
                <LoadingSpinner />
            </div>
        )
    }

    if (!draftEvents || draftEvents.length === 0) {
        return (
            <div className="">
                No draft event.
            </div>
        )
    }

    return (
        <div className="flex flex-wrap gap-4">
            { 
                draftEvents.map((event) => (
                    <EventMintCardSmall 
                        key={event._id?.toString()}
                        eventData={event}
                    />
                ))
            }
        </div>
    )
}