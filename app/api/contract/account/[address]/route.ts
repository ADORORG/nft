import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { getContractsByOwner } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { withRequestError } from '@/wrapper'

async function getContracts(_: NextRequest, { params }: {params: {address: string}}) {
    const { address } = params
    if (!address) {
        // throw bad request error
        throw new CustomRequestError('Account address is required', 400)
    }
    await mongooseConnectPromise
    const contracts = await getContractsByOwner(address.toLowerCase())

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: contracts,
        code: 200
    }, {status: 200})
}

const wrappedPost = withRequestError(getContracts)

export { wrappedPost as GET}