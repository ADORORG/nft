import type { NftContractSchemaType } from "@/lib/types/common"
import { useState } from "react"
import { 
    nftSaleEventDataStore,
    nftSaleEventCreatedStore,
    nftEventContractDataStore,
    nftEventContractMediaStore,
    nftEventContractDeployedStore,
} from "@/store/form"
import { useAtom } from "jotai"
import { toast } from "react-hot-toast"
import { useOpenEditionSaleEvent, useLimitedEditionSaleEvent } from "@/hooks/contract/event"
import { useContractChain } from "@/hooks/contract"
import { useAccountContract } from "@/hooks/fetch"
import { useAuthStatus } from "@/hooks/account"
import { readSingleFileAsDataURL } from "@/utils/file"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { nftEditionChecker } from "@/utils/contract"
import { ERC721_OPEN_EDITION_VERSION } from "@/solidity/erc721.open_edition.compiled"
import { ERC721_LIMITED_EDITION_VERSION } from "@/solidity/erc721.limited_edition.compiled"
import apiRoutes, { getNftContractBaseURI,  } from "@/config/api.route"
import Button from "@/components/Button"
import EventCreatedCompleted from "./components/EventCreatedCompleted"

interface CreateOnchainReturnType {
    contractAddress?: string,
    nftSchema?: NftContractSchemaType,
    version?: string,
    partitionId?: number,
}

export default function CreateEventModal({resetForm}: {resetForm: () => void}) {
    const [loading, setLoading] = useState(false)
    const [newEventId, setNewEventId] = useState<string|null>(null)
    const [nftEventContractData, setNftEventContractData] = useAtom(nftEventContractDataStore)
    const [nftSaleEventData, setNftSaleEventData] = useAtom(nftSaleEventDataStore)
    /** Media file object for this event */
    const [nftEventMedia] = useAtom(nftEventContractMediaStore)
    /** Holds whether we've deployed or added the event on the blockchain */
    const [nftContractDeployed, setNftContractDeployed] = useAtom(nftEventContractDeployedStore)
    /** Holds whether we've added the event to the database locally */
    const [nftSaleEventCreated, setNftSaleEventCreated] = useAtom(nftSaleEventCreatedStore)
    const { ensureContractChainAsync } = useContractChain({chainId: nftEventContractData.chainId as number})
    const { deployedContractOpenEdition } = useOpenEditionSaleEvent()
    const { deployedContractLimitedEdition, createPartition } = useLimitedEditionSaleEvent()
    const { session } = useAuthStatus()
    const { accountContracts } = useAccountContract(session?.user.address)
    const nftEditionType = nftEditionChecker(nftSaleEventData.nftEdition)
    
    const handleCreateOnchain = async () => {
        // deploy the contract or create a new nft id
        const result: CreateOnchainReturnType = {}
        const eventConfig = {
            supply: nftEditionType.isOneOfOne ? 1 : nftSaleEventData.supply as number,
            feeRecipient: nftSaleEventData.feeRecipient as string,
            royalty: nftSaleEventData.royalty || 0,
            royaltyReceiver: nftSaleEventData.royaltyReceiver as string,
            /** Price in ETH */
            price: nftSaleEventData.price as number,
            maxMintPerWallet: nftSaleEventData.maxMintPerWallet || 0,
            /** Start time in unix timestamp milliseconds */
            start: nftSaleEventData.start as number,
            /** End time in unix timestamp milliseconds */
            end: nftSaleEventData.end as number,
            /** If not defined, it's by default 'true' */
            transferrable: nftSaleEventData.transferrable === undefined ? true : nftSaleEventData.transferrable,
        }
        
        if (nftEditionType.isOpenEdition) {
            // deploy a new contract
            const { contractAddress } = await deployedContractOpenEdition({
                contractName: nftEventContractData.label as string,
                contractSymbol: nftEventContractData.symbol || "OE",
                baseURI: getNftContractBaseURI(nftEventContractData.chainId as number),
                eventConfig
            })

            result.contractAddress = contractAddress as string
            result.nftSchema = "erc721"
            result.version = ERC721_OPEN_EDITION_VERSION
            // set the contract address
            setNftEventContractData({
                ...nftEventContractData, 
                contractAddress: result.contractAddress,
                nftSchema: result.nftSchema,
                version: result.version
            })

        } else if (nftEditionType.isLimitedEdition || nftEditionType.isOneOfOne) {
            // create a new nft partition id with the supplied edition
            // if it's a new contract, deploy it otherwise create a new partition  
            if (!nftEventContractData._id) {
                // Existing contract not selected, deploy a new one
                const { contractAddress, partitionId } = await deployedContractLimitedEdition({
                    contractName: nftEventContractData.label as string,
                    contractSymbol: nftEventContractData.symbol || "LE",
                    baseURI: getNftContractBaseURI(nftEventContractData.chainId as number),
                    eventConfig
                })
    
                result.contractAddress = contractAddress as string
                result.partitionId = partitionId as number
                result.nftSchema = "erc721"
                result.version = ERC721_LIMITED_EDITION_VERSION
                // set the contract address
                setNftEventContractData({
                    ...nftEventContractData, 
                    contractAddress: result.contractAddress,
                    nftSchema: result.nftSchema,
                    version: result.version,
                })
                setNftSaleEventData({
                    ...nftSaleEventData,
                    partitionId: result.partitionId,
                })
            } else {
                // create partition
                /** Get the contract address.
                 * If a contract is selected, the contract list must have been fetched
                 */
                const selectedContract = accountContracts?.find(c => c?._id?.toString() === nftEventContractData._id?.toString())
                const { partitionId } = await createPartition({
                    contractAddress: selectedContract?.contractAddress as string,
                    eventConfig
                })
                
                result.partitionId = partitionId as number
                setNftSaleEventData({
                    ...nftSaleEventData,
                    partitionId: result.partitionId,
                })

            }
        }

        setNftContractDeployed(true)
        return result
    }

    /**
     * Upload event data to the database
     * @param onchainResult 
     * @todo - Stream the media file to the decentralized storage
     */
    const handleCreateOffchain = async (onchainResult: CreateOnchainReturnType) => {
        // Convert the nftEventMedia to data url
        const mediaDataUrl = await new Promise<string>((resolve) => {
            readSingleFileAsDataURL(nftEventMedia as Blob, resolve as any)
        })

        const contractAddress = onchainResult.contractAddress || nftEventContractData.contractAddress
        const nftSchema = onchainResult.nftSchema || nftEventContractData.nftSchema
        const version = onchainResult.version || nftEventContractData.version
        const partitionId = onchainResult.partitionId || nftSaleEventData.partitionId

        // deploy or create a new nft id
        const result = await fetcher(apiRoutes.createEvent, {
            method: "POST",
            body: JSON.stringify({
                contract: {
                    ...nftEventContractData,
                    contractAddress,
                    nftSchema,
                    version,
                },
                event: {
                    ...nftSaleEventData,
                    media: mediaDataUrl,
                    partitionId,
                    /** @todo - implement fixed and auction type on smart contract */
                    saleType: "fixed"
                },
            })
        })

        if (result.success) {
            return result
        }
    }

    const handleCreation = async () => {
        try {
            setLoading(true)
            let offchainCreateResult

            if (!nftContractDeployed) {
                // ensure that wallet is connected to the target chain
                await ensureContractChainAsync()
                const result = await handleCreateOnchain()
                // create the event in the database
                offchainCreateResult = await handleCreateOffchain(result)
            } else if (!nftSaleEventCreated) {
                // create the event in the database
                offchainCreateResult =  await handleCreateOffchain({})
            } else {
                // navigate to the event page
            }
            
            resetForm()

            if (offchainCreateResult) {
                setNftSaleEventCreated(true)
                setNewEventId(offchainCreateResult.data._id)
                toast.success(offchainCreateResult.message)
            }

        } catch (error: any) {
            console.log("Creating event error", error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    if (newEventId && nftSaleEventCreated) {
        return <EventCreatedCompleted eventId={newEventId} />
    }

    return (
        <div className="flex flex-col gap-4 p-1 md:w-80">
            <Button
                disabled={nftContractDeployed || loading}
                className="w-full"
                variant="gradient"
                loading={!nftContractDeployed && loading}
                onClick={handleCreation}
                rounded
            >
                Create on blockchain
            </Button>

            <Button
                disabled={!nftContractDeployed || nftSaleEventCreated || loading}
                className="w-full"
                variant="gradient"
                loading={nftContractDeployed && loading}
                onClick={handleCreation}
                rounded
            >
                Save event data
            </Button>
        </div>
    )
}