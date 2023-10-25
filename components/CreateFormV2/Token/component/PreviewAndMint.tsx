import type { CreateTokenSubComponentProps } from "../types"
import { useState, useCallback, useMemo } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useAuthStatus } from "@/hooks/account"
import { useContractChain } from "@/hooks/contract"
import { useERC721, useERC1155 } from "@/hooks/contract/nft"
import { getFetcherErrorMessage } from "@/utils/network"
import { camelCaseToSentence, cutString, replaceUrlParams } from "@/utils/main"
import { fromRoyaltyPercent } from "@/utils/contract"
import NavigationButton from "@/components/NavigationButton"
import Button from "@/components/Button"
import appRoutes from "@/config/app.route"

export default function PreviewAndMintToken(props: CreateTokenSubComponentProps) {
    const { 
        tokenData, 
        // setTokenData,
        saveTokenData,
        previousScreen,
    } = props
    const tokenLink = useMemo(() => {
        return replaceUrlParams(appRoutes.viewToken, {
            chainId: tokenData?.contract?.chainId?.toString() as string,
            contractAddress: tokenData?.contract?.contractAddress as string,
            tokenId: tokenData?.tokenId?.toString() as string
        })
    }, [tokenData])
    const [loading, setLoading] = useState(false)
    const { address } = useAuthStatus()
    const erc721Method = useERC721() 
    const erc1155Method = useERC1155()
    const contractChain = useContractChain({chainId: tokenData?.contract?.chainId as number})
   

    const handleMinting = useCallback(async () => {
        await contractChain.ensureContractChainAsync()
        const isErc721 = tokenData?.contract?.nftSchema.toLowerCase() === "erc721"

        let writeResult

        if (isErc721) {
            writeResult = await erc721Method.mint({
                contractAddress: tokenData?.contract?.contractAddress as string,
                royalty: tokenData?.royalty || tokenData?.contract?.royalty || 0,
                receiverAddress: address as string
            })
        } else {
            writeResult = await erc1155Method.create({
                contractAddress: tokenData?.contract?.contractAddress as string,
                initialSupply: tokenData?.quantity || 1,
                royalty: tokenData?.royalty || tokenData?.contract?.royalty || 0,
                receiverAddress: address as string
            })
        }

        const updatedToken = {tokenId: writeResult?.tokenId}
        return updatedToken
    }, [address, contractChain, erc1155Method, erc721Method, tokenData])


    const handleMint = useCallback(async () => {
        try {
            setLoading(true)
            if (!tokenData.tokenId) {
                await handleMinting()
                .then(async mintResult => {
                    // update token id in database
                    await saveTokenData?.({
                        tokenId: mintResult?.tokenId
                    })
                    return mintResult
                }).catch(console.error)
            } else {
                // token already minted
                // update token data in database
                await saveTokenData?.()
            }
            
        } catch(error) {
            console.error(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }, [handleMinting, saveTokenData, tokenData])

    const PreviewLine = (props: {label: string, value?: string}) => (
        <div 
            className="w-full grid grid-cols-4 border-b border-gray-200 dark:border-gray-600 py-2"
        >
            <span>{props.label}</span>
            <span className="col-span-3 justify-self-end break-words">{props.value}</span>  
        </div>
    )

    return (
        <div>
            <div className="w-full flex flex-col gap-4 justify-center pb-4">
                {
                    ([
                        "tokenId", "quantity", "name", 
                        "description", "mediaType", "tags"
                    ] as const).map(key => (
                        <PreviewLine 
                            key={key}
                            label={camelCaseToSentence(key)}
                            value={cutString(tokenData[key]?.toString(), 24)}
                        />
                    ))
                }
                <PreviewLine 
                    label="Collection"
                    value={tokenData.xcollection?.name}
                />
                <PreviewLine 
                    label={`Contract (${tokenData.contract?.nftSchema})`}
                    value={tokenData.contract?.contractAddress}
                />
                <PreviewLine 
                    label="Royalty"
                    value={`${fromRoyaltyPercent(tokenData?.royalty || tokenData?.contract?.royalty)}%`}
                />
            </div>
            {/* Navigation buttons */}
            <div className="flex justify-between py-6">
                <div>
                    {
                        previousScreen !== undefined &&
                        <NavigationButton
                            direction="left"
                            text="Previous"
                            onClick={() => previousScreen?.()}
                            className="bg-gray-200 dark:bg-gray-800 py-1 px-3"
                            disabled={loading}
                        />
                    }
                </div>
                <div>
                    {
                        tokenData.tokenId && !tokenData.draft
                        ?
                        <Link
                            href={tokenLink}    
                        >
                            <Button
                                variant="gradient"
                                type="button"
                                className="py-1 px-3 rounded"
                            > View token </Button>
                        </Link>
                        :
                        <Button
                            variant="gradient"
                            onClick={handleMint}
                            className="py-1 px-3 rounded"
                            disabled={loading || tokenData.tokenId !== undefined}
                            loading={loading}
                        > Mint Token </Button>
                    }
                </div>
            </div>
        </div>
    )
}