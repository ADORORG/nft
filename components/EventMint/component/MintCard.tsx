import type EventMintProps from "../types"
import { useState } from "react"
import { dateToRelativeDayAndHour } from "@/utils/date"
import { useAccountPurchaseCount } from "@/hooks/contract/event"
import { useAuthStatus } from "@/hooks/account"
import { InputField } from "@/components/Form"
import ProgressBar from "@/components/ProgressBar"
import MintButton from "./MintButton"

export default function MintCard(props: EventMintProps) {
    const { eventData } = props
    const [quantity, setQuantity] = useState(1)
    const relativeDate = dateToRelativeDayAndHour(new Date(eventData.end))
    const { session } = useAuthStatus()
    const accountPurchaseCount = useAccountPurchaseCount({
        contractAddress: eventData.contract.contractAddress, 
        accountAddress: session?.user?.address
    })

    return (
        <div className="bg-gray-200 dark:bg-gray-900 p-3 rounded shadow-xl">
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
                                eventData.maxMintPerWallet - accountPurchaseCount
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
                />

                {/* Max mint per wallet */}
                {
                    eventData.maxMintPerWallet && (
                        <p>
                            Max mints: {accountPurchaseCount}/{eventData.maxMintPerWallet}
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