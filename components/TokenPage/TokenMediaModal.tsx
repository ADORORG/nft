import { useState } from "react"
import MediaPreview from "@/components/MediaPreview"
import MediaTypeIcon from "@/components/MediaTypeIcon"
import QuickModal from "@/components/QuickModal"
import { MediaSkeleton } from "@/components/Skeleton"

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
                src={media}
                type={mediaType}
                previewClassName="md:w-[480px] w-[320px]"
                loadingComponent={<MediaSkeleton />}
            />
        </>
    )
}