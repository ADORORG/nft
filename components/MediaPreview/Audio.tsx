import { FileMusic } from "react-bootstrap-icons"
import useAudioLoader from "@/hooks/media/useAudioLoader"
import type MediaPreviewProps from "./type"

export default function AudioPreview(props: MediaPreviewProps) {
    const { loadingComponent, htmlFor, src, className, alt = "", previewClassName, ...otherProps } = props
    
    const audioLoaded = useAudioLoader(src)

    return (
        <div className={`relative ${previewClassName}`}>
            {
                !audioLoaded && !!loadingComponent ?
                loadingComponent
                :
                <audio
                    controls
                    src={src}
                    className={`${className}`}
                    {...otherProps}
                >{alt}</audio>
            }
    
            {
                htmlFor &&
                <label 
                    htmlFor={htmlFor}
                    title="Select another file"    
                    className="h-8 w-8 cursor-pointer bg-purple-900 hover:bg-purple-950 p-2 rounded-lg text-gray-100 transition-all absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <FileMusic className="h-4 w-4" />
                </label>
                
            }
        </div>
    )
}