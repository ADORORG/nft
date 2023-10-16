import type { CreateEventSubComponentProps } from "../types"
import { useCallback, useState } from "react"
import toast from "react-hot-toast"
import { getFetcherErrorMessage } from "@/utils/network"
import { InputField, TextArea } from "@/components/Form"
import AttributeForm from "@/components/AttributeForm"
import NavigationButton from "@/components/NavigationButton"

export default function EventTokenMetadata(props: CreateEventSubComponentProps) {
    const { 
        eventData,
        setEventData,
        saveEventData,
        previousScreen,
        nextSreen
    } = props
    const [loading, setLoading] = useState(false)
    const defaultAttributes = { trait_type: "", value: "" }

    const handleEventDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target
        setEventData?.({[name]: value})
    }

    const handleNextScreen = useCallback(async () => {
        try {
            setLoading(true)

            const requiredFormFields = ["tokenName", "tokenDescription"] as const
            const noEmptyFields = requiredFormFields.every(field => eventData && !!eventData[field])

            if (!noEmptyFields) {
                toast.error(`Please provide token name and description`)
                return
            }

            if (eventData.draft) {
                // update the draft event
                await saveEventData?.({
                    contract: {
                        ...eventData.contract,
                        nftSchema: "erc721",
                        draft: true
                    } as any,
                })
            }
            
            nextSreen?.()
        } catch(error) {
            console.error(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }, [eventData, saveEventData, nextSreen])

    return (
        <div>
            <div className="mt-4">
                <InputField
                    label={<span>Event name <br/><small>Minted tokens will have this name</small></span>}
                    type="text"
                    name="tokenName"
                    placeholder="My NFT"
                    onChange={handleEventDataChange}
                    value={eventData?.tokenName || ""}
                    className="rounded focus:transition-all duration-700"
                    labelClassName="my-1"
                    autoComplete="off"
                />
                <div className="">
                    <label htmlFor="event-description" className="block my-2 text-sm font-medium text-gray-900 dark:text-white ">
                        Description <br/><small>Minted tokens will have this description</small>
                    </label>
                    <TextArea
                        id="tokenDescription"
                        name="tokenDescription"
                        placeholder="Describe your contract token"
                        value={eventData?.tokenDescription || ""}
                        className="rounded focus:transition-all duration-700"
                        onChange={handleEventDataChange}
                    />
                </div>
                
                <InputField
                    label={<span>Redeemable Content <br/><small>Provide a content only accessible by holders</small></span>}
                    type="text"
                    name="redeemableContent"
                    placeholder="e.g. Discord invite link or secret code"
                    onChange={handleEventDataChange}
                    value={eventData?.redeemableContent || ""}
                    className="rounded focus:transition-all duration-700"
                    labelClassName="my-3"
                    autoComplete="off"
                />

                {/* Attributes */}
                <div className="my-2 rounded p-4 bg-gray-100 dark:bg-gray-800 drop-shadow-lg">
                    <label className="block pb-4 font-medium">
                        Attribute of the tokens
                    </label>
                    <AttributeForm
                        attributes={eventData?.attributes || [defaultAttributes]}
                        onChange={newAttributes => {
                            setEventData({ attributes: [...newAttributes] })
                        }}
                    />
                </div>
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
                            disabled={loading}
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
                            onClick={handleNextScreen}
                            className="py-1 px-3"
                            disabled={loading}
                            loading={loading}
                        />
                    }
                </div>
            </div>
        </div>
    )
}