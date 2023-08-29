import { Camera } from "react-bootstrap-icons"
// import { isHttpUrl } from "@/utils/main";
// import { IPFS_GATEWAY } from "@/lib/app.config";
import useImageLoader from "@/hooks/media/useImageLoader"
import type MediaPreviewProps from "./type"

export default function ImagePreview(props: MediaPreviewProps) {
    const { loadingComponent, htmlFor, src, className, alt = "", previewClassName, ...otherProps } = props

    const imageLoaded = useImageLoader(src)

    return (
        <div className={`relative ${previewClassName}`}>
            {
                !imageLoaded && !!loadingComponent ?
                loadingComponent
                :
                /* eslint-disable-next-line */
                <img
                    src={src}
                    alt={alt}
                    className={`${className}`}
                    {...otherProps}
                />
            }
            
            {
                htmlFor &&
                <label 
                    htmlFor={htmlFor}
                    title="Select another file"    
                    className="h-8 w-8 cursor-pointer bg-purple-900 hover:bg-purple-950 p-2 rounded-lg text-gray-100 transition-all absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <Camera className="h-4 w-4" />
                </label>
                
            }
        </div>
    )
}