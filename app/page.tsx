import HeroSection from "../components/LandingPage/Hero/Hero"
import MarketValueSummary from "../components/LandingPage/MarketValue"
import SupportedBlockchainNetwork from "../components/LandingPage/SupportedNetwork"
import TopCreator from "../components/LandingPage/TopCreator"
import StepsToBeACreator from "../components/LandingPage/StepToCreate"
import JoinOurCommunity from "../components/LandingPage/JoinCommunity"
import { TrendingAuction, TrendingFixedOrder } from "../components/LandingPage/TrendingItem"
import { getSettledPromiseValue } from "@/utils/main"
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

  return {
    marketOrders: getSettledPromiseValue(marketOrders, []),
    topTraders: getSettledPromiseValue(topTraders, []),
    marketValue: getSettledPromiseValue(marketValue, [])
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
