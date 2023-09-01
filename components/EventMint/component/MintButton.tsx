import type EventMintProps from "../types"
import type { OnchainMintResponse } from "@/lib/types/common"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useContractChain } from "@/hooks/contract"
import { useOpenEditionSaleEvent } from "@/hooks/contract/event"
import { useAuthStatus } from "@/hooks/account"
import { dateToRelativeDayAndHour } from "@/utils/date"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { replaceUrlParams } from "@/utils/main"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"


export default function MintButton({eventData, quantity}: EventMintProps & {quantity: number}) {
    const router = useRouter()
    const [mintData, setMintData] = useState<OnchainMintResponse[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [mintedOnchain, setMintedOnchain] = useState(false)
    const [mintedOffchain, setMintedOffchain] = useState(false) // Minting completed on the server
    const { session } = useAuthStatus()
    const { ensureContractChainAsync } = useContractChain({chainId: eventData.contract.chainId})
    const { mintBatchOpenEdition } = useOpenEditionSaleEvent()
    const relativeStartDate = dateToRelativeDayAndHour(new Date(eventData.start))
    const relativeEndDate = dateToRelativeDayAndHour(new Date(eventData.end))

    const mintOnchain = async () => {
        const result = await mintBatchOpenEdition({
            contractAddress: eventData.contract.contractAddress,
            quantity,
            totalAmount: quantity * eventData.price,
            receiverAddress: session?.user?.address as string,
        })

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

            router.refresh()
        } catch (error: any) {
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

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
                        (eventData.supply > 0 && eventData.supplyMinted >= eventData.supply)
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
                        relativeEndDate.future ? 
                            mintedOnchain && !mintedOffchain? 
                            "Finalize Mint" 
                            : 
                            mintedOffchain ?
                            "Mint More"
                            :
                            "Mint" 
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