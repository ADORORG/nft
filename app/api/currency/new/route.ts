import type AccountType from '@/lib/types/account'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateCurrency, createCurrency, setAccountDetails } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'

async function addNewCurrency(request: NextRequest, _: any, { user }: {user: AccountType}) {
    await mongooseConnectPromise

    const userAccount = await setAccountDetails(user.address, {})

    if (!userAccount || !userAccount.roles || !userAccount.roles.includes('admin')) {
        throw new CustomRequestError('Unauthorized', 401)
    }

    const formData = await request.formData()
    const currencyData: Record<string, any> = {}

    for (const key of formData.keys()) {
        currencyData[key] = formData.get(key) || ""
    }

    // validate the Currency data
    const isValidCurrency = await validateCurrency(currencyData)
    if (!isValidCurrency) {
        throw new CustomRequestError('Currency data is invalid', 400)
    }

    const newCurrency = await createCurrency({
        name: currencyData.name,
        cid: currencyData.cid,
        symbol: currencyData.symbol,
        decimals: currencyData.decimals,
        chainId: currencyData.chainId,
        address: currencyData.address,
        marketId: currencyData.marketId,
        logoURI: currencyData.logoURI
    })

    // send the new currency in response
    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: newCurrency,
        code: 201
    }, {status: 201})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(addNewCurrency))

export { wrappedPost as POST}