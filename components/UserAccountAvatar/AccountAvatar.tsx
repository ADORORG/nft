import type AccountType from "@/lib/types/account"
import Image from "@/components/Image"

interface AccountAvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    account?: AccountType,
    alt?: string
}

export default function AccountAvatar(props: AccountAvatarProps) {
    let { account, className, alt = "", ...otherProps } = props

    if (!account) {
        account = {
            address: "0x0"
        }
    }
    const { image = "", address } = account

    return (
        <Image 
            data={address}
            className={`rounded ${className}`} 
            src={image}
            alt={alt}
            {...otherProps}
        />
    )
}