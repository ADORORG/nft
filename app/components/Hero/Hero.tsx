import HeroText from "./HeroText"
import { MarketListingCard } from "@/components/Card"

export default function HeroSection() {
    const marketOrder = {
        token: {
            tokenId: "1",
            supply: 1,
            imported: false,
            contract: "no-contract",
            name: "NFT Name",
            image: "http://localhost:3000/test-images/image5.png",
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
        endsAt: 1688338800000,
        permitType: "offchain",
        version: 1,
        createdAt: 1635724800000,
        updatedAt: 1635724800000,
    } as const

    return (
        <div className="bg-white dark:bg-gray-950 p-4 lg:p-12">
            <div className="container px-6 py-16 mx-auto">
                <div className="items-center lg:flex justify-around">
                    <HeroText />
                    <div className="origin-top-left lg:rotate-[1deg] flex justify-center">
                        <MarketListingCard marketOrder={marketOrder} />
                    </div>
                </div>
            </div>
        </div>
    )
}