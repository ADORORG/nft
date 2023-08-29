

export default function Bordered({children, className}: {children: React.ReactNode, className?: string}) {

    return (
        <div className={`px-2 py-4 rounded border dark:border-gray-600 border-gray-200 ${className}`}>
            {children}
        </div>
    )
}