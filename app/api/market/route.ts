import { NextRequest, NextResponse } from 'next/server'
import { withRequestError } from '@/wrapper'


async function getMarketOrders(request: NextRequest) {
    return NextResponse.json({
        message:  "Not implemented"
    }, {status: 501})
}


const wrappedGet = (withRequestError(getMarketOrders))

export {
    wrappedGet as GET
}