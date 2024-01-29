import type { PopulatedMarketOrderType } from '@/lib/types/market'
import type { PopulatedMarketBidType } from '@/lib/types/bid'
import EventEmitter from 'events'

// Templates
import marketOrderCreatedEmailTemplate from '@/lib/mail_template/market_order_created'
import marketOrderCancelledEmailTemplate from '@/lib/mail_template/market_order_cancelled'
import marketOrderSoldEmailTemplate from '@/lib/mail_template/market_order_sold'
import marketAuctionEndedEmailTemplate from '@/lib/mail_template/market_auction_ended'
import newMarketBidEmailTemplate from '@/lib/mail_template/new_market_bid'
import offerReceivedOnTokenEmailTemplate from '@/lib/mail_template/offer_received_on_token'
import offerAcceptedOnTokenEmailTemplate from '@/lib/mail_template/offer_accepted_on_token'

import sendEmail from '@/lib/handlers/mailer'
import { setAccountDetails } from '@/lib/handlers/account'

const MarketplaceEventEmitter = new EventEmitter()

MarketplaceEventEmitter
.on('marketOrderCreated', marketOrderCreated)
.on('marketOrderCancelled', marketOrderCancelled)
.on('marketOrderSold', marketOrderSold)
.on('offerReceivedOnToken', offerReceivedOnToken)
.on('offerAcceptedOnToken', offerAcceptedOnToken)
.on('marketAuctionEnded', marketAuctionEnded)
.on('newMarketBid', newMarketBid)

async function marketOrderCreated({marketOrder}: {marketOrder: PopulatedMarketOrderType}) {
    try {

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