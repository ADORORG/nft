"use client"
import type TokenPageProps from "./types"
import type { DropdownOptions } from "@/components/Card/types"
import { useState } from "react"
import { ChevronDown } from "react-bootstrap-icons"
import { useAuthStatus } from "@/hooks/account"
import TokenLink from "./TokenLink"
import RedeemableButton from "./RedeemableButton"
import TokenAttributes from "./TokenAttributes"
import TokenImage from "./TokenImage"
// import TokenMediaModal from "./TokenMediaModal"
import TokenTextContent from "./TokenTextContent"
import TokenCardDropdownOptionHandlers from "@/components/Card/CardDropdownOptions"
import Dropdown from "@/components/Dropdown"
import { getChainIcon } from "@/components/ConnectWallet/ChainIcons"



export default function SingleTokenPage(props: TokenPageProps) {
    const [selectedDropdownOption, setSelectedDropdownOption] = useState<DropdownOptions>("")
    const { session } = useAuthStatus()
    const accountIsTokenOwner = session?.user.address === props.token.owner.address
    const tokenIsTransferable = props.token.transferrable === undefined || props.token.transferrable === true
    const ChainIcon = getChainIcon(props.token.contract.chainId)


    const screens = [
        {
            name: "Transfer",
            onClick: () => setSelectedDropdownOption("transfer"),
            enabled: accountIsTokenOwner && tokenIsTransferable,        
        },
        {
            name: "Use as Profile Pic",
            onClick: () => setSelectedDropdownOption("useAsProfilePic"),
            enabled: accountIsTokenOwner,        
        },
        {
            name: "Copy Token Link",
            onClick: () => setSelectedDropdownOption("copyLink"),  
            enabled: true,          
        }
    ]

    return (
        <div>
            <TokenCardDropdownOptionHandlers 
                token={props.token} 
                whichAction={selectedDropdownOption}
                resetAction={() => setSelectedDropdownOption("")}
            />
            <div className="relative w-[320px] md:w-[480px] text-gray-900 dark:text-white">
                {/* Chain Icon, top left */}
                <div className="absolute z-10 top-1 left-1 bg-gray-300 dark:bg-gray-600 p-1 rounded">
                    <ChainIcon className="h-5 w-5" />
                </div>
                {/* Dropdown Icon, top right. Token options */}
                <div className="absolute z-10 top-1 right-1 bg-gray-300 dark:bg-gray-600 p-1 rounded">
                    <Dropdown
                        dropdownTrigger={<ChevronDown className="h-4 w-4 opacity-60" />}
                        dropsClassName="w-44 rounded"
                    >
                        {
                            screens.map(screen => (
                                screen.enabled ?
                                <Dropdown.Item key={screen.name}>
                                    <span 
                                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        onClick={screen.onClick}    
                                    > {screen.name} </span>
                                </Dropdown.Item>
                                :
                                null
                            ))
                        }
                    </Dropdown>
                </div>
                
                <div className="px-4">
                    <TokenImage token={props.token} />
                    {/* <TokenMediaModal token={props.token} /> */}
                    <TokenTextContent token={props.token} />
                    <TokenLink token={props.token} />
                    <TokenAttributes token={props.token} />
                    <RedeemableButton token={props.token} session={session} />
                </div>
            </div>
        </div>
    )
}