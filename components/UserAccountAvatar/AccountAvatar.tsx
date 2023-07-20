import type AccountType from "@/lib/types/account"
import Image from "@/components/Image"

interface AccountAvatarProps {
    account: AccountType
}
const UserAccountAvatar: React.FC<AccountAvatarProps> = ({account}) => {
    const { image } = account

    return (
        <Image 
            className="w-10 lg:w-14 rounded-full" 
            src={image} 
            alt=""
            width={500}
            height={500}
        />
    )
}

export default UserAccountAvatar