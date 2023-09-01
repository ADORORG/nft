import type ContractType from "@/lib/types/contract";
import { useCallback } from "react"
import { getAddress } from "viem"
import { usePublicClient, useWalletClient } from "wagmi"
import { promiseDelay } from "@/utils/main"
import { supportedChains } from "@/web3.config"
import erc20Abi from "@/abi/erc20"

export function useContractChain(contract: Pick<ContractType, "chainId">) {
    const {data: walletClient} = useWalletClient()
    return {
        ensureContractChainAsync: useCallback( async () => {
            await walletClient?.switchChain({id: contract.chainId})
            // Delay for one second to allow chain change propagate
            await promiseDelay(1000)
        }, [walletClient, contract]) 
    }
}

export function useERC20Approval() {
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()

    const requestERC20ApprovalAsync = useCallback(async ({
        requireEnoughBalance = true,
        contractAddress,
        bigAmount,
        spender,
        owner,
        chain,
    }: {
        requireEnoughBalance?: boolean,
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
                throw new Error("Not enough token balance")
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

export function useChainById(id: number) {
    return supportedChains.find(chain => chain.id === id)
}