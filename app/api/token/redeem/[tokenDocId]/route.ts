import type AccountType from '@/lib/types/account'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { getTokenRedeemableContent } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { withRequestError, withSession } from '@/wrapper'

async function getRedeemableContent(_: NextRequest, { params }: {params: {tokenDocId: string}}, { user }: {user: AccountType}) {
    
    await mongooseConnectPromise
    const token = await getTokenRedeemableContent(params.tokenDocId, user.address)

    /**
     * @todo - getTokenRedeemableContent without passing `user.address`
     * then compare `token.owner.address` with `user.address`
     */
    if (!token) {
        // wrong owner account
        throw new CustomRequestError('Action may be unauthorized', 401)
    }

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: token,
        code: 200
    }, {status: 200})
}

const wrappedGet = withRequestError(withSession(getRedeemableContent))
export { wrappedGet as GET}