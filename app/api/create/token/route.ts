import type AccountType from '@/lib/types/account'
import type { default as NftTokenType, PopulatedNftTokenType } from '@/lib/types/token'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateToken, createToken, getAndUpdateTokenByQuery } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { dataUrlToReadableStream } from '@/lib/utils/file'
import { uploadMediaToIPFS } from '@/lib/utils/pinata'
import { type NextRequest, NextResponse } from 'next/server'

async function createNewToken(request: NextRequest, _: any, { user }: {user: AccountType}) {
    const nftToken = await request.json() as PopulatedNftTokenType
    nftToken.owner = user
    /** 
     * If nftToken._id, draft was created.
     * otherwise, it's a new token
    */ 
    let newToken: NftTokenType | null
    await mongooseConnectPromise

    if (nftToken._id) {
        // update token data
        if (!nftToken.tokenId) {
            throw new CustomRequestError('Token Id is missing', 400)
        }

        newToken = await getAndUpdateTokenByQuery({
            _id: nftToken._id,
            owner: user,
            draft: true,
            $or: [
                {tokenId: {$eq: undefined}},
                {tokenId: {$exists: false}}
            ] 
        }, {
            draft: false,
            tokenId: nftToken.tokenId,
        }, false)

        if (!newToken) {
            throw new CustomRequestError('Draft token not found', 400)
        }

    } else {
         // validate the token data
        const isValidToken = await validateToken(nftToken)
        if (!isValidToken) {
            throw new CustomRequestError('Token data is invalid', 400)
        }
        
        if ((!nftToken.media || !nftToken.media.startsWith('data:'))) {
            throw new CustomRequestError('Please provide a valid token media', 400)
        }
        // Convert dataURI to readable stream
        const mediaId = `${nftToken.contract.contractAddress}#token`
        const mediaStream = dataUrlToReadableStream(nftToken.media, mediaId)
        // Upload readable stream to ipfs through pinata
        const mediaHash = await uploadMediaToIPFS(mediaStream, mediaId)

        nftToken.media = mediaHash
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