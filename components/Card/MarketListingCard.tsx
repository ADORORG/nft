import type MarketOrderType from "@/lib/types/market"
import type NftTokenType from "@/lib/types/token"
import type AccountType from "@/lib/types/account"
import type { CryptocurrencyType } from "@/lib/types/currency"
import Image from "@/components/Image"
import CurrencyDisplay from "@/components/Currency"
import CountdownTimer from "@/components/Countdown"
import UserAccountAvatar from "@/components/UserAccountAvatar"

export default function MarketListingCard({marketOrder}: {marketOrder: MarketOrderType}) {
    const { token, price, endsAt, currency } = marketOrder
    const { name, image, owner } = token as NftTokenType

    return (
        <div className="w-[270px] h-[369px] lg:w-[405px] lg:h-[553.5px] rounded p-5 bg-gray-200 dark:bg-gray-900 hover:bg-opacity-60 transition flex flex-col justify-start items-center gap-2 shadow-lg">
            <div className="bg-white justify-center items-center inline-flex">
                <Image 
                    className="w-[250px] lg:w-[355px]" 
                    src={image}
                    alt=""
                    width={380}
                    height={380}
                />
            </div>

            <div className="w-full flex justify-between py-2 lg:py-4">
                <div className="flex flex-col items-start">
                    <p className="text-gray-950 text-opacity-80 dark:text-white text-lg lg:text-4xl tracking-wide subpixel-antialiased">{name}</p>
                    <p className="text-gray-950 dark:text-white text-xs lg:text-xl py-2 lg:py-3 text-opacity-40 tracking-wide subpixel-antialiased">Current Bid</p>
                    <CurrencyDisplay
                        currency={currency as CryptocurrencyType}
                        amount={price}
                    />
                </div>
            
                <div className="flex flex-col items-end">
                    <UserAccountAvatar account={owner as AccountType} />
                   {
                     endsAt && (
                        <div className="flex flex-col items-end gap-2">
                            <div className="text-gray-950 dark:text-white text-xs lg:text-xl py-2 lg:py-3 pt-2 pb-1 text-opacity-40 leading-3 tracking-wide subpixel-antialiased">Ending In</div>
                            
                            <div className="text-gray-950 dark:text-white lg:text-xl leading-3 tracking-wide">
                                <CountdownTimer targetDate={Number(endsAt)} />
                            </div>
                        </div>
                     )
                   }
                </div>
            </div>
        </div>
    )
}