import MarketFilterForm from "@/components/MarketplaceItems/FilterForm"
// Server
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import { getTotalMarketValueInDollar } from "@/lib/handlers"

async function getServerSideData() {
    await mongoooseConnectionPromise
    // Fetch market value and order count
    return getTotalMarketValueInDollar({})
}

export default async function Page() {
    const marketValuePromise = await getServerSideData()

    return (
        <MarketFilterForm
            marketValue={marketValuePromise[0]}
        />
    )
}