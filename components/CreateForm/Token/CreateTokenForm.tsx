"use client"
import type { PopulatedNftTokenType } from "@/lib/types/token"
import type CollectionType from "@/lib/types/collection"
import type NftContractType from "@/lib/types/contract"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { validateFile } from "@/utils/file"
import { replaceUrlParams } from "@/utils/main"
import { useMediaObjectUrl } from "@/hooks/media/useObjectUrl"
import {
    FileDropzone,
    InputField,
    TextArea,
    SwitchCheckbox,
} from "@/components/Form"
import { Select } from "@/components/Select"
import { MediaPreview } from "@/components/MediaPreview"
import RoyaltySlider from "@/components/RoyaltySlider"
import AttributeForm from "@/components/AttributeForm"
import QuickModal from "@/components/QuickModal"
import TagInput from "@/components/TagInput"
import Button from "@/components/Button"
import CreateTokenModal from "./CreateTokenModal"
import appRoutes from "@/config/app.route"
import { allowMediaExtension, maxMediaSize } from "@/config/media"

interface CreateTokenFormProps {
    tokenData: Partial<PopulatedNftTokenType>,
    setTokenData: (token: Partial<PopulatedNftTokenType>) => void,
    accountCollections?: CollectionType[],
    accountContracts?: NftContractType[],
    enableMediaChange?: boolean,
    resetForm?: () => void
}

export default function CreateTokenForm(props: CreateTokenFormProps) {
    const {
        tokenData,
        accountCollections,
        accountContracts,
        enableMediaChange = true,
        setTokenData,
        resetForm
    } = props

    /** Stack of form fields */
    const requiredFormFields = ["name", "description", "xcollection", "contract"] as const
    /** The default token attribute */
    const defaultAttributes = { trait_type: "", value: "" }
    const [tokenMedia, setTokenMedia] = useState<File | null>(null)
    /** Modal for minting and uploading token data */
    const [showModal, setShowModal] = useState(false)
    const tempMediaObjectUrl = useMediaObjectUrl(tokenMedia)
    const isErc721 = tokenData?.contract?.nftSchema === "erc721"
    const router = useRouter()
    const tokenCreated = !!(tokenData?.tokenId && tokenData._id && !tokenData.draft)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        if (type === "checkbox" && "checked" in e.target) {
            setTokenData({ [name]: e.target.checked })

        } else {
            setTokenData({ [name]: value })
        }
    }

    /**
     * Media change event handler
     * @param e Event handler
     */
    const handleMediaFile = (files: FileList | null) => {
        if (files?.length) {
            validateFile(files[0], { ext: allowMediaExtension, size: maxMediaSize })
            setTokenData({ mediaType: files[0].type })
            setTokenMedia(files[0])
        }
    }

    /**
     * Verify the required form fields for token creation and enable modal
     */
    const handleSubmit = async () => {
        const noEmptyFields = requiredFormFields.every(field => tokenData && !!tokenData[field])

        if (!noEmptyFields) {
            toast.error(`Please fill ${requiredFormFields.join(", ")}`)
            return
        }

        if (!tokenData.media && !tokenMedia) {
            toast.error("Please upload token media")
            return
        }
        setShowModal(true)
    }

    return (
        <div className="w-full md:5/6 lg:w-3/4 self-center">
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <div className="w-full">
                    {/* Input fields */}
                    <div className="my-2">
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
                                value={tokenData?.royalty || 0}
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

                    {/* Show account nft contracts */}
                    <div className="mb-4 mt-8">
                        <label htmlFor="account-contracts" className="block mt-4 mb-2 font-medium text-gray-900 dark:text-white">
                            <span>Contract &nbsp;</span>
                            <Button
                                variant="gradient"
                                className="rounded text-sm py-1"
                            >
                                <Link href={appRoutes.createErc721}>
                                    Create new
                                </Link>
                            </Button>
                        </label>

                        <Select
                            id="account-contracts"
                            onChange={e => {
                                const contract = accountContracts?.find(c => c._id?.toString() === e.target.value)
                                setTokenData({ contract })
                            }}
                            name="contract"
                            value={tokenData?.contract?._id?.toString() || ""}
                            className="rounded focus:transition-all duration-700"
                        >
                            <Select.Option value="" disabled>Select contract</Select.Option>
                            {
                                accountContracts &&
                                accountContracts.length &&
                                accountContracts
                                    // We do not have to filter, we request user to switch to the selected contract chain on deploy
                                    // .filter(contract => chain && chain.id === +contract.chainId)
                                    .filter(contract => contract.contractAddress && (!contract.nftEdition || contract.nftEdition === "private"))
                                    .map((contract) => (
                                        <Select.Option
                                            className="active:bg-gradient-300"
                                            key={contract._id?.toString()}
                                            value={contract._id?.toString()}>
                                            {contract.label || contract.contractAddress} - {contract.nftSchema}
                                        </Select.Option>
                                    ))
                            }
                        </Select>
                    </div>

                    {/*  Show account collections */}
                    <div className="my-4">
                        <label htmlFor="account-contracts" className="block mt-4 mb-2 font-medium text-gray-900 dark:text-white">
                            <span className="">Collection&nbsp;</span>
                            <Button
                                variant="gradient"
                                className="rounded text-sm py-1"
                            >
                                <Link href={appRoutes.createCollection}>
                                    Create new
                                </Link>
                            </Button>
                        </label>

                        <Select
                            id="account-collections"
                            onChange={e => {
                                const xcollection = accountCollections?.find(c => c._id?.toString() === e.target.value)
                                setTokenData({ xcollection })
                            }}
                            name="xcollection"
                            value={tokenData?.xcollection?._id?.toString() || ""}
                            className="rounded focus:transition-all duration-700"
                        >
                            <Select.Option value="" disabled>Select collection</Select.Option>
                            {
                                accountCollections &&
                                accountCollections.length &&
                                accountCollections.map((collection) => (
                                    <Select.Option
                                        className="active:bg-purple-300"
                                        key={collection._id?.toString()}
                                        value={collection._id?.toString()}>
                                        {collection.name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-4">
                    <div className="h-[250px] w-[250px]">
                        {/* Token Media */}
                        <label
                            htmlFor={enableMediaChange ? "nftTokenMedia" : undefined}
                            className="my-4 flex flex-col gap-2">
                            <span>Media</span>
                            <span className="text-gray-500 text-sm">Once you create an item it may not be changed in the future</span>
                        </label>
                        {
                            (tokenData?.media || tempMediaObjectUrl) &&
                            <MediaPreview
                                type={tokenData?.mediaType}
                                htmlFor={enableMediaChange ? "nftTokenMedia" : undefined}
                                previewClassName=""
                                src={tokenData?.media || tempMediaObjectUrl}
                            />
                        }
                        <div className={tokenData?.media || tempMediaObjectUrl ? "hidden" : ""}>
                            <FileDropzone
                                id="nftTokenMedia"
                                label="Token Media"
                                fileExtensionText={
                                    <span className="flex flex-col gap-2">
                                        <span>Recommended: 30MB max </span>
                                        {allowMediaExtension?.join(", ")}
                                    </span>
                                }
                                accept={allowMediaExtension?.map(x => "." + x).join(", ")}
                                labelClassName="hover:transition-all duration-700"
                                onChange={e => {
                                    try {
                                        handleMediaFile(e.target.files)
                                    } catch (error: any) {
                                        toast.error(error.message)
                                    }
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="my-4 flex gap-4">
                <Button
                    className="px-3"
                    variant="gradient"
                    rounded
                    onClick={handleSubmit}
                    disabled={tokenCreated}
                >
                    {
                        tokenCreated ?
                        "Token created"
                        :
                        tokenData._id && !tokenData.tokenId ?
                        "Mint token"
                        :
                        tokenData._id && tokenData.draft ?
                        "Update token"
                        :
                        "Create token"
                    }
                </Button>
                {
                    (tokenCreated) ?
                        // Reset to mint new token
                        <Button
                            className="px-3 bg-gray-600"
                            rounded
                            onClick={() => resetForm?.()}
                        >Mint another</Button>
                        :
                        null
                }
            </div>

            {/**  
            * Token data will be read from store by CreateTokenModal
            * We are passing the currently selected nft contract to mint on
            */}
            <QuickModal
                show={showModal}
                // disable modal closing
                // will be closed when done
                onHide={() => false }
                modalBody={CreateTokenModal}
                modalTitle="Create Token"
                tokenData={tokenData}
                setTokenData={setTokenData}
                mediaFile={tokenMedia}
                done={() => {
                    if (tokenCreated) {
                        const viewTokenUrl =  replaceUrlParams(appRoutes.viewToken, {
                            chainId: tokenData?.contract?.chainId.toString() as string,
                            contractAddress: tokenData?.contract?.contractAddress as string,
                            tokenId: tokenData?.tokenId?.toString() || ""
                        })
                        router.push(viewTokenUrl)         
                    }
                }}
            />
        </div>
    )
}