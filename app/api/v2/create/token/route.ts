import type AccountType from '@/lib/types/account'
import type { default as NftTokenType, PopulatedNftTokenType } from '@/lib/types/token'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateToken, createToken, getAndUpdateTokenByQuery } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'

async function createNewToken(request: NextRequest, _: any, { user }: {user: AccountType}) {
    const nftToken = await request.json() as PopulatedNftTokenType
    // Attach user account
    nftToken.owner = user
     // validate the token data
    const isValidToken = await validateToken(nftToken)
    if (!isValidToken) {
        throw new CustomRequestError('Token data is invalid', 400)
    }
    /** 
     * If nftToken._id, draft was created.
     * otherwise, it's a new token
    */ 
    let newToken: NftTokenType | null
    await mongooseConnectPromise

    if (nftToken._id) {

        newToken = await getAndUpdateTokenByQuery({
            _id: nftToken._id,
            owner: user,
            draft: true,
        }, {
            ...nftToken,
            draft: nftToken.tokenId ? false : true,
            tokenId: nftToken.tokenId,
        }, false)

        if (!newToken) {
            throw new CustomRequestError('Draft token not found', 400)
        }

    } else {
        newToken = await createToken(nftToken)
    }

    // send the new token in response
    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: newToken,
        code: 201
    }, {status: 201})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(createNewToken))

export { wrappedPost as POST}