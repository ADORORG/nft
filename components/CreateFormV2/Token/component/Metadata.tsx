import type { CreateTokenSubComponentProps } from "../types"
import { useState } from "react"
import toast from "react-hot-toast"
import { getFetcherErrorMessage } from "@/utils/network"
import { InputField, TextArea,SwitchCheckbox } from "@/components/Form"
import RoyaltySlider from "@/components/RoyaltySlider"
import AttributeForm from "@/components/AttributeForm"
import TagInput from "@/components/TagInput"
import NavigationButton from "@/components/NavigationButton"

export default function CreateTokenMetadata(props: CreateTokenSubComponentProps) {
    const [loading, setLoading] = useState(false)
    const { 
        tokenData, 
        setTokenData,
        saveTokenData,
        previousScreen,
        nextSreen
    } = props
        
    const isErc721 = tokenData?.contract?.nftSchema === "erc721"
    const defaultAttributes = { trait_type: "", value: "" }

    const handleNextScreen = async () => {
        try {
            setLoading(true)

            const requiredFormFields = ["name", "description"] as const
            const noEmptyFields = requiredFormFields.every(field => tokenData && !!tokenData[field])

            if (!noEmptyFields) {
                toast.error(`Please provide ${requiredFormFields.join(", ")}`)
                return
            }

            if (tokenData.draft) {
                // update the draft token
                await saveTokenData?.()
            }
            
            nextSreen?.()
        } catch(error) {
            console.error(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        if (type === "checkbox" && "checked" in e.target) {
            setTokenData({ [name]: e.target.checked })

        } else {
            setTokenData({ [name]: value })
        }
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row gap-4 justify-center pb-4">
                <div className="w-full">
                    {/* Input fields */}
                    <div className="mb-2">
                        <InputField
                            label="Name"
                            type="text"
                            name="name"
                            placeholder="e.g. Horse human"
                            onChange={handleInputChange}
                            value={tokenData?.name || ""}
                            autoComplete="off"
                            className="rounded focus:transition-all duration-700"
                        />
                    </div>

                    <div className="my-3">
                        <label htmlFor="token-description" className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white ">
                            Description
                        </label>
                        <TextArea
                            id="token-description"
                            name="description"
                            placeholder="Describe your token"
                            value={tokenData?.description || ""}
                            className="rounded focus:transition-all duration-700"
                            onChange={handleInputChange}
                        />
                    </div>


                    {/* Redeemable  */}
                    <div className="my-3">
                        <SwitchCheckbox
                            label="Redeemable"
                            name="redeemable"
                            checked={tokenData?.redeemable || false}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Redeemable Content */}
                    {
                        tokenData?.redeemable
                        &&
                        <div className="my-3">
                            <label htmlFor="token-description" className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white ">
                                Redeemable Content
                            </label>
                            <TextArea
                                rows={2}
                                id="redeemable-content"
                                name="redeemableContent"
                                placeholder="Redeemable Content"
                                value={tokenData?.redeemableContent || ""}
                                className="rounded focus:transition-all duration-700"
                                onChange={handleInputChange}
                            />
                        </div>
                    }

                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                        {/* Token Supply */}
                        <div className="my-2">
                            <InputField
                                label="Supply"
                                type="number"
                                name="quantity"
                                min={1}
                                placeholder="1"
                                onChange={handleInputChange}
                                value={isErc721 ? "1" : (tokenData?.quantity || "1")}
                                autoComplete="off"
                                className="rounded focus:transition-all duration-700"
                                disabled={isErc721}
                            />
                        </div>

                        {/* Token Royalty */}
                        <div className="">
                            <RoyaltySlider
                                setRoyaltyValue={value => setTokenData({royalty: value})}
                                labelText="Token Royalty"
                                value={tokenData?.royalty || tokenData?.contract?.royalty || 0}
                            />
                        </div>

                        {/* External Url */}
                        <div className="my-2">
                            <InputField
                                label="External Url (Optional)"
                                type="url"
                                name="externalUrl"
                                placeholder="https://mywebsite.com/tokenId"
                                onChange={handleInputChange}
                                value={tokenData?.externalUrl || ""}
                                autoComplete="off"
                                className="rounded focus:transition-all duration-400"
                            />
                        </div>

                        {/* Background color */}
                        <div className="my-2">
                            <InputField
                                label="Background color (Optional)"
                                type="color"
                                name="backgroundColor"
                                onChange={handleInputChange}
                                value={tokenData?.backgroundColor || "#000000"}
                                autoComplete="off"
                                className="rounded focus:transition-all duration-400"
                            />
                        </div>
                    </div>

                    {/* Tags  */}
                    <div className="mt-4 mb-6">
                        <TagInput
                            setTags={tags => setTokenData({ tags })}
                            tags={tokenData?.tags}
                            maxTags={6}
                        />
                    </div>

                    {/* Attributes */}
                    <div className="my-2 rounded p-4 bg-gray-100 dark:bg-gray-800 drop-shadow-lg">
                        <label className="block py-4 text-sm font-medium text-gray-900 dark:text-white ">
                            Attributes
                        </label>

                        <AttributeForm
                            attributes={tokenData?.attributes || [defaultAttributes]}
                            onChange={newAttributes => {
                                setTokenData({ attributes: [...newAttributes] })
                            }}
                        />
                    </div>
                </div>
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