import type { PopulatedMarketOrderType } from "@/lib/types/market"
import { useCallback } from "react"
import { usePublicClient, useWalletClient } from "wagmi"
import { parseUnits, getAddress } from "viem"
import { useContractChain, useERC20Approval } from "@/hooks/contract"
import { useAuthStatus } from "@/hooks/account"
import { isAddressZero } from "@/utils/main"
// ABI
import { marketplaceAbiVersionMap } from "@/abi/marketplace"
import { getMarketplaceContract } from "@/config/marketplace.contract"

/**
 * 
 * @param param0 
 * @returns 
 */
export function useAuctionOrder({order}: {order: PopulatedMarketOrderType}) {
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const erc20Approval = useERC20Approval(publicClient, walletClient)
    const contractChain = useContractChain(order.token.contract, walletClient)
    const { session } = useAuthStatus()

    /**
     * Create a bid onchain
     * @param price - A price string. Highest bid price or buyNowPrice for auction
     */
    const createBid = useCallback(async (price: string) => {
        // ensure we are connected to right chain that host this token contract
        await contractChain.ensureContractChainAsync()

        /** Destruct order data */
        const {
            token,
            version,
            currency,
        } = order

        /** True if the payment currency is ETH or BNB or Blockchain default Coin. Otherwise it's a token with contract address  */
        const isETHPayment = isAddressZero(currency.address)
        /** The marketplace contract address in which this order was listed */
        const marketplaceContractAddress = getMarketplaceContract(token, version)
        type MarketplaceVersionsKey = keyof typeof marketplaceAbiVersionMap
        /** The marketplace abi for the marketplaceContractAddress */
        const marketplaceAbi = marketplaceAbiVersionMap[version as MarketplaceVersionsKey]
        /** Big number buy now price */
        const bigOrderPrice = parseUnits(price as string, currency.decimals)
        /** Simulate write contract result */
        let writeContractRequest: any

        if (isETHPayment) {
            writeContractRequest = await publicClient.simulateContract({
                account: getAddress(session?.user.address as string),
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "createBidETH",
                value: bigOrderPrice,
                args: [
                    getAddress(token.contract.contractAddress),
                    BigInt(token.tokenId),
                ]
            })
        } else {
            // Request token approval
            await erc20Approval.requestERC20ApprovalAsync({
                contractAddress: currency.address,
                bigAmount: bigOrderPrice,
                owner: session?.user.address as string,
                spender: marketplaceContractAddress,
            })

            writeContractRequest = await publicClient.simulateContract({
                account: getAddress(session?.user.address as string),
                address: marketplaceContractAddress,
                abi: marketplaceAbi,
                functionName: "createBidERC20",
                args: [
                    getAddress(token.contract.contractAddress),
                    BigInt(token.tokenId),
                    bigOrderPrice
                ]
            })
        }

        const saleTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        await publicClient.waitForTransactionReceipt({hash: saleTxHash as any})
        return {
            saleTxHash,
            soldPrice: price,
            buyerId: session?.user.address,
        }

    }, [order, publicClient, session, walletClient, erc20Approval, contractChain])

    /**
     * Claim auction when it ended
     */
    const finaliseAuction = useCallback(async () => {
        // ensure we are connected to right chain that host this token contract
        await contractChain.ensureContractChainAsync()

        /** Destruct order data */
        const {
            token,
            version
        } = order

        const marketplaceContractAddress = getMarketplaceContract(token, version)
        type MarketplaceVersionsKey = keyof typeof marketplaceAbiVersionMap
        /** The marketplace abi for the marketplaceContractAddress */
        const marketplaceAbi = marketplaceAbiVersionMap[version as MarketplaceVersionsKey]

        const writeContractRequest = await publicClient.simulateContract({
            account: getAddress(session?.user.address as string),
            address: marketplaceContractAddress,
            abi: marketplaceAbi,
            functionName: "finaliseAuction",
            args: [
                getAddress(token.contract.contractAddress),
                BigInt(token.tokenId),
            ]
        })

        const saleTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        await publicClient.waitForTransactionReceipt({hash: saleTxHash as any})
        return {
            saleTxHash,
            buyerId: session?.user.address,
        }

    }, [order, publicClient, session, walletClient, contractChain])

    return {
        createBid,
        finaliseAuction
    }
}