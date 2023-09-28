
interface AccountLayoutProps {
    // children: React.ReactNode,
    tab: React.ReactNode,
    profileData: React.ReactNode,
}

export default function Layout(props: AccountLayoutProps) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="max-w-lg min-h-[500px] mx-auto py-6 px-4 lg:px-0">
                {props.tab}
                {props.profileData}
            </div>
        </div>
    )
}