"use client"
import { MarketListingCard } from "@/components/Card"
import Button from "@/components/Button"
import type { default as MarketOrderType, PopulatedMarketOrderType} from "@/lib/types/market"
import Link from "next/link"
import appRoutes from "@/config/app.route"

type TrendingAuctionProps = {
  marketOrders: MarketOrderType[]
}

export default function TrendingAuction({marketOrders}: TrendingAuctionProps) {
  const auctions = marketOrders.filter((m => m.saleType === "auction")) as PopulatedMarketOrderType[]
  return (
    <div className="bg-white dark:bg-gray-950 p-4 lg:p-8">
      <div className="container mx-auto pt-16 pb-4">
        <h1 className="py-16 text-2xl text-center text-gray-800 dark:text-white">
            Marketplace <br/>
            <span className="text-lg text-gray-600 dark:text-gray-400">Some auctions from the marketplace</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {
          auctions
          .map((marketAuction, index) => (
            <div
              key={index}
              className=""
            >
              <MarketListingCard marketOrder={marketAuction} />
            </div>
          ))}
        </div>
        
        <div className="text-center pt-12 lg:my-10">
          <Link href={appRoutes.marketplace}>
            <Button
              className="py-2 px-3 text-xl"
              variant="gradient"
              rounded
            >See more...</Button>
          </Link>
        </div>

      </div>
    </div>
  )
}