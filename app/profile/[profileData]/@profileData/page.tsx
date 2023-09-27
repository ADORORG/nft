import type { profileData } from "@/components/ProfilePage/types"
import ProfilePage from "@/components/ProfilePage"

export default async function Page({params}: {params: {profileData: profileData}}) {
    return <ProfilePage profileData={params.profileData} />
}