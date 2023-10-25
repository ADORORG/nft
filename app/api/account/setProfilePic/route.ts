import type AccountType from '@/lib/types/account'
import type { PopulatedNftTokenType } from '@/lib/types/token'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { setAccountDetails, getTokenByQuery } from '@/lib/handlers'
import { dataUrlToReadableStream } from '@/lib/utils/file'
import { uploadMediaToIPFS } from '@/lib/utils/pinata'
import { withRequestError, withSession } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

async function setProfilePic(request: NextRequest, _: {}, { user }: {user: AccountType}) {
    const body = await request.json()
    /* 
    * We are expecting a token id document.
    * Or media with data url and media type.
    * If it's a media data url, we upload it to ipfs and use it as the account profileMedia.
    * Otherwise, we set the token media to profileMedia.
    */
    const {tokenDocId, media, mediaType} = body as {tokenDocId: string, media: string, mediaType: string}

    let profileMedia: string, profileMediaType: string | undefined

    await mongooseConnectPromise

    if (media && media.startsWith('data:') && mediaType) {
        // Upload media to ipfs
        // Convert dataURI to readable stream
        const mediaId = `${user.address}-media`
        const mediaStream = dataUrlToReadableStream(media, mediaId)
        profileMedia = await uploadMediaToIPFS(mediaStream, mediaId)
        profileMediaType = mediaType

    } else if (tokenDocId) {
        const token = await getTokenByQuery({_id: tokenDocId}) as PopulatedNftTokenType

        if (!token) {
            throw new CustomRequestError('Invalid token')
        }

        if (user._id !== token.owner._id) {
            throw new CustomRequestError('Token owner mismatch')
        }

        profileMedia = token.media || ""
        profileMediaType = token.mediaType

    } else {
        throw new CustomRequestError('Invalid data to update profile media')
    }
    
    const updatedAccount = await setAccountDetails(user._id as string, {
        profileMedia,
        profileMediaType
    })

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: updatedAccount,
        code: 200
    }, {status: 200})
}

const wrappedGet = withRequestError(withSession(setProfilePic))
export { wrappedGet as POST}