import type NftContractSaleEventType from "@/lib/types/event"
import type { OnchainMintResponse } from "@/lib/types/common"
import { useCallback } from "react"
import { usePublicClient, useWalletClient } from "wagmi"
import { parseUnits, getAddress, decodeEventLog } from "viem"
import { useAuthStatus } from "@/hooks/account"
import { convertToUnixTimestampSeconds } from "@/utils/date"
import { default as latestERC721OpenEdition, erc721OpenEditionAbiMap } from "@/abi/erc721.open_edition"
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
            quantity,
            contractVersion
        }: {
            /** The contract address to mint on */
            contractAddress: string,
            /** The address to receive the minted nft */
            receiverAddress: string,
            /** The total amount to pay for the minting in ETH (not Wei) */
            totalAmount: number,
            /** The quantity to mint */
            quantity: number,
            /** The version of the contract */
            contractVersion: string
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

        const abiByVersion = erc721OpenEditionAbiMap[contractVersion as keyof typeof erc721OpenEditionAbiMap]

        const writeContractRequest = await publicClient?.simulateContract({
            account: getAddress(session?.user.address as string),
            abi: abiByVersion,
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

        for (const log of txReceipt.logs) {
            const decodedLogs = decodeEventLog({
                abi: abiByVersion,
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

/** Hook used for Limited Edition and One-of-One */
export function useLimitedEditionSaleEvent() {
    /** Deploy a new contract */
    const deployedContract = useCallback(async () => {}, [])
    /** Create an edition in the same contract */
    const createTokenId = useCallback(async () => {}, [])
    /** Mint a limited edition */
    const mintLimitedEdition = useCallback(async () => {}, [])
}