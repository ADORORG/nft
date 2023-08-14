import type CollectionType from "@/lib/types/collection"
import Link from "next/link"
import Image from "@/components/Image"
import appRoutes from "@/config/app.route"

interface CollectionAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    xcollection: CollectionType
}

export default function CollectionAvatarWithLink(props: CollectionAvatarProps) {
    const { className, ...otherProps } = props

    return (
        <Link 
            href={
                appRoutes.viewCollection
                .replace(":slug", props.xcollection.slug)
            }
            className="flex gap-1 items-center text-gray-950 dark:text-gray-100"
        >
            <Image 
                src={props.xcollection.image}
                alt=""
                className={`rounded border border-gray-200 dark:border-gray-800 ${className}`}
                {...otherProps}
            />
            &nbsp;
            <span>{props.xcollection.name}</span>
        </Link>
    )
}