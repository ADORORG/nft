import type AccountType from '@/lib/types/account'
import { type NextRequest, NextResponse } from 'next/server'
import { setAccountDetails } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

async function updateProfile(request: NextRequest, _: {}, { user }: {user: AccountType}) {
    const body = await request.json()
    const accountUpdateData = body as Partial<AccountType>
    const { name, twitter, discord, telegram } = accountUpdateData

    await mongooseConnectPromise
    const updatedAccount = await setAccountDetails(user._id as string, {
        name, twitter, discord, telegram
    })

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: updatedAccount,
        code: 200
    }, {status: 200})
}

const wrappedGet = withRequestError(withSession(updateProfile))
export { wrappedGet as POST}