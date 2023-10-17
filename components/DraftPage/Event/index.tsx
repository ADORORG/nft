"use client"
import Link from "next/link"
import LoadingSpinner from "@/components/LoadingSpinner"
import Button from "@/components/Button"
import { EventMintCollapsedSmall } from "@/components/EventMint"
import { useAccountDraftEvent } from "@/hooks/fetch/draft"
import { replaceUrlParams } from "@/utils/main"
import appRoutes from "@/config/app.route"

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
                    <div 
                        key={event._id?.toString()}
                        className="w-[400px] h-[240px] relative"
                    >
                        <div className="w-[400px] h-[240px] absolute rounded z-10 bg-opacity-50 top-0 left-0 bg-gray-600 flex items-center justify-center">
                            <Link href={
                                replaceUrlParams(appRoutes.editDraft, {
                                    draftType: "event",
                                    draftDocId: event._id?.toString() as string
                                })
                            }>
                                <Button variant="gradient" className="rounded px-6">Edit</Button>
                            </Link>
                        </div>    
                        <EventMintCollapsedSmall 
                            eventData={event}
                        />
                    </div>
                ))
            }
        </div>
    )
}