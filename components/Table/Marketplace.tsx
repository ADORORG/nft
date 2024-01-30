"use client"
import type { PopulatedMarketOrderType } from "@/lib/types/market"
import type { CryptocurrencyType } from "@/lib/types/currency"
import Link from "next/link"
import appRoutes from "@/config/app.route"
import { usePathname } from "next/navigation"
import { cutString, replaceUrlParams, cutAddress,  } from "@/utils/main"
import { dateToRelativeDayAndHour } from "@/utils/date"
import { CryptoCurrencyDisplay, CryptoToFiat } from "@/components/Currency"

type MarketListingCardProps = {
    marketOrder: PopulatedMarketOrderType[], 
}

export default function MarketplaceTable({marketOrder}: MarketListingCardProps) {
    const pathname = usePathname()

    return (
        <div className="relative overflow-x-auto shadow-md rounded">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Token
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Buyer
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Seller
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        marketOrder.map((order) => {
                            const createdTime = dateToRelativeDayAndHour(order.createdAt)
                            return (
                                <tr 
                                    key={order._id?.toString()}
                                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                                >
                                    <th scope="row" className="px-6 py-4 font-medium text-tertiary-700 dark:text-tertiary-400 whitespace-nowrap">
                                        <Link
                                            href={replaceUrlParams(appRoutes.viewToken, {
                                                chainId: order.token.contract.chainId.toString() as string,
                                                contractAddress: order.token.contract.contractAddress as string,
                                                tokenId: order.token.tokenId?.toString() as string,
                                            })}
                                        >
                                            {cutString(order.token.name, 12)}_{order.token.tokenId}
                                        </Link>
                                    </th>
                                    <td className="px-6 py-4">
                                        {
                                            pathname.toLowerCase().includes(order.buyer?.address?.toLowerCase() as string) ?
                                            <span>{cutAddress(order.buyer?.address, 4, 3)}</span>
                                            :
                                            <Link
                                                href={replaceUrlParams(appRoutes.viewAccount, {
                                                    address: order.buyer?.address as string
                                                })}
                                                className="text-tertiary-600"
                                            >
                                                {cutAddress(order.buyer?.address, 4, 3)}
                                            </Link>
                                        }
                                        
                                    </td>
                                    <td className="px-6 py-4">
                                        {
                                            pathname.toLowerCase().includes(order.seller?.address?.toLowerCase() as string) ?
                                            <span>{cutAddress(order.seller?.address, 4, 3)}</span>
                                            :
                                            <Link
                                                href={replaceUrlParams(appRoutes.viewAccount, {
                                                    address: order.seller?.address as string
                                                })}
                                                className="text-tertiary-600"
                                            >
                                                {cutAddress(order.seller?.address, 4, 3)}
                                            </Link>
                                        }
                                        
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-row items-center gap-2">
                                            <CryptoCurrencyDisplay
                                                currency={order.currency as CryptocurrencyType}
                                                amount={order.price}
                                            />
                                            {/* // Display crypto to fiat conversion */}
                                            <CryptoToFiat 
                                                amount={order.price}
                                                currency={order.currency}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.status}
                                    </td>
                                    <td className="px-6 py-4">
                                        {createdTime.days} {createdTime.hours}
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}