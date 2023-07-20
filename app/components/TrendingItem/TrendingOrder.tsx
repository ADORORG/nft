
"use client"
import { MarketListingCard } from '@/components/Card/'
import Button from "@/components/Button"
import SaleTypeButtons from "@/components/SaleTypeButtons"

export default function TrendingOfferOrFixedOrder() {
  const changeSaleType = (saleType: string) => {
    console.log(saleType)
  }

  const getTestData = (imgNumber: number) => {

    return  {
      token: {
          tokenId: "1",
          supply: 1,
          imported: false,
          contract: "no-contract",
          name: "NFT Name",
          image: `http://localhost:3000/test-images/image${imgNumber}.png`,
          createdAt: 1635724800000,
          updatedAt: 1635724800000,
          owner: {
              address: "0x1234567890123456789012345678901234567890",
              image: "http://localhost:3000/test-images/image2.png",
              createdAt: 1635724800000,
              updatedAt: 1635724800000,
          },
      },
      price: "0.1",
      currency: {
          cid: "ethereum",
          chainId: 1,
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
          address: "0x000000",
          logoURI: "http://localhost:3000/coin/eth.png",
      },
      saleType: "fixed",
      quantity: 1,
      status: "active",
      // endsAt: 1688338800000,
      permitType: "offchain",
      version: 1,
      createdAt: 1635724800000,
      updatedAt: 1635724800000,
    } as const
  }
  return (
    <div className="bg-white dark:bg-gray-950 p-4 lg:p-8">
      <div className="container mx-auto">
        <h1 className="py-16 text-3xl text-center text-gray-800 dark:text-white text-4xl lg:text-6xl">
            Listing & Offers <br/>
            <span className="text-lg text-gray-600 dark:text-gray-400">Top offers and fixed listing</span>
        </h1>

        {/* Category Buttons */}
        <div className="flex justify-center mb-12">
          <SaleTypeButtons 
            onSelected={changeSaleType}
            exclude={["auction"]}
        />
        </div>
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {Array.from(Array(8).keys()).map((index) => (
            <div
              key={index}
              className=""
            >
              <MarketListingCard marketOrder={getTestData(Math.floor((Math.random() * 4) + 1))} />
            </div>
          ))}
        </div>
        
        <div className="text-center pt-12 lg:my-10">
          <Button
            className="py-1 text-2xl lg:text-4xl hover:opacity-80"
            variant="primary"
            rounded
          >Marketplace</Button>
        </div>

      </div>
    </div>
  )
}