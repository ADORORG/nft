"use client"
import type AccountType from "@/lib/types/account"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "@/components/Image"
import { cutAddress, replaceUrlParams } from "@/utils/main"
import appRoute from "@/config/app.route"

type CreatorCardProps = {
    creatorAccount: AccountType, 
    currencyNode: React.ReactNode
}


export default function CreatorCard({creatorAccount, currencyNode}: CreatorCardProps) {
    const [showDropdown, setShowDropdown] = useState<boolean>(false)
    const { address = "0x0", image = "" } = creatorAccount || {}
    const dropdownRef = useRef<HTMLDivElement>(null)
    const viewAccount = replaceUrlParams(appRoute.viewAccount, {address: address.toLowerCase()})
    const accountRoute = ["token", "collection", "marketplace"].map(r => ({href: `${viewAccount}/${r}`, label: r}))

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setShowDropdown(false)
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside)

        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])

    return (
        <div className="lg:h-[150px] lg:w-[370px] flex lg:flex-row flex-col justify-start items-center gap-2 p-1 bg-gray-200 dark:bg-gray-900 transition dark:bg-opacity-70 dark:hover:bg-opacity-90 rounded shadow-lg">
            <div className="p-1">
                <Image 
                    className="w-[220px] rounded border border-gray-300" 
                    src={image}
                    data={address}
                    alt=""
                    width={300}
                    height={300}
                />
            </div>

            <div className="w-full flex flex-col justify-center items-center py-2">
                <p className="text-gray-950 dark:text-white text-xl lg:text-2xl tracking-wide subpixel-antialiased">{cutAddress(address)}</p>
                <div className="text-lg font-normal my-3">
                    {currencyNode}
                </div>
            </div>

            <div ref={dropdownRef} className="relative p-3">
                <button
                    className="relative rotate-90 lg:rotate-0"
                    onClick={() => setShowDropdown(!showDropdown)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 lg:w-10 lg:h-10 text-gray-950 dark:text-gray-100">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                </button>

                <div id="dropdownHover" className={`${!showDropdown && "hidden"} absolute origin-top-right right-0 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-800`}>
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownHoverButton">
                        {
                            accountRoute.map(route => (
                                <li key={route.href}>
                                    <Link href={route.href} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">See {route.label} </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}