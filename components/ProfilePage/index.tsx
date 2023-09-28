"use client"
import type { profileData } from "./types"
import { useAuthStatus } from "@/hooks/account"
import { ConnectWalletButton } from "@/components/ConnectWallet"
import LoadingSpinner from "@/components/LoadingSpinner"
import UpdateAvatar from "./UpdateAvatar"
import UpdateProfile from "./UpdateProfile"
import ViewProfile from "./ViewProfile"
import VerifyEmail from "./VerifyEmail"

export default function ProfilePage(props: {profileData: profileData}) {
    const { isConnected, session } = useAuthStatus()

    if (!isConnected) {
        return (
            <div className="flex justify-center my-8">
                <ConnectWalletButton />
            </div>
        )
    }

    if (!session?.user) {
        return (
            <div className="my-8">
                <LoadingSpinner />
            </div>
        )
    }

    if (props.profileData === "view") {
        return <ViewProfile />
    }

    if (props.profileData === "updateProfile") {
        return <UpdateProfile />
    }

    if (props.profileData === "updateAvatar") {
        return <UpdateAvatar />
    }

    if (props.profileData === "verifyEmail") {
        return <VerifyEmail />
    }
}