import type AccountType from '@/lib/types/account'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { setAccountEmailVerified, setOtpVerified } from '@/lib/handlers'
import { isValidEmail } from '@/lib/utils/main'
import { withRequestError, withSession } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

async function verifyAccountEmail(request: NextRequest, _: {}, { user }: {user: AccountType}) {
    const body = await request.json()
    const { otp, authentication, email } = body

    if (!isValidEmail(email) || !authentication || !otp) {
        throw new CustomRequestError('Invalid data in request', 400)
    }

    await mongooseConnectPromise
    /** Get the otp document and set the verified date a go.
     * returns `null` if the passed query does not match any valid otp
     */
    const otpDoc = await setOtpVerified({
        _id: authentication, 
        otpCode: otp, 
        otpFor: 'email', 
        owner: user._id,
        data: email,
    })

    if (!otpDoc) {
        throw new CustomRequestError('Invalid OTP', 400)
    }

    const updatedAccount = await setAccountEmailVerified(user._id as string, email)

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: updatedAccount,
        code: 200
    }, {status: 200})
}

const wrappedRequest = withRequestError(withSession(verifyAccountEmail))
export { wrappedRequest as POST}