import { type NextRequest, NextResponse } from 'next/server'
import type AccountType from '@/lib/types/account'
import { CustomRequestError } from '@/lib/error/request'
import { setMarketOrderStatusToCancelled } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import MarketplaceEventEmitter from '@/lib/appEvent/marketplace'

async function cancelMarketOrder(_: NextRequest, { params }: {params: {marketOrderDocId: string}}, { user }: { user: AccountType}) {
    await mongooseConnectPromise
    
    const cancelledMarketOrder = await setMarketOrderStatusToCancelled({
        _id: params.marketOrderDocId,
        /** Seller should be the account address in session */
        seller: user.address,
        /** We want to cancel saleType 'fixed' or 'offer'
         * We cannot cancel 'auction' at the moment
         */
        saleType: {$in: ['fixed', 'offer']}
    })

    if (!cancelledMarketOrder) {
        throw new CustomRequestError('Market order not found')
    }

    MarketplaceEventEmitter.emit('marketOrderCancelled', {marketOrder: cancelledMarketOrder})

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: cancelledMarketOrder,
        code: 200
    }, {status: 200})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(cancelMarketOrder))

export { wrappedPost as POST}