import type { MarketOrderProp } from "./types"
import type { FinaliseMarketOrderType } from "@/lib/types/common"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tag as TagIcon } from "react-bootstrap-icons"
import { toast } from "react-hot-toast"
import { parseUnits, getAddress } from "viem"
import { useNetwork, usePublicClient, useWalletClient } from "wagmi"
import { useAuthStatus } from "@/hooks/account"
import { useContractChain, useERC20Approval } from "@/hooks/contract"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { isAddressZero, replaceUrlParams } from "@/utils/main"
/** Import nft & marketplace ABIs versions */
import { marketplaceAbiVersionMap } from "@/abi/marketplace"
import { getMarketplaceContract } from "@/config/marketplace.contract"
import apiRoutes from "@/config/api.route"
import Button from "@/components/Button"

/**
 * Handle Fixed price order purchase
 * @param props 
 * @returns 
 */
export default function BuyButton(props: MarketOrderProp) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    /** Keep track of actions processesd.
     * This way, if transaction fails or an unexpected error occurred, user could continue from the last point
     * This may not be necessary if we have a backend cron that monitors the changes/events in the contract onchain 
    */
    const [processedOnchain, setProcessedOnchain] = useState(false)
    const [processedOffchain, setProcessedOffchain] = useState(false)
    const [purchaseData, setPurchaseData] = useState<Partial<FinaliseMarketOrderType>>({})
    const { session } = useAuthStatus()
    const { chains } = useNetwork()
    const {data: walletClient} = useWalletClient()
    const publicClient = usePublicClient()
    const contractChain = useContractChain(props.order.token.contract, walletClient)
    const erc20Approval = useERC20Approval(publicClient, walletClient)

    const buyFixedOrder = async () => {
        /** Destruct order data */
        const {
            price,
            token,
            seller,
            version,
            currency,
            permitType,
            orderDeadline,
            orderSignature,
            approvalSignature,
        } = props.order
        
        /** Target chain (network) to execute this purchase transaction.
         * We use the chain where the nft token contract was deployed
        */
        const chain = chains.find(c => c.id === token.contract.chainId)

        /** True if the payment currency is ETH or BNB or Blockchain default Coin. Otherwise it's a token with contract address  */
        const isETHPayment = isAddressZero(currency.address)

        /** The marketplace contract address in which this order was listed */
        const marketplaceContractAddress = getMarketplaceContract(token, version)
        type MarketplaceVersionsKey = keyof typeof marketplaceAbiVersionMap
        /** The marketplace abi for the marketplaceContractAddress */
        const marketplaceAbi = marketplaceAbiVersionMap[version as MarketplaceVersionsKey]

        /** Big order price */
        const bigOrderPrice = parseUnits(price, currency.decimals)
        /** Order data to send onchain */
        const onchainOrderData = {
            side: 0, // 0 for buy, 1 for sell
            seller: getAddress(seller.address),
            buyer: getAddress(session?.user.address as string),
            paymentToken: getAddress(currency.address),
            buyNowPrice: bigOrderPrice,
            startPrice: BigInt(0),
            deadline: BigInt(orderDeadline || 0),
            duration: BigInt(0)
        }

        /** Simulate write contract result */
        let writeContractRequest: any

        if (isETHPayment) {
            if (permitType === "offchain") {
                // order was signed offchain
                writeContractRequest = await publicClient.simulateContract({
                    account: getAddress(session?.user.address as string),
                    chain,
                    address: marketplaceContractAddress,
                    abi: marketplaceAbi,
                    functionName: "atomicBuyETH",
                    value: bigOrderPrice,
                    args: [
                        getAddress(token.contract.contractAddress),
                        BigInt(token.tokenId),
                        onchainOrderData,
                        orderSignature as any,
                        approvalSignature as any
                    ]
                })

                
            } else {
                // order was not signed offchain
                writeContractRequest = await publicClient.simulateContract({
                    account: getAddress(session?.user.address as string),
                    chain,
                    address: marketplaceContractAddress,
                    abi: marketplaceAbi,
                    functionName: "buyWithETH",
                    value: bigOrderPrice,
                    args: [
                        getAddress(token.contract.contractAddress),
                        BigInt(token.tokenId),
                    ]
                })
            }
        } else {
            // Request token approval
            await erc20Approval.requestERC20ApprovalAsync({
                contractAddress: currency.address,
                bigAmount: bigOrderPrice,
                owner: session?.user.address as string,
                spender: marketplaceContractAddress,
                chain
            })

            if (permitType === "offchain") {
                // Execute Atomic buy with ERC20
                writeContractRequest = await publicClient.simulateContract({
                    account: getAddress(session?.user.address as string),
                    chain,
                    address: marketplaceContractAddress,
                    abi: marketplaceAbi,
                    functionName: "atomicBuyERC20",
                    args: [
                        getAddress(token.contract.contractAddress),
                        BigInt(token.tokenId),
                        onchainOrderData,
                        orderSignature as any,
                        approvalSignature as any
                    ]
                })
            } else {
                // order was not signed offchain
                writeContractRequest = await publicClient.simulateContract({
                    account: getAddress(session?.user.address as string),
                    chain,
                    address: marketplaceContractAddress,
                    abi: marketplaceAbi,
                    functionName: "buyWithERC20",
                    args: [
                        getAddress(token.contract.contractAddress),
                        BigInt(token.tokenId),
                    ]
                })
            }

        }

        const saleTxHash = await walletClient?.writeContract(writeContractRequest?.request)
        await publicClient.waitForTransactionReceipt({hash: saleTxHash as any})
        /** We done processing onchain */
        setProcessedOnchain(true)
        return {
            saleTxHash,
            soldPrice: price,
            buyerId: session?.user.address,
        }
    }

    /**
     * Finalise market order
     * @todo - Make it reusable in other similar functions
     * @param purchaseData 
     */
    const finaliseMarketOrder = async (purchaseData: FinaliseMarketOrderType) => {
        // Send the purchase to the backend
        const response = await fetcher(replaceUrlParams(apiRoutes.finaliseMarketOrder, {
            marketOrderDocId: props.order._id?.toString() as string
        }), {
            method: "POST",
            body: JSON.stringify(purchaseData)
        })

        if (response.success) {
            setProcessedOffchain(true)
            toast.success(response.message)
            router.refresh()
        }
    }
    
    const handleFixedPriceOrderPurchase = async () => {
        try {
            setLoading(true)
        
            if (!processedOnchain) {
                // ensure we are connected to right chain that host this token contract
                await contractChain.ensureContractChainAsync()

                const result = await buyFixedOrder()
                setPurchaseData(result)
                // finalise
                await finaliseMarketOrder(result as FinaliseMarketOrderType)
            } else if (!processedOffchain) {
                // if error occurred while processing offchain, we could try again
                await finaliseMarketOrder(purchaseData as FinaliseMarketOrderType)
            } else {
                // Refresh to reflect changes
                router.refresh()
            }

        } catch (error: any) {
            console.log(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-3/4">
            <Button 
                className="flex flex-wrap justify-center items-center gap-2 w-full py-3 text-xl"
                variant="gradient"
                onClick={handleFixedPriceOrderPurchase} 
                loading={loading}
                disabled={loading || !session?.user}
                rounded
            >
                
                <TagIcon
                    className="h-6 w-6"
                />
                <span>
                    Buy now
                </span>
            
            </Button>
        </div>
    )
}