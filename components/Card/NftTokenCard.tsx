"use client"
import { useState } from "react"
import type { PopulatedNftTokenType} from "@/lib/types/token"
import { IPFS_GATEWAY } from "@/lib/app.config"
import Link from "next/link"
import { ChevronDown } from "react-bootstrap-icons"
import MediaPreview from "@/components/MediaPreview"
import UserAccountAvatar from "@/components/UserAccountAvatar"
import CollectionAvatar from "@/components/CollectionAvatar"
import Button from "@/components/Button"
import TokenDropdownOption from "@/components/TokenPage/TokenDropdown"

import QuickModal from "@/components/QuickModal"
import AddTokenToMarket from "@/components/MarketOrderPage/AddTokenToMarket"
import TransferToken from "@/components/TokenPage/TransferToken"
import ShowOfferForm from "@/components/MarketOrderPage/ShowOfferForm"

import Dropdown from "@/components/Dropdown"
import { getChainIcon } from "@/components/ConnectWallet/ChainIcons"
import { MediaSkeleton } from "@/components/Skeleton"
import { useAuthStatus } from "@/hooks/account"
import appRoutes from "@/config/app.route"
import { replaceUrlParams, cutString } from "@/utils/main"

type NftTokenProps = {
    token: PopulatedNftTokenType, 
}

export default function NftTokenCard(props: NftTokenProps) {
    const { session } = useAuthStatus()
    const accountIsTokenOwner = session?.user.address === props.token.owner.address
    const { tokenId, name, image = "", media, mediaType, owner, contract, xcollection } = props.token
    const ChainIcon = getChainIcon(contract.chainId)

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

    const makeOffer = () => {
        setShowOfferModal(true)
    }

    const screens = [
        {
            name: "Transfer",
            onClick: transfer,
            enabled: accountIsTokenOwner,        
        },
        {
            name: "Sell",
            onClick: sell,
            enabled: accountIsTokenOwner,          
        },
        {
            name: "Make offer",
            onClick: makeOffer,
            enabled: !accountIsTokenOwner,          
        },
        {
            name: "Use as Profile Pic",
            onClick: setAsProfilePic,
            enabled: accountIsTokenOwner,        
        },
        {
            name: "Copy Token Link",
            onClick: copyTokenLink,  
            enabled: true,          
        },
        
    ]
    /**
     * @todo Fix card sizes base on size (lg | md) passed as prop
     */
    return (
        <div>
            <div className={`w-56 h-80 rounded p-4 bg-gray-100 dark:bg-gray-900 hover:bg-opacity-60 transition drop-shadow-xl`}>
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
                
                <div className="flex flex-col justify-between gap-2 h-72">
                    <div className={`bg-transparent flex justify-center items-center h-2/3`}>
                        {/* Check if there's a media, show the media, otherwise display the image */}
                        <MediaPreview
                            src={`${IPFS_GATEWAY}${media || image}`}
                            type={mediaType || "image/*"}
                            loadingComponent={<MediaSkeleton className="w-full h-full" />}
                            previewClassName="flex justify-center items-center w-full h-full"
                            className="max-w-56 max-h-52"
                        />
                    {/*  {
                            media && mediaType ? 
                            <MediaPreview
                                src={`${IPFS_GATEWAY}${media}`}
                                type={mediaType}
                                loadingComponent={<MediaSkeleton className="w-full h-full" />}
                                previewClassName="flex justify-center items-center w-full h-full"
                                className="max-w-[260px] max-h-[270px]"
                            />
                            :
                            <Image 
                                className={`h-full w-auto`} 
                                src={image}
                                alt=""
                                data={`${contract.contractAddress}${tokenId}`}
                                width={400}
                                // height={`${sizes[size].imageHeight}`}
                            />
                        }
                        */}
                    </div>

                    <div className="w-full flex flex-col py-2 lg:py-4 justify-end">
                        <h4 className={`text-xl text-gray-950 dark:text-white tracking-wide subpixel-antialiased`}>
                            {cutString(name, 10)} #{tokenId}
                        </h4>
                        
                        <div className="flex flex-row items-center justify-between pt-2">
                            <div className="flex flex-row items-center gap-3">
                                <UserAccountAvatar 
                                    account={owner}
                                    width={24}
                                    height={24}
                                    title={`Owner: ${owner.address}`}
                                />
                                <CollectionAvatar
                                    xcollection={xcollection}
                                    width={28}
                                    height={28}
                                    title={`Collection: ${xcollection.name}`}
                                />
                            </div>
                            <div className="flex justify-end">
                                <Link
                                    href={
                                        replaceUrlParams(appRoutes.viewToken, {
                                            tokenId: tokenId.toString(),
                                            contractAddress: contract.contractAddress,
                                            chainId: contract.chainId.toString()
                                        })
                                    }
                                >
                                    <Button
                                        className="text-sm px-2 py-1"
                                        variant="gradient"
                                        rounded
                                        inversed
                                    >
                                        View
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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

            <QuickModal
                show={showOfferModal}
                onHide={() => setShowOfferModal(false)}
                modalTitle={`Make offer for ${token.name}#${token.tokenId}`}
                className=""
                modalBody={ShowOfferForm}
                // modalBodyClassName="lg:w-[410px] w-[310px]"
                // modalBody props
                token={token}
                orders={[]}
            />
        </div>
    )
}