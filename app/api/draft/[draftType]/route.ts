import type AccountType from '@/lib/types/account'
import { type NextRequest, NextResponse } from 'next/server'
import { CustomRequestError } from '@/lib/error/request'
import { getContractsByQuery, getTokensByQuery, getEventsByQuery } from '@/lib/handlers'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { withRequestError, withSession } from '@/wrapper'

type DraftDataType = 'token' | 'event' | 'contract'

async function getDraftData(_: NextRequest, { params }: {params: {draftType: DraftDataType}}, { user }: {user: AccountType}) {
    const { draftType } = params
    let draftData

    await mongooseConnectPromise
    
    if (draftType === 'contract') {
        draftData = await getContractsByQuery({
            draft: true,
            owner: user._id,
        }, {limit: 10})

    } else if (draftType === 'token') {
        draftData = await getTokensByQuery({
            draft: true,
            owner: user._id,
        }, {limit: 10})

    } else if (draftType === 'event') {
        draftData = await getEventsByQuery({
            draft: true,
            owner: user._id,
        }, {limit: 10})

    } else {
        throw new CustomRequestError('Request not understood', 400)
    }

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: draftData,
        code: 200
    }, {status: 200})
}

const wrappedGet = withRequestError(withSession(getDraftData))

export { wrappedGet as GET}