import type AccountType from '@/lib/types/account'
import { Types } from 'mongoose'
import type { PopulatedNftTokenType } from '@/lib/types/token'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { setTokenOwner, setAccountDetails, getTokenByQuery, getMarketOrderByQuery } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { isEthereumAddress } from '@/lib/utils/main'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

async function transferToken(request: NextRequest, _: {}, { user }: {user: AccountType}) {
    const body = await request.json()
    const { tokenDocId, newOwner } = body as {tokenDocId: string, newOwner: string}

    if (!isEthereumAddress(newOwner)) {
        throw new CustomRequestError('Invalid new owner address')
    }

    await mongooseConnectPromise

    // Ensure that the token is not listed for sale
    const marketOrder = await getMarketOrderByQuery({token: tokenDocId, status: 'active'})

    if (marketOrder) {
        throw new CustomRequestError('Please remove the token from sale before transferring it')
    }
    
    const token = await getTokenByQuery({_id: tokenDocId}) as PopulatedNftTokenType

    if (!token) {
        throw new CustomRequestError('Invalid token')
    }
    
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