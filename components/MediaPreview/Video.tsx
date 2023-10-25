import { PlayBtn } from "react-bootstrap-icons"
import useVideoLoader from "@/hooks/media/useVideoLoader"
import type MediaPreviewProps from "./type"

export default function VideoPreview(props: MediaPreviewProps) {
    const { loadingComponent, htmlFor, src, className, alt = "", type, previewClassName, ...otherProps } = props

    const videoLoaded = useVideoLoader(src)

    return (
        <div className={`relative ${previewClassName}`}>
            <div>
                {
                    !videoLoaded && !!loadingComponent ?
                    loadingComponent
                    :
                    <video
                        controls
                        controlsList="nodownload"
                        src={src}
                        className={`${className}`}
                        {...otherProps}
                    >
                        <source src={src} type={type} />
                        {alt}
                    </video>
                }
                
                {
                    htmlFor &&
                    <label 
                        htmlFor={htmlFor}
                        title="Select another file"    
                        className="h-8 w-8 cursor-pointer bg-purple-900 hover:bg-purple-950 p-2 rounded-lg text-gray-100 transition-all absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    >
                        <PlayBtn className="h-4 w-4" />
                    </label>
                    
                }
            </div>
        </div>
    )
}