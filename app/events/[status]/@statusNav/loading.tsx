import { CardSkeleton } from "@/components/Skeleton"

export default function Loading() {
    return (
        <div className="flex flex-col md:flex-row flex-wrap gap-4 my-6 justify-center items-center pt-8">
            {
                Array.from({length: 7})
                .map((_, index) => (
                    <CardSkeleton
                        key={index}
                    />
                ))
            }
        </div>
    )
}