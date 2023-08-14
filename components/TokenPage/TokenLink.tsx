import type TokenPageProps from "./types"
import { CollectionAvatarWithLInk } from "@/components/CollectionAvatar"
import ContractAvatar from "@/components/ContractAvatar"
import { UserAccountAvatarWithLink } from "@/components/UserAccountAvatar"
import { BoxArrowUpRight } from "react-bootstrap-icons"

export default function TokenLink(props: TokenPageProps) {

    return (
        <div className="flex flex-col gap-4 py-4">
            {/* Token contract info */}
            <div className="py-1 flex gap-1 items-center">
                <span>Contract:&nbsp;</span>
                <ContractAvatar 
                    contract={props.token.contract} 
                    width={24}
                    height={24}
                />
                
            </div>
            {/* Token Collection info */}
            <div className="py-1 flex gap-1 items-center">
                <span>Collection:&nbsp;</span>
                <CollectionAvatarWithLInk 
                    xcollection={props.token.xcollection}
                    width={24}
                    height={24}
                />
            </div>

            {/* Token Owner */}
            <div className="py-1 flex gap-1 items-center">
                <span>Owner:&nbsp;</span>
                <UserAccountAvatarWithLink
                    account={props.token.owner}
                />
            </div>
            {/* Token External link */}
            {
                props.token.externalUrl ?
                <div className="py-1 flex gap-1 items-center">
                    <span>External link:&nbsp;</span>
                    <span>
                        <a href={props.token.externalUrl} target="_blank" referrerPolicy="no-referrer">
                            <BoxArrowUpRight />
                        </a>
                    </span>
                </div>
                :
                null
            }
        </div>
    )
}