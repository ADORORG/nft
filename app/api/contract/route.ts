import { type NextRequest, NextResponse } from 'next/server'
import { withRequestError } from '@/wrapper'

async function getContracts(request: NextRequest, response: NextResponse) {
    return NextResponse.json({
        message:  "Not implemented"
    }, {status: 501})
}


const wrappedGet = withRequestError(getContracts)

export {
    wrappedGet as GET
}