import CreateEventForm from "@/components/CreateForm/Event"

export default function CreateLimitedEdition() {

    return (
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-2xl pb-6 text-center">Create Limited Edition</h1>
            <CreateEventForm nftEdition="limited_edition" />
        </div>
    )
}