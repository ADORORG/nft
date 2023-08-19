import type ContractType from "@/lib/types/contract";
import { /* WalletClient, */ type PublicClient, getAddress } from "viem"
import erc20Abi from "@/abi/erc20"
import { useCallback } from "react"

export function useContractChain(contract: ContractType, walletClient: any /* WalletClient */) {
    return {
        ensureContractChainAsync: useCallback(() => walletClient?.switchChain({id: contract.chainId}), [walletClient, contract]) 
    }
}

export function useERC20Approval(publicClient: PublicClient, walletClient: any) {

    const requestERC20ApprovalAsync = useCallback(async ({
        contractAddress,
        bigAmount,
        spender,
        owner,
        chain,
    }: {
        contractAddress: string,
        bigAmount: bigint,
        spender: string,
        owner: string,
        chain?: any,
    }) => {

        const allowance = await publicClient.readContract({
            address: getAddress(contractAddress),
            abi: erc20Abi,
            functionName: "allowance",
            args: [owner, spender]
        }) as bigint

        if (allowance < bigAmount) {
            const txhash = await walletClient?.writeContract({
                chain,
                address: getAddress(contractAddress),
                abi: erc20Abi,
                functionName: "approve",
                args: [spender, bigAmount]
            })

            await publicClient.waitForTransactionReceipt({hash: txhash as any})
        }
    }, [walletClient, publicClient])

    return {
        requestERC20ApprovalAsync
    }
}