
interface DraftLayoutProps {
    children: React.ReactNode,
    // tab: React.ReactNode,
    // draftData: React.ReactNode
}

export default function Layout(props: DraftLayoutProps) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                {props.children}
            </div>
        </div>
    )
}