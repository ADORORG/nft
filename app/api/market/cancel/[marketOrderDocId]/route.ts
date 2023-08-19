import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { setMarketOrderStatusToCancelled } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'
import type AccountType from '@/lib/types/account'
/**
 * Finalise market order by marking the order as as sold
 */
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