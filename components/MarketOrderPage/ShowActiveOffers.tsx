import type { MarketOrdersProp, MarketOrderProp } from "./types"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import { AccountAvatar } from "@/components/UserAccountAvatar"
import Button from "@/components/Button"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import apiRoutes from "@/config/api.route"

export default function ShowActiveOffers(props: MarketOrdersProp) {
    
    return (
        <div className="my-4 drop-shadow-xl p-4 flex flex-col gap-4">
            <h5 className="my-3">Offer</h5>
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
    const router = useRouter()

    const cancelFixedPriceOrder = useCallback(async () => {
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

    return (
        <div className="flex flex-row justify-between items-center py-1">
            <span>
                <AccountAvatar
                    account={props.order.buyer}
                    height={24}
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
                    disabled={cancelling}
                    rounded
                >Accept</Button>
                
                <Button
                    className="text-sm"
                    variant="gradient"
                    loading={cancelling}
                    disabled={cancelling}
                    onClick={cancelFixedPriceOrder}
                    inversed
                    rounded
                >
                    Reject</Button>
            </div>
        </div>
    )
}