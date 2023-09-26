import type { MarketOrdersProp, MarketOrderProp } from "./types"
import type { FinaliseMarketOrderType } from "@/lib/types/common"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import { AccountAvatar } from "@/components/UserAccountAvatar"
import Button from "@/components/Button"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import { useSignatures, useFixedPriceOrder } from "@/hooks/contract/marketplace"
import { useContractChain } from "@/hooks/contract"
import { getAddress } from "viem"
import { usePublicClient, useWalletClient } from "wagmi"
/** Import nft & marketplace ABIs versions */
import erc721ABI from "@/abi/erc721"
import { getMarketplaceContract } from "@/config/marketplace.contract"
import apiRoutes from "@/config/api.route"

export default function ShowActiveOffers(props: MarketOrdersProp) {
    
    return (
        <div className="my-4 drop-shadow-xl p-4 flex flex-col gap-4">
            <h1 className="text-2xl py-6">
                Active offers ({props.orders.length})
            </h1>
            {
                props.orders.map((order) => (
                    <ShowSingleActiveOffer
                        key={order._id?.toString()}
                        order={order}
                    />
                ))
            }
        </div>
    )
}

function ShowSingleActiveOffer(props: MarketOrderProp) {
    const [cancelling, setCancelling] = useState(false)
    const [accepting, setAccepting] = useState(false)
    const [processedOnchain, setProcessedOnchain] = useState(false)
    const [processedOffchain, setProcessedOffchain] = useState(false)
    const [purchaseData, setPurchaseData] = useState<Partial<FinaliseMarketOrderType>>({})
    const publicClient = usePublicClient()
    const {data: walletClient} = useWalletClient()
    const offerOrder = useFixedPriceOrder(props.order)
    const signatures = useSignatures()
    const contractChain = useContractChain(props.order.token.contract)
    const router = useRouter()

    const cancelOfferOrder = useCallback(async () => {
        try {
            setCancelling(true)

            const confirm = window.confirm("Are you sure you want to cancel this order?")
            
            if (!confirm) {
                throw new Error("Cancellation aborted")
            }

            const response = await fetcher(replaceUrlParams(apiRoutes.cancelMarketOrder, {
                marketOrderDocId: props.order._id?.toString() as string
            }), {
                method: "POST",
            })
    
            if (response.success) {
                toast.success(response.message)
                router.refresh()
            }
        } catch (error) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setCancelling(false)
        }
    }, [props.order._id, router])

   /**
     * Finalise market order
     * @todo - Make it reusable in other similar functions
     * @param purchaseData 
     */
   const finaliseMarketOrder = useCallback(async (purchaseData: FinaliseMarketOrderType) => {
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
    }, [props.order._id, router])
    
    const sellOnchain = useCallback(async () => {
        // ensure we are connected to right chain that host this token contract
        await contractChain.ensureContractChainAsync()

        const {version: marketplaceVersion, orderDeadline} = props.order
        const {
            tokenId,
            contract: {
                contractAddress: tokenContractAddress,
                chainId: tokenContractChainId
            }
        } = props.order.token

        const marketplaceContractAddress = getMarketplaceContract(tokenContractChainId, marketplaceVersion)
        const hasOffchainSupport = await signatures.hasOffchainSigning({contractAddress: tokenContractAddress})
        
        const offerOrderHandler = offerOrder.sellForERC20()
        let saleTxHash

        if (hasOffchainSupport) {
            // request for approval signature
            const [{tokenContractName, tokenContractNonce}] = await Promise.all([
                signatures.getContractStaticParams({contractAddress: tokenContractAddress, tokenId})
            ])
            const approvalSignature = await signatures.approvalSignature({
                tokenContractName,
                tokenContractChainId,
                tokenContractAddress,
                tokenContractNonce,
                tokenId,
                marketplaceContractAddress,
                signatureDeadline: Number(orderDeadline)
            }) as string

            // Approval signature is available (offchain permit)
            saleTxHash = await offerOrderHandler.atomicSell({approvalSignature})
        
        } else {
            // request for onchain approval
            /** Approved address to spend this token */
            const approvedAddress = await publicClient.readContract({
                address: getAddress(tokenContractAddress),
                abi: erc721ABI,
                functionName: "getApproved",
                args: [BigInt(tokenId)]
            })

            if (approvedAddress.toLowerCase() !== marketplaceContractAddress.toLowerCase()) {
                await walletClient?.writeContract({
                    address: getAddress(tokenContractAddress),
                    abi: erc721ABI,
                    functionName: "approve",
                    args: [marketplaceContractAddress, BigInt(tokenId)]
                })
            }

            // Offchain permit is not supported
            saleTxHash = await offerOrderHandler.nonAtomicSell()
        }

        await publicClient.waitForTransactionReceipt({hash: saleTxHash as any})
        /** We done processing onchain */
        setProcessedOnchain(true)
        return {
            saleTxHash: saleTxHash as string,
            soldPrice: props.order.price,
            // Buyer is the one who created the offer
            buyerId: props.order.buyer?.address,
        }

    }, [contractChain, offerOrder, props.order, publicClient, signatures, walletClient])
    
    const handleOfferAcceptance = useCallback(async () => {
        try {
            setAccepting(true)

            if (!processedOnchain) {
                const result = await sellOnchain()
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
            console.error(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setAccepting(false)
        }
    }, [finaliseMarketOrder, processedOffchain, processedOnchain, purchaseData, router, sellOnchain])


    return (
        <div className="flex flex-row justify-between items-center py-1">
            <span>
                <AccountAvatar
                    account={props.order.buyer}
                    height={24}
                    width={24}
                />
            </span>
            <span>
                <CryptoCurrencyDisplay
                    currency={props.order.currency}
                    amount={props.order.price}
                    height={12}
                />
            </span>

            <div className="flex flex-wrap gap-2 justify-center">
                <Button
                    className="text-sm"
                    variant="gradient"
                    disabled={cancelling || accepting}
                    loading={accepting}
                    onClick={handleOfferAcceptance}
                    rounded
                >
                    {processedOnchain ? "Finalize" : "Accept"}
                </Button>
                
                <Button
                    className="text-sm"
                    variant="gradient"
                    loading={cancelling}
                    disabled={cancelling || accepting || processedOnchain}
                    onClick={cancelOfferOrder}
                    inversed
                    rounded
                >
                    Reject</Button>
            </div>
        </div>
    )
}