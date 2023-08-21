import type { MarketOrderProp } from "./types"
import type { default as MarketBidType, PopulatedMarketBidType } from "@/lib/types/bid"
import type { FinaliseMarketOrderType } from "@/lib/types/common"
import { useState } from "react"
import { PatchCheck, Tag as TagIcon, Trophy, Cart } from "react-bootstrap-icons"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useTokenMarketOrderBids } from "@/hooks/fetch"
import { useAuthStatus } from "@/hooks/account"
import { useAuctionOrder } from "@/hooks/contract/marketplace"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import { InputField } from "@/components/Form"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"

export default function BidForm(props: MarketOrderProp) {
    const { marketOrderBids } = useTokenMarketOrderBids(props.order._id?.toString())
    const { session } = useAuthStatus()

    const auctionEnded = new Date(props.order.endsAt as Date) < new Date()

    /* Check if current account session has a bid and
     * if it's the highest bid
     */
    let hasBidAndHighestBidder
    let highestBid

    if (session && marketOrderBids && marketOrderBids.length) {
        marketOrderBids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)) // sort by price desc
        highestBid = marketOrderBids[0]
        hasBidAndHighestBidder = highestBid.bidder.address.toLowerCase() === session.user.address.toLowerCase()
    }

    return (
        <>
            {
                auctionEnded ?
                <div className="flex flex-col gap-4">
                    {
                        hasBidAndHighestBidder ?
                        /** Auction ended and highest bidder can claim the token */
                        <ClaimAuctionToken 
                            order={props.order} 
                            highestBid={highestBid}
                        />
                        :
                        /**
                         * Auction ended
                         */
                        <Button 
                            className="flex items-center justify-center text-xl p-4 gap-2"
                            variant="gradient"
                            disabled
                            rounded
                        >
                            <Cart 
                                className="h-6 w-6" 
                            />
                            <span>Auction ended</span>
                        </Button>
                    }
                </div>
                :
                <div className="flex flex-col gap-4">
                    {
                        hasBidAndHighestBidder ?
                        /** Current account is the highest bidder */
                        <Button 
                            className="flex items-center justify-center text-xl p-4 gap-2"
                            variant="gradient" 
                            rounded
                            disabled>
                            <PatchCheck
                                className="h-6 w-6"
                            />
                            <span>Highest bidder (You)</span>
                        </Button>
                        :
                        /**
                         * Place a bid
                         */
                        <ShowBidForm 
                            order={props.order}
                            highestBid={highestBid}
                        />
                    }
                    {
                        /**
                         * If there's a buyNowPrice for this auction
                         * Show the buy now button
                         */
                        parseFloat(props.order.buyNowPrice || "0") > 0 &&
                        <BuyAuctionNow order={props.order} />
                    }
                </div>
            }
        </>
    )

}


function BuyAuctionNow(props: MarketOrderProp) {
    const router = useRouter()
    const { session, isConnected } = useAuthStatus()
    const [loading, setLoading] = useState(false)
    /** Keep track of actions processesd.
     * This way, if transaction fails or an unexpected error occurred, user could continue from the last point
     * This may not be necessary if we have a backend cron that monitors the changes/events in the contract onchain 
    */
    const [processedOnchain, setProcessedOnchain] = useState(false)
    const [processedOffchain, setProcessedOffchain] = useState(false)
    const [purchaseData, setPurchaseData] = useState<Partial<FinaliseMarketOrderType>>({})
    // Handle bidding and instant auction purchase
    const auctionOrder = useAuctionOrder({order: props.order})

    const buyAuctionNow = async () => {
        const result = await auctionOrder.createBid(props.order.buyNowPrice as string)
        /** We done processing onchain */
        setProcessedOnchain(true)
        return result
    }

     /**
     * Finalise auction
     * @todo - Make it reusable in other similar functions
     * @param purchaseData 
     */
     const finaliseAuction = async (purchaseData: FinaliseMarketOrderType) => {
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

    const handleAuctionBuyNow = async () => {
        try {
            setLoading(true)
            if (!processedOnchain) {

                const result = await buyAuctionNow()
                setPurchaseData(result)
                // finalise
                await finaliseAuction(result as FinaliseMarketOrderType)
            } else if (!processedOffchain) {
                // if error occurred while processing offchain, we could try again
                await finaliseAuction(purchaseData as FinaliseMarketOrderType)
            } else {
                // Refresh to reflect changes
                router.refresh()
            }

        } catch (error) {
            console.log(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button 
            className="flex flex-col items-center justify-center gap-2 text-xl"
            variant="gradient"
            disabled={!isConnected || !session?.user || loading}
            loading={loading}
            onClick={handleAuctionBuyNow}
            rounded
        >
            <span>Buy now</span>
            <CryptoCurrencyDisplay 
                currency={props.order.currency}
                amount={props.order.buyNowPrice || "0"}
                width={16}
            />
        </Button>
    )
}


function ShowBidForm(props: MarketOrderProp & {highestBid?: PopulatedMarketBidType}) {
    const router = useRouter()
    const { session, isConnected } = useAuthStatus()
    const [bidData, setBidData] = useState<Partial<MarketBidType>>({})
    const [loading, setLoading] = useState(false)
    const [processedOnchain, setProcessedOnchain] = useState(false)
    const [processedOffchain, setProcessedOffchain] = useState(false)
    // Handle bidding and instant auction purchase
    const auctionOrder = useAuctionOrder({order: props.order})

    const placeBidOnchain = async () => {
        const result = await auctionOrder.createBid(bidData.price as string)
        /** We done processing onchain */
        setProcessedOnchain(true)
        return {
            txHash: result.saleTxHash,
            bidder: result.buyerId,
            price: result.soldPrice
        }
    }

    const createBidOffchain = async (bidData: Partial<MarketBidType>) => {
        // Send the bid to the backend
        const response = await fetcher(replaceUrlParams(apiRoutes.createMarketAuctionBid, {
            marketOrderDocId: props.order._id?.toString() as string
        }), {
            method: "POST",
            body: JSON.stringify(bidData)
        })

        if (response.success) {
            setProcessedOffchain(true)
            toast.success(response.message)
            router.refresh()
        }
    }

    const handleBidding = async () => {
        try {
            setLoading(true)
            const bidPrice = parseFloat(bidData.price as any)

            if (!bidPrice) {
                throw new Error("Invalid bid price")
            } 

            /** The last bid price or the listing price for this auction */
            const lastBidPrice = parseFloat(props?.highestBid?.price || props.order.price)

            if (lastBidPrice && bidPrice <= lastBidPrice) {
                throw new Error("Bid price should be greater than the current price")
            }

            if (!processedOnchain) {
                const result = await placeBidOnchain()
                setBidData(result)
                // finalise
                await createBidOffchain(result)
            } else if (!processedOffchain) {
                // if error occurred while processing offchain, we could try again
                await createBidOffchain(bidData)
            } else {
                // Refresh to reflect changes
                router.refresh()
            }

        } catch (error) {
            console.log(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <InputField
                label="Bid price"
                type="number"
                min={props.highestBid ? props.highestBid.price : props.order.price}
                value={bidData.price || ""}
                onChange={e => setBidData({...bidData, price: e.target.value}) }
                className="my-2 rounded text-lg"
                disabled={processedOnchain || loading}
                step="0.00001"
            />
            {
                isConnected ?
                <Button
                    className="flex items-center justify-center gap-2 text-xl py-3"
                    variant="gradient" 
                    onClick={handleBidding}
                    disabled={!session?.user || loading || processedOffchain}
                    loading={loading}
                    rounded
                >
                    <TagIcon 
                        className="h-6 w-6" 
                    /> 
                    <span>Place a Bid</span>
                </Button>
                :
                <ConnectWalletButton />
            }
            
        </div>
    )
}


function ClaimAuctionToken(props: MarketOrderProp & {highestBid?: PopulatedMarketBidType}) {
    const router = useRouter()
    const { session } = useAuthStatus()
    const [purchaseData, setPurchaseData] = useState<Partial<FinaliseMarketOrderType>>({})
    const [loading, setLoading] = useState(false)
    const [processedOnchain, setProcessedOnchain] = useState(false)
    const [processedOffchain, setProcessedOffchain] = useState(false)
    const auctionOrder = useAuctionOrder({order: props.order})

    const claimOnchain = async () => {
        const result = await auctionOrder.finaliseAuction()
        /** We done processing onchain */
        setProcessedOnchain(true)
        return result
    }

    const claimOffchain = async (purchaseData: Partial<FinaliseMarketOrderType>) => {
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

    const handleClaim = async () => {
        try {
            setLoading(true)
            if (!processedOnchain) {

                const result = await claimOnchain()
                setPurchaseData({...result, soldPrice: props.highestBid?.price})
                // finalise
                await claimOffchain(result)
            } else if (!processedOffchain) {
                // if error occurred while processing offchain, we could try again
                await claimOffchain(purchaseData)
            } else {
                // Refresh to reflect changes
                router.refresh()
            }

        } catch (error) {
            console.log(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button 
            className="flex items-center justify-center text-xl p-4 gap-2"
            variant="gradient"
            onClick={handleClaim}
            loading={loading}
            disabled={!session?.user || loading}
            rounded    
        >
            <Trophy 
                className="h-6 w-6" 
            />
            <span>Claim token</span>
        </Button>
    )
}