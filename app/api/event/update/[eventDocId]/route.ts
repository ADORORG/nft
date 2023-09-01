// import mongooseConnectPromise from '@/wrapper/mongoose_connect'
// import { CustomRequestError } from '@/lib/error/request'
// import { getEventById } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'
import type AccountType from '@/lib/types/account'

async function updateSaleEvent(request: NextRequest, { params }: {params: {eventDocId: string}}, { user }: {user: AccountType}) {
    

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: null,
        code: 201
    }, {status: 201})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(updateSaleEvent))

export { wrappedPost as POST}