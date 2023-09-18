import type AccountType from '@/lib/types/account'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateToken, createToken, setAccountDetails } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { dataUrlToReadableStream } from '@/lib/utils/file'
import { uploadMediaToIPFS } from '@/lib/utils/pinata'
import { type NextRequest, NextResponse } from 'next/server'

async function createNewToken(request: NextRequest, _: any, { user }: {user: AccountType}) {
    const formData = await request.formData()
    
    // Build the token data
    const data: any = {
        owner: user.address
    }

    for (const key of formData.keys()) {
        data[key] = formData.get(key) || ""
    }

    data.attributes = JSON.parse(data.attributes)
    data.redeemable = Boolean(data.redeemable)
    data.royalty = Number(data.royalty) || 0 // handle case 'undefined' for royalty
    data.supply = Number(data.supply) || 1 // handle case 'undefined' for royalty
    // validate the token data
    const isValidToken = await validateToken(data)
    if (!isValidToken) {
        throw new CustomRequestError('Token data is invalid', 400)
    }

    /** 
     * @todo Convert media to stream and upload to decentralized storage 
    */
    if (
        (!data.media && !data.media.startsWith('data:'))
    ) throw new CustomRequestError('Please provide a valid token media', 400)
    
    // Convert dataURI to readable stream
    const mediaId = `${data.contract}#${data.tokenId}-media`
    const mediaStream = dataUrlToReadableStream(data.media, mediaId)

    // Upload readable stream to ipfs through pinata
    const mediaHash = await uploadMediaToIPFS(mediaStream, mediaId)

    await mongooseConnectPromise
    // Get the user session account
    const account = await setAccountDetails(user.address, {address: user.address})
    // create the new token
    const newToken = await createToken({
        media: mediaHash,
        mediaType: data.mediaType,
        tokenId: data.tokenId,
        supply: data.supply,
        royalty: data.royalty,
        name: data.name,
        description: data.description,
        tags: data.tags,
        attributes: data.attributes,
        redeemable: data.redeemable,
        redeemableContent: data.redeemableContent,
        externalUrl: data.externalUrl,
        backgroundColor: data.backgroundColor,
        owner: account._id,
        xcollection: data.xcollection,
        contract: data.contract,
    })
    
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