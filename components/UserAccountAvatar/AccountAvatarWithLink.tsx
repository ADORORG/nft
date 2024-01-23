import type AccountType from "@/lib/types/account"
import Link from "next/link"
import UserAccountAvatar from "./AccountAvatar"
import AccountVerifyBadge from "./VerifyBadge"
import appRoutes from "@/config/app.route"
import { cutAddress } from "@/utils/main";

interface AccountAvatarWithLinkProps {
    account: AccountType,
    width?: number,
    height?: number,
    suffix?: number,
    prefix?: number,
    className?: string,
}

const UserAccountAvatarWithLink: React.FC<AccountAvatarWithLinkProps> = ({account, width = 10, height = 10, suffix, prefix, className}) => {
    const { address } = account

    return (
        <Link 
            href={appRoutes.viewAccount.replace(":address", address)}
            title={address}
            className="flex gap-2 items-center"
        >
            <UserAccountAvatar 
                account={account} 
                width={width}
                height={height}
                className={`rounded border border-gray-100 dark:border-gray-800 ${className}`}
            />
            <span>
                {cutAddress(address, prefix, suffix)}
            </span>
            <AccountVerifyBadge account={account} />
        </Link>
    )
}

export default UserAccountAvatarWithLink