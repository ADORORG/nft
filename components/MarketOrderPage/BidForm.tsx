import type { MarketOrderProp } from "./types"
import { useState } from "react"
import { PatchCheck, Tag as TagIcon, Trophy, Cart } from "react-bootstrap-icons"
import { useTokenMarketOrderBids } from "@/hooks/fetch"
import { useAuthStatus } from "@/hooks/account"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import { InputField } from "@/components/Form"
import Button from "@/components/Button"

export default function BidForm(props: MarketOrderProp) {
    const [newBidPrice, setNewBidPrice] = useState("0")
    const { marketOrderBids } = useTokenMarketOrderBids(props.order._id?.toString())
    const { session } = useAuthStatus()

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
                <>
                    {
                        hasBidAndHighestBidder ?
                        /** Auction ended and highest bidder can claim the token */
                        <Button 
                            className=""
                            variant="secondary"
                            onClick={ClaimAuctionToken} 
                            rounded    
                        >
                            <Trophy 
                                className="h-5 w-5" 
                            />&nbsp; 
                            Claim token
                        </Button>
                        :
                        /**
                         * Auction ended
                         */
                        <Button 
                            className=""
                            variant="secondary"
                            disabled
                            rounded
                        >
                            <Cart 
                                className="h-5 w-5" 
                            />&nbsp; 
                            Auction ended!
                        </Button>
                    }
                </>
                :
                <>
                    {
                        hasBidAndHighestBidder ?
                        /** Current account is the highest bidder */
                        <Button 
                            className=""
                            variant="secondary" 
                            rounded
                            disabled>
                            <PatchCheck
                                className="h-5 w-5"
                            />&nbsp; 
                            Highest bidder (You)
                        </Button>
                        :
                        /**
                         * Place a bid
                         */
                        <div className="flex flex-row gap-4">
                            <InputField
                                label="Bid price"
                                type="number"
                                min={highestBid ? highestBid.price : props.order.price}
                                value={newBidPrice}
                                onChange={e => setNewBidPrice(e.target.value) }
                                labelClassName="my-2"
                            />
                            <Button
                                className=""
                                variant="secondary" 
                                onClick={placeBid}
                                rounded
                            >
                                <TagIcon 
                                    className="h-5 w-5" 
                                />&nbsp; 
                                Place a Bid
                            </Button>
                        </div>
                       
                    }
                    {
                        /**
                         * If there's a buyNowPrice for this auction
                         * Show the buy now button
                         */
                        parseFloat(props.order.buyNowPrice || "0") > 0 &&
                        <Button 
                            className="flex flex-wrap items-center"
                            variant="secondary" 
                            onClick={buyAuctionNow}
                            rounded
                        >
                            Buy now&nbsp; 
                            <CryptoCurrencyDisplay 
                                currency={props.order.currency}
                                amount={props.order.buyNowPrice || "0"}
                            />
                        </Button>
                    }
                </>
            }
        </>
    )

}