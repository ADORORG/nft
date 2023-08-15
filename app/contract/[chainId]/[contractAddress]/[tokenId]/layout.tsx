
interface TokenPageProps {
    children: React.ReactNode,
    // market?: React.ReactNode,
    // token: React.ReactNode
}

/**
 * @todo - Switch to parallel routing
 * @param param0 
 * @returns 
 */
export default function Layout({children}: TokenPageProps) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                {children}
            </div>
        </div>
    )
}