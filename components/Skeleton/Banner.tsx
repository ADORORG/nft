import ImageSkeleton from "./Image"
import TextSkeleton from "./Text"

export default function BannerSkeleton() {

    return (
        <div className="w-full flex flex-col md:flex-row gap-4 justify-start items-center">
            <ImageSkeleton />
            <TextSkeleton />
        </div>
    )
}