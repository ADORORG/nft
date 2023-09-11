import BannerSkeleton from "@/components/Skeleton/Banner"

export default function Loading() {
    return (
        <div className="flex flex-col md:flex-row flex-wrap gap-4 my-6 items-center">
            <BannerSkeleton />
        </div>
    )
}