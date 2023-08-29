import { TokenPageSkeleton, MarketOrderPageSkeleton } from "@/components/Skeleton"

export default function Loading() {
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="border-2 border-gray-100 dark:border-gray-800 rounded px-4 shadow-xl">
                <TokenPageSkeleton />
            </div>
            <div className="border border-gray-50 dark:border-gray-900 rounded px-6 shadow-2xl">
                <MarketOrderPageSkeleton />
            </div>
        </div>
    )
}