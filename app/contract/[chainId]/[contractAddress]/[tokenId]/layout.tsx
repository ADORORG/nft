
interface TokenPageProps {
    children?: React.ReactNode,
    market?: React.ReactNode,
    token?: React.ReactNode
}

export default function Layout({token}: TokenPageProps) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                {token}
            </div>
        </div>
    )
}