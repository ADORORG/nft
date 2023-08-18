import type { MarketOrderProp } from "./types"
import { useState } from "react"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { toast } from "react-hot-toast"
import Button from "@/components/Button"

export default function CancelListingButton(props: MarketOrderProp) {
    const [cancelling, setCancelling] = useState(false)
    
    const cancelFixedPriceOrder = () => {
        try {
            setCancelling(true)
            throw new Error("Not implemented!")
        } catch (error) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setCancelling(false)
        }
    }

    return (
        // we cannot cancel auction listing
        <div className="flex flex-col items-center justify-center py-4">
            {
                props.order.saleType === "fixed" ?
                <Button
                    onClick={cancelFixedPriceOrder}
                    className="w-full md:w-3/4"
                    variant="secondary"
                    loading={cancelling}
                    disabled={cancelling}
                    rounded
                >
                    Cancel Order
                </Button>
                :
                <Button
                    className="w-full wd:w-4/5"
                    variant="secondary"
                    disabled
                    rounded
                >
                    Auction is active
                </Button>
            }
            
        </div>
    )
}