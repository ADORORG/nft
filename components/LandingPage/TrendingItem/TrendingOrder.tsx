
"use client"
import { MarketListingCard } from '@/components/Card/'
import Button from "@/components/Button"
import Link from "next/link"
import appRoutes from "@/config/app.route"
// import SaleTypeButtons from "@/components/SaleTypeButtons"
import type { default as MarketOrderType, PopulatedMarketOrderType} from "@/lib/types/market"

type TrendingOfferOrFixedOrderProps = {
  marketOrders: MarketOrderType[]
}

export default function TrendingOfferOrFixedOrder({marketOrders}: TrendingOfferOrFixedOrderProps) {
  const offerOrFixedOrder = marketOrders.filter((m => m.saleType !== "auction")) as PopulatedMarketOrderType[]

  /* const changeSaleType = (saleType: string) => {
    console.log(saleType)
  } */

  return (
    <div className="bg-white dark:bg-gray-950 p-4 lg:p-8">
      <div className="container mx-auto">
        <h1 className="py-16 text-3xl text-center text-gray-800 dark:text-white text-4xl lg:text-6xl">
            Listing & Offers <br/>
            <span className="text-lg text-gray-600 dark:text-gray-400">Top offers and fixed listing</span>
        </h1>

        {/* Category Buttons */}
        {/* <div className="flex justify-center mb-12">
          <SaleTypeButtons 
            onSelected={changeSaleType}
            exclude={["auction"]}
        />
        </div> */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {
          offerOrFixedOrder
          .map((order, index) => (
            <div
              key={index}
              className=""
            >
              <MarketListingCard marketOrder={order} />
            </div>
          ))}
        </div>
        
        <div className="text-center pt-12 lg:my-10">
          <Link href={appRoutes.marketplace}>
            <Button
              className="py-2 px-4 text-xl"
              variant="gradient"
              rounded
            >Visit Marketplace</Button>
          </Link>
        </div>

      </div>
    </div>
  )
}