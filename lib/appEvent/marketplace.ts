import type { PopulatedMarketOrderType } from '@/lib/types/market'
import type { PopulatedMarketBidType } from '@/lib/types/bid'
import EventEmitter from 'events'
import striptags from 'striptags'
// Templates
import activityNotificationEmailTemplate from '@/lib/mail_template/activity_notification'
import appRoutes from '@/config/app.route'
import { AppInfo } from '@/lib/app.config'
import sendEmail from '@/lib/handlers/mailer'
import { setAccountDetails } from '@/lib/handlers/account'
import { replaceUrlParams } from '@/utils/main'

const MarketplaceEventEmitter = new EventEmitter()

MarketplaceEventEmitter
.on('marketOrderCreated', marketOrderCreated)
.on('marketOrderCancelled', marketOrderCancelled)
.on('marketOrderSold', marketOrderSold)
// .on('offerReceivedOnToken', offerReceivedOnToken)
// .on('offerAcceptedOnToken', offerAcceptedOnToken)
// .on('marketAuctionEnded', marketAuctionEnded)
.on('newMarketBid', newMarketBid)


function getTokenUrl(marketOrder: PopulatedMarketOrderType) {
    const tld = process.env.NEXTAUTH_URL
    const rawLink = replaceUrlParams(`${tld}/${appRoutes.viewToken}`, 
    { 
        chainId: marketOrder.token.contract.chainId.toString(),
        contractAddress: marketOrder.token.contract?.contractAddress as string,
        tokenId: marketOrder.token?.tokenId?.toString() as string,
    })

    return rawLink
}

async function marketOrderCreated({marketOrder}: {marketOrder: PopulatedMarketOrderType}) {
    /* 
    * CASES
    * 1. Token owner (seller) created an order (auction or fixed)
    *   a. Send 'marketOrderCreated' to seller
    * 2. User make an offer on a token (buyer) - (offer)
    *   a. Send 'marketOrderCreated' to buyer
    *   b. Send 'offerReceivedOnToken' to seller
    */
    try {
        /* 
        * If its an auction or fixed listing, send email to seller if enabled
        */
        if (marketOrder.saleType === 'auction' || marketOrder.saleType === 'fixed') {
            // Send 'marketOrderCreated' to seller
            const seller = await setAccountDetails(marketOrder.seller._id?.toString() as string, {})
        
            if (
                seller.emailVerified && (
                    !seller?.notification || 
                    seller?.notification.marketOrderCreated
                )
            ) {
                // Send email
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Order`,
                    title: `You listed a token for ${marketOrder.saleType} sale`,
                    mainContent: `You listed a token on ${AppInfo.name} marketplace. You can view it below.`
                }
    
                await sendEmail({
                    to: seller.email as string,
                    subject: 'You listed a token',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }
        
        } else {
            // It's an offer
            /* 
            * a. Send 'marketOrderCreated' to buyer
            * b. Send 'offerReceivedOnToken' to seller
            */

            const [buyer, seller] = await Promise.all([
                setAccountDetails(marketOrder?.buyer?._id?.toString() as string, {}),
                setAccountDetails(marketOrder?.seller?._id?.toString() as string, {}),
            ])

            // Send 'marketOrderCreated' to buyer
            if (
                buyer.emailVerified && (
                    !buyer?.notification || 
                    buyer?.notification.marketOrderCreated
                )
            ) {
                // Send email
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Order`,
                    title: `You made an offer on a token`,
                    mainContent: `You made an offer on ${marketOrder.token.name}. You can view the status below.`
                }
    
                await sendEmail({
                    to: buyer.email as string,
                    subject: 'You made an offer on a token',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }

            // Send 'offerReceivedOnToken' to seller
            if (
                seller.emailVerified && (
                    !seller?.notification || 
                    seller?.notification.offerReceivedOnToken
                )
            ) {
                // Send email
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Order`,
                    title: `You received an offer on a token`,
                    mainContent: `You received an offer on ${marketOrder.token.name}. You can view below to accept or reject it.`
                }
    
                await sendEmail({
                    to: seller.email as string,
                    subject: 'You received an offer on a token',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }
        }
    } catch (error) {
        console.log(error)
    }
}

async function marketOrderCancelled({marketOrder}: {marketOrder: PopulatedMarketOrderType}) {
    /* 
    * CASES
    * 1. Token owner (seller) cancelled auction|fixed order 
    *   a. Send 'marketOrderCancelled' to seller
    * 2. Token owner (seller) rejected an offer
    *   a. Send 'offerRejectedOnToken' to seller
    *   b. Send 'offerRejectedOnToken' to buyer (offerer)
    */
    try {
        if (marketOrder.saleType === 'auction' || marketOrder.saleType === 'fixed') {
            const seller = await setAccountDetails(marketOrder.seller._id?.toString() as string, {})
        
            if (
                seller.emailVerified && (
                    !seller?.notification || 
                    seller?.notification.marketOrderCancelled
                )
            ) {
                // Send email
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Token`,
                    title: `You cancelled ${marketOrder.saleType === 'auction' ? 'an' : 'a'} ${marketOrder.saleType} sale`,
                    mainContent: `You just cancelled ${marketOrder.saleType === 'auction' ? 'an' : 'a'} ${marketOrder.saleType} sale on ${AppInfo.name} marketplace. You can view the token below.`
                }
    
                await sendEmail({
                    to: seller.email as string,
                    subject: 'You cancelled a listing',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }
        
        } else {
            // It's an offer
            const [seller, buyer] = await Promise.all([
                setAccountDetails(marketOrder?.seller?._id?.toString() as string, {}),
                setAccountDetails(marketOrder?.buyer?._id?.toString() as string, {})
            ])
            
            if (
                seller.emailVerified && (
                    !seller?.notification || 
                    seller?.notification.offerRejectedOnToken
                )
            ) {
                // Send email
                // a. Send 'offerRejectedOnToken' to seller
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Token`,
                    title: `You rejected an offer on a token`,
                    mainContent: `You just rejected an offer made on ${marketOrder.token.name}. You can create a new order below.`
                }
    
                await sendEmail({
                    to: seller.email as string,
                    subject: 'You rejected an offer on a token',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }

            if (
                buyer.emailVerified && (
                    !buyer?.notification || 
                    buyer?.notification.offerRejectedOnToken
                )
            ) {
                // Send email
                // b. Send 'offerRejectedOnToken' to buyer (offerer)
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Token`,
                    title: `Your offer was rejected on a token`,
                    mainContent: `Your offer was rejected on ${marketOrder.token.name} token. You can make a new offer below.`
                }
    
                await sendEmail({
                    to: buyer.email as string,
                    subject: 'Your offer was rejected',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }
        
        }
    } catch (error) {
        console.log(error)
    }
}

async function marketOrderSold({marketOrder}: {marketOrder: PopulatedMarketOrderType}) {
    /* 
    * CASES
    * 1. User (buyer) buys auction|fixed order
    *   a. Send 'marketOrderSold' to seller
    *   b. Send 'marketOrderSold' to buyer
    * 2. User (seller) accepts an offer on a token
    *   a. Send 'offerAcceptedOnToken' to seller
    *   b. Send 'offerAcceptedOnToken' to buyer
    */

    const [seller, buyer] = await Promise.all([
        setAccountDetails(marketOrder?.seller?._id?.toString() as string, {}),
        setAccountDetails(marketOrder?.buyer?._id?.toString() as string, {})
    ])
    
    try {
        if (marketOrder.saleType === 'auction' || marketOrder.saleType === 'fixed') {
            if (
                seller.emailVerified && (
                    !seller?.notification || 
                    seller?.notification.marketOrderSold
                )
            ) {
                // Send email
                // a. Send 'marketOrderSold' to seller
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Token`,
                    title: `You sold a token`,
                    mainContent: `You sold ${marketOrder.token.name} on ${AppInfo.name} marketplace. You can view the token below.`
                }
    
                await sendEmail({
                    to: seller.email as string,
                    subject: 'You sold a token',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }

            if (
                buyer.emailVerified && (
                    !buyer?.notification || 
                    buyer?.notification.marketOrderSold
                )
            ) {
                // Send email
                // b. Send 'marketOrderSold' to buyer
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Token`,
                    title: `You bought a token`,
                    mainContent: `You just bought ${marketOrder.token.name} token on ${AppInfo.name} marketplace. You can list the token below.`
                }
    
                await sendEmail({
                    to: buyer.email as string,
                    subject: 'You bought a token',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }

        } else {
            // It's an offer
            if (
                seller.emailVerified && (
                    !seller?.notification || 
                    seller?.notification.offerAcceptedOnToken
                )
            ) {
                // Send email
                // a. Send 'offerAcceptedOnToken' to seller
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Token`,
                    title: `You accepted an offer on a token`,
                    mainContent: `You accepted an offer on ${marketOrder.token.name} token. You can view the token below.`
                }
    
                await sendEmail({
                    to: seller.email as string,
                    subject: 'You accepted an offer on a token',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }

            if (
                buyer.emailVerified && (
                    !buyer?.notification || 
                    buyer?.notification.offerAcceptedOnToken
                )
            ) {
                // Send email
                // b. Send 'offerAcceptedOnToken' to buyer
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Token`,
                    title: `Your offer accepted on ${marketOrder.token.name} token`,
                    mainContent: `Your offer has been accepted on ${marketOrder.token.name} token on ${AppInfo.name} marketplace. You can list the token below.`
                }
    
                await sendEmail({
                    to: buyer.email as string,
                    subject: 'Your offer accepted on a token',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }

        }
    } catch (error) {
        console.log(error)
    }
}

/* async function marketAuctionEnded({marketOrder}: {marketOrder: PopulatedMarketOrderType}) {
    try {

    } catch (error) {
        console.log(error)
    }
} */

async function newMarketBid({marketOrder, marketBid}: {marketOrder: PopulatedMarketOrderType, marketBid: PopulatedMarketBidType}) {
    try {
        /* 
        * CASES
        * a. Send 'newMarketBid' to seller
        * b. Send 'newMarketBid' to bidder
        */
        const [seller, bidder] = await Promise.all([
            setAccountDetails(marketOrder.seller._id?.toString() as string, {}),
            setAccountDetails(marketBid.bidder._id?.toString() as string, {}),
        ])

        if (
            seller.emailVerified && (
                !seller?.notification || 
                seller?.notification.newMarketBid
            )
        ) {
            // Send email
            // a. Send 'newMarketBid' to seller
            const templateConfig = {
                buttonLink: getTokenUrl(marketOrder),
                buttonLabel: `View Order`,
                title: `You received a new bid on a token`,
                mainContent: `You received a new bid on ${marketOrder.token.name} token. You can view the order below.`
            }

            await sendEmail({
                to: seller.email as string,
                subject: 'You received a new bid on a token',
                text: striptags(activityNotificationEmailTemplate(templateConfig)),
                html: activityNotificationEmailTemplate(templateConfig)
            })
        }

        if (
            bidder.emailVerified && (
                !bidder?.notification || 
                bidder?.notification.offerAcceptedOnToken
            )
        ) {
            // Send email
            // b. Send 'offerAcceptedOnToken' to bidder
            const templateConfig = {
                buttonLink: getTokenUrl(marketOrder),
                buttonLabel: `View Order`,
                title: `You bidded on ${marketOrder.token.name} token`,
                mainContent: `You bidded on ${marketOrder.token.name} token on ${AppInfo.name} marketplace. You can view your bid below.`
            }

            await sendEmail({
                to: bidder.email as string,
                subject: 'You bidded on a token',
                text: striptags(activityNotificationEmailTemplate(templateConfig)),
                html: activityNotificationEmailTemplate(templateConfig)
            })
        }

        
    } catch (error) {
        console.log(error)
    }
}

export default MarketplaceEventEmitter