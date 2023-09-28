import type AccountType from '@/lib/types/account'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { isValidEmail } from '@/lib/utils/main'
import { setAccountDetails } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

async function updateProfile(request: NextRequest, _: {}, { user }: {user: AccountType}) {
    const body = await request.json()
    const accountUpdateData = body as Partial<AccountType>
    const { name, twitter, discord, email } = accountUpdateData

    if (!isValidEmail(email)) {
        throw new CustomRequestError('Invalid email address', 400) 
    }

    await mongooseConnectPromise
    const updatedAccount = await setAccountDetails(user._id as string, {
        name, twitter, discord, email,
        // Email was previously verified and user is not changing it in this update
        emailVerified: user.emailVerified && email?.toLowerCase() === user?.email?.toLowerCase()
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