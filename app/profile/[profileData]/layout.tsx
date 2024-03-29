
interface ProfileLayoutProps {
    // children: React.ReactNode,
    tab: React.ReactNode,
    profileData: React.ReactNode,
}

export default function Layout(props: ProfileLayoutProps) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container md:max-w-[600px] min-h-[500px] mx-auto py-6 px-4 lg:px-0">
                {props.tab}
                {props.profileData}
            </div>
        </div>
    )
}