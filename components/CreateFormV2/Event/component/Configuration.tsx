import type { CreateEventSubComponentProps } from "../types"
import toast from "react-hot-toast"
import { useChainById } from "@/hooks/contract"
import { nftEditionChecker } from "@/utils/contract"
import { InputField, SwitchCheckbox } from "@/components/Form"
import Bordered from "@/components/Bordered"
import RoyaltySlider from "@/components/RoyaltySlider"
import NavigationButton from "@/components/NavigationButton"
import DateAndTime from "@/components/DateAndTime"

export default function EventConfiguration(props: CreateEventSubComponentProps & {step2Done: boolean}) {
    const { 
        eventData,
        step2Done,
        setEventData,
        previousScreen,
        nextSreen
    } = props
    const chain = useChainById(eventData?.contract?.chainId as number)
    const nftEditionType = nftEditionChecker(eventData.nftEdition)

    const handleEventDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setEventData?.({[name]: value})
    }
    
    return (
        <div>
            <div className="mt-4">
                <InputField
                    label={`Price (${chain?.nativeCurrency?.symbol || `ETH`})`}
                    type="number"
                    min="0"
                    name="price"
                    onChange={handleEventDataChange}
                    value={eventData?.price || "0"}
                    className="rounded focus:transition-all duration-700"
                    labelClassName="my-2"
                />
                <InputField
                    label="Sale payout address"
                    type="text"
                    name="feeRecipient"
                    onChange={handleEventDataChange}
                    placeholder="0x..."
                    value={eventData?.feeRecipient || ""}
                    className="rounded focus:transition-all duration-700"
                    labelClassName="my-2"
                />
                <div className="my-3">
                    <h5>Mint start date</h5>
                    <DateAndTime 
                        onChange={newDate => (
                            setEventData({start: newDate.getTime()})
                        )}
                        minDate={new Date()}
                        value={eventData.start}
                    />
                </div>
                
                <div className="my-3">
                    <h5>Mint end date</h5>
                    <DateAndTime 
                        onChange={newDate => (setEventData({end: newDate.getTime()}))}
                        minDate={new Date(eventData.start || new Date())}
                        value={eventData.end}
                    />
                </div>
                
                {/* Token Royalty */}
                <div className="my-3">
                    <RoyaltySlider
                        setRoyaltyValue={value => setEventData({royalty: value})}
                        labelText="Royalty amount"
                        value={eventData?.royalty || eventData?.contract?.royalty || 0}
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
                    labelClassName="my-1"
                />
                {
                    // open_edition is unlimited supply, one-of-one is always a single supply.
                    // nftEditionType.isLimitedSupply is will be true for limited_edition and generative series
                    nftEditionType.isLimitedSupply && (
                        <InputField
                            label="Supply (Edition size)"
                            type="number"
                            name="supply"
                            min="1"
                            placeholder="100"
                            onChange={handleEventDataChange}                    
                            value={eventData?.supply || ""}
                            autoComplete="off"
                            className="rounded focus:transition-all duration-700"
                            labelClassName="my-3"
                        />
                    )
                }

                {
                    !nftEditionType.isOneOfOne &&
                    <InputField
                        label="Limit mints per wallet (0 = unlimited)"
                        type="number"
                        min="0"
                        name="maxMintPerWallet"
                        onChange={handleEventDataChange}
                        value={eventData?.maxMintPerWallet || "0"}
                        className="rounded focus:transition-all duration-700"
                        labelClassName="my-2"
                    />
                }
                <Bordered className="my-3 flex flex-col md:flex-row justify-between md:items-center">
                    <span>
                        {
                            eventData?.transferrable === false ?
                            "Minted tokens will be locked forever (Soul-bound)" 
                            :
                            "Minted tokens can be transferred"
                        }
                    </span>
                    <SwitchCheckbox
                        checked={
                            (eventData?.transferrable === undefined || eventData?.transferrable) ?
                            true :
                            false
                        }
                        onChange={e => (
                            setEventData({transferrable: e.target.checked})
                        )}
                    />
                </Bordered>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between py-6">
                <div>
                    {
                        previousScreen !== undefined &&
                        <NavigationButton
                            direction="left"
                            text="Go back"
                            onClick={() => previousScreen?.()}
                            className="bg-gray-200 dark:bg-gray-800 py-1 px-3"
                        />
                    }
                </div>
                <div>
                    {
                        nextSreen !== undefined &&
                        <NavigationButton
                            direction="right"
                            text="Next"
                            variant="gradient"
                            onClick={() => {
                                if (!step2Done) {
                                    toast.error("Please provide all the required data")
                                    return
                                }
                                nextSreen?.()
                            }}
                            className="py-1 px-3"
                        />
                    }
                </div>
            </div>
        </div>
    )
}