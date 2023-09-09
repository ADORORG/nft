

export default function Layout({children}: {children: React.ReactNode}) {

    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen">
            <div className="container mx-auto">
                {children}
            </div>
        </div>
    )
}