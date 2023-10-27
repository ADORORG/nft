import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { getMarketOrderByQuery } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { withRequestError } from '@/wrapper'

async function getTokenActiveOrder(_: NextRequest, { params }: {params: {tokenDocId: string}}) {
    const { tokenDocId } = params

    if (!tokenDocId) {
        // throw bad request error
        throw new CustomRequestError('Invalid request', 400)
    }

    await mongooseConnectPromise

    const singleOrder = await getMarketOrderByQuery({
        saleType: {$in: ['auction', 'fixed']},
        status: 'active',
        token: tokenDocId,
    })

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: singleOrder,
        code: 200
    }, {status: 200})
}

const wrappedGet = withRequestError(getTokenActiveOrder)

export { wrappedGet as GET}