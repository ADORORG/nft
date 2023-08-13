import type AccountType from "@/lib/types/account"
import Link from "next/link"
import UserAccountAvatar from "./AccountAvatar"
import appRoutes from "@/config/app.route"
import { cutAddress } from "@/utils/main";

interface AccountAvatarWithLinkProps {
    account: AccountType,
    width?: number,
    height?: number,
    suffix?: number,
    prefix?: number
}

const UserAccountAvatarWithLink: React.FC<AccountAvatarWithLinkProps> = ({account, width = 10, height = 10, suffix, prefix}) => {
    const { address } = account

    return (
        <Link 
            href={appRoutes.viewAccount.replace(":address", address)}
            title={address}
            className="flex gap-1 items-center"
        >
            <UserAccountAvatar 
                account={account} 
                width={width}
                height={height}
                className="h-6 w-6 rounded border border-gray-100 dark:border-gray-800"
            />
            &nbsp;
            {cutAddress(address, prefix, suffix)}
        </Link>
    )
}

export default UserAccountAvatarWithLink