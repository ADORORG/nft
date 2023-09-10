import type { EventStatusType } from "../types"
import Link from "next/link"
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
            name: "minting_now",
            label: mintingNowNode
        },
        {
            name: "upcoming",
            label: "Upcoming"
        },
        {
            name: "completed",
            label: "Completed"
        }
    ]

    const activeClassName = "inline-block p-4 text-tertiary-600 border-b-2 border-tertiary-600 rounded-t-lg active dark:text-tertiary-500 dark:border-tertiary-500"
    const inactiveClassName = "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"

    return (
        <div className="font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap flex-row">
                {
                    statusTabs.map((tab) => (
                        <li className="mr-2" key={tab.name}>
                            <Link href={`${appRoutes.events}/${tab.name}`} className={tab.name === currentTab ? activeClassName : inactiveClassName}>
                                {tab.label}                                    
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}