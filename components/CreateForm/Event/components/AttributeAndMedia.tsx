import type { EventDataFormProps } from "../types"
import type { AttributeType } from "@/lib/types/common"
import { toast } from "react-hot-toast"
import { validateFile } from "@/utils/file"
import { FileDropzone } from "@/components/Form"
import AttributeForm from "@/components/AttributeForm"
import Bordered from "@/components/Bordered"
import MediaPreview from "@/components/MediaPreview"

export default function AttributeAndMedia(props: EventDataFormProps) {
    const allowMediaExtension = ["png", "jpg", "jpeg", "gif", "svg", "webp", "mp4", "webm", "ogg", "mp3", "wav", "m4a", "mpg", "mpeg", "3gp"]
   
    const setNftTokenAttribute = (attributes: AttributeType[]) => {
        props?.updateEventData?.({...props.eventData, attributes})
    }

    /**
     * Media change event handler
     * @param e Event handler
     */
    const handleMediaFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (e.target.files?.length) {
                validateFile(e.target.files[0], {ext: allowMediaExtension})
                props?.updateEventMedia?.(e.target.files[0])
                props?.updateEventData?.({...props.eventData, mediaType: e.target.files[0].type})
            }
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className={`${props.className}`}>
            <Bordered className="px-3 bg-gray-50 dark:bg-gray-900 drop-shadow-xl">
                <label className="block pb-4 font-medium">
                    Attributes of the tokens
                </label>
                <AttributeForm 
                    attributes={props.eventData.attributes || []}
                    onChange={setNftTokenAttribute}
                />
            </Bordered>

            <div>
                {/* Token Media */}
                <label htmlFor="eventMedia" className="block mb-4">Upload Artwork</label>
                {
                    props.tempMediaObjectUrl &&
                    <MediaPreview 
                        type={props.eventData?.mediaType}
                        src={props.tempMediaObjectUrl}
                        htmlFor="eventMedia"
                        previewClassName="h-[250px] w-[250px] md:h-[350px] md:w-[350px]"
                    />
                }
                <div className={!!props.tempMediaObjectUrl ? "hidden h-0" : ""}>
                    <FileDropzone
                        id="eventMedia"
                        label="Event Media"
                        fileExtensionText={allowMediaExtension.join(", ")}
                        accept={allowMediaExtension.map(x => "." + x).join(", ")}
                        labelClassName="hover:transition-all duration-700 h-[250px] w-[250px] md:h-[350px] md:w-[350px]"
                        onChange={handleMediaFile}
                    />
                </div>
            </div>
        </div>
    )
}