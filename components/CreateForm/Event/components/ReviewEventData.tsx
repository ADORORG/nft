import type { EventDataFormProps } from "../types"
import type { NftContractEditionType } from "@/lib/types/common"
import { useChainById } from "@/hooks/contract"
import { useAccountContract, useAccountCollection } from "@/hooks/fetch"
import { useAuthStatus } from "@/hooks/account"
import { fromRoyaltyPercent, getEventContractEditionData, nftEditionChecker } from "@/utils/contract"

export default function ReviewEventData(props: EventDataFormProps) {
    const { session } = useAuthStatus()
    const { accountContracts } = useAccountContract(session?.user.address)
    const { accountCollections } = useAccountCollection(session?.user.address)
    const {contractData, eventData} = props
    const {label, chainId, _id} = contractData
    const chain = useChainById(chainId as number)

    const {
        tokenName,
        maxMintPerWallet, 
        start, 
        end, 
        price, 
        nftEdition, 
        supply,
        feeRecipient,
        royalty,
        royaltyReceiver,
        transferrable,
        xcollection,
    } = eventData

    const nftEditionType = nftEditionChecker(nftEdition)
    const editionDescription = getEventContractEditionData(props.eventData?.nftEdition as NftContractEditionType, supply)
    const selectedContract = accountContracts?.find(c => c?._id?.toString() === _id?.toString())
    const selectedCollection = accountCollections?.find(c => c?._id?.toString() === xcollection?.toString())

    const fieldClassName = "flex flex-row justify-between items-start pb-2 border-b border-gray-300 dark:border-gray-700"
    const notSet = <span className="border border-rose-500 p-1 text-rose-500 text-[12px] rounded">Not set</span>

    return (
        <div className={`${props.className}`}>
            <p className={fieldClassName}>
                <span>Event Name</span>
                <span>
                    {tokenName || notSet}
                </span>
            </p>
            <p className={fieldClassName}>
                <span>Network</span>
                <span>
                    {chain?.name || notSet}
                </span>
            </p>
            <p className={fieldClassName}>
                <span>Contract</span>
                <span>{selectedContract ? selectedContract.label : (label || notSet)}</span>
            </p>
            <p className={fieldClassName}>
                <span>Royalty</span>
                <span>{royalty ? `${fromRoyaltyPercent(royalty)}%` : notSet}</span>
            </p>
            <p className={fieldClassName}>
                <span>Royalty Receiver</span>
                <span className="break-all text-sm select-all">{royaltyReceiver || notSet}</span>
            </p>
            <p className={fieldClassName}>
                <span>Supply</span>
                <span>
                    {
                        nftEditionType.isLimitedSupply 
                        ?  
                        Number(supply) > 0 ? editionDescription.editionStr  : notSet 
                        : 
                        editionDescription.editionStr
                    }
                </span>
            </p>
            <p className={fieldClassName}>
                <span>Collection</span>
                <span>{selectedCollection ? selectedCollection.name : notSet}</span>
            </p>
            <p className={fieldClassName}>
                <span>Price</span>
                <span>{price || notSet} {chain?.nativeCurrency?.symbol}</span>
            </p>
            <p className={fieldClassName}>
                <span>Start date</span>
                <span>{start ? new Date(start).toUTCString() : notSet}</span>
            </p>
            <p className={fieldClassName}>
                <span>End date</span>
                <span>{end ? new Date(end).toUTCString() : notSet}</span>
            </p>
            <p className={fieldClassName}>
                <span>Mint Per Wallet</span>
                <span>{maxMintPerWallet || "No max"}</span>
            </p>
            <p className={fieldClassName}>
                <span>Payout Address</span>
                <span className="break-all text-sm select-all">{feeRecipient || notSet}</span>
            </p>
            <p className={fieldClassName}>
                <span>Transferrable</span>
                {/* Transferrable by default */}
                <span>{(transferrable === undefined || transferrable) ? "Yes" : "No"}</span>
            </p>
        </div>
    )
}