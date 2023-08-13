import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { getCollectionsByOwner } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { withRequestError } from '@/wrapper'

async function getCollections(_: NextRequest, { params }: {params: {address: string}}) {
    const { address } = params
    if (!address) {
        // throw bad request error
        throw new CustomRequestError('Account address is required', 400)
    }
    await mongooseConnectPromise
    const collections = await getCollectionsByOwner(address.toLowerCase())

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: collections,
        code: 200
    }, {status: 200})
}

const wrappedPost = withRequestError(getCollections)

export { wrappedPost as GET}