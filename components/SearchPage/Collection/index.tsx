
import LoadingSpinner from "@/components/LoadingSpinner"
import { CollectionCard } from "@/components/Card"
import { useCollectionSearch } from "@/hooks/fetch/search"

export default function CollectionSearch({searchQuery}: {searchQuery: string}) {
    const { collections, isLoading } = useCollectionSearch(searchQuery)

    if (isLoading) {
        return (
            <div className="">
                <LoadingSpinner />
            </div>
        )
    }

    if (!collections || collections.length === 0) {
        return (
            <div className="">
                No matching collection.
            </div>
        )
    }

    return (
        <div className="flex flex-wrap gap-4">
            {
                collections.map((collection) => (
                    <div
                        key={collection._id?.toString() as string}
                        className="my-3"
                    >
                        <CollectionCard
                            collection={collection}
                        />
                    </div>
                ))
            }          
        </div>
    )
}