"use client"
import type AccountType from "@/lib/types/account"
import Link from "next/link"
import Image from "@/components/Image"
import Dropdown from "@/components/Dropdown"
import { ThreeDotsVertical } from "react-bootstrap-icons"
import { cutAddress, replaceUrlParams } from "@/utils/main"
import appRoute from "@/config/app.route"

type CreatorCardProps = {
    creatorAccount: AccountType, 
    currencyNode: React.ReactNode
}


export default function CreatorCard({creatorAccount, currencyNode}: CreatorCardProps) {
    const { address = "0x0", image = "" } = creatorAccount || {}
    const viewAccount = replaceUrlParams(appRoute.viewAccount, {address: address.toLowerCase()})
    const accountRoute = ["token", "collection", "marketplace"].map(r => ({href: `${viewAccount}/${r}`, label: r}))

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

            <div className="p-3">
                <Dropdown
                    dropdownTrigger={<ThreeDotsVertical className="h-6 w-6 rotate-90 lg:rotate-0" />}
                    dropsClassName="w-44 rounded"
                >
                    {
                        accountRoute.map(route => (
                            <Dropdown.Item key={route.href}>
                                <Link href={route.href} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">See {route.label} </Link>
                            </Dropdown.Item>
                        ))
                    }
                </Dropdown>
            </div>
        </div>
    )
}