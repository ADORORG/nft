import { useCallback } from "react"
import { usePublicClient, useWalletClient, useAccount } from "wagmi"
import { getAddress, decodeEventLog, type Abi } from "viem"
import { useAuthStatus } from "@/hooks/account"
import { useContractChain } from "@/hooks/contract"
import { getNftContractBaseURI } from "@/config/api.route"
import { ERC1155_BYTECODE } from "@/solidity/erc1155.compiled"
import { ERC721_BYTECODE } from "@/solidity/erc721.compiled"
import erc721Abi from "@/abi/erc721"
import erc1155Abi from "@/abi/erc1155"

export function useERC721() {
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const { address } = useAccount()

    const mint = useCallback(async (
        {
            contractAddress,
            receiverAddress,
            royalty
        }:{
            contractAddress: string,
            receiverAddress: string,
            royalty: number
        }
    ) => {

        const writeContractRequest = await publicClient?.simulateContract({
            account: address,
            abi: erc721Abi,
            address: getAddress(contractAddress),
            functionName: "mint",
            args: [getAddress(receiverAddress), BigInt(royalty)]
        })

        const minTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        const txReceipt = await publicClient.waitForTransactionReceipt({hash: minTxHash as any})

        const mintLog = decodeEventLog({
            abi: erc721Abi,
            data: txReceipt.logs[0].data,
            topics: txReceipt.logs[0].topics
        })

        const tokenId = (mintLog.args as any)?.tokenId?.toString()

        return {
            tokenId: Number(tokenId)
        }
    }, [publicClient, walletClient, address])

    const transferFrom = useCallback(async (
        {
            tokenId,
            contractAddress,
            newOwner
        }: {
            tokenId: number,
            contractAddress: string,
            newOwner: string
        }
    ) => {
        const writeContractRequest = await publicClient?.simulateContract({
            account: address,
            abi: erc721Abi,
            address: getAddress(contractAddress),
            functionName: "transferFrom",
            args: [getAddress(address as string), getAddress(newOwner), BigInt(tokenId)]
        })

        const minTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        const txReceipt = await publicClient.waitForTransactionReceipt({hash: minTxHash as any})

        return txReceipt

    }, [publicClient, walletClient, address])

    const ownerOf = useCallback(async ({tokenId, contractAddress}: { tokenId: number, contractAddress: string }) => {
        const owner = await publicClient?.readContract({
            account: address,
            abi: erc721Abi,
            address: getAddress(contractAddress),
            functionName: "ownerOf",
            args: [BigInt(tokenId)]
        })

        return owner
    }, [publicClient, address])

    return {
        mint,
        ownerOf,
        transferFrom
    }
}

export function useERC1155() {
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const { address } = useAccount()

    const create = useCallback(async (
        {
            contractAddress,
            receiverAddress,
            initialSupply,
            royalty
        }:{
            contractAddress: string,
            receiverAddress: string,
            initialSupply: number,
            royalty: number
        }
    ) => {

        const writeContractRequest = await publicClient?.simulateContract({
            account: address,
            abi: erc1155Abi,
            address: getAddress(contractAddress),
            functionName: "create",
            args: [getAddress(receiverAddress), BigInt(initialSupply), BigInt(royalty), "0x"]
        })

        const minTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        const txReceipt = await publicClient.waitForTransactionReceipt({hash: minTxHash as any})

        const mintLog = decodeEventLog({
            abi: erc1155Abi,
            data: txReceipt.logs[0].data,
            topics: txReceipt.logs[0].topics
        })

        const tokenId = (mintLog.args as any)?.id?.toString()

        return {
            tokenId
        }
    }, [publicClient, walletClient, address])

    const safeTransferFrom = useCallback(async (
        {
            contractAddress,
            newOwner,
            tokenId,
            amount
        }: {
            contractAddress: string,
            newOwner: string,
            tokenId: number,
            amount: number
        }
        ) => {
        const writeContractRequest = await publicClient?.simulateContract({
            account: address,
            abi: erc1155Abi,
            address: getAddress(contractAddress),
            functionName: "safeTransferFrom",
            args: [
                getAddress(address as string), 
                getAddress(newOwner),
                BigInt(tokenId), 
                BigInt(amount), 
                "0x"
            ]
        })

        const minTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        const txReceipt = await publicClient.waitForTransactionReceipt({hash: minTxHash as any})
        
        return txReceipt

    }, [publicClient, walletClient, address])

    const balanceOf = useCallback(async (
        {
            tokenId, 
            contractAddress,
            accountAddress = address
        }: { 
            tokenId: number, 
            contractAddress: string,
            accountAddress?: typeof address | string
        }) => {
        const balance = await publicClient?.readContract({
            account: address,
            abi: erc1155Abi,
            address: getAddress(contractAddress),
            functionName: "balanceOf",
            args: [getAddress(accountAddress as string), BigInt(tokenId)]
        })

        return Number(balance)

    }, [publicClient, address])

    const mint = useCallback(async () => {}, [])

    return {
        create,
        mint,
        safeTransferFrom,
        balanceOf
    }
}

export function useNftDeployer({chainId}: {chainId: number}) {
    const { address } = useAuthStatus()
    const { ensureContractChainAsync } = useContractChain({chainId})
    const { data: walletClicent } = useWalletClient()
    const publicClient = usePublicClient()

    const _deployNftContract = useCallback(async ({
        nftBytecode, 
        nftAbi, 
        nftVersion,
        label,
        symbol,
        royalty
    }: {
        nftBytecode: `0x${string}`, 
        nftAbi: Abi, 
        nftVersion: string,
        label: string,
        symbol: string,
        royalty: number
    }) => {
        const deployTxhash = await walletClicent?.deployContract({
            abi: nftAbi,
            account: address,
            bytecode: nftBytecode,
            args: [
                label,
                symbol,
                getNftContractBaseURI(chainId),
                BigInt(royalty)
            ]
        })

        const transactionReceipt = await publicClient.waitForTransactionReceipt({
            hash: deployTxhash as any
        })
        
        return {
            version: nftVersion,
            chainId: chainId,
            owner: transactionReceipt.from.toLowerCase(),
            contractAddress: transactionReceipt.contractAddress as string
        }
    }, [address, chainId, publicClient, walletClicent])

    const deployNftContract = useCallback(async ({
        contractSymbol,
        contractLabel,
        contractRoyalty,
        contractSchema,
        contractVersion
    }: {
        contractSymbol: string,
        contractLabel: string,
        contractRoyalty: number,
        contractSchema: string,
        contractVersion: string
    }) => {
        await ensureContractChainAsync()
        const isErc721 = contractSchema.toLowerCase() === "erc721"

        let result

        if (isErc721) {
            result = await _deployNftContract({ 
                nftAbi: erc721Abi,
                nftBytecode: ERC721_BYTECODE,
                nftVersion: contractVersion,
                label: contractLabel,
                symbol: contractSymbol,
                royalty: contractRoyalty
            })
        } else {
            result = await _deployNftContract({
                nftAbi: erc1155Abi,
                nftBytecode: ERC1155_BYTECODE,
                nftVersion: contractVersion,
                label: contractLabel,
                symbol: contractSymbol,
                royalty: contractRoyalty
            })
        }

        return result
    }, [_deployNftContract, ensureContractChainAsync])

    return {
        deployNftContract
    }
}