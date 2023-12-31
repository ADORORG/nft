

export default function Layout({children}: {children: React.ReactNode}) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto">
                {children}
            </div>
        </div>
    )
}