import { NextResponse } from 'next/server'
import { getAllCurrencies } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { withRequestError } from '@/wrapper'

async function getCurrencies() {   
    await mongooseConnectPromise
    const currencies = await getAllCurrencies()

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: currencies,
        code: 200
    }, {status: 200})
}

const wrappedGet = withRequestError(getCurrencies)

export { wrappedGet as GET}