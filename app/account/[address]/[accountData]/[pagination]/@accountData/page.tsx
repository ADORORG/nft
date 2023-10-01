import type { PageProps } from "../types"
import CollectionData from "./collection"
import TokenData from "./token"
import MarketplaceData from "./marketplace"
import SaleEvent from "./event"
import AccountContract from "./contract"


export default async function Page({params}: {params: PageProps}) {

    const accountDataMap = {
        token: <TokenData {...params} />,
        collection: <CollectionData {...params} />,
        marketplace: <MarketplaceData {...params} />,
        event: <SaleEvent {...params} />,
        contract: <AccountContract {...params} />
    }

    return accountDataMap[params.accountData] || null
}