import type AccountType from '@/lib/types/account'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { CustomRequestError } from '@/lib/error/request'
import { uploadMediaToIPFS, unPinIPFS } from '@/lib/utils/pinata'
import { dataUrlToReadableStream } from '@/lib/utils/file'
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

/* 
* This @/app/api/v2/create/media handles media upload for token, collection and event.
* However, there is a strict maximum size of upload 4.5MB for a serverless function.
* We are using the the /pages/ api to bypass this limitation.
*/
import collectionMedia from '@/app/api/v2/create/media/[mediaFor]/[docId]/collection'
import tokenMedia from '@/app/api/v2/create/media/[mediaFor]/[docId]/token'
import eventMedia from '@/app/api/v2/create/media/[mediaFor]/[docId]/event'

type MediaForType = 'token' | 'collection' | 'event'

export default async function createMediaForDocument(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method !== 'POST') {
            throw new CustomRequestError('Method not allowed', 405)
        }

        const authOption = nextAuthOptions(request)
        const session = await getServerSession(request, response, authOption)
        const user = session?.user as AccountType
        const { mediaFor, docId } = request.query as {mediaFor: MediaForType, docId: string}
        const { mediaType, media } = request.body as {mediaType: string, media: string}
    
        const targetMedia = ['token', 'collection', 'event']

        if (!targetMedia.includes(mediaFor) || !media || !mediaType) {
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
                try {
                    await unPinIPFS(validDoc.media)
                } catch (error) {
                    console.log('error', error)
                }
            }
        }
        
        const mediaId = `${mediaFor}_${docId}`
        const mediaStream = dataUrlToReadableStream(media, mediaId)
        const mediaHash = await uploadMediaToIPFS(mediaStream, mediaId)
        const updatedDoc = await updateDoc(query, {media: mediaHash, mediaType})
    
        // send the updated doc
        return response.status(201).json({
            success: true,
            message: 'Operation completed successfully',
            data: updatedDoc,
            code: 201
        })

    } catch (error: any) {
        const status = error.code < 599 ? error.code : (error.errorCode || 500)

        return response.status(error.code || 500).json({
            success: false,
            message: error.message || 'Error occurred',
            code: status,
            data: null
        })
    }
}

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '50mb',
        },
    },
    // Specifies the maximum allowed duration for this function to execute (in seconds)
    maxDuration: 30,
}