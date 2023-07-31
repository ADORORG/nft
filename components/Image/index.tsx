"use client"
import useImageLoader from "@/hooks/media/useImageLoader"
import imageData from "@/utils/icon"
import { isHttpUrl } from "@/utils/main";
import { IPFS_GATEWAY } from "@/lib/app.config";

export default function CustomImage(params: React.ImgHTMLAttributes<HTMLImageElement>) {
    const { src = "", title, alt = "", width, height, className, ...props } = params

    const imageUrl = isHttpUrl(src) ? src : IPFS_GATEWAY + src    
    const imageLoaded = useImageLoader(imageUrl)
    const strData = `${imageUrl + width + height + className}`

    return (
        // next Image is too strict :-), we use img for now
        // eslint-disable-next-line
        <img
            className={className}
            width={width}
            // height={height}
            src={imageLoaded ? imageUrl : imageData(strData, Number(width))}
            alt={alt}
            title={title}
            {...props}
        />
    )

    
}