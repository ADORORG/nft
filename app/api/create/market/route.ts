import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateMarket, createMarketOrder } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'

async function createNewMarketOrder(request: NextRequest) {
    const body = await request.json()
    
    const isValidOrder = await validateMarket(body)
    // console.log('market', body)
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