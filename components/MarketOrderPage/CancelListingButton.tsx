import type { MarketOrderProp } from "./types"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import { toast } from "react-hot-toast"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"

export default function CancelListingButton(props: MarketOrderProp) {
    const [cancelling, setCancelling] = useState(false)
    const router = useRouter()

    const cancelFixedPriceOrder = async () => {
        try {
            setCancelling(true)
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
    }

    return (
        // we cannot cancel auction listing
        <div className="flex flex-col items-center justify-center py-4">
            {
                props.order.saleType === "fixed" ?
                <Button
                    onClick={cancelFixedPriceOrder}
                    className="w-full md:w-3/4 py-3"
                    variant="gradient"
                    loading={cancelling}
                    disabled={cancelling}
                    rounded
                >
                    Cancel Order
                </Button>
                :
                <Button
                    className="w-full wd:w-4/5 py-3"
                    variant="gradient"
                    disabled
                    rounded
                >
                    Your auction is active
                </Button>
            }
            
        </div>
    )
}