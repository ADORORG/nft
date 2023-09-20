import { useState } from "react"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import { toast } from "react-hot-toast"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"
import type TokenPageProps from "./types"

export default function RedeemableModal(props: TokenPageProps) {
    const [redeemableContent, setRedeemableContent] = useState("")
    const [isFetching, setIsFetching] = useState(false)

    const fetchRedeemableContent = async () => {
        try {
            setIsFetching(true)

            const response = await fetcher(
                replaceUrlParams(apiRoutes.getRedeemableContent, {tokenDocId: props.token._id?.toString() as string})
            )
            
            if (response.data) {
                setRedeemableContent((response.data as any)?.redeemableContent)
            }

        } catch(error) {
            console.log(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setIsFetching(false)
        }
    }

    return (
        <div className="w-[320px] md:[480px] flex flex-col items-center justify-center gap-4">
            <div className="min-h-48 py-4 px-2">
                {redeemableContent}
            </div>

            <Button
                onClick={!redeemableContent ? fetchRedeemableContent : undefined}
                loading={isFetching}
                variant="secondary"
                className="w-3/4"
                rounded
            >
                Redeem content
            </Button>
        </div>
    )
}