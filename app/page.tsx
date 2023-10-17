import type { PopulatedNftContractEventType } from "@/lib/types/event"
import HeroSection from "../components/LandingPage/Hero/Hero"
import MarketValueSummary from "../components/LandingPage/MarketValue"
import SupportedBlockchainNetwork from "../components/LandingPage/SupportedNetwork"
import TopCreator from "../components/LandingPage/TopCreator"
import StepsToBeACreator from "../components/LandingPage/StepToCreate"
import JoinOurCommunity from "../components/LandingPage/JoinCommunity"
import FeaturedEvents from "../components/LandingPage/FeaturedEvents"
import { TrendingAuction, TrendingFixedOrder } from "../components/LandingPage/TrendingItem"
import { getSettledPromiseValue } from "@/utils/main"
// server side
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import { 
  getTrendingMarketOrders,
  getTopTradersAccountMarketValue,
  getTotalMarketValueInDollar,
  getEventsByQuery
} from "@/lib/handlers"

async function getServerSideData() {
  await mongoooseConnectionPromise
  /**
   * fetch market orders
   * @todo - Implement a way to mark/determine an order as featured/trending
   */
  const marketOrdersPromise = getTrendingMarketOrders({status: "active"}, 10)
  const saleEventsPromise = getEventsByQuery({
    start: {$lte: Date.now()},
    end: {$gte: Date.now()},
    draft: false,
  }, {limit: 8}) as Promise<PopulatedNftContractEventType[]>
  // fetch top traders
  const topTradersPromise = getTopTradersAccountMarketValue({}, 8)
  // fetch market value and order count
  const marketValuePromise = getTotalMarketValueInDollar({})

  const [marketOrders, topTraders, marketValue, saleEvents] = await Promise.allSettled([marketOrdersPromise, topTradersPromise, marketValuePromise, saleEventsPromise])

  return {
    marketOrders: getSettledPromiseValue(marketOrders, []),
    topTraders: getSettledPromiseValue(topTraders, []),
    marketValue: getSettledPromiseValue(marketValue, []),
    saleEvents: getSettledPromiseValue(saleEvents, []),
  }
}

/**
 * @todo - Find two orders (fixed|auction) in marketOrders and pass it <HeroSection />
 * @returns 
 */
export default async function LandingPage() {
  const {marketOrders, topTraders, marketValue, saleEvents} = await getServerSideData()
  return (
    <div className="">
      <HeroSection marketOrders={marketOrders} />
      <FeaturedEvents events={saleEvents} />
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
