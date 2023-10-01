import type { PageProps } from "../types"
import TabNavigation from "@/components/TabNav"
import appRoutes from "@/config/app.route"
import { replaceUrlParams } from "@/utils/main"

export default async function Page({params}: {params: PageProps}) {
    const { accountData, address } = params

    const accountPathname = replaceUrlParams(appRoutes.viewAccount, {
        address
    })

    const statusTabs = [
        {
            label: "Token",
            link: `${accountPathname}/token`,
            active: accountData === "token"
        },
        {
            label: "Collection",
            link: `${accountPathname}/collection`,
            active: accountData === "collection"
        },
        {
            label: "Event",
            link: `${accountPathname}/event`,
            active: accountData === "event"
        },
        {
            label: "Contract",
            link: `${accountPathname}/contract`,
            active: accountData === "contract"
        },
        {
            label: "Marketplace",
            link: `${accountPathname}/marketplace`,
            active: accountData === "marketplace"
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