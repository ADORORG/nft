"use client"
import type AccountType from "@/lib/types/account"
import { PatchCheckFill } from "react-bootstrap-icons"

export default function AccountVerifyBadge({account}: {account: AccountType | undefined}) {

    if (account?.verified) {
        return (
            <PatchCheckFill className="text-tertiary-600 dark:text-tertiary-500" />
        )
    }
    
    return null
}