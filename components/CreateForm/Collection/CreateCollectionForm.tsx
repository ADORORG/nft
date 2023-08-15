"use client"
import Link from "next/link"
import { useState, useRef } from "react"
import { useAtom } from "jotai"
import { toast } from "react-hot-toast"
import {
    collectionImageStore,
    collectionBannerStore,
    collectionDataStore,
    collectionCreatedStore
} from "@/store/form"
import { onlyAlphaNumeric } from "@/lib/utils/main"
import { collectionCategories } from "@/lib/app.config"
import { useAuthStatus } from "@/hooks/account"
import {
    FileDropzone,
    InputField,
    TextArea
} from "@/components/Form"
import { Select } from "@/components/Select"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import { ImagePreview } from "@/components/MediaPreview"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import TagList from "@/components/TagList"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"
import appRoute from "@/config/app.route"

export default function CreateCollectionForm() {
    const { isConnected } = useAuthStatus()
    // form field
    const socialMediaFields = ["discord", "twitter"] as const
	const requiredFormFields = ["name", "description", "category", "tags"] as const
	const otherFormFields = ["externalUrl"] as const

    const [isLoading, setIsLoading] = useState(false)
    const [isInvalidCollectionSlug, setIsInvalidCollectionSlug] = useState<boolean | undefined>()
    const [bannerFile, setBannerFile] = useAtom(collectionBannerStore)
    const [imageFile, setImageFile] = useAtom(collectionImageStore)
    const [collectionData, setCollectionData] = useAtom(collectionDataStore)
    const [collectionCreated, setCollectionCreated] = useAtom(collectionCreatedStore)
    const [collectionSlug, setCollectionSlug] = useState('')

    const imageRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>
    const bannerRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>

   /**
    * Check that collection slug (url) is not in use by another collection 
    * @param slug - collection slug
    */
    const validateCollectionSlug = async (slug: string) => {
        try {
            if (!slug) return
            if (slug.length < 3 || slug.length > 24) {
                setIsInvalidCollectionSlug(true)
                return
            }

            const collection = await fetcher(apiRoutes.getCollectionBySlug.replace(":slug", slug))
            if (collection.data) {
                // collection is already existing for this for slug
                // Thus, set collection slug as invalid
                setIsInvalidCollectionSlug(true)
            } else {
                setIsInvalidCollectionSlug(false)
            }

        } catch (error: any) {   
            console.log(error)
            toast.error(getFetcherErrorMessage(error))
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
		const {name, value} = e.target;
        if (name === "name") {
            const slug = onlyAlphaNumeric(value)
            setCollectionSlug(slug.toLowerCase())
            setIsInvalidCollectionSlug(undefined)
        }
        setCollectionData({...collectionData, [name]: value})
	}

    const readSingleFileChange = (file: Blob, fileResultHandler: (update: ArrayBuffer | string | null) => void ) => {
        const reader = new FileReader();
		reader.addEventListener("load", function() {
			fileResultHandler(reader.result);
		}, false)

		if (file) reader.readAsDataURL(file);
    }

    const handleSubmit = () => {
		const noEmptyFields = requiredFormFields.every(field => collectionData && !!collectionData[field])

		if (!noEmptyFields) {
			toast.error(`Please fill ${requiredFormFields.join(", ")}`)
			return
		}

		if (!imageFile || !bannerFile) {
			toast.error("Please upload collection image and banner")
			return
		}

        submitForm()
	}

    const submitForm = async () => {
        try {
            setIsLoading(true)
            const formData = new FormData()
            // append image and banner
            formData.append("image", imageFile)
            formData.append("banner", bannerFile)

            for (const field of requiredFormFields) {
                formData.append(field, collectionData ? collectionData[field] || "" : "")
            }

            for (const field of socialMediaFields) {
                formData.append(field, collectionData ? collectionData[field] || "" as string : "")
            }

            for (const field of otherFormFields) {
                formData.append(field, collectionData ? collectionData[field] || "" as string : "")
            }

            await fetcher(apiRoutes.createCollection, {
                method: "POST",
                body: formData
            })

            setCollectionCreated(true)
            toast.success("Collection created")
        } catch (error: any) {
            const message = error.body && error.body.message ? error.body.message : error.message
            console.log(error)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
		setImageFile("")
		setBannerFile("")
		setCollectionData({})
        setCollectionCreated(false)
        setCollectionSlug("")
        setIsInvalidCollectionSlug(undefined)
	}

    return (
        <div className="w-full md:5/6 lg:w-3/4 mx-auto">
            <h1 className="text-4xl text-center pb-10 md:leading-4">Create a collection</h1>
           
            <div className="flex flex-col md:flex-row gap-4 justify-center">
                <div className="w-full">
                    {/* Input fields */}
                    <div className="my-2">
                        <InputField
                            label="Name"
                            type="text"
                            name="name"
                            placeholder="e.g. Metador"
                            onChange={handleInputChange}
                            onBlur={() => validateCollectionSlug(collectionSlug)}
                            value={collectionData?.name || ""}
                            autoComplete="off"
                            className="rounded focus:transition-all duration-700"
                        />

                        <p className="my-4">
                            Slug: {collectionSlug}&nbsp;
                            {
                                isInvalidCollectionSlug === true
                                &&
                                <span className="transition-all duration-500 text-gray-600">is not available</span>
                            }
                            {
                                isInvalidCollectionSlug === false
                                &&
                                <span className="transition-all duration-500 text-gray-600">is available</span>
                            }
                        </p>
                    </div>
                    <div className="my-3">
                        <label htmlFor="collection-description" className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white ">
                            Description
                        </label>
                        <TextArea
                            id="collection-description"
                            name="description"
                            placeholder="Describe your collection"
                            value={collectionData?.description || ""}
                            className="rounded focus:transition-all duration-700"
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* Category */}
                    <div className="my-2">
                        <label htmlFor="collection-category" className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            <span className="bg-indigo-800 px-3 rounded text-white">Category</span>
                        </label>

                        <Select
                            id="collection-category"
                            onChange={handleInputChange}
                            name="category"
                            value={collectionData?.category || ""}
                            className="rounded focus:transition-all duration-700"
                        >
                            <Select.Option value="" disabled>Select category</Select.Option>
                            {
                                collectionCategories.map(({slug, name}) => (
                                    <Select.Option 
                                        className="active:bg-purple-300"
                                        key={slug} 
                                        value={slug}>
                                            {name}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    {/* Tags  */}
                    <div className="my-2">
                        <InputField
                            label="Tags"
                            type="text"
                            name="tags"
                            placeholder="art, 3D, pin"
                            onChange={handleInputChange}
                            value={collectionData?.tags || ""}
                            autoComplete="off"
                            className="rounded focus:transition-all duration-400"
                        />

                        <p className="my-4">
                            <TagList tags={collectionData?.tags} />
                        </p>
                    </div>
                    {/* External Url */}
                    <div className="my-2">
                        <InputField
                            label="External Url"
                            type="url"
                            name="externalUrl"
                            placeholder="https://mywebsite.com"
                            onChange={handleInputChange}
                            value={collectionData?.externalUrl || ""}
                            autoComplete="off"
                            className="rounded focus:transition-all duration-400"
                        />
                    </div>

                    {/* Social links */}
                    <div className="flex flex-col lg:flex-row flex-wrap my-4">
                    {
                        socialMediaFields.map(field => (
                            <div key={field} className="my-2">
                                <InputField
                                    label={<span className="capitalize">{field}</span>}
                                    type="url"
                                    name={field}
                                    placeholder={`https://${field}/abc`}
                                    onChange={handleInputChange}
                                    value={collectionData ? collectionData[field] || "" : ""}
                                    autoComplete="off"
                                    className="rounded focus:transition-all duration-700"
                                />
                            </div>
                        ))
                    }
                    </div>
                </div>
                <div className="w-full flex flex-col gap-4">
                    {/* Input media/file  */}
                    <div>
                        {/* Collection Image */}
                        <h4 className="my-4 font-medium">Image</h4>
                        {
                            imageFile &&
                            <ImagePreview 
                                src={imageFile}
                                clickRef={imageRef.current}
                                previewClassName="md:w-[320px] md:h-[320px] h-[250px] w-[250px]"
                            />
                        }
                        <div className={!!imageFile ? "hidden" : ""}>
                            <FileDropzone
                                ref={imageRef}
                                label="Collection Image"
                                fileExtensionText="SVG, PNG, GIF, JPG (Max: 10MB)"
                                accept=".jpg, .png, .svg, .gif"
                                labelClassName="hover:transition-all duration-700"
                                onChange={(event) => {
                                    if (event.target.files?.length) {
                                        readSingleFileChange(event.target.files[0], setImageFile)
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        {/* Collection Banner */}
                        <h4 className="my-4 text-sm font-medium">Banner</h4>
                        
                        {
                            bannerFile &&
                            <ImagePreview 
                                src={bannerFile}
                                clickRef={bannerRef.current}
                                previewClassName="md:h-[250px] md:w-[500px] h-[250px] w-[444px]"
                            />
                        }
                        <div className={!!bannerFile ? "hidden" : ""}>
                            <FileDropzone
                                ref={bannerRef}
                                label="Collection Banner"
                                fileExtensionText="SVG, PNG, GIF, JPG, MP4, 3GP (Max: 10MB)"
                                accept=".jpg, .png, .svg, .gif, .mp4, .3gp"
                                labelClassName="hover:transition-all duration-700"
                                onChange={(event) => {
                                    if (event.target.files?.length) {
                                        readSingleFileChange(event.target.files[0], setBannerFile)
                                    }
                                }}
                            />
                        </div>
                    </div>

                </div>
            </div>
            
            <div className="my-4 flex gap-4">
                {
                    isConnected ?
                    <>
                        {
                            collectionCreated ?
                            <Button
                                className="px-3"
                                variant="secondary"
                                rounded
                            >
                                <Link href={appRoute.viewCollection.replace(":slug", onlyAlphaNumeric(collectionData?.name as string))}>View Collection</Link>
                            </Button>
                            :
                            <Button
                                className="px-3"
                                variant="secondary"
                                rounded
                                onClick={handleSubmit}
                                disabled={isInvalidCollectionSlug || isLoading}
                                loading={isLoading}
                            >Create Collection</Button>
                        }
                        
                        <Button
                            className="px-3 bg-gray-600"
                            rounded
                            onClick={resetForm}
                        >Reset</Button>
                    </>
                    :
                    <ConnectWalletButton />
                }
                
            </div>
        </div>
    )
}