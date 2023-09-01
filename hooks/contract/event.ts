import type NftContractSaleEventType from "@/lib/types/event"
import type { OnchainMintResponse } from "@/lib/types/common"
import { useCallback, useMemo, useEffect, useState } from "react"
import { usePublicClient, useWalletClient } from "wagmi"
import { parseUnits, getAddress, decodeEventLog, formatEther } from "viem"
import { useAuthStatus } from "@/hooks/account"
import { convertToUnixTimestampSeconds } from "@/utils/date"
import { default as latestERC721OpenEdition } from "@/abi/erc721.open_edition"
import { ERC721_OPEN_EDITION_BYTECODE } from "@/solidity/erc721.open_edition.compiled"

export function useOpenEditionSaleEvent() {
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const { session } = useAuthStatus()

    /** Deploy the latest erc721 open edition contract.
     * @param contractName The name of the contract
     * @param contractSymbol The symbol of the contract
     * @param baseURI The base URI of the contract
     * @param evenConfig The configuration of the contract
     * @returns The deployed contract address
     * @note - 'price' is expected in ETH and will be converted to wei in this function.
     * @note - 'end' and 'start' are expected in milliseconds and will be converted to unix timestamp seconds in this function.
    */
    const deployedContractOpenEdition = useCallback(async (
        {
            contractName,
            contractSymbol,
            baseURI,
            evenConfig
        }: {
            contractName: string,
            contractSymbol: string,
            baseURI: string,
            evenConfig: Pick<
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
        const contract = await walletClient?.deployContract({
            account: getAddress(session?.user.address as string),
            abi: latestERC721OpenEdition,
            bytecode: ERC721_OPEN_EDITION_BYTECODE,
            args: [
                contractName,
                contractSymbol,
                baseURI,
                {
                    feeRecipient: getAddress(evenConfig.feeRecipient),
                    royaltyReceiver: getAddress(evenConfig.royaltyReceiver),
                    royalty: BigInt(evenConfig.royalty),
                    maxMintPerWallet: BigInt(evenConfig.maxMintPerWallet),
                    startTime: BigInt(convertToUnixTimestampSeconds(evenConfig.start)),
                    endTime: BigInt(convertToUnixTimestampSeconds(evenConfig.end)),
                    price: parseUnits((evenConfig.price.toString()), 18),
                    transferrable: evenConfig.transferrable
                }
            ]
        })

        const txReceipt = await publicClient.waitForTransactionReceipt({hash: contract as any})
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

            // On successful transaction, the logs will contain the tokenId and to (receiver address)
            const thisLog = {
                to: "to" in decodedLogs.args ? decodedLogs.args.to : "",
                tokenId: "tokenId" in decodedLogs.args ? decodedLogs.args.tokenId.toString() : "",
                quantity: 1
            } as OnchainMintResponse

            mintData.push(thisLog)
        }

        return mintData

    }, [publicClient, walletClient, session?.user.address])


    return {
        deployedContractOpenEdition,
        mintBatchOpenEdition
    }
}

export function useEditionConfiguration({contractAddress}: {contractAddress: string}) {
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
                royaltyReceiver: editionConfig[1],
                royalty: Number(editionConfig[2]),
                maxMintPerWallet: Number(editionConfig[3]),
                transferrable: editionConfig[4],
                price: formatEther(editionConfig[5]),
                startTime: Number(editionConfig[6]),
                endTime: Number(editionConfig[7]),
            }
        } catch (error) {
            console.log(error)
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

export function useAccountPurchaseCount({contractAddress, accountAddress}: {contractAddress: string, accountAddress?: string}) {
    const publicClient = usePublicClient()
    const [count, setCount] = useState(0)
    const accountPurchaseCount = useMemo(async () => {
        let accountPurchaseCount: Number | bigint = 0

        if (accountAddress) {
            accountPurchaseCount = await publicClient.readContract({
                abi: latestERC721OpenEdition,
                address: getAddress(contractAddress),
                functionName: "userPurchases",
                args: [getAddress(accountAddress as string)]
            })
        }

        return Number(accountPurchaseCount)

    }, [publicClient, contractAddress, accountAddress])

    useEffect(() => {
        accountPurchaseCount.then((count) => {
            setCount(count)
        })
    }, [accountPurchaseCount])

    return count
}

/** Hook used for Limited Edition and One-of-One */
export function useLimitedEditionSaleEvent() {
    /** Deploy a new contract */
    const deployedContract = useCallback(async () => {}, [])
    /** Create an edition in the same contract */
    const createTokenId = useCallback(async () => {}, [])
    /** Mint a limited edition */
    const mintLimitedEdition = useCallback(async () => {}, [])
}