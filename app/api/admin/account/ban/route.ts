import { type NextRequest, NextResponse } from 'next/server'
import { isEthereumAddress } from '@/utils/main'
import { getAccountsByQuery, setAccountDetails } from '@/lib/handlers'
import { CustomRequestError } from '@/lib/error/request'
import { withRequestError, withSession } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

async function toggleAccountBan(req: NextRequest) {
    const {accountId} = await req.json() as {accountId: string}
    
    if (!isEthereumAddress(accountId)) {
        throw new CustomRequestError('Invalid account id')
    }

    await mongooseConnectPromise
    const accounts = await getAccountsByQuery({
        _id: accountId.toLowerCase()
    }, {})

    if (!accounts.length) {
        throw new CustomRequestError('Account not found')
    }

    const account = accounts[0]

    await setAccountDetails(accountId, {
        banned: !account.banned
    })

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: null,
        code: 200
    }, {status: 200})
}


const wrappedRequest = withRequestError(withSession(toggleAccountBan, true))

export {
    wrappedRequest as POST
}