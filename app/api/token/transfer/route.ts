import type AccountType from '@/lib/types/account'
import { Types } from 'mongoose'
import type { PopulatedNftTokenType } from '@/lib/types/token'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { setTokenOwner, setAccountDetails, validateToken } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { isEthereumAddress } from '@/lib/utils/main'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

async function transferToken(request: NextRequest, _: {}, { user }: {user: AccountType}) {
    const body = await request.json()
    const token = body.token as PopulatedNftTokenType
    const newOwner = body.newOwner as string
    
    if (user._id !== token.owner._id) {
        throw new CustomRequestError('Token owner mismatch')
    }

    if (!isEthereumAddress(newOwner)) {
        throw new CustomRequestError('Invalid new owner address')
    }

    const isValidToken = await validateToken(token)

    if (!isValidToken){
        throw new CustomRequestError('Invalid token data')
    }

    await mongooseConnectPromise

    const newOwnerAccount = await setAccountDetails(newOwner, {address: newOwner})
    const newOwnerToken = await setTokenOwner(token._id as Types.ObjectId, newOwnerAccount._id)

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: newOwnerToken,
        code: 200
    }, {status: 200})
}

const wrappedGet = withRequestError(withSession(transferToken))
export { wrappedGet as POST}