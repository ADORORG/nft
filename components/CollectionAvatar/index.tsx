import type CollectionType from "@/lib/types/collection"
import Link from "next/link"
import Image from "@/components/Image"
import appRoutes from "@/config/app.route"

export default function CollectionAvatar(props: {xcollection: CollectionType}) {

    return (
        <Link 
            href={
                appRoutes.viewCollection
                .replace(":slug", props.xcollection.slug)
            }
            className="flex gap-1 items-center"
        >
            <Image 
                src={props.xcollection.image}
                alt=""
                className="h-6 w-6 rounded border border-gray-100 dark:border-gray-800"
            />
            &nbsp;
            <span>{props.xcollection.name}</span>
        </Link>
    )
}