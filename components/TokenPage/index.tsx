"use client"
import type TokenPageProps from "./types"
import TokenLink from "./TokenLink"
import RedeemableButton from "./RedeemableButton"
import TokenAttributes from "./TokenAttributes"
import TokenImage from "./TokenImage"
import TokenMediaModal from "./TokenMediaModal"
import TokenTextContent from "./TokenTextContent"
import { useAuthStatus } from "@/hooks/account"

export default function SingleTokenPage(props: TokenPageProps) {
    const { session } = useAuthStatus()
    
    return (
        <div className="w-[320px] md:w-[480px] text-gray-900 dark:text-white">
            <TokenImage token={props.token} />
            <TokenMediaModal token={props.token} />
            <TokenTextContent token={props.token} />
            <TokenLink token={props.token} />
            <TokenAttributes token={props.token} />
            <RedeemableButton token={props.token} session={session} />
        </div>
    )
}