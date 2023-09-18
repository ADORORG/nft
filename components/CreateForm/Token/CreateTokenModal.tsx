import type ContractType from "@/lib/types/contract"
import { useState, useEffect } from "react"
import { CodeSlash, CloudCheck, BagCheck } from "react-bootstrap-icons"
import { useAtom } from "jotai"
import { toast } from "react-hot-toast"
import { useAccount } from "wagmi"
import {
    nftTokenMediaStore,
    nftTokenCreatedStore,
    nftTokenUploadedStore,
    nftTokenDataStore,
    nftTokenAttributeStore
} from "@/store/form"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import { readSingleFileAsDataURL } from "@/utils/file"
import { useContractChain } from "@/hooks/contract"
import { useERC721, useERC1155 } from "@/hooks/contract/nft"
import Stepper from "@/components/Stepper"
import Button from "@/components/Button"
import Link from "next/link"
import apiRoutes from "@/config/api.route"
import appRoutes from "@/config/app.route"

interface CreateTokenModalProps {
    contract: ContractType
}

export default function CreateTokenModal({contract}: CreateTokenModalProps) {
    const [nftTokenCreated] = useAtom(nftTokenCreatedStore)
    const [nftTokenUploaded] = useAtom(nftTokenUploadedStore)
    const [nftTokenData] = useAtom(nftTokenDataStore)

    // Which view to display?
    const currentView: "mint" | "upload" | "market" = nftTokenCreated ? nftTokenUploaded ? "market" : "upload" : "mint"

    /** Progress */
    const steps = {
        mint: {
            title: "Mint",
            subtitle: "Create on chain",
            done: nftTokenCreated,
            active: false,
            icon: <CodeSlash className="" />
        },
        upload: {
            title: "Upload item",
            subtitle: "Save token details",
            done: nftTokenCreated && nftTokenUploaded,
            active: false,
            icon: <CloudCheck className="" />
        },
        market: {
            title: "Marketplace",
            subtitle: "Add to market",
            done: false,
            active: false,
            icon: <BagCheck className="" />
        },
    }

    const screenMap = {
        mint: <MintToken contract={contract} />,
        upload: <UploadTokenData  />,
        market: <AddTokenToMarket contract={contract} />
    }

    return (
        <div className="flex flex-row gap-4 justify-between p-3">
            <Stepper
                steps={Object.values(steps)}
            />
            <div className="px-6 text-gray-950 dark:text-gray-100">
                <ul className="mb-4">
                    <li className="py-1">Name: {nftTokenData?.name}</li>
                    <li className="py-1">Contract: {contract.label}</li>
                    <li className="py-1">Schema: {contract.nftSchema}</li>
                    <li className="py-1">
                        Supply: {
                            contract.nftSchema.toLowerCase() === "erc721" 
                            ? 
                            1 
                            : 
                            nftTokenData?.supply || 1
                        }
                    </li>
                </ul>

                {screenMap[currentView]}

            </div>
        </div>
    )
}


function MintToken({contract}: CreateTokenModalProps) {
    const nftSchema = contract.nftSchema.toLowerCase()
    const [minting, setMinting] = useState(false)
    const [nftTokenCreated, setNftTokenCreated] = useAtom(nftTokenCreatedStore)
    const [nftTokenData, setNftTokenData] = useAtom(nftTokenDataStore)
    const { address } = useAccount()
    const erc721Method = useERC721() 
    const erc1155Method = useERC1155()
    const contractChain = useContractChain(contract)
    
    useEffect(() => {
        contractChain.ensureContractChainAsync()
    }, [contractChain])

    const handleMinting = async () => {
        try {
            setMinting(true)
            /** Send the transaction */
            let writeResult

            if (nftSchema === "erc721") {
                writeResult = await erc721Method.mint({
                    contractAddress: contract.contractAddress,
                    royalty: nftTokenData?.royalty || contract.royalty,
                    receiverAddress: address as string
                })
            } else {
                writeResult = await erc1155Method.create({
                    contractAddress: contract.contractAddress,
                    initialSupply: nftTokenData?.supply || 1,
                    royalty: nftTokenData?.royalty || contract.royalty,
                    receiverAddress: address as string
                })
            }

            setNftTokenData({...nftTokenData, tokenId: writeResult?.tokenId})
            // console.log("tokenId", tokenId)
            setNftTokenCreated(true)
        
        } catch (error: any) {
            console.error(error)
            toast.error(getFetcherErrorMessage(error))

        } finally {
            setMinting(false)
        }
    }
    
    return (
        <div className="my-4 flex flex-col">
            <Button 
                variant="secondary"
                disabled={nftTokenCreated || minting}
                loading={minting}
                onClick={handleMinting}
                rounded
            >
                {minting ? "Minting..." : nftTokenCreated ? "Token Minted" : "Mint on-chain"}
            </Button>
        </div>
    )
}


function UploadTokenData() {
    const [uploading, setUploading] = useState(false)
    const [nftTokenUploaded, setNftTokenUploaded] = useAtom(nftTokenUploadedStore)
    const [nftTokenMedia] = useAtom(nftTokenMediaStore)
    const [nftTokenData] = useAtom(nftTokenDataStore)
    const [nftTokenAttribute] = useAtom(nftTokenAttributeStore)

    const tokenDataToFormData = async () => {
        /** Stack of form fields */
        const requiredFormFields = ["name", "description", "xcollection", "contract", "tokenId"] as const
        const otherFormFields = ["supply", "royalty", "tags","backgroundColor", "redeemable", "redeemableContent", "externalUrl", "mediaType"] as const

        const formData = new FormData()
        
        // append requried fields
        for (const field of requiredFormFields) {
            if (nftTokenData && field in nftTokenData && nftTokenData[field]) {
                formData.append(field, nftTokenData[field] as string)
            }
        }

        // append other form fields
        for (const field of otherFormFields) {
            if (nftTokenData && field in nftTokenData && nftTokenData[field]) {
                formData.append(field, nftTokenData[field] || "" as any)
            }
        }

        // append attributes
        if (nftTokenAttribute.length) {
            formData.append("attributes", JSON.stringify(nftTokenAttribute))
        }

        const mediaDataURL = await new Promise<string>(resolve => readSingleFileAsDataURL(nftTokenMedia as Blob, resolve as any))

        // append media
        formData.append("media", mediaDataURL)

        return formData
    }

    const uploadToken = async () => {
        try {
            setUploading(true)
            // upload
            const formData = await tokenDataToFormData()
            await fetcher(apiRoutes.createToken, {
                method: "POST",
                body: formData
            })
2
            toast.success("Token created")
            setNftTokenUploaded(true)
        } catch(error: any) {
            toast.error(getFetcherErrorMessage(error))

        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="my-4 flex flex-col gap-4">
            <Button 
                variant="gradient"
                disabled={nftTokenUploaded || uploading} 
                loading={uploading}
                onClick={uploadToken}
                rounded
            >
                {	
                    uploading ?
                    "Uploading token data..."
                    :
                    nftTokenUploaded ?
                    "Token data saved"
                    :
                    "Upload token data"
                }
            </Button>

        </div>
    )
}

function AddTokenToMarket({contract}: CreateTokenModalProps) {
    const [nftTokenData] = useAtom(nftTokenDataStore)

    return (
        <div>
            <Button 
                variant="secondary"
                rounded
            >
               <Link 
                    href={
                        replaceUrlParams(appRoutes.viewToken, {
                            chainId: contract.chainId.toString(),
                            contractAddress: contract.contractAddress,
                            tokenId: nftTokenData?.tokenId?.toString() || ""
                        })
                    }
                >
                    Marketplace
                </Link> 
            </Button>
        </div>
    )
}