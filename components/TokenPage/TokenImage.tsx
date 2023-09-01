import type TokenPageProps from "./types"
// import Image from "@/components/Image"
import MediaPreview from "@/components/MediaPreview"
import { MediaSkeleton } from "@/components/Skeleton"
import { IPFS_GATEWAY } from "@/lib/app.config"

export default function TokenImage(props: TokenPageProps) {
    const { media, mediaType, image } = props.token
    return (
        <div className="flex justify-center p-4 drop-shadow-lg">
            {/* Check if there's a media, show the media, otherwise display the image */}
            <MediaPreview
                src={`${IPFS_GATEWAY}${media || image}`}
                type={mediaType || "image/*"}
                loadingComponent={<MediaSkeleton className="h-[250px] w-[250px]" />}
                previewClassName="flex flex-col items-center w-full h-full"
                className="max-h-[350px] max-w-[350px]"
            />
            {/* <Image 
                src={props.token.image}
                alt={props.token.tokenId.toString()}
                data={`${props.token.contract.contractAddress}${props.token.tokenId}`}
                title={props.token.name}
                // height={350}
                width={350}
                className=""
            /> */}
        </div>
    )
}