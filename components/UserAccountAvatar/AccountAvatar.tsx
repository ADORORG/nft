import type AccountType from "@/lib/types/account"
import Image from "@/components/Image"

interface AccountAvatarProps {
    account: AccountType,
    width?: number,
    height?: number
}

const UserAccountAvatar: React.FC<AccountAvatarProps> = ({account, width = 10, height = 10}) => {
    if (!account) {
        account = {
            address: "0x0"
        }
    }
    const { image = "" } = account

    return (
        <Image 
            className={`w-${width} rounded`} 
            src={image} 
            alt=""
            width={width}
            height={height}
        />
    )
}

export default UserAccountAvatar