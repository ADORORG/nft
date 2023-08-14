import ImageSkeleton from "./Image"
import ListSkeleton from "./List"
import TextSkeleton from "./Text"

export default function TokenPageSkeleton() {

    return (
        <div className="w-[320px] md:w-[480px] p-4">
            <div className="flex flex-col justify-end gap-8 p-4">
                <ImageSkeleton />
                <ListSkeleton />
                <TextSkeleton />
            </div>
        </div>
    )
}