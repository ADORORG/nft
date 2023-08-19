import type { PopulatedMarketOrderType } from "@/lib/types/market"
import type { CryptocurrencyType } from "@/lib/types/currency"
import Link from "next/link"
import { cutString, replaceUrlParams } from "@/utils/main"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import Image from "@/components/Image"
import CountdownTimer from "@/components/Countdown"
import UserAccountAvatar from "@/components/UserAccountAvatar"
import CollectionAvatar from "@/components/CollectionAvatar"
import appRoutes from "@/config/app.route"

type MarketListingCardProps = {
    marketOrder: PopulatedMarketOrderType, 
    size?: "lg" | "md"
}

export default function MarketListingCard({marketOrder, size = "md"}: MarketListingCardProps) {
    const { token, price, endsAt, currency, saleType } = marketOrder

    const sizes: Record<string, any> = {
        // medium card
        md: {
            cardWidth: 40,
            cardHeight: 80,
            imageWidth: 236.6,
            imageHeight: 323.4,
            currencyWidth: 10,
            currencyHeight: 10,
            avatarWidth: 10,
            avatarHeight: 10,
            textNormal: 'text-lg',
            textMedium: 'text-md',
            textSmall: 'text-sm',
        },
    }

    /**
     * @todo Fix card sizes base on size (lg | md) passed as prop
     */
    return (
        <div className={`w-72 h-96 rounded p-4 bg-gray-200 dark:bg-gray-900 hover:bg-opacity-60 transition flex flex-col justify-between items-center gap-2 drop-shadow-xl`}>
            <div className={`bg-transparent flex justify-center items-center h-2/3`}>
                <Image 
                   className={`h-full w-auto`} 
                   src={token.image}
                   alt=""
                   data={`${token.contract.contractAddress}${token.tokenId}`}
                   width={400}
                   // height={`${sizes[size].imageHeight}`}
                />
            </div>

            <div className="w-full flex justify-between py-2 lg:py-4">
                <div className={`flex flex-col items-start justify-between text-gray-950 dark:text-white ${sizes[size].textNormal}`}>
                    
                    <p className={`text-gray-950 dark:text-white ${sizes[size].textNormal} tracking-wide subpixel-antialiased`}>
                        <Link
                            href={
                                replaceUrlParams(appRoutes.viewToken, {
                                    tokenId: token.tokenId.toString(),
                                    contractAddress: token.contract.contractAddress,
                                    chainId: token.contract.chainId.toString()
                                })
                            }
                        >
                            {cutString(token.name, 10)} #{token.tokenId}
                        </Link>
                    </p>
                    
                    <p className={`text-gray-950 dark:text-white ${sizes[size].textSmall} py-2 text-opacity-40 tracking-wide subpixel-antialiased`}>
                        {saleType === "auction" ?  "Current Bid" : "Price"}
                    </p>
                   
                    <CryptoCurrencyDisplay
                        currency={currency as CryptocurrencyType}
                        amount={price}
                        width={sizes[size].currencyWidth}
                        height={sizes[size].currencyHeight}
                    />
                </div>
            
                <div className="flex flex-col items-end justify-between">
                    <div className="flex flex-row items-center gap-3">
                        <UserAccountAvatar 
                            account={token.owner}
                            width={24}
                            height={24}
                            title={`Owner: ${token.owner.address}`}
                        />
                        <CollectionAvatar
                            xcollection={token.xcollection}
                            width={28}
                            height={28}
                            title={`Collection: ${token.xcollection.name}`}
                        />
                    </div>
                    
                   {
                     saleType === "auction" ? (
                        <div className="flex flex-col items-end gap-2">
                            <div className={`text-gray-950 dark:text-white ${sizes[size].textSmall} py-3 text-opacity-40 leading-3 tracking-wide subpixel-antialiased`}>Ending In</div>
                            
                            <div className={`text-gray-950 dark:text-white tracking-wide ${sizes[size].textMedium}`}>
                                <CountdownTimer 
                                    targetDate={Number(endsAt)} 
                                />
                            </div>
                        </div>
                     ): null
                   }
                </div>
            </div>
        </div>
    )
}