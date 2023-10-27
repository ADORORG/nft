import { type NextRequest, NextResponse } from 'next/server'
import { getContractsByQuery } from '@/lib/handlers'
import { withRequestError } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

export const dynamic = 'force-dynamic'

async function searchContract(request: NextRequest) {
    const query = request.nextUrl.searchParams
    const searchQuery = query.get('q') || ''
    let results

    if (searchQuery && searchQuery.length) {
        await mongooseConnectPromise
        results = await getContractsByQuery({
            contractAddress: {
                $regex: new RegExp(searchQuery.toLowerCase(), 'i'),
            }
        }, {limit: 10})
    }

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: results || [],
        code: 200
    }, {status: 200})
}


const wrappedRequest = withRequestError(searchContract)

export {
    wrappedRequest as GET
}