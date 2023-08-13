"use client"
import useImageLoader from "@/hooks/media/useImageLoader"
import imageData from "@/utils/icon"
import { isHttpUrl } from "@/utils/main"
import { IPFS_GATEWAY } from "@/lib/app.config"

interface CustomImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    /** Optional data to use to generate placeholder icon */
    data?: any,
    /** Provide an optional loading component as placeholder */
    loadingComponent?: React.ReactNode
}

/**
 * Construct an image for ipfs hash or an absolute image url
 * @param params 
 * @returns 
 */
export default function CustomImage(params: CustomImageProps) {
    const { loadingComponent, data = "0x".padEnd(32, "0"), src = "", title, alt = "", width = 10, height = 10, className, ...props } = params

    let imageUrl

    if (isHttpUrl(src) || src.startsWith("data:image")) {
        // it's a url or data url, hence, we use it unmodified
        imageUrl =  src
    } else {
        /** 
         * We expect it to be IPFS hash
         * @todo Check if it's IPFS hash 
        */
        imageUrl = IPFS_GATEWAY + src 
    }

    const imageLoaded = useImageLoader(imageUrl)

    return (
        <>
            {
                !imageLoaded && !!loadingComponent ?
                loadingComponent
                :
                /**
                 * next Image is too strict with width and height :-), we use img for now
                 * @todo Use next Image
                 */
                // eslint-disable-next-line
                <img
                    className={className}
                    width={width}
                    // height={height}
                    src={imageLoaded ? imageUrl : imageData(data, Number(width || height))}
                    alt={alt}
                    title={title}
                    {...props}
                />
            }
        </>
    )

    
}