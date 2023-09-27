import type { profileData } from "../types"
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
        }
    ]

 
    return (
        <div className="my-4">
            <TabNavigation
                tabs={statusTabs}
            />
        </div>
    )
}