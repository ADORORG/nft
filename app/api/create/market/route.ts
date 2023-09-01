import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateMarket, createMarketOrder, /* setAccountDetails */ } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'

/**
 * Create market order.
 * @todo - Reset marketOrderType.seller (for 'auction'|'fixed' order) to current account in session.
 * Reset marketOrderType.buyer (for 'offer' order) to current account in session.
 * @param request 
 * @param _ 
 * @returns 
 */
async function createNewMarketOrder(request: NextRequest, _: any) {
    const body = await request.json()
    const isValidOrder = await validateMarket(body)
    if (!isValidOrder) {
        throw new CustomRequestError('Market order is invalid', 400)
    }
    
    await mongooseConnectPromise

    const newMarketOrder = await createMarketOrder(body)
    // console.log('newMarketOrder', newMarketOrder)
    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: newMarketOrder,
        code: 201
    }, {status: 201})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(createNewMarketOrder))

export { wrappedPost as POST}