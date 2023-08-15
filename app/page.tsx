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
  getTrendingMarketOrders,
  getTraderAccountMarketValue,
  getTotalMarketValueInDollar,
} from "@/lib/handlers"

async function getServerSideData() {
  await mongoooseConnectionPromise
  /**
   * fetch market orders
   * @todo - Implement a way of marking order as featured/trending
   */
  const marketOrdersPromise = getTrendingMarketOrders({status: {$ne: "cancelled"}}, 10)

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

/**
 * @todo - Find two orders (fixed|auction) in marketOrders and pass it <HeroSection />
 * @returns 
 */
export default async function LandingPage() {
  const {marketOrders, topTraders, marketValue} = await getServerSideData()

  return (
    <div className="">
      <HeroSection marketOrders={marketOrders} />
      <MarketValueSummary 
        marketValue={
          marketValue && 
          marketValue.length ? 
          marketValue[0]
          : 
          {dollarValue: 0, orderCount:0} 
        }
      />
      <SupportedBlockchainNetwork />
      <TrendingAuction marketOrders={marketOrders}/>
      <TrendingFixedOrder marketOrders={marketOrders} />
      <TopCreator creators={topTraders} />
      <StepsToBeACreator />
      <JoinOurCommunity />
    </div>
  )
}
