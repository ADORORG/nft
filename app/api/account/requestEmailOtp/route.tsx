import type AccountType from '@/lib/types/account'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import verifyEmailTemplate from '@/lib/mail_template/verify_email'
import sendEmail from '@/lib/handlers/mailer'
import { createOtp, getOtpByQuery } from '@/lib/handlers'
import { isValidEmail } from '@/lib/utils/main'
import { withRequestError, withSession } from '@/wrapper'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'

async function requestEmailOtp(request: NextRequest, _: {}, { user }: {user: AccountType}) {
    const body = await request.json()
    const { email } = body

    if (!isValidEmail(email)) {
        throw new CustomRequestError('Invalid email address', 400)
    }

    const sameVerifiedEmail = user.emailVerified && user?.email?.toLowerCase() === email.toLowerCase()
    if (sameVerifiedEmail) {
        throw new CustomRequestError('No need to verify same email address', 400)
    }

    await mongooseConnectPromise    
    const oneMinuteAgo = new Date(Date.now() - 60000)
    const lastOtp = await getOtpByQuery({
        owner: user._id, 
        createdAt: {$gte: oneMinuteAgo}
    })

    if (lastOtp) {
        throw new CustomRequestError('Wait a minute ☺️!', 400)
    }

    const emailOtp = (Math.floor(Math.random() * (999999 - 100000) + 100000)).toString()
    const newOtp = await createOtp({
        owner: user._id as string,
        otpFor: 'email',
        otpCode: emailOtp,
        data: email,
    })

    await sendEmail({
        to: email,
        subject: 'Email verification',
        text: `Your OTP is ${emailOtp}`,
        html: verifyEmailTemplate(emailOtp)
    })

    return NextResponse.json({
        success: true,
        message: 'OTP sent',
        data: {authentication: newOtp._id},
        code: 201
    }, {status: 201})
}

const wrappedRequest = withRequestError(withSession(requestEmailOtp))
export { wrappedRequest as POST}