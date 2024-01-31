import type { profileData } from "@/components/ProfilePage/types"
import { Check2Circle } from "react-bootstrap-icons"
import TabNavigation from "@/components/TabNav"
import appRoutes from "@/config/app.route"

export default async function Page({params}: {params: {profileData: profileData}}) {
    const { profileData } = params

    const statusTabs = [
        {
            label: "My Profile",
            link: `${appRoutes.setProfile}/view`,
            active: profileData === "view"
        },
        {
            label: "Set Profile", 
            link: `${appRoutes.setProfile}/updateProfile`,
            active: profileData === "updateProfile"
        },
        {
            label: "Set Avatar",
            link: `${appRoutes.setProfile}/updateAvatar`,
            active: profileData === "updateAvatar"
        },
        {
            label: <span className="flex"><span>Verify Email</span> <Check2Circle className="h-3 w-3 text-gray-500" /></span>,
            link: `${appRoutes.setProfile}/verifyEmail`,
            active: profileData === "verifyEmail"
        },
        {
            label: "Notification",
            link: `${appRoutes.setProfile}/notification`,
            active: profileData === "notification"
        },
    ]

 
    return (
        <div className="my-4">
            <TabNavigation
                tabs={statusTabs}
                className="justify-between"
            />
        </div>
    )
}