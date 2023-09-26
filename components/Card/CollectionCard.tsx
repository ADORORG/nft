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
        <div className="flex flex-col h-[260px] w-[260px]">
            <Bordered className="my-3 w-full h-full flex justify-center items-center">
                <MediaPreview
                    type={mediaType || "image/*"}
                    src={`${IPFS_GATEWAY}${media || image}`}
                    previewClassName="h-[250px] w-[250px] flex justify-center items-center"
                    className="max-h-[250px]"
                />
            </Bordered>
            <div className="flex flex-row justify-between items-center px-2">
                <h5 className="opacity-70">
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
        </div>
    )
}