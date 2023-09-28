"use client"
import Link from "next/link"

interface TabNavigationProps {
    tabs: {
        label: React.ReactNode,
        link: string,
        active?: boolean
    }[],
    className?: string
}

export default function TabNavigation(props: TabNavigationProps) {

    const activeClassName = "inline-block p-4 text-tertiary-600 border-b-2 border-tertiary-600 rounded-t-lg active dark:text-tertiary-500 dark:border-tertiary-500"
    const inactiveClassName = "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"

    return (
        <div className="font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className={`flex flex-wrap flex-row ${props.className}`}>
                {
                    props.tabs.map((tab) => (
                        <li className="" key={tab.link}>
                            <Link href={tab.link} className={tab.active ? activeClassName : inactiveClassName}>
                                {tab.label}                                    
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}