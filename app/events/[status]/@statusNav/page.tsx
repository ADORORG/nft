import type { EventStatusType } from "../types"
import TabNavigation from "@/components/TabNav"
import appRoutes from "@/config/app.route"

export default async function EventPage({params}: {params: {status: EventStatusType}}) {
    const currentTab = params.status || "minting_now"
    const mintingNowNode = (<span className="flex flex-row items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded bg-tertiary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded h-3 w-3 bg-tertiary-500"></span>
                                </span> 
                                 <span>Minting now</span>
                            </span>)

    const statusTabs = [
        {
            label: mintingNowNode,
            link: `${appRoutes.events}/minting_now`,
            active: currentTab === "minting_now"
        },
        {
            label: "Upcoming",
            link: `${appRoutes.events}/upcoming`,
            active: currentTab === "upcoming"
        },
        {
            label: "Completed",
            link: `${appRoutes.events}/completed`,
            active: currentTab === "completed"
        }
    ]

 
    return (
        <TabNavigation
            tabs={statusTabs}
        />
    )
}