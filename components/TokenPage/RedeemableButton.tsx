import { useState } from "react"
import Button from "@/components/Button"
import QuickModal from "@/components/QuickModal"
import RedeemableModal from "./RedeemableModal"
import type TokenPageProps from "./types"
import type AccountType from "@/lib/types/account"

export default function RedeemableButton(props: TokenPageProps & {session: { user: AccountType } | null}) {
    const [showModal, setShowModal] = useState(false)
    const { redeemable } = props.token
    const isOwnedBySessionAccount = props.session && props.session?.user.address === props.token?.owner?.address

    return (
        <div className="flex flex-col py-4 items-center gap-4">
            <Button 
                disabled={!redeemable || !isOwnedBySessionAccount }
                onClick={() => setShowModal(true)}
                className="w-3/4"
                variant="secondary"
                title={redeemable ? "Has redeemable content by owner" : "No redeemable content"}
                rounded
            >
                {redeemable ? "Redeemable content" : "No Redeemable content"}
            </Button>

            <QuickModal
                onHide={setShowModal}
                show={showModal}
                modalTitle={`Redeem #${props.token.tokenId} content`}
                modalBody={RedeemableModal}
                // RedeemableModal props
                token={props.token}
            />  
        </div>
    )
}