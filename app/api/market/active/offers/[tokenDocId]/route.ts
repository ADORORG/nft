import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { getMarketOrdersByQuery } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { withRequestError } from '@/wrapper'

async function getTokenOffers(_: NextRequest, { params }: {params: {tokenDocId: string}}) {
    const { tokenDocId } = params

    if (!tokenDocId) {
        // throw bad request error
        throw new CustomRequestError('Invalid request', 400)
    }

    await mongooseConnectPromise
    const offers = await getMarketOrdersByQuery({
        saleType: 'offer',
        status: 'active',
        token: tokenDocId,
        // orderDeadline: {$gt: new Date().getTime()}
    }, {limit: 50})

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: offers,
        code: 200
    }, {status: 200})
}

const wrappedPost = withRequestError(getTokenOffers)

export { wrappedPost as GET}