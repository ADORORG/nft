import type { NftContractSchemaType } from "@/lib/types/common"
import type { CreateEventSubComponentProps } from "../types"
import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useContractChain, useChainById } from "@/hooks/contract"
import { useOpenEditionSaleEvent, useLimitedEditionSaleEvent } from "@/hooks/contract/event"
import { getFetcherErrorMessage } from "@/utils/network"
import { camelCaseToSentence, cutString, replaceUrlParams } from "@/utils/main"
import { fromRoyaltyPercent, nftEditionChecker } from "@/utils/contract"
import { ERC721_OPEN_EDITION_VERSION } from "@/solidity/erc721.open_edition.compiled"
import { ERC721_LIMITED_EDITION_VERSION } from "@/solidity/erc721.limited_edition.compiled"
import { getNftContractBaseURI,  } from "@/config/api.route"
import NavigationButton from "@/components/NavigationButton"
import Button from "@/components/Button"
import appRoutes from "@/config/app.route"

interface CreateOnchainReturnType {
    contractAddress?: string,
    nftSchema?: NftContractSchemaType,
    version?: string,
    partitionId?: number,
}

export default function PreviewAndDeployEvent(props: CreateEventSubComponentProps) {
    const { 
        eventData,
        accountContracts,
        saveEventData,
        previousScreen,
    } = props

    const tokenLink = useMemo(() => {
        return replaceUrlParams(appRoutes.viewEvent, {
            eventDocId: eventData?._id?.toString() as string,
        })
    }, [eventData._id])

    const [loading, setLoading] = useState(false)
    const { deployedContractOpenEdition } = useOpenEditionSaleEvent()
    const { deployedContractLimitedEdition, createPartition } = useLimitedEditionSaleEvent()
    const contractChain = useContractChain({chainId: eventData?.contract?.chainId as number})
    const chain = useChainById(eventData?.contract?.chainId as number)
    const nftEditionType = nftEditionChecker(eventData.nftEdition)
    
    const handleCreateOnchain = useCallback(async () => {
        await contractChain.ensureContractChainAsync()
        // deploy the contract or create a new nft id
        const result: CreateOnchainReturnType = {}
        const eventConfig = {
            supply: nftEditionType.isOneOfOne ? 1 : eventData.supply as number,
            feeRecipient: eventData.feeRecipient as string,
            royalty: eventData.royalty || 0,
            royaltyReceiver: eventData.royaltyReceiver as string,
            /** Price in ETH */
            price: eventData.price as number,
            maxMintPerWallet: eventData.maxMintPerWallet || 0,
            /** Start time in unix timestamp milliseconds */
            start: eventData.start as number,
            /** End time in unix timestamp milliseconds */
            end: eventData.end as number,
            /** If not defined, it's by default 'true' */
            transferrable: eventData.transferrable === undefined ? true : eventData.transferrable,
        }
        
        if (nftEditionType.isOpenEdition) {
            // deploy a new contract
            const { contractAddress } = await deployedContractOpenEdition({
                contractName: eventData?.contract?.label as string,
                contractSymbol: eventData?.contract?.symbol || "OE",
                baseURI: getNftContractBaseURI(eventData?.contract?.chainId as number),
                eventConfig
            })

            result.contractAddress = contractAddress as string
            result.nftSchema = "erc721"
            result.version = ERC721_OPEN_EDITION_VERSION

        } else if (nftEditionType.isLimitedEdition || nftEditionType.isOneOfOne) {
            // create a new nft partition
            // if it's a new contract, deploy it otherwise create a new partition  
            if (eventData?.contract?._id && eventData?.contract?.contractAddress) {
                
                // create partition
                /** Get the contract address.
                 * If a contract is selected, the contract list must have been fetched
                 */
                const selectedContract = accountContracts?.find(c => c?._id?.toString() === eventData?.contract?._id?.toString())
                const { partitionId } = await createPartition({
                    contractAddress: selectedContract?.contractAddress as string,
                    eventConfig
                })
                
                result.partitionId = partitionId as number
            } else {
                // Existing contract not selected, deploy a new one
                const { contractAddress, partitionId } = await deployedContractLimitedEdition({
                    contractName: eventData?.contract?.label as string,
                    contractSymbol: eventData?.contract?.symbol || "LE",
                    baseURI: getNftContractBaseURI(eventData?.contract?.chainId as number),
                    eventConfig
                })
    
                result.contractAddress = contractAddress as string
                result.partitionId = partitionId as number
                result.nftSchema = "erc721"
                result.version = ERC721_LIMITED_EDITION_VERSION
            }
        }
        return result
    }, [accountContracts, contractChain, deployedContractLimitedEdition, deployedContractOpenEdition, eventData, nftEditionType, createPartition])

    const handleDeploy = useCallback(async () => {
        try {
            setLoading(true)
            if (
                (nftEditionType.isOpenEdition && !eventData.contract?.contractAddress) ||
                !eventData.partitionId
            ) {
                await handleCreateOnchain()
                .then(async createOnchainResult => {
                    // update event data
                    await saveEventData?.({
                        contract: {
                            ...eventData.contract,
                            ...createOnchainResult,
                            draft: false
                        } as any,
                        partitionId: createOnchainResult?.partitionId,
                        draft: false,
                    })

                    return createOnchainResult
                })

            } else {
               // save event data
                await saveEventData?.()
            }
            
        } catch(error) {
            console.error(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }, [eventData, nftEditionType, saveEventData, handleCreateOnchain])

    const PreviewLine = (props: {label: string, value?: React.ReactNode}) => (
        <div 
            className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-600"
        >
            <span>{props.label}</span>
            <span className="col-span-3 justify-self-end break-all">{props.value}</span>  
        </div>
    )

    return (
        <div>
            <div className="w-full flex flex-col gap-4 justify-center pb-4">
                <PreviewLine 
                    label={`Network`}
                    value={chain?.name}
                />
                <PreviewLine 
                    label={`Contract (${eventData.contract?.nftSchema})`}
                    value={eventData.contract?.contractAddress}
                />
                <PreviewLine 
                    label="Collection"
                    value={eventData.xcollection?.name}
                />
                <PreviewLine 
                    label="Price"
                    value={
                        <span>
                            {
                                !parseFloat((eventData.price || "0") as string) ?
                                <span>
                                    <Button className="py-1" variant="gradient" rounded>Free</Button>
                                    &nbsp;0&nbsp;
                                </span>
                                :
                                eventData.price
                            }
                            <span> {chain?.nativeCurrency?.symbol}</span>
                        </span>
                    }
                />
                <PreviewLine 
                    label="Start Date"
                    value={new Date(eventData.start as number).toUTCString()}
                />
                <PreviewLine 
                    label="End Date"
                    value={new Date(eventData.end as number).toUTCString()}
                />
                <PreviewLine 
                    label="Payout Address"
                    value={eventData.feeRecipient}
                />
                <PreviewLine 
                    label="Royalty"
                    value={`${fromRoyaltyPercent(eventData?.royalty || eventData?.contract?.royalty)}%`}
                />
                {
                    ([
                        "royaltyReceiver", "tokenName", "tokenDescription", 
                        "redeemableContent", "mediaType"
                    ] as const).map(key => (
                        <PreviewLine 
                            key={key}
                            label={camelCaseToSentence(key)}
                            value={cutString(eventData[key]?.toString(), 24)}
                        />
                    ))
                }
                <PreviewLine 
                    label="Max Mint Per Wallet"
                    value={parseInt(eventData?.maxMintPerWallet?.toString() as string) === 0 ? "Unlimited" : eventData?.maxMintPerWallet}
                />
                
            </div>
            {/* Navigation buttons */}
            <div className="flex justify-between py-6">
                <div>
                    {
                        previousScreen !== undefined &&
                        <NavigationButton
                            direction="left"
                            text="Previous"
                            onClick={() => previousScreen?.()}
                            className="bg-gray-200 dark:bg-gray-800 py-1 px-3"
                            disabled={loading || !eventData.draft}
                        />
                    }
                </div>
                <div>
                    {
                        !eventData.draft
                        ?
                        <Link
                            href={tokenLink}    
                        >
                            <Button
                                variant="gradient"
                                type="button"
                                className="py-1 px-3 rounded"
                            > View event </Button>
                        </Link>
                        :
                        <Button
                            variant="gradient"
                            onClick={handleDeploy}
                            className="py-1 px-3 rounded"
                            disabled={loading}
                            loading={loading}
                        > Deploy Event </Button>
                    }
                </div>
            </div>
        </div>
    )
}