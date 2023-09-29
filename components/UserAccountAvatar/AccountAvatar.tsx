import type AccountType from "@/lib/types/account"
import Image from "@/components/Image"
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
            address: "0x".padEnd(32, "0")
        }
    }
    const { image = "", profileMedia, profileMediaType, address } = account
    const imgUrl = (profileMedia || image) && `${IPFS_GATEWAY}${profileMedia || image}`

    return (
        <div>
            <MediaPreview
                src={imgUrl || imageData(address, Number(width || height))}
                type={profileMediaType || "image/*"}
                loadingComponent={
                    // Use Temporary Image which uses the address to generate a placeholder
                    <Image 
                        data={account.address} 
                        alt="" 
                        src={profileMedia}
                        width={width}
                        height={height}
                        className="rounded"
                    />
                }
                previewClassName="flex justify-center items-center w-full h-full"
                className={`max-w-[${width}px] max-h-[${height}px] rounded`}
                width={width}
                height={height}
            />
        </div>
    )
}