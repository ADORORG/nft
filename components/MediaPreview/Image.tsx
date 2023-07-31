import Button from "@/components/Button"
import { CameraIcon } from "@heroicons/react/24/outline"

interface ImagePreviewProps extends React.HTMLAttributes<HTMLImageElement> {
    clickRef?: HTMLInputElement,
    src: any,
    previewClassName?: string
}

export default function ImagePreview(props:ImagePreviewProps) {
    const { clickRef, src, className, previewClassName, ...otherProps } = props

    return (
        <div className={`relative ${previewClassName}`}>
            {/* eslint-disable-next-line */}
            <img
                src={src}
                alt=""
                className={`block w-full h-full ${className}`}
                {...otherProps}
            />
            {
                clickRef &&
                <span 
                    onClick={clickRef.click.bind(clickRef)}
                    title="Select image"    
                    className="cursor-pointer bg-purple-900 hover:bg-purple-950 p-2 rounded-lg text-gray-100 transition-all absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                    <CameraIcon className="h-6" />
                </span>
                
            }
        </div>
    )
}