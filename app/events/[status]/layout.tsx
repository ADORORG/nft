
interface EventsLayoutProps {
    statusNav: React.ReactNode,
    eventData: React.ReactNode
}

export default function Layout(props: EventsLayoutProps) {

    return (
        <div className="bg-white dark:bg-gray-950">
            <div className="container mx-auto py-6">
                <div className="flex flex-col gap-4">
                    {props.statusNav}
                    {props.eventData}
                </div>
            </div>
        </div>
    )
}