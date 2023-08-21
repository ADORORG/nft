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
        requireEnoughBalance,
        contractAddress,
        bigAmount,
        spender,
        owner,
        chain,
    }: {
        requireEnoughBalance: boolean,
        contractAddress: string,
        bigAmount: bigint,
        spender: string,
        owner: string,
        chain?: any,
    }) => {

        const [allowance, balance] = await Promise.all([
            publicClient.readContract({
                address: getAddress(contractAddress),
                abi: erc20Abi,
                functionName: "allowance",
                args: [owner, spender]
            }),
            publicClient.readContract({
                address: getAddress(contractAddress),
                abi: erc20Abi,
                functionName: "balanceOf",
                args: [owner]
            })
        ]) as bigint[]


        if (requireEnoughBalance) {
            if (balance < bigAmount) {
                throw new Error("Not token enough balance")
            }
        }

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