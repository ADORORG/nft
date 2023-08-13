import { PlayBtn } from "react-bootstrap-icons"
import { isHttpUrl } from "@/utils/main";
import { IPFS_GATEWAY } from "@/lib/app.config";
import useVideoLoader from "@/hooks/media/useVideoLoader"
import type MediaPreviewProps from "./type"

export default function VideoPreview(props: MediaPreviewProps) {
    const { loadingComponent, clickRef, src, className, alt = "", type, previewClassName, ...otherProps } = props

    let videoSrc

    if (isHttpUrl(src) || src.startsWith("data:video")) {
        // it's a url or data url, hence, we use it unmodified
        videoSrc =  src
    } else {
        /** 
         * We expect it to be IPFS hash
         * @todo Check if it's IPFS hash 
        */
        videoSrc = IPFS_GATEWAY + src 
    }

    const videoLoaded = useVideoLoader(videoSrc)

    return (
        <div className={`relative ${previewClassName}`}>
            {
                !videoLoaded && !!loadingComponent ?
                loadingComponent
                :
                <video
                    controls
                    src={videoSrc}
                    className={`block w-full h-full ${className}`}
                    {...otherProps}
                >
                    <source src={src} type={type} />
                    {alt}
                </video>
            }
            
            {
                clickRef &&
                <span 
                    onClick={clickRef.click.bind(clickRef)}
                    title="Select another file"    
                    className="cursor-pointer bg-purple-900 hover:bg-purple-950 p-2 rounded-lg text-gray-100 transition-all absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <PlayBtn className="h-6" />
                </span>
                
            }
        </div>
    )
}