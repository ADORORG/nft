import type { TokenCardDropdownOptionProps} from "./types"
import { useRef, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { copyToClipboard, replaceUrlParams } from "@/utils/main"
import { useTokenActiveMarketOrder } from "@/hooks/fetch/market"
import QuickModal from "@/components/QuickModal"
import OwnerSectionAddTokenToMarket from "@/components/MarketOrderPage/OwnerSection"
import PublicSectionBuyOrOffer from "@/components/MarketOrderPage/PublicSection"
import LoadingSpinner from "@/components/LoadingSpinner"
import TransferToken from "@/components/TokenPage/TransferToken"
import appRoutes from "@/config/app.route"
import apiRoutes from "@/config/api.route"

export default function TokenCardDropdownOptionHandlers({token, whichAction, resetAction}: TokenCardDropdownOptionProps) {
    const copyLinkRef = useRef<HTMLSpanElement>(null)
    const useAsProfilePicRef = useRef<HTMLSpanElement>(null)
    const router = useRouter()
    const {activeOrder, isLoading: activeOrderLoading} = useTokenActiveMarketOrder(token._id?.toString())

    useEffect(() => {
        if (whichAction === "copyLink") {
            copyLinkRef.current?.click()
        } else if (whichAction === "useAsProfilePic") {
            useAsProfilePicRef.current?.click()
        }
    }, [whichAction])

    const copyTokenLink = () => {
        const tokenUrl = replaceUrlParams(appRoutes.viewToken, {
            chainId: token.contract.chainId.toString(), 
            contractAddress: token.contract.contractAddress,
            tokenId: token.tokenId.toString()
        })
        copyToClipboard(window.location.origin + tokenUrl, () => toast.success("Token link copied to clipboard"))
        resetAction()
    }

    const setAsProfilePic = async () => {
        const toastId = toast.loading("Updating profile picture...")
        try {
            const res = await fetcher(apiRoutes.setProfilePic, {
                method: "POST",
                body: JSON.stringify({
                    // send the token id. The token media will be used as profile pic
                    tokenDocId: token._id
                })
            })

            if (res.success) {
                toast.dismiss(toastId)
                toast.success("Profile picture updated")
            }
        } catch (error) {
            toast.dismiss(toastId)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            resetAction()
        }
    }

    const AddTokenToMarketComponent = () => {
        if (activeOrderLoading) return <LoadingSpinner className="h-32" />

        return (
            <OwnerSectionAddTokenToMarket 
                token={token}
                activeOrder={activeOrder}
                orders={[]}
            />
        )
    }

    const TokenBuyOrOfferComponent = () => {
        if (activeOrderLoading) return <LoadingSpinner className="h-32" />

        return (
            <PublicSectionBuyOrOffer 
                token={token}
                activeOrder={activeOrder}
                orders={[]}
                bids={[]}
            />
        )
    }

    return (
        <div>
            {/* Copy link holder */}
            <span ref={copyLinkRef} onClick={copyTokenLink}></span>
            {/* Use as profile pic holder */}
            <span ref={useAsProfilePicRef} onClick={setAsProfilePic}></span>
            <QuickModal
                show={ whichAction === "transfer" }
                onHide={resetAction}
                modalTitle={`Transfer Token ${token.name}#${token.tokenId}`}
                modalBody={TransferToken}
                // modalBody props
                token={token}
                done={() => router.refresh()}
            />
            <QuickModal
                show={ whichAction === "sell" }
                onHide={resetAction}
                modalTitle={`Add ${token.name}#${token.tokenId} to market`}
                modalBody={AddTokenToMarketComponent}
            />
            <QuickModal
                show={ whichAction === "makeOffer" }
                onHide={resetAction}
                modalTitle={`Make offer for ${token.name}#${token.tokenId}`}
                modalBody={TokenBuyOrOfferComponent}
            />
        </div>
    )
}