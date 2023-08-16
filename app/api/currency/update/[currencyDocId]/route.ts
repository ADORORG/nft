import type AccountType from '@/lib/types/account'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateCurrency, setCurrencyData, setAccountDetails } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'

async function updateCurrency(request: NextRequest, { params }: { params: {currencyDocId: string} }, { user }: {user: AccountType}) {
    await mongooseConnectPromise

    const userAccount = await setAccountDetails(user.address, {})

    if (!userAccount || !userAccount.roles || !userAccount.roles.includes('admin')) {
        throw new CustomRequestError('Unauthorized', 401)
    }

    const formData = await request.json()
    // validate the Currency data
    const isValidCurrency = await validateCurrency(formData)
    if (!isValidCurrency) {
        throw new CustomRequestError('Currency data is invalid', 400)
    }

    const updatedCurrency = await setCurrencyData(params.currencyDocId, {
        name: formData.name,
        cid: formData.cid,
        symbol: formData.symbol,
        decimals: formData.decimals,
        chainId: formData.chainId,
        address: formData.address,
        marketId: formData.marketId,
        logoURI: formData.logoURI,
        disabled: !!formData.disabled
    })

    // send the new currency in response
    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: updatedCurrency,
        code: 200
    }, {status: 200})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(updateCurrency))

export { wrappedPost as POST}