import type EventMintProps from "../types"
import type { OnchainMintResponse } from "@/lib/types/common"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useContractChain } from "@/hooks/contract"
import { useOpenEditionSaleEvent, useLimitedEditionSaleEvent } from "@/hooks/contract/event"
import { useAuthStatus } from "@/hooks/account"
import { dateToRelativeDayAndHour } from "@/utils/date"
import { nftEditionChecker } from "@/utils/contract"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"


export default function MintButton({eventData, quantity, done}: EventMintProps & {quantity: number, done?: (success: boolean) => void}) {
    const [mintData, setMintData] = useState<OnchainMintResponse[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [mintedOnchain, setMintedOnchain] = useState(false)
    const [mintedOffchain, setMintedOffchain] = useState(false) // Minting completed on the server
    const { session } = useAuthStatus()
    const { ensureContractChainAsync } = useContractChain({chainId: eventData.contract.chainId})
    const { mintBatchOpenEdition } = useOpenEditionSaleEvent()
    const { mintBatchLimitedEdition } = useLimitedEditionSaleEvent()
    const relativeStartDate = dateToRelativeDayAndHour(new Date(eventData.start))
    const relativeEndDate = dateToRelativeDayAndHour(new Date(eventData.end))
    const nftEditionType = nftEditionChecker(eventData.nftEdition)

    const mintOnchain = async () => {
        let result: OnchainMintResponse[] = []
        const mintData = {
            partitionId: eventData.partitionId as number,
            contractAddress: eventData.contract.contractAddress,
            quantity,
            totalAmount: quantity * eventData.price,
            receiverAddress: session?.user?.address as string,
        }

        if (nftEditionType.isOpenEdition) {
            result = await mintBatchOpenEdition(mintData)

        } else if (nftEditionType.isLimitedEdition || nftEditionType.isOneOfOne) {
            result = await mintBatchLimitedEdition(mintData)
        }
    
        setMintedOnchain(true)
        return result
    }

    const mintOffchain = async (data: typeof mintData ) => {
        const response = await fetcher(replaceUrlParams(apiRoutes.mintOnEvent, {eventDocId: eventData?._id?.toString() as string}), {
            method: "POST",
            body: JSON.stringify(data)
        })

        if (response.success) {
            setMintedOffchain(true)
            toast.success(response.message)
        }
    }

    const handleMint = async () => {
        try {
            setLoading(true)

            if (!mintedOnchain) {
                await ensureContractChainAsync()
                const result = await mintOnchain()
                setMintData(result)

                await mintOffchain(result)
            } else if (!mintedOffchain) {
                await mintOffchain(mintData)
            } else {
                // Reset mint data
                setMintData(null)
                setMintedOnchain(false)
                setMintedOffchain(false)
            }
                
            done?.(true)
        } catch (error: any) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    const mintedOut = ((nftEditionType.isLimitedSupply || nftEditionType.isOneOfOne) && eventData.supplyMinted >= eventData.supply)
    return (
        <div>
            {
                session?.user ? 
                <Button
                    disabled={
                        quantity <= 0 ||
                        loading || 
                        !relativeEndDate.future ||
                        relativeStartDate.future ||
                        mintedOut
                    }
                    variant="gradient"
                    className="w-full"
                    loading={loading}
                    onClick={handleMint}
                    rounded
                >
                    
                    {
                        relativeStartDate.future ?
                        "Not Started"
                        :
                        mintedOut ?
                        "Minted Out"
                        :
                        relativeEndDate.future ? 
                            mintedOnchain && !mintedOffchain? 
                            "Finalize Mint" 
                            : 
                            mintedOffchain ?
                            "Mint More"
                            :
                            `${
                                parseFloat(eventData.price.toString()) <= 0 ?
                                "Mint Free"
                                :
                                "Mint"
                            }` 
                        : 
                        "Ended"
                    }
                </Button>
                :
                <ConnectWalletButton className="w-full" text="Connect & Mint"/>
            }
        </div>
    )
}