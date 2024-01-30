import type MarketBidType from '@/lib/types/bid'
import type AccountType from '@/lib/types/account'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { getMarketOrderByQuery, createBid, validateBid } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import MarketplaceEventEmitter from '@/lib/appEvent/marketplace'

async function createMarketAuctionBid(request: NextRequest, { params }: {params: {marketOrderDocId: string}}, { user }: { user: AccountType}) {
    const marketOrder = await getMarketOrderByQuery({
        _id: params.marketOrderDocId
    })

    if (!marketOrder) {
        throw new CustomRequestError('Invalid market data', 400)
    }

    const bid = await request.json() as Partial<MarketBidType>
    // Add market order document and bidder
    bid.marketOrder = marketOrder
    // Add session account address as bidder
    bid.bidder = user.address
    const isValidBid = await validateBid(bid)

    if (!isValidBid) {
        throw new CustomRequestError('Invalid transaction data', 400)
    }

    await mongooseConnectPromise
    // Create market bid
    const newBid = await createBid(bid as MarketBidType )
    
    MarketplaceEventEmitter.emit('newMarketBid', {
        marketOrder,
        marketBid: newBid
    })

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: newBid,
        code: 200
    }, {status: 200})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(createMarketAuctionBid))

export { wrappedPost as POST}