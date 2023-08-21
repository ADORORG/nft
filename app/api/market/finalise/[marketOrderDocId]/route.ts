import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { setMarketOrderStatusToSold, setTokenOwner } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { isEthereumTransactionHash, isEthereumAddress } from '@/utils/main'
import { type FinaliseMarketOrderType } from '@/lib/types/common'
import { type NextRequest, NextResponse } from 'next/server'
import type { Types } from 'mongoose'
/**
 * Finalise market order by marking the order as as sold
 */
async function finaliseMarketOrder(request: NextRequest, { params }: {params: {marketOrderDocId: string}}) {
    const body = await request.json() as FinaliseMarketOrderType

    const {
        saleTxHash,
        soldPrice,
        buyerId,
    } = body

    if (
        !isEthereumTransactionHash(saleTxHash) ||
        !isEthereumAddress(buyerId) ||
        !parseFloat(soldPrice)
    ) {
        throw new CustomRequestError('Invalid transaction data', 400)
    }

    await mongooseConnectPromise
    // Mark market order as sold
    const soldMarketOrder = await setMarketOrderStatusToSold(params.marketOrderDocId, {
        saleTxHash,
        soldPrice,
        buyerId,
    })

    if (!soldMarketOrder) {
        throw new CustomRequestError('Market order is not on sale', 400)
    }
    
    // Transfer ownership
    await setTokenOwner(soldMarketOrder.token._id as Types.ObjectId, buyerId)

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: soldMarketOrder,
        code: 200
    }, {status: 200})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(finaliseMarketOrder))

export { wrappedPost as POST}