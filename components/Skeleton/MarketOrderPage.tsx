import TextSkeleton from "./Text"
import ListSkeleton from "./List"

export default function MarketOrderPage() {
    
    return (
        <div className="w-[320px] md:w-[420px]">
            <div className="flex flex-col">
                <ListSkeleton />
                <TextSkeleton />
                <ListSkeleton />
            </div>
        </div>
    )
}