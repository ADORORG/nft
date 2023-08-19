import type { MarketOrderProp } from "./types"
import { useState } from "react"
import { PatchCheck, Tag as TagIcon, Trophy, Cart } from "react-bootstrap-icons"
import { useTokenMarketOrderBids } from "@/hooks/fetch"
import { useAuthStatus } from "@/hooks/account"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import { InputField } from "@/components/Form"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import Button from "@/components/Button"

export default function BidForm(props: MarketOrderProp) {
    const [newBidPrice, setNewBidPrice] = useState(props.order.price)
    const { marketOrderBids } = useTokenMarketOrderBids(props.order._id?.toString())
    const { session, isConnected } = useAuthStatus()

    const isAuctionEnded = new Date(props.order.endsAt as Date) < new Date()

    /** Check if current account session has a bid and
     * if it's the highest bid
     */
    let hasBidAndHighestBidder
    let highestBid

    if (session && marketOrderBids && marketOrderBids.length) {
        marketOrderBids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)) // sort by price desc
        highestBid = marketOrderBids[0]
        hasBidAndHighestBidder = highestBid.bidder.address.toLowerCase() === session.user.address.toLowerCase()
    }

    const ClaimAuctionToken = () => {

    }

    const placeBid = () => {

    }

    const buyAuctionNow = () => {

    }

    return (
        <>
            {
                isAuctionEnded ?
                <div className="flex flex-col gap-4">
                    {
                        hasBidAndHighestBidder ?
                        /** Auction ended and highest bidder can claim the token */
                        <Button 
                            className="flex items-center justify-center text-xl p-4 gap-2"
                            variant="gradient"
                            onClick={ClaimAuctionToken} 
                            rounded    
                        >
                            <Trophy 
                                className="h-6 w-6" 
                            />
                            <span>Claim token</span>
                        </Button>
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
                        <div className="flex flex-col gap-4">
                            <InputField
                                label="Bid price"
                                type="number"
                                min={highestBid ? highestBid.price : props.order.price}
                                value={newBidPrice}
                                onChange={e => setNewBidPrice(e.target.value) }
                                className="my-2 rounded text-lg"
                                step="0.00001"
                            />
                            {
                                isConnected ?
                                <Button
                                    className="flex items-center justify-center gap-2 text-xl py-3"
                                    variant="gradient" 
                                    onClick={placeBid}
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
                       
                    }
                    {
                        /**
                         * If there's a buyNowPrice for this auction
                         * Show the buy now button
                         */
                        parseFloat(props.order.buyNowPrice || "0") > 0 &&
                        <Button 
                            className="flex flex-col items-center justify-center gap-2 text-xl"
                            variant="gradient"
                            disabled={!isConnected}
                            onClick={buyAuctionNow}
                            rounded
                        >
                            <span>Buy now</span>
                            <CryptoCurrencyDisplay 
                                currency={props.order.currency}
                                amount={props.order.buyNowPrice || "0"}
                                width={16}
                            />
                        </Button>
                    }
                </div>
            }
        </>
    )

}