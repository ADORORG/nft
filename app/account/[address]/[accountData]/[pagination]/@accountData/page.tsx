/**
 * These pages have rewrite rule, configured in next.config.js
 */

import type { PageProps } from "../types"
import CollectionData from "./collection"
import TokenData from "./token"
import OfferReceived from "./offerReceived"
import OfferSent from "./offerSent"
import SaleEvent from "./event"
import AccountContract from "./contract"


export default async function Page({params}: {params: PageProps}) {

    const accountDataMap = {
        token: <TokenData {...params} />,
        collection: <CollectionData {...params} />,
        event: <SaleEvent {...params} />,
        contract: <AccountContract {...params} />,
        offer_received: <OfferReceived {...params} />,
        offer_sent: <OfferSent {...params} />,
    }

    return accountDataMap[params.accountData] || null
}