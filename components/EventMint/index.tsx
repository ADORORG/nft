"use client"
import type EventMintProps from "./types"
import Link from "next/link"
import EventDetails from "./component/EventDetails"
import ExternalLink from "./component/ExternalLink"
import MintCard from "./component/MintCard"
import { MediaSkeleton } from "@/components/Skeleton"
import { MediaPreview } from "@/components/MediaPreview"
import { UserAccountAvatarWithLink } from "@/components/UserAccountAvatar"
import { cutString, replaceUrlParams } from "@/utils/main"
import { IPFS_GATEWAY } from "@/lib/app.config"
import appRoutes from "@/config/app.route"

export function EventMintExpanded(props: EventMintProps) {
    /**
     * @todo - Get the contract configuration from the blockchain.
     */
    const { eventData } = props

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col self-center gap-4 w-[250px] md:w-[350px]">
                <h1 className="text-2xl self-center font-semibold break-all">{eventData.contract.label}</h1>
                <div className="self-center">
                    <UserAccountAvatarWithLink 
                        account={eventData.owner}
                        className="w-4 h-4 text-sm"
                    />
                </div>
            </div>

            <div className="flex justify-center">
                <div className="w-[250px] md:w-[350px] flex justify-center items-center bg-gray-200 dark:bg-gray-900">
                    <MediaPreview
                        src={`${IPFS_GATEWAY}${eventData.media}`}
                        type={eventData.mediaType}
                        loadingComponent={<MediaSkeleton className="w-full h-full" />}
                        previewClassName="w-full h-full"
                    />
                </div>
            </div>

            <div className="flex flex-col-reverse items-center md:items-start md:flex-row justify-evenly gap-6 md:gap-2">
                <div className="basis-1/2">
                    <EventDetails eventData={eventData} />
                </div>

                <div className="flex flex-col gap-6 grow-0 w-[250px]">
                    <MintCard eventData={eventData} />
                    <ExternalLink eventData={eventData} />
                </div>

            </div>
        </div>
    )
}

export function EventMintCollapsed(props: EventMintProps) {
    /**
     * @todo - Get the contract configuration from the blockchain.
     */
    const { eventData } = props
    return (
        <div className="max-w-xl flex flex-col justify-between gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded drop-shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-xl font-semibold break-all">{cutString(eventData.contract.label, 24)}</h1>
                <div className="">
                    <UserAccountAvatarWithLink 
                        account={eventData.owner}
                        className="w-4 h-4 text-sm"
                    />
                </div>
            </div>
            
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 py-3">
                <div className="w-[260px] h-[270px] flex flex-col gap-2">
                    <MintCard eventData={eventData} />
                </div>
                <div className="flex items-center p-2 w-[260px] h-[270px] bg-gray-200 dark:bg-gray-900 rounded">
                    <MediaPreview
                        src={`${IPFS_GATEWAY}${eventData.media}`}
                        type={eventData.mediaType}
                        loadingComponent={<MediaSkeleton className="w-full h-full" />}
                        previewClassName="flex justify-center items-center w-full h-full"
                        className="max-w-[260px] max-h-[270px]"
                    />
                </div>
            </div>

            <div className="p-3">
                <p className="min-h-[70px]">
                    {cutString(eventData.xcollection.description.repeat(15), 120)}
                </p>
                <p className="text-end">
                <Link
                    className="text-tertiary-950 dark:text-tertiary-400"
                    href={
                        replaceUrlParams(appRoutes.viewEvent, {
                            eventDocId: eventData._id?.toString() as string
                        })
                    }
                >
                    More info...
                </Link>
                </p>
            </div>
        </div>
    )
}