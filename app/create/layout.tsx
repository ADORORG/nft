
export default function Layout({ children }: {children: React.ReactNode}) {

    return (
        <div className="bg-white dark:bg-gray-950 p-4 lg:p-12">
            <div className="container px-6 mx-auto">
                {children}
            </div>
        </div>
    )
}