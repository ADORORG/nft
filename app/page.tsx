import HeroSection from "./components/Hero/Hero"
import MarketValueSummary from "./components/MarketValue"
import SupportedBlockchainNetwork from "./components/SupportedNetwork"
import TopCreator from "./components/TopCreator"
import StepsToBeACreator from "./components/StepToCreate"
import JoinOurCommunity from "./components/JoinCommunity"
import { TrendingAuction, TrendingFixedOrder } from "./components/TrendingItem"
// server side
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import { 
  getMarketOrdersByQuery,
  getTraderAccountMarketValue,
  getTotalMarketValueInDollar,
} from "@/lib/handlers"

async function getServerSideData() {
  await mongoooseConnectionPromise
  // fetch market orders
  const marketOrdersPromise = getMarketOrdersByQuery({
    status: {$ne: "cancelled"},
    $or: [
      {saleType: "auction"},
      {saleType: "fixed"}
    ]
  }, {
    limit: 22 
  })

  // fetch top traders
  const topTradersPromise = getTraderAccountMarketValue({}, 8)
  // fetch market value and order count
  const marketValuePromise = getTotalMarketValueInDollar({})

  const [marketOrders, topTraders, marketValue] = await Promise.allSettled([marketOrdersPromise, topTradersPromise, marketValuePromise])

  const getPromiseValue = (settledPromised: any, altValue = []) => settledPromised.status === "fulfilled" ? settledPromised.value : altValue

  return {
    marketOrders: getPromiseValue(marketOrders),
    topTraders: getPromiseValue(topTraders),
    marketValue: getPromiseValue(marketValue)
  }
}


export default async function LandingPage() {
  const {marketOrders, topTraders, marketValue} = await getServerSideData()
  return (
    <div className="">
      <HeroSection marketOrders={marketOrders} />
      <MarketValueSummary marketValue={marketValue[0]} />
      <SupportedBlockchainNetwork />
      <TrendingAuction marketOrders={marketOrders}/>
      <TrendingFixedOrder marketOrders={marketOrders} />
      <TopCreator creators={topTraders} />
      <StepsToBeACreator />
      <JoinOurCommunity />
    </div>
  )
}
