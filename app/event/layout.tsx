

export default function Layout({children}: {children: React.ReactNode}) {

    return (
        <div className="bg-white dark:bg-gray-950 p-4">
            <div className="container mx-auto py-6">
                {children}
            </div>
        </div>
    )
}