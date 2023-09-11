import CardSkeleton from "@/components/Skeleton/Card"

export default function Loading() {
    return (
        <div className="flex flex-col md:flex-row flex-wrap gap-4 my-6 items-center">
                        {
                Array.from({length: 4})
                .map((_, index) => (
                    <CardSkeleton
                        key={index}
                    />
                ))
            }
        </div>
    )
}