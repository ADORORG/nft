import type AccountType from "@/lib/types/account"
import Link from "next/link"
import UserAccountAvatar from "./AccountAvatar"
import { cutAddress } from '@/utils/main';

interface AccountAvatarWithLinkProps {
    account: AccountType
}

const UserAccountAvatarWithLink: React.FC<AccountAvatarWithLinkProps> = ({account}) => {
    const { address } = account

    return (
        <Link 
            href={`/account/${address}`}
            title={address}
        >
            <UserAccountAvatar account={account} />
            &nbsp;
            {cutAddress(address)}
        </Link>
    )
}

export default UserAccountAvatarWithLink