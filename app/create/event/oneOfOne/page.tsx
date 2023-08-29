import CreateEventForm from "@/components/CreateForm/Event"

export default function CreateOneOfOneEdition() {

    return (
        <div className="flex flex-col gap-6 w-full">
            <h1 className="text-2xl pb-6 text-center">Create One-of-one Edition</h1>
            <CreateEventForm nftEdition="one_of_one" />
        </div>
    )
}