import type { NftContractSchemaType } from "@/_cron/src/lib/types/common"
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
import { useOpenEditionSaleEvent } from "@/hooks/contract/event"
import { useContractChain } from "@/hooks/contract"
import { readSingleFileAsDataURL } from "@/utils/file"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { ERC721_OPEN_EDITION_VERSION } from "@/solidity/erc721.open_edition.compiled"
import apiRoutes, { getNftContractBaseURI,  } from "@/config/api.route"
import Button from "@/components/Button"


interface CreateOnchainReturnType {
    contractAddress?: string,
    nftSchema?: NftContractSchemaType,
    version?: string,
}

export default function CreateEventModal() {
    const [loading, setLoading] = useState(false)
    const [nftEventContractData, setNftEventContractData] = useAtom(nftEventContractDataStore)
    const [nftSaleEventData/* , setNftSaleEventData */] = useAtom(nftSaleEventDataStore)
    /** Media file object for this event */
    const [nftEventMedia] = useAtom(nftEventContractMediaStore)
    /** Holds whether we've deployed or added the event on the blockchain */
    const [nftContractDeployed, setNftContractDeployed] = useAtom(nftEventContractDeployedStore)
    /** Holds whether we've added the event to the database locally */
    const [nftSaleEventCreated, setNftSaleEventCreated] = useAtom(nftSaleEventCreatedStore)
    const { ensureContractChainAsync } = useContractChain({chainId: nftEventContractData.chainId as number})
    const { deployedContractOpenEdition } = useOpenEditionSaleEvent()

    const handleCreateOnchain = async () => {
        // deploy the contract or create a new nft id
        const result: CreateOnchainReturnType = {}

        if (nftSaleEventData.nftEdition === "open_edition") {
            // deploy a new contract
            const { contractAddress } = await deployedContractOpenEdition({
                contractName: nftEventContractData.label || "Open Edition",
                contractSymbol: nftEventContractData.symbol || "OE",
                baseURI: getNftContractBaseURI(nftEventContractData.chainId as number),
                evenConfig: {
                    feeRecipient: nftSaleEventData.feeRecipient || "",
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

        } else if (nftSaleEventData.nftEdition === "limited_edition") {
            // create a new nft id with the supplied edition
        } else if (nftSaleEventData.nftEdition === "one_of_one") {
            // create a single supply nft id
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
                },
            })
        })

        if (result.success) {
            setNftSaleEventCreated(true)
            toast.success(result.message)
        }
    }

    const handleCreation = async () => {
        try {
            setLoading(true)

            if (!nftContractDeployed) {
                // ensure that wallet is connected to the target chain
                await ensureContractChainAsync()
                const result = await handleCreateOnchain()
                // create the event in the database
                await handleCreateOffchain(result)
            } else if (!nftSaleEventCreated) {
                // create the event in the database
                await handleCreateOffchain({})
            } else {
                // navigate to the event page
            }

        } catch (error: any) {
            console.log("Creating event error", error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
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