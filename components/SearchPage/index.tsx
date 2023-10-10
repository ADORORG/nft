"use client"
import type { SearchType } from "@/components/SearchPage/types"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import TabNavigation from "@/components/TabNav"
import CollectionSearch from "./Collection"
import EventSearch from "./Event"
import ContractSearch from "./Contract"

export default function SearchPage() {
    const [searchType, setSearchType] = useState<SearchType>("collection")
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get("q") || ""

    const searchTabs = [
        {
            label: "Collection",
            link: `#!collection`,
            uselink: false,
            active: searchType === "collection",
            onClick: () => setSearchType("collection")
        },
        {
            label: "Event", 
            link: `#!event`,
            uselink: false,
            active: searchType === "event",
            onClick: () => setSearchType("event")
        },
        {
            label: "Contract",
            link: `#!contract`,
            uselink: false,
            active: searchType === "contract",
            onClick: () => setSearchType("contract")
        }
    ]

    const searchMap = {
        collection: <CollectionSearch searchQuery={searchQuery} />,
        event: <EventSearch searchQuery={searchQuery} />,
        contract: <ContractSearch searchQuery={searchQuery} />
    }

    return (
        <div>
            <p>Search query: {searchQuery}</p>
            <div className="my-4">
                <TabNavigation
                    tabs={searchTabs}
                    className=""
                />
            </div>
            <div className="p-6">
                {searchMap[searchType]}
            </div>
        </div>
    )
}