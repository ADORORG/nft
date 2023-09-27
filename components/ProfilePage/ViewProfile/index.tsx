"use client"
import { useAuthStatus } from "@/hooks/account"
import AccountAvatar from "@/components/UserAccountAvatar"

export default function ViewProfile() {
    const { session } = useAuthStatus()
    const {
        address,
        name,
        email,
        twitter,
        discord
    } = session?.user || {}
 
    const fieldClassName = "flex flex-row justify-between items-start pb-2 my-3 border-b border-gray-300 dark:border-gray-700"
    const notSet = "Not Set"

    return (
        <div>
            <div className="my-3">
                <AccountAvatar
                    account={session?.user}
                    width={160}
                    height={160}
                    className="rounded"
                />
            </div>
            
            <p className={fieldClassName}>
                <span>Address</span>
                <span className="break-all text-sm select-all">{address || notSet}</span>
            </p>
            <p className={fieldClassName}>
                <span>Name</span>
                <span>{name || notSet}</span>
            </p>
            <p className={fieldClassName}>
                <span>Email</span>
                <span>{email || notSet}</span>
            </p>
            <p className={fieldClassName}>
                <span>Twitter</span>
                <span>{twitter || notSet}</span>
            </p>
            <p className={fieldClassName}>
                <span>Discord</span>
                <span>{discord || notSet}</span>
            </p>
        </div>
    )
}

