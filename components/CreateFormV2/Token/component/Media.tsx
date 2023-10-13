import type { CreateTokenSubComponentProps } from "../types"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { validateFile, readSingleFileAsArrayBuffer } from "@/utils/file"
import { replaceUrlParams } from "@/utils/main"
import { useMediaObjectUrl } from "@/hooks/media/useObjectUrl"
import { MediaPreview } from "@/components/MediaPreview"
import { FileInput, FileDropzone } from "@/components/Form"
import NavigationButton from "@/components/NavigationButton"
import { allowMediaExtension, maxMediaSize } from "@/config/media"
import apiRoutes from "@/config/api.route"
import { IPFS_GATEWAY } from "@/lib/app.config"

export default function CreateTokenMedia(props: CreateTokenSubComponentProps) {
    const { 
        tokenData, 
        setTokenData,
        previousScreen,
        nextSreen
    } = props
    const [loading, setLoading] = useState(false)
    const [tokenMedia, setTokenMedia] = useState<File | null>(null)
    const tempMediaObjectUrl = useMediaObjectUrl(tokenMedia)
    
    /**
     * Media change event handler
     * @param e Event handler
     */
    const handleMediaFile = (files: FileList | null) => {
        try {
            if (files?.length) {
                validateFile(files[0], { ext: allowMediaExtension, size: maxMediaSize })
                setTokenData({ mediaType: files[0].type })
                setTokenMedia(files[0])
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleNextScreen = async () => {
        try {
            setLoading(true)

            if ((!tokenMedia && tokenData.media) || !tokenData.draft) {
                // Call next screen if we have media already and
                // the user didn't change the media or the token is not a draft
                nextSreen?.()
            } else if (tokenMedia && tokenData.draft && tokenData._id) {
                // user wants to change the media
                const FileBuffer = await new Promise<ArrayBuffer>(resolve => readSingleFileAsArrayBuffer(tokenMedia as Blob, resolve))
                const response = await fetcher(replaceUrlParams(apiRoutes.uploadTokenMedia, {
                    docId: tokenData?._id?.toString() as string
                }), {
                    method: "POST",
                    body: FileBuffer,
                    headers: {
                        "Content-Type": tokenMedia.type
                    }
                })

                if (response.success) {
                    setTokenData({ media: response?.data.media })
                    nextSreen?.()
                }
            } else {
                throw new Error("Please provide media")
            }

        } catch (error: any) {
            console.error(error)
            toast.error(getFetcherErrorMessage(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 pb-4">
            <div>
                <label
                    htmlFor="nftTokenMedia"
                    className="my-4 flex flex-col gap-2">
                    <span>Media (Drop or click to choose)</span>
                    <span className="text-gray-500 text-sm">Once you create an item it may not be changed in the future</span>
                </label>

                <FileDropzone
                    mediaHandler={handleMediaFile}
                    className="flex justify-center items-center h-[320px] w-[320px] mb-[20px] rounded"
                >
                    <div className="self-center max-h-[250px] max-w-[250px]">
                        {/* Token Media */}
                        {
                            (tokenData?.media || tempMediaObjectUrl) &&
                            <MediaPreview
                                type={tokenData?.mediaType}
                                htmlFor="nftTokenMedia"
                                previewClassName="max-h-[250px] max-w-[250px]"
                                className="max-h-[250px] max-w-[250px]"
                                src={tempMediaObjectUrl || (IPFS_GATEWAY as string) + tokenData?.media}
                            />
                        }
                        <div className={tokenData?.media || tempMediaObjectUrl ? "hidden" : ""}>
                            <FileInput
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
                </FileDropzone>
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