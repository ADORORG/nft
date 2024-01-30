import type { PopulatedCollectionType } from "@/lib/types/collection"
import Link from "next/link"
import Bordered from "@/components/Bordered"
import MediaPreview from "@/components/MediaPreview"
import UserAccountAvatar from "@/components/UserAccountAvatar"
import appRoutes from "@/config/app.route"
import { replaceUrlParams, cutString } from "@/utils/main"
import { IPFS_GATEWAY } from "@/lib/app.config"

type CollectionCardProps = {
    collection: PopulatedCollectionType
}

export default function CollectionCard(props: CollectionCardProps) {
    const {name, slug, owner, media, mediaType, image} = props.collection

    return (
        <Bordered className="flex flex-col gap-3 w-[290px] h-[320px] rounded">
            <div className="mx-auto w-[220px] h-[220px]">
                <MediaPreview
                    type={mediaType || "image/*"}
                    src={`${IPFS_GATEWAY}${media || image}`}
                    previewClassName="flex flex-col justify-center items-center"
                    className="max-w-[220px] max-h-[220px]"
                />
            </div>
            <div className="flex flex-row justify-between items-center px-2">
                <h5 className="text-xl py-2 text-gray-950 dark:text-gray-100 tracking-wide subpixel-antialiased opacity-70">
                    <Link href={replaceUrlParams(appRoutes.viewCollection, {slug})}>
                        {cutString(name, 20)}
                    </Link>
                </h5>
                <div>
                    <UserAccountAvatar 
                        account={owner}
                        width={28}
                        height={28}
                        title={`Owner: ${owner.address}`}
                    />
                </div>
            </div>
        </Bordered>
    )
}