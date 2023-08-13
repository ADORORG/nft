import { FileMusic } from "react-bootstrap-icons"
import { isHttpUrl } from "@/utils/main";
import { IPFS_GATEWAY } from "@/lib/app.config";
import useAudioLoader from "@/hooks/media/useAudioLoader"
import type MediaPreviewProps from "./type"

export default function AudioPreview(props: MediaPreviewProps) {
    const { loadingComponent, clickRef, src, className, alt = "", previewClassName, ...otherProps } = props
    
    let audioSrc

    if (isHttpUrl(src) || src.startsWith("data:audio")) {
        // it's a url or data url, hence, we use it unmodified
        audioSrc =  src
    } else {
        /** 
         * We expect it to be IPFS hash
         * @todo Check if it's IPFS hash 
        */
        audioSrc = IPFS_GATEWAY + src 
    }

    const audioLoaded = useAudioLoader(audioSrc)

    return (
        <div className={`relative ${previewClassName}`}>
            {
                !audioLoaded && !!loadingComponent ?
                loadingComponent
                :
                <audio
                    controls
                    src={audioSrc}
                    className={`block ${className}`}
                    {...otherProps}
                >{alt}</audio>
            }
    
            {
                clickRef &&
                <span 
                    onClick={clickRef.click.bind(clickRef)}
                    title="Select another file"    
                    className="cursor-pointer bg-purple-900 hover:bg-purple-950 p-2 rounded-lg text-gray-100 transition-all absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <FileMusic className="h-6" />
                </span>
                
            }
        </div>
    )
}