import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { getCollectionBySlug } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { withRequestError } from '@/wrapper'

async function getCollection(_: NextRequest, { params }: {params: {slug: string}}) {
    const  { slug } = params
    if (!slug) {
        // throw bad request error
        throw new CustomRequestError('Collection slug is required', 400)
    }
    if (slug.length < 3) {
        throw new CustomRequestError('Collection slug is too short')
    }

    if (slug.length > 24) {
        throw new CustomRequestError('Collection slug is too long')
    }
    
    await mongooseConnectPromise
    const collection = await getCollectionBySlug(slug)

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: collection,
        code: 200
    }, {status: 200})
}

const wrappedGet = withRequestError(getCollection)

export { wrappedGet as GET}