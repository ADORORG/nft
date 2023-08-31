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
import { InputField } from "@/components/Form"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import Button from "@/components/Button"
import ProgressBar from "@/components/ProgressBar"
import apiRoutes from "@/config/api.route"

export default function MintCard(props: EventMintProps) {
    const router = useRouter()
    const { eventData } = props
    const [quantity, setQuantity] = useState(1)
    const [cost, setCost] = useState(eventData.price)
    const [mintData, setMintData] = useState<OnchainMintResponse[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [mintedOnchain, setMintedOnchain] = useState(false)
    const [mintedOffchain, setMintedOffchain] = useState(false) // Minting completed on the server
    const { session } = useAuthStatus()
    const { ensureContractChainAsync } = useContractChain({chainId: eventData.contract.chainId})
    const { mintBatchOpenEdition } = useOpenEditionSaleEvent()

    const relativeDate = dateToRelativeDayAndHour(new Date(eventData.end))

    const mintOnchain = async () => {
        const result = await mintBatchOpenEdition({
            contractAddress: eventData.contract.contractAddress,
            quantity,
            totalAmount: cost,
            receiverAddress: session?.user?.address as string,
            contractVersion: eventData.contract.version,
        })

        setMintedOnchain(true)
        return result
    }

    const mintOffchain = async (data: typeof mintData ) => {
        const response = await fetcher(replaceUrlParams(apiRoutes.mintOnEvent, {eventDocId: props.eventData?._id?.toString() as string}), {
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
                toast("Already minted")
            }

            router.refresh()
        } catch (error: any) {
            console.log(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="bg-gray-200 dark:bg-gray-900 p-3 rounded shadow-xl">
            <div className="flex flex-col gap-4">
                {/* Price and Input form */}
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                        <span className="font-semibold">
                            {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 6 }).format(cost)}
                        </span>
                        <span className="text-xl">{eventData.currency.symbol}</span>
                    </div>
                    <div className="w-24">
                        <InputField
                            name="quantity"
                            type="number"
                            min="1"
                            max={eventData.maxMintPerWallet || undefined}
                            value={quantity}
                            onChange={(e) => {
                                setQuantity(parseInt(e.target.value))
                                setCost(eventData.price * parseInt(e.target.value))
                            }}
                            className="rounded"
                        />
                    </div>
                    
                </div>
                {/* Mint button */}
                {
                    session?.user ? 
                    <Button
                        disabled={mintedOffchain || loading || !relativeDate.future || (eventData.supply > 0 && eventData.supplyMinted >= eventData.supply)}
                        variant="gradient"
                        className="w-full"
                        loading={loading}
                        onClick={handleMint}
                        rounded
                    >
                        
                        {
                        
                        relativeDate.future ? 
                            mintedOnchain && !mintedOffchain? 
                            "Finalize Mint" 
                            : 
                            mintedOffchain ?
                            "Minted"
                            :
                            "Mint" 
                        : 
                        "Ended"
                        
                        }
                    </Button>
                    :
                    <ConnectWalletButton text="Connect & Mint"/>
                }

                {/* Max mint per wallet */}
                {
                    eventData.maxMintPerWallet && (
                        <p>
                            Max mints: {eventData.maxMintPerWallet}
                        </p>
                    )
                }

                {/* Progress bar */}
                <div className="flex flex-col gap-1 border-t border-gray-300 dark:border-gray-700">
                    <div className="flex flex-row justify-between items-center">
                        <span>
                            {eventData.supplyMinted || 0} minted
                        </span>
                        <span>
                            {eventData.supply > 0 ? `${eventData.supply} total` : "unlimited"}
                        </span>
                    </div>

                    <ProgressBar
                        progress={eventData.supplyMinted / eventData.supply * 100}
                        variant="gradient"
                        size="sm"
                    />
                </div>
                
                {/* End date */}
                <div className="flex flex-row justify-between items-center border-t border-gray-300 dark:border-gray-700">
                    <span>
                        {relativeDate.future ? "Ending:" : "Ended:"} 
                    </span>
                    <span>
                        {relativeDate.days} {relativeDate.hours}h
                    </span>
                </div>
            </div>
        </div>
    )
}