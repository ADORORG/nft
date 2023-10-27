"use client"
import CreateEventForm from "@/components/CreateFormV2/Event"

export default function CreateOpenEdition() {

    return (
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-2xl pb-6 text-center">Create Open Edition</h1>
            <CreateEventForm nftEdition="open_edition" />
        </div>
    )
}