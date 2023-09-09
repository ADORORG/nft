import type { EventDataFormProps } from "../types"
import { useState, useEffect } from "react"
import { toRoyaltyPercent, fromRoyaltyPercent } from "@/utils/contract"
import { useChainById } from "@/hooks/contract"
import { useAuthStatus } from "@/hooks/account"
import { InputField, RangeInput, SwitchCheckbox } from "@/components/Form"
import DateAndTime from "@/components/DateAndTime"
import Bordered from "@/components/Bordered"

export default function SaleEventMetadataForm(props: EventDataFormProps) {
    const [royaltyPercent, setRoyaltyPercent] = useState(fromRoyaltyPercent(props?.eventData?.royalty || 0))
    const {eventData, contractData} = props
    const chain = useChainById(contractData.chainId as number)
    const { session } = useAuthStatus()

    useEffect(() => {
        if (session?.user.address && !eventData?.feeRecipient) {
            props?.updateEventData?.({...eventData, feeRecipient: session?.user.address})
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleEventDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        props?.updateEventData?.({...eventData, [name]: value})
    }

    return (
        <div className={`${props.className}`}>
            <InputField
                label={<span>Event name <br/><small>Minted tokens will have this name</small></span>}
                type="text"
                name="tokenName"
                placeholder="My NFT"
                onChange={handleEventDataChange}
                value={eventData?.tokenName || ""}
                className="rounded focus:transition-all duration-700"
                labelClassName="my-3"
                autoComplete="off"
            />

            <InputField
                label={`Price (${chain?.nativeCurrency?.symbol || `ETH`})`}
                type="number"
                min="0"
                name="price"
                onChange={handleEventDataChange}
                value={eventData?.price || "0"}
                className="rounded focus:transition-all duration-700"
                labelClassName="my-3"
            />
          
            <div>
                <h5>Mint start date</h5>
                <DateAndTime 
                    onChange={newDate => (
                        props?.updateEventData?.({
                            ...eventData, 
                            start: newDate.getTime()
                        })
                    )}
                    minDate={new Date()}
                    value={eventData.start}

                />
            </div>
            
            <div>
                <h5>Mint end date</h5>
                <DateAndTime 
                    onChange={newDate => (
                        props?.updateEventData?.({
                            ...eventData, 
                            end: newDate.getTime()
                        })
                    )}
                    minDate={new Date(eventData.start || new Date())}
                    value={eventData.end}
                />
            </div>
           
            <InputField
                label="Sale payout address"
                type="text"
                name="feeRecipient"
                onChange={handleEventDataChange}
                placeholder="0x..."
                value={eventData?.feeRecipient || ""}
                className="rounded focus:transition-all duration-700"
                labelClassName="my-3"
            />
            {/* Event Royalty amount*/}
            <div className="flex flex-col gap-3 mb-3 w-full">
                <span>Royalty amount ({royaltyPercent}%)</span>
                <RangeInput
                    max={100}
                    step={1}
                    value={royaltyPercent}
                    onChange={e => {
                        const value = Number(e.target.value)
                        setRoyaltyPercent(value)
                        // set contract royalty
                        props?.updateEventData?.({...eventData, royalty: toRoyaltyPercent(value)})
                    }}
                />
            </div>
            
            <InputField
                label="Royalty payout address"
                type="text"
                name="royaltyReceiver"
                onChange={handleEventDataChange}
                placeholder="0x..."
                value={eventData?.royaltyReceiver || ""}
                className="rounded focus:transition-all duration-700"
                labelClassName="my-3"
            />
            <InputField
                label="Limit mints per wallet (0 = unlimited)"
                type="number"
                min="0"
                name="maxMintPerWallet"
                onChange={handleEventDataChange}
                value={eventData?.maxMintPerWallet || "0"}
                className="rounded focus:transition-all duration-700"
                labelClassName="my-3"
            />
            <Bordered className="flex flex-col md:flex-row justify-between md:items-center">
                <span>Minted tokens can be transferred</span>
                <SwitchCheckbox
                    checked={
                        (eventData?.transferrable === undefined || eventData?.transferrable) ?
                        true :
                        false
                    }
                    onChange={e => (
                        props?.updateEventData?.({...eventData, transferrable: e.target.checked})
                    )}
                />
            </Bordered>
            
        </div>
    )
}