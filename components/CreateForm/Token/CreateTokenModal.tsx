import type ContractType from "@/lib/types/contract"
import { useState } from "react"
import { CodeSlash, CloudCheck, BagCheck } from "react-bootstrap-icons"
import { useAtom } from "jotai"
import { toast } from "react-hot-toast"
import { decodeEventLog } from "viem"
import { usePrepareContractWrite, useContractWrite, useAccount, useFeeData, usePublicClient } from "wagmi"
import {
    nftTokenImageStore,
    nftTokenMediaStore,
    nftTokenCreatedStore,
    nftTokenUploadedStore,
    nftTokenDataStore,
    nftTokenAttributeStore
} from "@/store/form"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import Stepper from "@/components/Stepper"
import Button from "@/components/Button"
import Link from "next/link"
import apiRoutes from "@/config/api.route"
import appRoutes from "@/config/app.route"
/** Use the default Abi */
import erc1155Abi from "@/abi/erc1155"
import erc721Abi from "@/abi/erc721"

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
    const { data: feeData } = useFeeData({ chainId: contract.chainId })

    const writeArgs: Record<string, Record<string, any>> = {
        erc721: {
            functionName: "mint",
            /** @todo Execution is always reverted if royalty is passed */
            // args: [address, BigInt(nftTokenData?.royalty || 1)],
            args: [address],
            abi: erc721Abi,
            address: contract.contractAddress,
            chainId: contract.chainId,
            maxFeePerGas: feeData?.maxFeePerGas,
            maxPriorityFeePerGas: feeData?.maxPriorityFeePerGas,
            onError: () => toast.error("Minting will fail, please report error")
        },
        erc1155: {
            functionName: "create",
            /** @todo Execution is always reverted if royalty is passed */
            // args: [address, BigInt(nftTokenData?.supply || 1), BigInt(nftTokenData?.royalty || 0), "0x"],
            args: [address, BigInt(nftTokenData?.supply || 1), "0x"],
            abi: erc1155Abi,
            address: contract.contractAddress,
            chainId: contract.chainId,
            maxFeePerGas: feeData?.maxFeePerGas,
            maxPriorityFeePerGas: feeData?.maxPriorityFeePerGas,
            onError: () => toast.error("Minting will fail, please report error")
        }
    } as const

    const { config } = usePrepareContractWrite(writeArgs[nftSchema])
    const { isLoading, writeAsync } = useContractWrite(config)
    const publcClient = usePublicClient({ chainId: contract.chainId })

    const handleMinting = async () => {
        try {
            setMinting(true)
            /** Send the transaction */
            const mintTransaction = await writeAsync?.()
            /** Wait for the transaction to be mined */
            const txReceipt = await publcClient.waitForTransactionReceipt(mintTransaction as any)
            /** Decode the transaction logs to extract the tokenId */
            const mintLog = decodeEventLog({
                abi: writeArgs[nftSchema].abi,
                data: txReceipt.logs[0].data,
                topics: txReceipt.logs[0].topics
            })

            let tokenId

            /** Get the tokenId */
            switch(nftSchema) {
                case "erc721":
                    tokenId = (mintLog.args as any)?.tokenId?.toString()
                    break
                case "erc1155":
                    tokenId = (mintLog.args as any)?.id?.toString()
                    break;
            }
            
            setNftTokenData({...nftTokenData, tokenId})
            // console.log("tokenId", tokenId)
            setNftTokenCreated(true)
        
        } catch (error: any) {
            // toast.error(error.message)

        } finally {
            setMinting(false)
        }
    }


    return (
        <div className="my-4 flex flex-col">
            <Button 
                variant="secondary"
                disabled={nftTokenCreated || minting || isLoading || !writeAsync}
                loading={minting || isLoading}
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
    const [nftTokenImage] = useAtom(nftTokenImageStore)
    const [nftTokenMedia] = useAtom(nftTokenMediaStore)
    const [nftTokenData] = useAtom(nftTokenDataStore)
    const [nftTokenAttribute] = useAtom(nftTokenAttributeStore)

    const tokenDataToFormData = () => {
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

        // append image
        formData.append("image", nftTokenImage)

        if (nftTokenMedia) {
            formData.append("media", nftTokenMedia)
        }

        return formData
    }

    const uploadToken = async () => {
        try {
            setUploading(true)
            // upload
            const formData = tokenDataToFormData()
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
                variant="secondary"
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
                        appRoutes.viewToken
                        .replace(":chainId", contract.chainId.toString())
                        .replace(":contractAddress", contract.contractAddress)
                        .replace(":tokenId", nftTokenData?.tokenId.toString() || "")
                    }
                >
                    Marketplace
                </Link> 
            </Button>
        </div>
    )
}