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
.on('offerReceivedOnToken', offerReceivedOnToken)
.on('offerAcceptedOnToken', offerAcceptedOnToken)
.on('marketAuctionEnded', marketAuctionEnded)
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
    try {
        /* 
        * If its an auction or fixed listing, send email to seller if enabled
        */
        if (marketOrder.saleType === 'auction' || marketOrder.saleType === 'fixed') {
            const mailReceiver = await setAccountDetails(marketOrder.seller._id?.toString() as string, {})
        
            if (
                mailReceiver.emailVerified && (
                    !mailReceiver?.notification || 
                    mailReceiver?.notification.marketOrderCreated
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
                    to: mailReceiver.email as string,
                    subject: 'You listed a token',
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
    try {

    } catch (error) {
        console.log(error)
    }
}

async function marketOrderSold({marketOrder}: {marketOrder: PopulatedMarketOrderType}) {
    try {

    } catch (error) {
        console.log(error)
    }
}

async function offerReceivedOnToken({marketOrder}: {marketOrder: PopulatedMarketOrderType}) {
    try {
        /* 
        * If its an offer, send email to seller
        */
        if (marketOrder.saleType === 'offer') {
            const mailReceiver = await setAccountDetails(marketOrder.seller._id?.toString() as string, {})
        
            if (
                mailReceiver.emailVerified && (
                    !mailReceiver?.notification || 
                    mailReceiver?.notification.offerReceivedOnToken
                )
            ) {
                // Send email
                const templateConfig = {
                    buttonLink: getTokenUrl(marketOrder),
                    buttonLabel: `View Offer`,
                    title: `Offer Received on ${marketOrder.token.name}`,
                    mainContent: `You received an offer on ${marketOrder.token.name}. You can view it on ${AppInfo.name} marketplace.`
                }
    
                await sendEmail({
                    to: mailReceiver.email as string,
                    subject: 'Offer Received on your token',
                    text: striptags(activityNotificationEmailTemplate(templateConfig)),
                    html: activityNotificationEmailTemplate(templateConfig)
                })
            }
        
        }
    } catch (error) {
        console.log(error)
    }
}

async function offerAcceptedOnToken({marketOrder}: {marketOrder: PopulatedMarketOrderType}) {
    try {

    } catch (error) {
        console.log(error)
    }
}

async function marketAuctionEnded({marketOrder}: {marketOrder: PopulatedMarketOrderType}) {
    try {

    } catch (error) {
        console.log(error)
    }
}

async function newMarketBid({marketOrder, marketBid}: {marketOrder: PopulatedMarketOrderType, marketBid: PopulatedMarketBidType}) {

}

export default MarketplaceEventEmitter