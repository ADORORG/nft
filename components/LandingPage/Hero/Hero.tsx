import HeroText from "./HeroText"
import { MarketListingCard } from "@/components/Card"
import type MarketOrderType from "@/lib/types/market"

type HeroSectionProps = {
    marketOrders: MarketOrderType[]
}

export default function HeroSection({marketOrders}: HeroSectionProps) {

    return (
        <div className="bg-white dark:bg-gray-950 p-4 lg:p-12">
            <div className="container px-6 py-16 mx-auto">
                <div className="items-center lg:flex justify-around">

                    <HeroText />

                    <div className="flex flex-col md:flex-row justify-center gap-6 py-3 ">
                        <div className="origin-bottom-right md:rotate-[350deg] flex justify-center hover:z-10">
                            {
                                marketOrders && 
                                marketOrders[0] ?
                                <MarketListingCard marketOrder={marketOrders[0]} size="md" />
                                :
                                null
                            }
                            
                        </div>
                        <div className="origin-top-left md:rotate-[10deg] flex justify-center hover:z-10">
                            {
                                marketOrders && 
                                marketOrders[1] ?
                                <MarketListingCard marketOrder={marketOrders[1]} size="md" />
                                :
                                null
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}