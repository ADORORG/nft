import type { MarketOrderProp } from "./types"
import type { FinaliseMarketOrderType } from "@/lib/types/common"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Tag as TagIcon } from "react-bootstrap-icons"
import { toast } from "react-hot-toast"
import { usePublicClient } from "wagmi"
import { useAuthStatus } from "@/hooks/account"
import { useContractChain } from "@/hooks/contract"
import { useFixedPriceOrder } from "@/hooks/contract/marketplace"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { isAddressZero, replaceUrlParams } from "@/utils/main"
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
    const publicClient = usePublicClient()
    const contractChain = useContractChain(props.order.token.contract)
    const fixedPriceOrder = useFixedPriceOrder(props.order)

    const buyFixedOrder = useCallback(async () => {
        // ensure we are connected to right chain that host this token contract
        await contractChain.ensureContractChainAsync()
        /** True if the payment currency is ETH or BNB or Blockchain default Coin. Otherwise it's a token with contract address  */
        const isETHPayment = isAddressZero(props.order.currency.address)

        let saleTxHash;

        if (isETHPayment) {
            if (props.order.permitType === "offchain") {
                // order was signed offchain
                saleTxHash = await fixedPriceOrder.atomicBuy().buyWithETH()
            } else {
                // order was not signed offchain
                saleTxHash = await fixedPriceOrder.nonAtomicBuy().buyWithETH()
            }
        } else {

            if (props.order.permitType === "offchain") {
                // Execute Atomic buy with ERC20
                saleTxHash = await fixedPriceOrder.atomicBuy().buyWithERC20Token()
            } else {
                // order was not signed offchain
                saleTxHash = await fixedPriceOrder.nonAtomicBuy().buyWithERC20Token()
            }

        }

        await publicClient.waitForTransactionReceipt({hash: saleTxHash as any})
        /** We done processing onchain */
        setProcessedOnchain(true)
        return {
            saleTxHash: saleTxHash as string,
            soldPrice: props.order.price,
            buyerId: session?.user.address,
        }
    }, [props.order, publicClient, fixedPriceOrder, session?.user, contractChain])

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