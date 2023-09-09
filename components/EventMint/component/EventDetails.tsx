import type EventMintProps from "../types"
import { useChainById } from "@/hooks/contract"
import { cutAddress } from "@/utils/main"
import { fromRoyaltyPercent, getEventContractEditionData } from "@/utils/contract"

export default function EventDetails(props: EventMintProps) {
    const { eventData } = props
    const { contract } = eventData
    const chain = useChainById(contract.chainId)

    const nodeData = {
        "Contract address": cutAddress(contract.contractAddress),
        "Blockchain": chain?.name,
        "Token Schema": contract.nftSchema.toUpperCase(),
        "Edition": getEventContractEditionData(eventData.nftEdition, eventData.supply).editionStr,
        "Royalty": fromRoyaltyPercent(eventData.royalty) + "%",
        "Royalty Receiver": cutAddress(eventData.royaltyReceiver),
        "Transferrable": eventData.transferrable ? "Yes" : "No",
        "Partition": eventData.partitionId || "None",
    }

    return (
        <div className="flex flex-col gap-4">
            <p className="px-2 py-6">
                {eventData.xcollection.description}
            </p>
            {
                Object.entries(nodeData).map(([key, value]) => (
                    <div key={key} className="flex flex-row justify-between items-center pt-1 border-t border-gray-300 dark:border-gray-700">
                        <span className="">{key}</span>
                        <span>{value}</span>
                    </div>
                ))
            }
        </div>
    )

}