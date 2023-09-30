import LoadingSpinner from "@/components/LoadingSpinner"
import { EventMintCardSmall } from "@/components/EventMint"
import { useEventSearch } from "@/hooks/fetch/search"

export default function EventSearch({searchQuery}: {searchQuery: string}) {
    const { events, isLoading } = useEventSearch(searchQuery)

    if (isLoading) {
        return (
            <div className="">
                <LoadingSpinner />
            </div>
        )
    }

    if (!events || events.length === 0) {
        return (
            <div className="">
                No matching event.
            </div>
        )
    }

    return (
        <div className="flex flex-wrap gap-4">
            {
                events.map((event) => (
                    <div
                        key={event._id?.toString() as string}
                        className="py-4">
                        <EventMintCardSmall
                            eventData={event}
                        />
                    </div>
                ))
            }
        </div>
    )
}