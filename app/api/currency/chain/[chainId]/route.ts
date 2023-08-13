import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { getCurrenciesByChainId } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { withRequestError } from '@/wrapper'

async function getCurrencyByChainId(_: NextRequest, { params }: {params: {chainId: string}}) {
    const  { chainId } = params
    if (!chainId) {
        // throw bad request error
        throw new CustomRequestError('Chain id is required', 400)
    }
    
    await mongooseConnectPromise
    const currencies = await getCurrenciesByChainId(Number(chainId))

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: currencies,
        code: 200
    }, {status: 200})
}

const wrappedGet = withRequestError(getCurrencyByChainId)

export { wrappedGet as GET}