"use client"
import Link from "next/link"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAtom } from "jotai"
import { toast } from "react-hot-toast"
import { useAccount } from "wagmi"
import {
    nftTokenMediaStore,
    nftTokenCreatedStore,
    nftTokenUploadedStore,
    nftTokenDataStore,
    nftTokenAttributeStore
} from "@/store/form"
import { validateFile } from "@/utils/file"
import { splitAtWhiteSpaceOrComma } from "@/utils/main"
import { toRoyaltyPercent } from "@/utils/contract"
import { useMediaObjectUrl } from "@/hooks/media/useObjectUrl"
import {
    FileDropzone,
    InputField,
    TextArea,
    SwitchCheckbox,
    RangeInput
} from "@/components/Form"
import { Select } from "@/components/Select"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import { MediaPreview } from "@/components/MediaPreview"
import { useAccountCollection, useAccountContract } from "@/hooks/fetch"
import AttributeForm from "@/components/AttributeForm"
import QuickModal from "@/components/QuickModal"
import TagList from "@/components/TagList"
import Button from "@/components/Button"
import CreateTokenModal from "./CreateTokenModal"
import appRoutes from "@/config/app.route"

/**
 * @todo - Move contract write/read to hook in a separate file 
 * @returns 
 */
export default function CreateTokenForm() {
    const searchParams = useSearchParams()
    const { isConnected, address } = useAccount()
    /**
     * Fetch address contracts and collections
     */
    const { accountContracts } = useAccountContract(address)
    const { accountCollections } = useAccountCollection(address)

    /** Stack of form fields */
    const requiredFormFields = ["name", "description", "xcollection", "contract"] as const
	// const onchainFormFields = ["tokenId"]
	// const otherFormFields = ["supply", "royalty", "tags", "attributes","backgroundColor", "redeemable", "redeemableContent", "externalUrl"]
    
    /** A placeholder or default token attribute */
	const defaultAttributes = {trait_type: "", value: ""}
    /** Allowed Image type of token  */
    /** Optional media extension of token */
	const allowMediaExtension = ["jpg", "jpeg", "png", "gif", "webp", "svg", "mp3", "3gp", "mp4", "webm", "mov"]

    /** Use atom store of token data */
    const [nftTokenMedia, setNftTokenMedia] = useAtom(nftTokenMediaStore)
    const [nftTokenData, setNftTokenData] = useAtom(nftTokenDataStore)
    const [nftTokenAttribute, setNftTokenAttribute] = useAtom(nftTokenAttributeStore)
    /** Signifies that token data has minted on the blockchain */
    const [, setNftTokenCreated] = useAtom(nftTokenCreatedStore)
    /** Signifies that token data has been uploaded to the backend */
    const [nftTokenUploaded, setNftTokenUploaded] = useAtom(nftTokenUploadedStore)

    /** Modal for minting and uploading token data */
    const [showModal, setShowModal] = useState(false)
    const [royaltyPercent, setRoyaltyPercent] = useState(10)
    const tempMediaObjectUrl = useMediaObjectUrl(nftTokenMedia)
    const targetContract = accountContracts?.find(c => c._id?.toString() === nftTokenData?.contract)
    const isErc721 = targetContract?.nftSchema === "erc721"

    /**
     * Reset all the form field. This must be done before creating a new token
     */
    const resetForm = () => {
        setNftTokenCreated(false)
        setNftTokenUploaded(false)
        setNftTokenData({})
        setNftTokenAttribute([{...defaultAttributes}])
        setNftTokenMedia(null)
    }

    /**
     * Input change event handler
     * @param e Event handler
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
		const {name, value, type } = e.target

        if (type === "checkbox" && "checked" in e.target) {
			setNftTokenData({...nftTokenData, [name]: e.target.checked})
		
		} else {
            setNftTokenData({...nftTokenData, [name]: value})            
        }
	}

    /**
     * Media change event handler
     * @param e Event handler
     */
    const handleMediaFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target.files?.length) {
                validateFile(e.target.files[0], {ext: allowMediaExtension})
                setNftTokenMedia(e.target.files[0])
                setNftTokenData({...nftTokenData, mediaType: e.target.files[0].type})
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }


    /**
     * Verify the required form fields for token creation and enable modal
     */
    const handleSubmit = async () => {
        const noEmptyFields = requiredFormFields.every(field => nftTokenData && !!nftTokenData[field])

		if (!noEmptyFields) {
			toast.error(`Please fill ${requiredFormFields.join(", ")}`)
			return
		}

		if (!nftTokenMedia) {
			toast.error("Please upload token media")
			return
		}
        setShowModal(true)
        
    }

    return (
        <div className="w-full md:5/6 lg:w-3/4 mx-auto">
            <h1 className="text-4xl text-center pb-10 md:leading-4">Create a token</h1>

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
                            value={nftTokenData?.name || ""}
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
                            value={nftTokenData?.description || ""}
                            className="rounded focus:transition-all duration-700"
                            onChange={handleInputChange}
                        />
                    </div>
                    
                    
                    {/* Redeemable  */}
                    <div className="my-3">
                        <SwitchCheckbox
                            label="Redeemable"
                            name="redeemable"
                            checked={nftTokenData?.redeemable || false}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Redeemable Content */}
                    {
                        nftTokenData?.redeemable
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
                                value={nftTokenData?.redeemableContent || ""}
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
                                name="supply"
                                min={0}
                                placeholder="1"
                                onChange={handleInputChange}
                                value={isErc721 ? "1" : (nftTokenData?.supply || "1")}
                                autoComplete="off"
                                className="rounded focus:transition-all duration-700"
                                disabled={isErc721}
                            />
                        </div>

                        {/* Token Royalty */}
                        <div className="flex flex-col gap-3 mb-4">
                            <span>Royalty ({royaltyPercent}%)</span>
                            <RangeInput
                                max={50}
                                step={1}
                                value={royaltyPercent}
                                onChange={e => {
                                    const value = Number(e.target.value)
                                    setRoyaltyPercent(value)
                                    // set contract royalty
                                    setNftTokenData({...nftTokenData, royalty: toRoyaltyPercent(value)})
                                }}
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
                                value={nftTokenData?.externalUrl || ""}
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
                                value={nftTokenData?.backgroundColor || "#000000"}
                                autoComplete="off"
                                className="rounded focus:transition-all duration-400"
                            />
                        </div>
                    </div>
                    
                     {/* Tags  */}
                     <div className="mt-4 mb-6">
                        <InputField
                            label="Tags (max 6)"
                            type="text"
                            name="tags"
                            placeholder="art, 3D, pin"
                            onChange={handleInputChange}
                            onBlur={e => {
                                // Limit tags to 6
                                const {value} = e.target
                                const tags = splitAtWhiteSpaceOrComma(value).slice(0, 6).join(", ")
                                setNftTokenData({...nftTokenData, tags})
                            }}
                            value={nftTokenData?.tags || ""}
                            autoComplete="off"
                            className="rounded focus:transition-all duration-400"
                        />

                        <p className="my-2">
                            <TagList tags={nftTokenData?.tags} />
                        </p>
                    </div>
                    
                    {/* Attributes */}
                    <div className="my-2 rounded p-4 bg-gray-100 dark:bg-gray-800 drop-shadow-lg">
                        <label className="block py-4 text-sm font-medium text-gray-900 dark:text-white ">
                            Attributes
                        </label>
                        
                        <AttributeForm 
                            attributes={nftTokenAttribute}
                            onChange={setNftTokenAttribute}
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
                            onChange={handleInputChange}
                            name="contract"
                            value={nftTokenData?.contract?.toString() || searchParams.get("contract") || ""}
                            className="rounded focus:transition-all duration-700"
                        >
                            <Select.Option value="" disabled>Select contract</Select.Option>
                            {
                                accountContracts &&
                                accountContracts.length &&
                                accountContracts
                                // We do not have to filter, we request user to switch to the selected contract chain on deploy
                                // .filter(contract => chain && chain.id === +contract.chainId)
                                .map((contract) => (
                                    <Select.Option 
                                        className="active:bg-purple-300"
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
                            onChange={handleInputChange}
                            name="xcollection"
                            value={nftTokenData?.xcollection?.toString() || ""}
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
                        <label htmlFor="nftTokenMedia" className="my-4 text-sm font-medium">Media</label>      
                        {
                            nftTokenMedia &&
                            <MediaPreview 
                                type={nftTokenData?.mediaType}
                                htmlFor="nftTokenMedia"
                                previewClassName=""
                                src={tempMediaObjectUrl}
                            />
                        }
                        <div className={!!nftTokenMedia ? "hidden" : ""}>
                            <FileDropzone
                                id="nftTokenMedia"
                                label="Token Media"
                                fileExtensionText={allowMediaExtension.join(", ")}
                                accept={allowMediaExtension.map(x => "." + x).join(", ")}
                                labelClassName="hover:transition-all duration-700"
                                onChange={handleMediaFile}
                            />
                        </div>
                    </div>

                </div>
            </div>

            <div className="my-4 flex gap-4">
                {
                    isConnected ?
                    <>
                        <Button
                            className="px-3"
                            variant="gradient"
                            rounded
                            onClick={handleSubmit}
                        >Create Token</Button>
                        {
                            nftTokenUploaded ? 
                            // Reset to mint new token
                            <Button
                                className="px-3 bg-gray-600"
                                rounded
                                onClick={resetForm}
                            >Mint another</Button>
                            :
                            null
                        }
                        
                    </>
                    :
                    <ConnectWalletButton />
                }
                
                
            </div>

            {/**  
            * Token data will be read from store by CreateTokenModal
            * We are passing the currently selected nft contract to mint on
            */}
            <QuickModal
                show={showModal}
                onHide={setShowModal}
                modalBody={CreateTokenModal}
                modalTitle="Create Token"
                contract={accountContracts?.find(c => c._id?.toString() === nftTokenData?.contract)}
                
            />
        </div>
    )
}