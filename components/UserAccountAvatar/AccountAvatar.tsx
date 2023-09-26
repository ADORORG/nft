import type AccountType from "@/lib/types/account"
// import Image from "@/components/Image"
import MediaPreview from "@/components/MediaPreview"
import { MediaSkeleton } from "@/components/Skeleton"
import imageData from "@/utils/icon"
import { IPFS_GATEWAY } from "@/lib/app.config"

interface AccountAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    account?: AccountType,
    alt?: string
}

export default function AccountAvatar(props: AccountAvatarProps) {
    let { account, width, height } = props

    if (!account) {
        account = {
            address: "0x0"
        }
    }
    const { image = "", profileMedia, profileMediaType, address } = account
    const imgUrl = (profileMedia || image) && `${IPFS_GATEWAY}${profileMedia || image}`

    return (
        <MediaPreview
            src={imgUrl || imageData(address, Number(width || height))}
            type={profileMediaType || "image/*"}
            loadingComponent={<MediaSkeleton className="w-full h-full" />}
            previewClassName="flex justify-center items-center w-full h-full"
            className={`max-w-[${width}px] max-h-[${height}px] rounded`}
            width={width}
            height={height}
        />
    )
}