"use client"
import type { PopulatedMarketOrderType } from '@/lib/types/market'
import React, { useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import MarketCard from '@/components/Card/MarketListingCard'
import Button from "@/components/Button"
import CategoryButtons from "@/components/CategoryButtons"

const CardList = () => {
  const cardListRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (cardListRef.current) {
      cardListRef.current.scrollTo({
        left: cardListRef.current.scrollLeft - 200,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (cardListRef.current) {
      cardListRef.current.scrollTo({
        left: cardListRef.current.scrollLeft + 200,
        behavior: 'smooth',
      });
    }
  };

  const changeCategory = (categorySlug: string) => {
    console.log(categorySlug)
  }

  const getTestData = (imgNumber: number) => {

    return  {
      token: {
          tokenId: 1,
          supply: 1,
          contract: {
            label: "some contract",
            contractAddress: "0x",
            chainId: 5,
            nftSchema: "erc721",
            royalty: 10,
            version: "1"
          },
          name: "NFT Name",
          image: `http://localhost:3000/test-images/image${imgNumber}.png`,
          createdAt: new Date(),
          updatedAt: new Date(),
          owner: {
              address: "0x1234567890123456789012345678901234567890",
              image: "http://localhost:3000/test-images/image2.png",
              createdAt: new Date(),
              updatedAt: new Date(),
          },
          xcollection: {
            name: "my collection",
            slug: "mycollection",
            owner: "0x1234567890123456789012345678901234567890",
            image: "hash",
            banner: "hash",
            description: "",
            tags: "",
            category: "print"
          }
      },
      seller: {
        address: "0x1234567890123456789012345678901234567890",
        image: "http://localhost:3000/test-images/image2.png",
        createdAt: new Date(),
        updatedAt: new Date(),
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
      endsAt: new Date(),
      permitType: "offchain",
      version: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    } satisfies PopulatedMarketOrderType
  }

  return (
    <div className="bg-white dark:bg-gray-950 p-4 lg:p-8">
      <div className="container mx-auto py-16">
        <h1 className="py-16 text-3xl text-center text-gray-800 dark:text-white lg:text-4xl">
            Marketplace <br/>
            <span className="text-lg text-gray-600 dark:text-gray-400">Some amazing creation</span>
        </h1>

        {/* Category Buttons */}
        <div className="flex justify-center mb-12">
          <CategoryButtons onSelected={changeCategory} />
        </div>

        <div className="relative w-full">
          <div ref={cardListRef} className="md:mx-12 flex overflow-x-hidden scrollbar-hide space-x-4">
            {Array.from(Array(8).keys()).map((index) => (
              <div
                key={index}
                className=""
              >
                <MarketCard marketOrder={getTestData(Math.floor((Math.random() * 4) + 1))} />
              </div>
            ))}
          </div>

          {/* Scroll Buttons */}
          <Button
            className="px-1 py-1 absolute top-1/2 left-0 transform -translate-y-1/2 hover:opacity-70 transition shadow-md"
            variant="secondary"
            onClick={scrollLeft}
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </Button>
          <Button
            className="px-1 py-1 absolute top-1/2 right-0 transform -translate-y-1/2 hover:opacity-70 transition shadow-md"
            variant="secondary"
            onClick={scrollRight}
          >
            <ChevronRightIcon className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardList;
