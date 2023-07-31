import type MarketOrderType from "@/lib/types/market"
import type NftTokenType from "@/lib/types/token"
import type AccountType from "@/lib/types/account"
import type { CryptocurrencyType } from "@/lib/types/currency"
import { CryptoCurrencyDisplay } from "@/components/Currency"
import Image from "@/components/Image"
import CountdownTimer from "@/components/Countdown"
import UserAccountAvatar from "@/components/UserAccountAvatar"

type MarketListingCardProps = {
    marketOrder: MarketOrderType, 
    size?: "lg" | "md"
}

export default function MarketListingCard({marketOrder, size = "md"}: MarketListingCardProps) {
    const { token, price, endsAt, currency } = marketOrder
    const { name, image = "", owner } = token as NftTokenType

    const sizes: Record<string, any> = {
        // large card
        lg: {
            cardWidth: 48,
            cardHeight: 96,
            imageWidth: 355,
            imageHeight: 485.1,
            currencyWidth: 24,
            currencyHeight: 24,
            avatarWidth: 16,
            avatarHeight: 16,
            textNormal: 'text-3xl',
            textMedium: 'text-2xl',
            textSmall: 'text-lg',
        },
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
        <div className={`w-72 h-96 rounded p-4 bg-gray-200 dark:bg-gray-900 hover:bg-opacity-60 transition flex flex-col justify-between items-center gap-2 shadow-lg`}>
            <div className={`bg-transparent flex justify-center items-center h-2/3 w-5/6`}>
                <Image 
                    className={`h-full`} 
                    src={image}
                    alt=""
                    // width={sizes[size].imageWidth}
                    // height={`${sizes[size].imageHeight}`}
                />
            </div>

            <div className="w-full flex justify-between py-2 lg:py-4">
                <div className={`flex flex-col items-start justify-between ${sizes[size].textNormal}`}>
                    
                    <p className={`text-gray-950 text-opacity-80 dark:text-white ${sizes[size].textNormal} tracking-wide subpixel-antialiased`}>{name}</p>
                    
                    <p className={`text-gray-950 dark:text-white ${sizes[size].textSmall} py-2 text-opacity-40 tracking-wide subpixel-antialiased`}>Current Bid</p>
                   
                    <CryptoCurrencyDisplay
                        currency={currency as CryptocurrencyType}
                        amount={price}
                        width={sizes[size].currencyWidth}
                        height={sizes[size].currencyHeight}
                    />
                </div>
            
                <div className="flex flex-col items-end justify-between">
                    <UserAccountAvatar 
                        account={owner as AccountType}
                        width={sizes[size].avatarWidth}
                        height={sizes[size].avatarHeight}
                    />
                   {
                     endsAt && (
                        <div className="flex flex-col items-end gap-2">
                            <div className={`text-gray-950 dark:text-white ${sizes[size].textSmall} py-3 text-opacity-40 leading-3 tracking-wide subpixel-antialiased`}>Ending In</div>
                            
                            <div className={`text-gray-950 dark:text-white tracking-wide ${sizes[size].textMedium}`}>
                                <CountdownTimer 
                                    targetDate={Number(endsAt)} 
                                />
                            </div>
                        </div>
                     )
                   }
                </div>
            </div>
        </div>
    )
}