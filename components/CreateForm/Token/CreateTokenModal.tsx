import type { PopulatedNftTokenType } from "@/lib/types/token"
import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { CodeSlash, CloudCheck, BagCheck } from "react-bootstrap-icons"
import { toast } from "react-hot-toast"
import { useAccount } from "wagmi"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import { readSingleFileAsDataURL } from "@/utils/file"
import { useContractChain } from "@/hooks/contract"
import { useERC721, useERC1155 } from "@/hooks/contract/nft"
import Stepper from "@/components/Stepper"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"
import appRoutes from "@/config/app.route"

interface CreateTokenModalProps {
    tokenData: PopulatedNftTokenType,
    setTokenData: (token: Partial<PopulatedNftTokenType>) => void,
    resetForm?: () => void,
    mediaFile?: File | null
}

export default function CreateTokenModal({ tokenData, setTokenData, resetForm, mediaFile }: CreateTokenModalProps) {
    const isErc721 = tokenData.contract.nftSchema.toLowerCase() === "erc721"
    const currentStage: "mint" | "save" | "market" = tokenData._id ? tokenData.tokenId ? "market" : "mint" : "save"
    const [loading, setLoading] = useState(false)
    const { address } = useAccount()
    const erc721Method = useERC721() 
    const erc1155Method = useERC1155()
    const contractChain = useContractChain({chainId: tokenData.contract.chainId})
    const router = useRouter()
    /** 
    * Progress steps
    */
    const steps = {
        save: {
            title: "Upload item",
            subtitle: "Save token details",
            done: tokenData._id !== undefined,
            active: false,
            icon: <CloudCheck className="" />
        },
        mint: {
            title: "Mint",
            subtitle: "Create on chain",
            done: !!(tokenData._id && tokenData.tokenId),
            active: false,
            icon: <CodeSlash className="" />
        },
        market: {
            title: "Marketplace",
            subtitle: "Add to market",
            done: false,
            active: false,
            icon: <BagCheck className="" />
        },
    }

    const saveTokenData = useCallback(async (newNftToken: PopulatedNftTokenType) => {
        const response = await fetcher(apiRoutes.createToken, {
            method: "POST",
            body: JSON.stringify(newNftToken)
        })

        if (response.success) {
            return response.data
        }
    }, [])

    const updateTokenId = useCallback(async (token: PopulatedNftTokenType) => {
        const updatedToken = await saveTokenData(token)
        setTokenData({...tokenData, draft: updatedToken.draft, tokenId: updatedToken?.tokenId})
    }, [tokenData, saveTokenData, setTokenData])

    const handleMinting = useCallback(async () => {
        await contractChain.ensureContractChainAsync()
        let writeResult

        if (isErc721) {
            writeResult = await erc721Method.mint({
                contractAddress: tokenData.contract.contractAddress,
                royalty: tokenData?.royalty || tokenData.contract.royalty,
                receiverAddress: address as string
            })
        } else {
            writeResult = await erc1155Method.create({
                contractAddress: tokenData.contract.contractAddress,
                initialSupply: tokenData?.quantity || 1,
                royalty: tokenData?.royalty || tokenData.contract.royalty,
                receiverAddress: address as string
            })
        }

        const updatedToken = {...tokenData, tokenId: writeResult?.tokenId}
        setTokenData(updatedToken)
        return updatedToken
    }, [address, contractChain, erc1155Method, erc721Method, isErc721, tokenData, setTokenData])

    const handleSubmit = async () => {
        try {
            setLoading(true)
            if (!tokenData._id) {
                // Token not yet saved to database
                // convert file to data url
                let mediaDataURL: string | undefined

                if (mediaFile) {
                    mediaDataURL = await new Promise<string>(resolve => readSingleFileAsDataURL(mediaFile as Blob, resolve as any))
                }

                const savedDraft = await saveTokenData({
                    ...tokenData, 
                    tokenId: undefined,
                    draft: true,
                    media: tokenData.media || mediaDataURL || ""
                })

                // set the token document _id
                if (savedDraft._id) {
                    setTokenData({
                        ...tokenData, 
                        _id: savedDraft._id,
                        media: savedDraft.media
                    })
                    toast("Token saved as draft")
                }
                // mint token
                const mintedToken = await handleMinting()
                // update token id in database
                await updateTokenId(mintedToken)
            } else if (tokenData._id && !tokenData.tokenId) {
                // Token already saved to database as draft
                // mint token
                const mintedToken = await handleMinting()
                // update token id in database
                await updateTokenId(mintedToken)
            } else if (tokenData.draft) {
                await updateTokenId(tokenData)
            }

            toast.success("Token created successfully")
            if (tokenData.tokenId && tokenData._id && !tokenData.draft) {
                const viewTokenUrl =  replaceUrlParams(appRoutes.viewToken, {
                    chainId: tokenData.contract.chainId.toString(),
                    contractAddress: tokenData.contract.contractAddress,
                    tokenId: tokenData?.tokenId?.toString() || ""
                })
                resetForm?.()
                router.push(viewTokenUrl)
            }
            
        } catch (error) {
            console.error(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-row gap-4 justify-between p-3">
            <Stepper
                steps={Object.values(steps)}
            />
            <div className="px-6 text-gray-950 dark:text-gray-100">
                <ul className="mb-4">
                    <li className="py-1">Name: {tokenData?.name}</li>
                    <li className="py-1">Contract: {tokenData.contract.label}</li>
                    <li className="py-1">Schema: {tokenData.contract.nftSchema}</li>
                    <li className="py-1">
                        Supply: {
                            isErc721 ? 1 : (tokenData.quantity || 1)
                        }
                    </li>
                </ul>

                <div className="my-4 flex flex-col">
                    <Button 
                        variant="gradient"
                        disabled={loading}
                        loading={loading}
                        onClick={handleSubmit}
                        rounded
                    >
                        {currentStage}
                    </Button>
                </div>

            </div>
        </div>
    )
}