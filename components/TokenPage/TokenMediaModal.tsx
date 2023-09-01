import { useState } from "react"
import MediaPreview from "@/components/MediaPreview"
import MediaTypeIcon from "@/components/MediaTypeIcon"
import QuickModal from "@/components/QuickModal"
import { MediaSkeleton } from "@/components/Skeleton"
import { IPFS_GATEWAY } from "@/lib/app.config"
import type TokenPageProps from "./types"

export default function TokenMediaModal(props: TokenPageProps) {
    const [showModal, setShowModal] = useState(false)
    const { media, mediaType } = props.token

    if (!mediaType || !media) {
        return null
    }

    return (
        <>
            <div 
                className="flex flex-wrap items-center rounded bg-gray-100 dark:bg-gray-800 p-1 cursor-pointer"
                onClick={() => setShowModal(true)}
            >
                <MediaTypeIcon
                    mediaType={mediaType}
                    className="h-5 w-5"
                />&nbsp;
                <span>Token contain additional media - {mediaType}</span>
            </div>

            <QuickModal
                show={showModal}
                onHide={setShowModal}
                modalTitle={`${props.token?.name} #${props.token.tokenId}`}
                modalBody={MediaPreview}
                // MediaPreview props
                src={IPFS_GATEWAY + media}
                type={mediaType}
                modalBodyClassName="lg:w-[410px] w-[310px]"
                loadingComponent={<MediaSkeleton className="h-[250px] w-[250px]" />}
                previewClassName="flex flex-col items-center w-full h-full"
                className="max-h-[300px] max-w-[300px]"
            />
        </>
    )
}