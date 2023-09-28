"use client"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { validateFile, readSingleFileAsDataURL } from "@/utils/file"
import { fetcher, getFetcherErrorMessage } from "@/utils/network"
import { useMediaObjectUrl } from "@/hooks/media/useObjectUrl"
import { FileDropzone } from "@/components/Form"
import { MediaPreview } from "@/components/MediaPreview"
import Button from "@/components/Button"
import apiRoutes from "@/config/api.route"

export default function UpdateAvatar() {
	const allowMediaExtension = ["jpg", "jpeg", "png", "gif", "webp", "svg", "mp3", "3gp", "mp4", "webm", "mov"]
    const [profileMedia, setProfileMedia] = useState<File | null>(null)
    const [profileMediaType, setProfileMediaType] = useState("")
    const [loading, setLoading] = useState(false)
    const tempMediaObjectUrl = useMediaObjectUrl(profileMedia)

    /**
     * Media change event handler
     * @param e Event handler
     */
    const handleMediaFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target.files?.length) {
                validateFile(e.target.files[0], {ext: allowMediaExtension})
                setProfileMedia(e.target.files[0])
                setProfileMediaType(e.target.files[0].type)
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleSubmit = async () => {
        try {
            if (!profileMedia) {
                return toast.error("Please select a media file")
            }

            setLoading(true)
            const mediaDataURL = await new Promise<string>(resolve => readSingleFileAsDataURL(profileMedia as Blob, resolve as any))
            const res = await fetcher(apiRoutes.setProfilePic, {
                method: "POST",
                body: JSON.stringify({
                    media: mediaDataURL,
                    mediaType: profileMediaType
                })
            })

            if (res.success) {
                toast.success(res.message)
            }

        } catch (error) {
            toast.error(getFetcherErrorMessage(error))

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="">
            <div className="py-4">
                {/* Token Media */}
                <label htmlFor="profileMedia" className="my-4 text-sm font-medium">Profile Avatar</label>      
                {
                    profileMedia &&
                    <MediaPreview 
                        type={profileMediaType}
                        htmlFor="profileMedia"
                        previewClassName="h-[250px] w-[250px]"
                        src={tempMediaObjectUrl}
                    />
                }
                <div className={!!profileMedia ? "hidden" : "h-[250px] w-[250px]"}>
                    <FileDropzone
                        id="profileMedia"
                        label="Profile Avatar"
                        fileExtensionText={allowMediaExtension.join(", ")}
                        accept={allowMediaExtension.map(x => "." + x).join(", ")}
                        labelClassName="hover:transition-all duration-700"
                        onChange={handleMediaFile}
                    />
                </div>
            </div>

            <Button
                onClick={handleSubmit}
                className="rounded"
                variant="gradient"
                loading={loading}
                disabled={loading}
            >Submit</Button>
        </div>
    )
}
