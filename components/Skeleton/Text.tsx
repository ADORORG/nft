
export default function TextSkeleton({className}: {className?: string}) {

    return (
        <div role="status" className={`w-full animate-pulse ${className}`}>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-5/6 mb-4" />
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4 mb-2.5" />
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5" />
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-2/3 mb-2.5" />
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2 mb-2.5" />
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-3/4" />
            <span className="sr-only">Loading...</span>
        </div>

    )
}