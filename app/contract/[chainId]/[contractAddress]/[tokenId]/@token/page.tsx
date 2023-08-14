import SingleTokenPage from "@/components/TokenPage"
import MarketOrderPage from "@/components/MarketOrderPage"

/**
 * @todo Use parallel routing for token and marketOrder sections 
 */

// Server
import mongoooseConnectionPromise from "@/wrapper/mongoose_connect"
import { getContractsByQuery, getTokenByQuery, getMarketOrdersByQuery } from "@/lib/handlers"

interface PageProps {
    chainId: string,
    contractAddress: string,
    tokenId: string
}

async function getServerSideData(params: PageProps) {
    const {chainId, contractAddress, tokenId} = params
    await mongoooseConnectionPromise
    const contracts = await getContractsByQuery({
        contractAddress,
        chainId
    }, {limit: 1})

    const token = await getTokenByQuery({
        contract: contracts[0]?._id,
        tokenId
    })

    const marketOrders = await getMarketOrdersByQuery({token: token?._id}, {})
    // console.log("token", token)
    // console.log("marketOrders", marketOrders)
    return {
        token,
        marketOrders
    }
}

export default async function Page({params}: {params: PageProps}) {
    const {
        token, // token
        marketOrders // market orders for this token
    } = await getServerSideData(params)
    
    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-center items-center lg:items-stretch h-max">
            <div className="border-2 border-gray-100 dark:border-gray-800 rounded px-4 shadow-xl">
                <SingleTokenPage token={token as any} />
            </div>
            <div className="border border-gray-50 dark:border-gray-900 rounded px-6 shadow-2xl">
                <MarketOrderPage orders={marketOrders as any} token={token as any} />
            </div>
        </div>
    )
}