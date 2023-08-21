import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { createBid, validateBid } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import type MarketBidType from '@/lib/types/bid'
import type AccountType from '@/lib/types/account'
import { type NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'

async function createMarketAuctionBid(request: NextRequest, { params }: {params: {marketOrderDocId: string}}, { user }: { user: AccountType}) {
    const body = await request.json() as Partial<MarketBidType>
    
    // Add market order document _id and bidder
    body.marketOrder = new Types.ObjectId(params.marketOrderDocId)
    // Add session account address as bidder
    body.bidder = user.address

    const isValidBid = await validateBid(body)

    if (!isValidBid) {
        throw new CustomRequestError('Invalid transaction data', 400)
    }

    await mongooseConnectPromise
    // Create market bid
    const newBid = await createBid(body as MarketBidType )
    
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