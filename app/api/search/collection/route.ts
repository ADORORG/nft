import { type NextRequest, NextResponse } from 'next/server'
import { getCollectionsByQuery } from '@/lib/handlers'
import { withRequestError } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

export const dynamic = 'force-dynamic'

async function searchCollection(request: NextRequest) {
    const query = request.nextUrl.searchParams
    const searchQuery = query.get('q') || ''
    let results

    if (searchQuery && searchQuery.length) {
        await mongooseConnectPromise
        results = await getCollectionsByQuery({
            slug: {
                $regex: new RegExp(searchQuery.toLowerCase(), 'i'),
            }
        }, {limit: 20})
    }

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: results || [],
        code: 200
    }, {status: 200})
}


const wrappedRequest = withRequestError(searchCollection)

export {
    wrappedRequest as GET
}