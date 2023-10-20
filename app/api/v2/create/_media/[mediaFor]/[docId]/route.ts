import type AccountType from '@/lib/types/account'
import { type NextRequest, NextResponse } from 'next/server'
import { ReadableWebToNodeStream } from 'readable-web-to-node-stream'
import { CustomRequestError } from '@/lib/error/request'
import { uploadMediaToIPFS, unPinIPFS } from '@/lib/utils/pinata'
import { createCustomReadableFromExistingReadable } from '@/lib/utils/file'
import { withRequestError, withSession } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import collectionMedia from './collection'
import tokenMedia from './token'
import eventMedia from './event'

type MediaForType = 'token' | 'collection' | 'event'

async function createMediaForDocument(request: NextRequest, { params }: {params: {mediaFor: MediaForType, docId: string}}, { user }: {user: AccountType}) {
    const mediaType = request.headers.get("Content-Type")
    const { mediaFor, docId } = params

    const targetMedia = ['token', 'collection', 'event']
    if (!targetMedia.includes(mediaFor) || !request.body) {
        throw new CustomRequestError('Request is not understood', 404)
    }

    const targetMap = {
        token: tokenMedia,
        collection: collectionMedia,
        event: eventMedia 
    }

    await mongooseConnectPromise
    const { docIsValid, updateDoc } = targetMap[mediaFor]()
    const query = {_id: docId, owner: user}
    const validDoc = await docIsValid(query)
    
    if (!validDoc) {
        throw new CustomRequestError(`The target ${mediaFor} not found`, 404)
    } else {
        // Check if the doc has a previously pinned media and unpin
        if (validDoc.media) {
            await unPinIPFS(validDoc.media)
        }
    }

    const mediaStream = createCustomReadableFromExistingReadable(new ReadableWebToNodeStream(request.body))
    const mediaHash = await uploadMediaToIPFS(mediaStream, `${mediaFor}_${docId}`)
    const updatedDoc = await updateDoc(query, {media: mediaHash, mediaType})

    // send the updated doc
    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: updatedDoc,
        code: 201
    }, {status: 201})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(createMediaForDocument))

export { wrappedPost as POST}