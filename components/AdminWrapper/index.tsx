"use client"
/**
 * Temporary hack to enable some administrative actions
 * @todo - 
 */

import { useAuthStatus } from "@/hooks/account"
import AdminPanel from "./components/AdminPanel"

export default function AdminWrapper({ children }: {children: React.ReactNode}) {
    const { session } = useAuthStatus()

    return (
        <div>
            {children}
            {
                session 
                && session.user
                && session.user.roles 
                && session.user.roles.includes("admin")
                ?
                <AdminPanel />
                :
                null
            }
        </div>
    )
}