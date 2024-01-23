import { type NextRequest, NextResponse } from 'next/server'
import type AccountType from '@/lib/types/account'
import { isEthereumAddress } from '@/utils/main'
import { getAccountsByQuery } from '@/lib/handlers'
import { CustomRequestError } from '@/lib/error/request'
import { withRequestError } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

export const dynamic = 'force-dynamic'

async function searchAccount(request: NextRequest) {
    const query = request.nextUrl.searchParams
    const searchQuery = query.get('q') || ''

    if (!isEthereumAddress(searchQuery)) {
        throw new CustomRequestError('Invalid search query')
    }

    let results: AccountType[] = []

    if (searchQuery && searchQuery.length) {
        await mongooseConnectPromise
        results = await getAccountsByQuery({
            address: searchQuery.toLowerCase()
        }, {})
    }

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: results,
        code: 200
    }, {status: 200})
}


const wrappedRequest = withRequestError(searchAccount)

export {
    wrappedRequest as GET
}