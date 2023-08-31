import type EventMintProps from "../types"
import Link from "next/link"
import { BoxArrowUpRight, BarChart, Folder } from "react-bootstrap-icons"
import { useChainById } from "@/hooks/contract"
import { replaceUrlParams } from "@/utils/main"
import appRoutes from "@/config/app.route"

export default function ExternalLink(props: EventMintProps) {
    const chain = useChainById(props.eventData.contract.chainId)


    return (
        <div className="flex flex-col gap-2">
            <a 
                href={`${chain?.blockExplorers?.default.url}/address/${props.eventData.contract.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex flex-row justify-between items-center pt-1 border-t border-gray-300 dark:border-gray-700">
                
                <span className="flex flex-row justify-between items-center gap-1">
                    <BarChart className="h-4 w-4" />&nbsp;
                    <span>View on {chain?.blockExplorers?.default.name}</span>
                </span>
                <BoxArrowUpRight className="h-4 w-4" />
            </a>

            <Link
                href={replaceUrlParams(appRoutes.viewCollection, {slug: props.eventData.xcollection.slug})}
                className="block flex flex-row justify-between items-center pt-1 border-t border-gray-300 dark:border-gray-700"
            >
                <span className="flex flex-row justify-between items-center gap-1">
                    <Folder className="h-4 w-4" />&nbsp;
                    <span>View collection</span>
                </span>
            </Link>
        </div>

    )
}