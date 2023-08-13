import { Camera } from "react-bootstrap-icons"
import { isHttpUrl } from "@/utils/main";
import { IPFS_GATEWAY } from "@/lib/app.config";
import useImageLoader from "@/hooks/media/useImageLoader"
import type MediaPreviewProps from "./type"

export default function ImagePreview(props: MediaPreviewProps) {
    const { loadingComponent, clickRef, src, className, alt = "", previewClassName, ...otherProps } = props

    let imageSrc

    if (isHttpUrl(src) || src.startsWith("data:image")) {
        // it's a url or data url, hence, we use it unmodified
        imageSrc = src
    } else {
        /** 
         * We expect it to be IPFS hash
         * @todo Check if it's IPFS hash 
        */
        imageSrc = IPFS_GATEWAY + src 
    }

    const imageLoaded = useImageLoader(imageSrc)

    return (
        <div className={`relative ${previewClassName}`}>
            {
                !imageLoaded && !!loadingComponent ?
                loadingComponent
                :
                /* eslint-disable-next-line */
                <img
                    src={imageSrc}
                    alt={alt}
                    className={`block w-full h-full ${className}`}
                    {...otherProps}
                />
            }
            
            {
                clickRef &&
                <span 
                    onClick={clickRef.click.bind(clickRef)}
                    title="Select another file"    
                    className="cursor-pointer bg-purple-900 hover:bg-purple-950 p-2 rounded-lg text-gray-100 transition-all absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <Camera className="h-6" />
                </span>
                
            }
        </div>
    )
}