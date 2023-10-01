import type { PageProps } from "../types"
import CollectionData from "./collection"
import TokenData from "./token"
import MarketplaceData from "./marketplace"
import SaleEvent from "./event"

export default async function Page({params}: {params: PageProps}) {

    if (params.accountData === "token") {
        return <TokenData {...params} />
    }

    if (params.accountData === "collection") {
        return <CollectionData {...params} />
    }

    if (params.accountData === "marketplace") {
        return <MarketplaceData {...params} />
    }

    if (params.accountData === "event") {
        return <SaleEvent {...params} />
    }
}