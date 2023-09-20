import type TokenPageProps from "./types"
import { useState } from "react"
import { ChevronDown } from "react-bootstrap-icons"
import Dropdown from "@/components/Dropdown"
import QuickModal from "@/components/QuickModal"
import AddTokenToMarket from "@/components/MarketOrderPage/AddTokenToMarket"
import TransferToken from "@/components/TokenPage/TransferToken"
import ShowOfferForm from "@/components/MarketOrderPage/ShowOfferForm"

export default function TokenDropdownOption(props: TokenPageProps) {
    const { token } = props
    const [showTransferModal, setShowTransferModal] = useState(false)
    const [showSellModal, setShowSellModal] = useState(false)
    const [showOfferModal, setShowOfferModal] = useState(false)

    const sell = () => {
        setShowSellModal(true)
    }

    const transfer = () => {
        setShowTransferModal(true)
    }

    const setAsProfilePic = () => {

    }

    const copyTokenLink = () => {}

    const screens = [
        {
            name: "Transfer",
            onClick: transfer,            
        },
        {
            name: "Sell",
            onClick: sell,            
        },
        {
            name: "Use as Profile Pic",
            onClick: setAsProfilePic,            
        },
        {
            name: "Copy Token Link",
            onClick: copyTokenLink,            
        },
        
    ]

    return (
        <>
            <Dropdown
                dropdownTrigger={<ChevronDown className="h-4 w-4 opacity-60" />}
                dropsClassName="w-44 rounded"
            >
                {
                    screens.map(screen => (
                        <Dropdown.Item key={screen.name}>
                            <span 
                                className="block px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={screen.onClick}    
                            > {screen.name} </span>
                        </Dropdown.Item>
                    ))
                }
            </Dropdown>
            
            <QuickModal
                show={showTransferModal}
                onHide={() => setShowTransferModal(false)}
                modalTitle={`Transfer Token ${token.name}#${token.tokenId}`}
                className=""
                modalBody={TransferToken}
                // modalBodyClassName="lg:w-[410px] w-[310px]"
                // modalBody props
                token={token}
            />
            <QuickModal
                show={showSellModal}
                onHide={() => setShowSellModal(false)}
                modalTitle={`Add ${token.name}#${token.tokenId} to market`}
                className=""
                modalBody={AddTokenToMarket}
                // modalBodyClassName="lg:w-[410px] w-[310px]"
                // modalBody props
                token={token}
            />
        </>
    )

}