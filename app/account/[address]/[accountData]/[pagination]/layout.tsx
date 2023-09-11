
interface AccountLayoutProps {
    // children: React.ReactNode,
    tab: React.ReactNode,
    accountData: React.ReactNode,
    banner: React.ReactNode
}

export default function Layout(props: AccountLayoutProps) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                {props.banner}
                {props.tab}
                {props.accountData}
            </div>
        </div>
    )
}