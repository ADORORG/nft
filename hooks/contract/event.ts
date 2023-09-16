import type NftContractSaleEventType from "@/lib/types/event"
import type { OnchainMintResponse } from "@/lib/types/common"
import { useCallback, useMemo, useEffect, useState } from "react"
import { usePublicClient, useWalletClient } from "wagmi"
import { parseUnits, getAddress, decodeEventLog, formatEther } from "viem"
import { useAuthStatus } from "@/hooks/account"
import { convertToUnixTimestampSeconds } from "@/utils/date"
import { default as latestERC721OpenEdition } from "@/abi/erc721.open_edition"
import { default as latestERC721LimitedEdition } from "@/abi/erc721.limited_edition"
import { ERC721_OPEN_EDITION_BYTECODE } from "@/solidity/erc721.open_edition.compiled"
import { ERC721_LIMITED_EDITION_BYTECODE } from "@/solidity/erc721.limited_edition.compiled"

export function useOpenEditionSaleEvent() {
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const { session } = useAuthStatus()

    /** Deploy the latest erc721 open edition contract.
     * @param contractName The name of the contract
     * @param contractSymbol The symbol of the contract
     * @param baseURI The base URI of the contract
     * @param eventConfig The configuration of the contract
     * @returns The deployed contract address
     * @note - 'price' is expected in ETH and will be converted to wei in this function.
     * @note - 'end' and 'start' are expected in milliseconds and will be converted to unix timestamp seconds in this function.
    */
    const deployedContractOpenEdition = useCallback(async (
        {
            contractName,
            contractSymbol,
            baseURI,
            eventConfig
        }: {
            contractName: string,
            contractSymbol: string,
            baseURI: string,
            eventConfig: Pick<
                NftContractSaleEventType,
                "feeRecipient" |
                "royaltyReceiver" |
                "royalty" |
                "maxMintPerWallet" |
                "start" |
                "end" |
                "price" |
                "transferrable" 
            >
        }
    ) => {
        const deployTxhash = await walletClient?.deployContract({
            account: getAddress(session?.user.address as string),
            abi: latestERC721OpenEdition,
            bytecode: ERC721_OPEN_EDITION_BYTECODE,
            args: [
                contractName,
                contractSymbol,
                baseURI,
                getAddress(eventConfig.royaltyReceiver),
                BigInt(eventConfig.royalty),
                {
                    feeRecipient: getAddress(eventConfig.feeRecipient),
                    maxMintPerWallet: BigInt(eventConfig.maxMintPerWallet),
                    startTime: BigInt(convertToUnixTimestampSeconds(eventConfig.start)),
                    endTime: BigInt(convertToUnixTimestampSeconds(eventConfig.end)),
                    price: parseUnits((eventConfig.price.toString()), 18),
                    transferrable: eventConfig.transferrable
                }
            ]
        })

        const txReceipt = await publicClient.waitForTransactionReceipt({hash: deployTxhash as any})
        // wait for transaction to be mined and get the contract address

        return {
            contractAddress: txReceipt.contractAddress,
        }
   
    }, [walletClient, publicClient, session?.user.address])

    /** Mint batch on open edition 
     * @param contractAddress The contract address to mint from
     * @param receiverAddress The address to receive the minted nft
     * @param totalAmount The total amount to pay for the minting
     * @param quantity The quantity to mint
     * @returns An array of tokenIds, to address and quantity
    */
    const mintBatchOpenEdition = useCallback(async (
        {
            contractAddress,
            receiverAddress,
            totalAmount,
            quantity
        }: {
            /** The contract address to mint on */
            contractAddress: string,
            /** The address to receive the minted nft */
            receiverAddress: string,
            /** The total amount to pay for the minting in ETH (not Wei) */
            totalAmount: number,
            /** The quantity to mint */
            quantity: number,
        }
    ) => {
        // Convert totalAmount to wei
        const valueInWei = parseUnits(totalAmount.toString(), 18)
        // Ensure that the account have enough ETH balance to pay for the minting
        const balance = await publicClient.getBalance({
            address: getAddress(session?.user.address as string)
        })

        if (balance < valueInWei) {
            throw new Error("Not enough balance to mint")
        }

        const writeContractRequest = await publicClient?.simulateContract({
            account: getAddress(session?.user.address as string),
            abi: latestERC721OpenEdition,
            address: getAddress(contractAddress),
            functionName: "batchMint",
            // cost for minting nft. Convert to wei
            value: parseUnits(totalAmount.toString(), 18),
            args: [
                getAddress(receiverAddress),
                BigInt(quantity)
            ]
        })

        const minTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        const txReceipt = await publicClient.waitForTransactionReceipt({hash: minTxHash as any})

        const mintData = []

        // Decode the logs to get the tokenId and to (receiver address)
        for (const log of txReceipt.logs) {
            const decodedLogs = decodeEventLog({
                abi: latestERC721OpenEdition,
                data: log.data,
                topics: log.topics
            })

            if (decodedLogs.eventName === "Transfer") {
                // On successful transaction, the logs will contain the tokenId and to (receiver address)
                const thisLog = {
                    to: decodedLogs.args.to,
                    tokenId: decodedLogs.args.tokenId.toString(),
                    quantity: 1
                } as OnchainMintResponse

                mintData.push(thisLog)
            }
        }

        return mintData

    }, [publicClient, walletClient, session?.user.address])

    return {
        deployedContractOpenEdition,
        mintBatchOpenEdition
    }
}

export function useOpenEditionConfiguration({contractAddress}: {contractAddress: string}) {
    const publicClient = usePublicClient()
    const [config, setConfig] = useState<Record<string, unknown> | null>(null)

    const openEditionConfig = useMemo(async () => {
        try {
            const editionConfig = await publicClient.readContract({
                abi: latestERC721OpenEdition,
                address: getAddress(contractAddress),
                functionName: "editionConfig"
            })
    
            return {
                feeRecipient: editionConfig[0],
                maxMintPerWallet: Number(editionConfig[1]),
                transferrable: editionConfig[2],
                price: formatEther(editionConfig[3]),
                startTime: Number(editionConfig[4]),
                endTime: Number(editionConfig[5]),
            }
        } catch (error) {
            // console.log(error)
        }

        return null
        
    }, [publicClient, contractAddress])

    useEffect(() => {
        openEditionConfig.then((config) => {
            setConfig(config)
        })
    }, [openEditionConfig])

    return config
}

export function useAccountMintCount({contractAddress, accountAddress, partitionId}: {contractAddress: string, accountAddress?: string, partitionId?: number}) {
    const publicClient = usePublicClient()
    const [count, setCount] = useState(0)
    
    const accountMintsCount = useCallback(async () => {
        if (accountAddress) {
            let mintsCount

            if (partitionId) {
                // use limited edition abi
                mintsCount = await publicClient.readContract({
                    abi: latestERC721LimitedEdition,
                    address: getAddress(contractAddress),
                    functionName: "walletMints",
                    args: [BigInt(partitionId), getAddress(accountAddress as string)]
                })
            } else {
                mintsCount = await publicClient.readContract({
                    abi: latestERC721OpenEdition,
                    address: getAddress(contractAddress),
                    functionName: "walletMints",
                    args: [getAddress(accountAddress as string)]
                })
            }

            setCount(Number(mintsCount))
        }

    }, [publicClient, contractAddress, accountAddress, partitionId])

    useEffect(() => {
        accountMintsCount()
    }, [accountMintsCount])

    return count
}

/** Hook used for Limited Edition and One-of-One */
export function useLimitedEditionSaleEvent() {
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const { session } = useAuthStatus()

    /** Deploy a new contract */
    const deployedContractLimitedEdition = useCallback(async ({
        contractName,
        contractSymbol,
        baseURI,
        eventConfig
    }: {
        contractName: string,
        contractSymbol: string,
        baseURI: string,
        eventConfig: Pick<
            NftContractSaleEventType,
            "supply" |
            "feeRecipient" |
            "royaltyReceiver" |
            "royalty" |
            "maxMintPerWallet" |
            "start" |
            "end" |
            "price" |
            "transferrable"
        >
    }) => {
        const deployTxhash = await walletClient?.deployContract({
            account: getAddress(session?.user.address as string),
            abi: latestERC721LimitedEdition,
            bytecode: ERC721_LIMITED_EDITION_BYTECODE,
            args: [
                contractName,
                contractSymbol,
                baseURI,
                BigInt(eventConfig.supply),
                {
                    feeRecipient: getAddress(eventConfig.feeRecipient),
                    royaltyReceiver: getAddress(eventConfig.royaltyReceiver),
                    royaltyFraction: BigInt(eventConfig.royalty),
                    maxMintPerWallet: BigInt(eventConfig.maxMintPerWallet),
                    startTime: BigInt(convertToUnixTimestampSeconds(eventConfig.start)),
                    endTime: BigInt(convertToUnixTimestampSeconds(eventConfig.end)),
                    price: parseUnits((eventConfig.price.toString()), 18),
                    transferrable: eventConfig.transferrable
                }
            ]
        })

        // wait for transaction to be mined and get the contract address
        const txReceipt = await publicClient.waitForTransactionReceipt({hash: deployTxhash as any})

        let partitionId: bigint | null = null

        for (const log of txReceipt.logs) {
            const decodedLogs = decodeEventLog({
                abi: latestERC721LimitedEdition,
                data: log.data,
                topics: log.topics
            })

            if (decodedLogs.eventName === "NewPartition") {
                partitionId = decodedLogs.args.partitionId
                break
            }
        }
        
        return {
            partitionId: Number(partitionId),
            contractAddress: txReceipt.contractAddress,
        }

    }, [publicClient, walletClient, session?.user.address])
    /** Create an edition in the same contract */
    const createPartition = useCallback(async ({
        contractAddress,
        eventConfig
    }: {
        contractAddress: string,
        eventConfig: Pick<
            NftContractSaleEventType,
            "supply" |
            "feeRecipient" |
            "royaltyReceiver" |
            "royalty" |
            "maxMintPerWallet" |
            "start" |
            "end" |
            "price" |
            "transferrable"
        >   
    }) => {

        const createPartitionRequest = await publicClient?.simulateContract({
            account: getAddress(session?.user.address as string),
            abi: latestERC721LimitedEdition,
            address: getAddress(contractAddress),
            functionName: "createPartition",
            args: [
                BigInt(eventConfig.supply),
                {
                    maxMintPerWallet: BigInt(eventConfig.maxMintPerWallet),
                    transferrable: eventConfig.transferrable,
                    price: parseUnits((eventConfig.price.toString()), 18),
                    startTime: BigInt(convertToUnixTimestampSeconds(eventConfig.start)),
                    endTime: BigInt(convertToUnixTimestampSeconds(eventConfig.end)),
                    feeRecipient: getAddress(eventConfig.feeRecipient),
                    royaltyReceiver: getAddress(eventConfig.royaltyReceiver),
                    royaltyFraction: BigInt(eventConfig.royalty),
                }
            ]
        })

        const createTxhash = await walletClient?.writeContract(createPartitionRequest?.request)
        const txReceipt = await publicClient.waitForTransactionReceipt({hash: createTxhash as any})

        let partitionId: bigint | null = null

        for (const log of txReceipt.logs) {
            const decodedLogs = decodeEventLog({
                abi: latestERC721LimitedEdition,
                data: log.data,
                topics: log.topics
            })

            if (decodedLogs.eventName === "NewPartition") {
                partitionId = decodedLogs.args.partitionId
                break
            }
        }

        return {
            partitionId: Number(partitionId)
        }

    }, [publicClient, walletClient, session?.user.address])

    /** Mint a limited edition */
    const mintBatchLimitedEdition = useCallback(async (
        {
            contractAddress,
            partitionId,
            receiverAddress,
            totalAmount,
            quantity
        }: {
            /** The contract address to mint on */
            contractAddress: string,
            /** The limited edition partition id to mint on */
            partitionId: number,
            /** The address to receive the minted nft */
            receiverAddress: string,
            /** The total amount to pay for the minting in ETH (not Wei) */
            totalAmount: number,
            /** The quantity to mint */
            quantity: number,
        }
    ) => {
        // Convert totalAmount to wei
        const valueInWei = parseUnits(totalAmount.toString(), 18)
        // Ensure that the account have enough ETH balance to pay for the minting
        const balance = await publicClient.getBalance({
            address: getAddress(session?.user.address as string)
        })

        if (balance < valueInWei) {
            throw new Error("Not enough balance to mint")
        }

        const writeContractRequest = await publicClient?.simulateContract({
            account: getAddress(session?.user.address as string),
            abi: latestERC721LimitedEdition,
            address: getAddress(contractAddress),
            functionName: "batchMint",
            // cost for minting nft. Convert to wei
            value: parseUnits(totalAmount.toString(), 18),
            args: [
                BigInt(partitionId),
                getAddress(receiverAddress),
                BigInt(quantity)
            ]
        })

        const minTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        const txReceipt = await publicClient.waitForTransactionReceipt({hash: minTxHash as any})

        const mintData = []

        // Decode the logs to get the tokenId and to (receiver address)
        for (const log of txReceipt.logs) {
            const decodedLogs = decodeEventLog({
                abi: latestERC721OpenEdition,
                data: log.data,
                topics: log.topics
            })

            if (decodedLogs.eventName === "Transfer") {
                // On successful transaction, the logs will contain the tokenId and to (receiver address)
                const thisLog = {
                    to: decodedLogs.args.to,
                    tokenId: decodedLogs.args.tokenId.toString(),
                    quantity: 1
                } as OnchainMintResponse

                mintData.push(thisLog)
            }
        }

        return mintData

    }, [publicClient, walletClient, session?.user.address])

    return {
        deployedContractLimitedEdition,
        createPartition,
        mintBatchLimitedEdition
    }
}