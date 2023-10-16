import type { PopulatedNftTokenType } from "@/lib/types/token"
import { useState, useCallback } from "react"
import { CodeSlash, CloudCheck, BagCheck } from "react-bootstrap-icons"
import { toast } from "react-hot-toast"
import { useAccount } from "wagmi"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { readSingleFileAsDataURL } from "@/utils/file"
import { useContractChain } from "@/hooks/contract"
import { useERC721, useERC1155 } from "@/hooks/contract/nft"
import Stepper from "@/components/Stepper"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"

interface CreateTokenModalProps {
    tokenData: PopulatedNftTokenType,
    setTokenData: (token: Partial<PopulatedNftTokenType>) => void,
    done?: (/* createdToken: Partial<PopulatedNftTokenType> */) => void,
    mediaFile?: File | null
}

export default function CreateTokenModal({ tokenData, setTokenData, done, mediaFile }: CreateTokenModalProps) {
    const isErc721 = tokenData.contract.nftSchema.toLowerCase() === "erc721"
    const currentStage: "mint" | "save" | "market" = tokenData._id ? tokenData.tokenId ? "market" : "mint" : "save"
    const [loading, setLoading] = useState(false)
    const { address } = useAccount()
    const erc721Method = useERC721() 
    const erc1155Method = useERC1155()
    const contractChain = useContractChain({chainId: tokenData.contract.chainId})
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
            subtitle: "Ready to sell",
            done: !tokenData.draft,
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
            return response.data as PopulatedNftTokenType
        }
    }, [])

    const saveDraftTokenData = useCallback(async (newNftToken: PopulatedNftTokenType) => {
        const savedDraft = await saveTokenData(newNftToken)
        setTokenData({_id: savedDraft?._id})
        return savedDraft
    }, [saveTokenData, setTokenData])

    const updateTokenId = useCallback(async (token: PopulatedNftTokenType) => {
        await saveTokenData(token)
        setTokenData({draft: false})
    }, [saveTokenData, setTokenData])

    const handleMinting = useCallback(async () => {
        await contractChain.ensureContractChainAsync()
        let writeResult

        if (isErc721) {
            writeResult = await erc721Method.mint({
                contractAddress: tokenData.contract?.contractAddress || "",
                royalty: tokenData?.royalty || tokenData.contract.royalty || 0,
                receiverAddress: address as string
            })
        } else {
            writeResult = await erc1155Method.create({
                contractAddress: tokenData.contract?.contractAddress || "",
                initialSupply: tokenData?.quantity || 1,
                royalty: tokenData?.royalty || tokenData.contract.royalty || 0,
                receiverAddress: address as string
            })
        }

        const updatedToken = {tokenId: writeResult?.tokenId}
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

                await saveDraftTokenData({
                    ...tokenData, 
                    tokenId: undefined,
                    draft: true,
                    media: (mediaDataURL ? mediaDataURL : tokenData.media) as string
                }).then(async draftToken => {
                    toast("Token saved as draft")
                    // mint token
                    const mintResult = await handleMinting()
                    return {
                        ...draftToken,
                        tokenId: mintResult?.tokenId
                    }
                }).then(async draftToken => {
                    // update token id in database
                    await updateTokenId(draftToken as PopulatedNftTokenType)
                    return draftToken
                }).catch(error => {
                    console.error(error)
                })

            } else if (tokenData._id && !tokenData.tokenId) {
                // Token already saved to database as draft
                // mint token
                await handleMinting()
                .then(async mintResult => {
                    // update token id in database
                    return updateTokenId({...tokenData, tokenId: mintResult?.tokenId})
                }).catch(error => {
                    console.error(error)
                })

            } else if (tokenData.draft) {
                await updateTokenId(tokenData)
            }

            done?.()
           
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