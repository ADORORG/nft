"use client"
import { CreatorCard } from '@/components/Card/'
import type { TopTraderAccountType } from '@/lib/types/common'
import { FiatCurrencyDisplay } from "@/components/Currency"

type TopCreatorProps = {
  creators: TopTraderAccountType[]
}

export default function TopCreator({creators}: TopCreatorProps) {
 
  return (
    <div className="bg-white dark:bg-gray-950 p-4 lg:p-8">
      <div className="container mx-auto">
        <h1 className="py-16 text-2xl text-center text-gray-800 dark:text-white">
            NFT Creators <br/>
            <span className="text-lg text-gray-600 dark:text-gray-400">Some creators making a difference</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-4">
          {creators.map((creator, index) => (
            <div
              key={index}
              className=""
            >
              <CreatorCard 
                creatorAccount={creator.owner} 
                currencyNode={<FiatCurrencyDisplay amount={creator.dollarValue} />}
            />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}