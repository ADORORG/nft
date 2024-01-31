import type { default as AccountType, AccountNotificationType } from '@/lib/types/account'
import { type NextRequest, NextResponse } from 'next/server'
import { setAccountDetails } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

async function setNotification(request: NextRequest, _: {}, { user }: {user: AccountType}) {
    const notification = await request.json() as AccountNotificationType

    await mongooseConnectPromise
    
    const updatedAccount = await setAccountDetails(user._id as string, {
        notification
    })

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: updatedAccount,
        code: 200
    }, {status: 200})
}

const wrappedRequest = withRequestError(withSession(setNotification))
export { wrappedRequest as POST}