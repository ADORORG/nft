"use client"
import Image, { ImageProps } from "next/image"
import useImageLoader from "@/hooks/media/useImageLoader"
import imageData from "@/utils/icon"
import { isHttpUrl } from "@/utils/main";
import { IPFS_GATEWAY } from '@/lib/app.config';

export default function CustomImage(params: React.ImgHTMLAttributes<HTMLImageElement> & ImageProps) {
    const { src = "", title, alt, width, height, className, ...props } = params

    const imageUrl = isHttpUrl(src) ? src : IPFS_GATEWAY + src    
    const imageLoaded = useImageLoader(imageUrl)
    const strData = `${imageUrl + width + height + className}`

    return (
        <Image
            className={className}
            width={width}
            height={height}
            src={imageLoaded ? imageUrl : imageData(strData)}
            alt={alt}
            title={title}
            {...props}
        />
    )

    
}