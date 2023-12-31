import type EventMintProps from "../types"
import { useEffect, useState } from "react"
import { dateToRelativeDayAndHour } from "@/utils/date"
import { nftEditionChecker } from "@/utils/contract"
import { useAccountMintCount } from "@/hooks/contract/event"
import { InputField } from "@/components/Form"
import ProgressBar from "@/components/ProgressBar"
import MintButton from "./MintButton"
import MintCompleted from "./MintCompleted"

export default function MintCard(props: EventMintProps) {
    const { eventData } = props
    const accountMintCount = useAccountMintCount({
        contractAddress: eventData.contract?.contractAddress as string, 
        partitionId: eventData.partitionId
    })
    const [quantity, setQuantity] = useState(1)
    const [mintDone, setMintDone] = useState(false)
    const relativeStartDate = dateToRelativeDayAndHour(new Date(eventData.start))
    const relativeEndDate = dateToRelativeDayAndHour(new Date(eventData.end))
    const nftEditionType = nftEditionChecker(eventData.nftEdition)
    
    // We want to show MintCompleted for a few seconds before hiding it
    useEffect(() => {
        if (mintDone) {
            const timeout = setTimeout(() => {setMintDone(false)}, 12000)
            return () => clearTimeout(timeout)
        }
    }, [mintDone])

    if (mintDone) return (<MintCompleted eventData={props.eventData} />)

    return (
        <div className="bg-gray-100 dark:bg-gray-900 shadow-lg p-3 rounded">
            <div className="flex flex-col gap-4">
                {/* Price and Input form */}
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col">
                        <span className="font-semibold">
                            {
                                new Intl.NumberFormat("en-US", { 
                                    minimumFractionDigits: 2, maximumFractionDigits: 6 
                                }).format(eventData.price * quantity)
                            }
                        </span>
                        <span className="text-xl">{eventData.currency.symbol}</span>
                    </div>
                    <div className="w-24">
                        <InputField
                            name="quantity"
                            type="number"
                            min={1}
                            max={
                                eventData.maxMintPerWallet &&
                                eventData.maxMintPerWallet > 0 ?
                                eventData.maxMintPerWallet - accountMintCount
                                : 
                                undefined
                            }
                            value={quantity}
                            onChange={e => setQuantity(parseInt(e.target.value))}
                            className="rounded"
                        />
                    </div>
                    
                </div>
                {/* Mint button */}
                <MintButton
                    eventData={eventData}
                    quantity={quantity}
                    done={setMintDone}
                />

                {/* Max mint per wallet */}
                {
                    <p>
                        Account Mints:&nbsp; 
                        {accountMintCount}/{
                            eventData.maxMintPerWallet > 0 ?
                            eventData.maxMintPerWallet
                            :
                            <span>&infin;</span>
                        }
                    </p>
                }

                {/* Progress bar */}
                <div className="flex flex-col gap-1 border-t border-gray-300 dark:border-gray-700">
                    <div className="flex flex-row justify-between items-center">
                        <span>
                            {eventData.supplyMinted || 0} minted
                        </span>
                        <span>
                            {(eventData?.supply && eventData.supply > 0) ? `${eventData.supply} total` : "unlimited"}
                        </span>
                    </div>

                    <ProgressBar
                        progress={
                            nftEditionType.isOpenEdition ?
                            100
                            :
                            ((eventData.supplyMinted || 0) / (eventData.supply || 0)) * 100
                        }
                        variant="gradient"
                        size="sm"
                    />
                </div>
                
                {/* End date */}
                <div className="flex flex-row justify-between items-center border-t border-gray-300 dark:border-gray-700">
                    {
                        relativeStartDate.future ? 
                        <>
                            <span>
                                Starts
                            </span>
                            <span>
                                {relativeStartDate.days} {relativeStartDate.hours}
                            </span>
                        </>
                        :
                        <>
                            <span>
                                {relativeEndDate.future ? "Ending:" : "Ended:"} 
                            </span>
                            <span>
                                {relativeEndDate.days} {relativeEndDate.hours}
                            </span>
                        </>
                    }
                    
                </div>
            </div>
        </div>
    )
}