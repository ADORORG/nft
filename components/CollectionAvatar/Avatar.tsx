import type CollectionType from "@/lib/types/collection"
import Image from "@/components/Image"

interface CollectionAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    xcollection: CollectionType
}

export default function CollectionAvatar(props: CollectionAvatarProps) {
    const { className, ...otherProps } = props

    return (
        <Image 
            src={props.xcollection.image}
            alt=""
            className={`rounded border border-gray-200 dark:border-gray-800 ${className}`}
            {...otherProps}
        />
    )
}