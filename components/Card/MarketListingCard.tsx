import type { PopulatedMarketOrderType } from "@/lib/types/market"
import type { CryptocurrencyType } from "@/lib/types/currency"
import Link from "next/link"
import { cutString, replaceUrlParams } from "@/utils/main"
import { CryptoCurrencyDisplay, CryptoToFiat } from "@/components/Currency"
import { MediaSkeleton } from "@/components/Skeleton"
import CountdownTimer from "@/components/Countdown"
import UserAccountAvatar from "@/components/UserAccountAvatar"
import CollectionAvatar from "@/components/CollectionAvatar"
import MediaPreview from "@/components/MediaPreview"
import appRoutes from "@/config/app.route"
import { IPFS_GATEWAY } from "@/lib/app.config"

type MarketListingCardProps = {
    marketOrder: PopulatedMarketOrderType, 
    size?: "lg" | "md"
}

export default function MarketListingCard({marketOrder, size = "md"}: MarketListingCardProps) {
    const { token, price, endsAt, currency, saleType } = marketOrder
    const { image, media, mediaType } = token

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
        <div className={`w-72 h-96 rounded p-3 bg-gray-100 dark:bg-gray-900 hover:opacity-80 transition flex flex-col justify-between gap-2 drop-shadow-xl`}>
            <div className={`bg-transparent flex justify-center items-center h-64`}>
                <MediaPreview
                    src={`${IPFS_GATEWAY}${media || image}`}
                    type={mediaType || "image/*"}
                    loadingComponent={<MediaSkeleton className="w-72 h-64" />}
                    previewClassName="flex justify-center items-center w-full h-full"
                    className="max-w-72 max-h-64"
                />
                {/* <Image 
                   className={`h-full w-auto`} 
                   src={token.image}
                   alt=""
                   data={`${token.contract.contractAddress}${token.tokenId}`}
                   width={400}
                   // height={`${sizes[size].imageHeight}`}
                /> */}
            </div>
            
            <div className="h-32 flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                    {/* Token Name */}
                    <p className={`${sizes[size].textNormal} tracking-wide subpixel-antialiased`}>
                        <Link
                            href={
                                replaceUrlParams(appRoutes.viewToken, {
                                    tokenId: token?.tokenId?.toString() || "",
                                    contractAddress: token.contract.contractAddress,
                                    chainId: token.contract.chainId.toString()
                                })
                            }
                        >
                            {cutString(token.name, 10)}#{token.tokenId}
                        </Link>
                    </p>
                    
                    {/* Token Owner and Collection avatar */}
                    <div className="flex flex-row items-center gap-2">
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
                </div>

                {/* Current bid or price and Ending time text */}
                <div className="flex flex-row justify-between items-center">
                    <p className={`${sizes[size].textSmall} opacity-60 tracking-wide subpixel-antialiased`}>
                        {saleType === "auction" ?  "Current Bid" : "Price"}
                    </p>

                    {
                        saleType === "auction" && 
                        <p className={`${sizes[size].textSmall} opacity-60 tracking-wide subpixel-antialiased`}>Ending In</p>
                    }

                </div>

                {/* Price and Countdown */}
                <div className="flex flex-row justify-between items-center">
                    <CryptoCurrencyDisplay
                        currency={currency as CryptocurrencyType}
                        amount={price}
                        width={sizes[size].currencyWidth}
                        height={sizes[size].currencyHeight}
                    />
                    {
                        
                        saleType === "auction" ? (
                            // Display auction coundown
                            <div className="flex gap-1">
                                <CountdownTimer 
                                    targetDate={Number(endsAt)} 
                                />
                            </div>
                        ):
                        // Display crypto to fiat conversion
                        <CryptoToFiat 
                            amount={price}
                            currency={currency}
                        />
                    }
                </div>
            </div>
        </div>
    )
}