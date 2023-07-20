
"use client"
import { CreatorCard } from '@/components/Card/'

export default function TrendingOfferOrFixedOrder() {
 
  const getTestData = (imgNumber: number) => {

    return  {
        owner: {
            address: "0x1234567890123456789012345678901234567890",
            image: `http://localhost:3000/test-images/image${imgNumber%4}.png`,
            name: "Test Account",
            value: Math.floor(imgNumber * 2.4),
        },
        currency: {
            cid: "ethereum",
            chainId: 1,
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
            address: "0x000000",
            logoURI: "http://localhost:3000/coin/eth.png",
        },
    } as const
  }

  const testData = Array.from(Array(6).keys()).map((index) => getTestData(Math.floor((Math.random() * index) + 1)))

  return (
    <div className="bg-white dark:bg-gray-950 p-4 lg:p-8">
      <div className="container mx-auto">
        <h1 className="py-16 text-3xl text-center text-gray-800 dark:text-white text-4xl lg:text-6xl">
            NFT Creators <br/>
            <span className="text-lg text-gray-600 dark:text-gray-400">Some creators making a difference</span>
        </h1>

        <div className="flex flex-wrap justify-center gap-4">
          {testData.map((data, index) => (
            <div
              key={index}
              className=""
            >
              <CreatorCard 
                creatorAccount={data.owner} 
                currency={data.currency}
            />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}