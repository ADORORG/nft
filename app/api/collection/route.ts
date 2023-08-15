import { type NextRequest, NextResponse } from 'next/server'
import { withRequestError } from '@/wrapper'


async function getCollections(request: NextRequest) {
    return NextResponse.json({
        message:  "Not implemented"
    }, {status: 501})
}


const wrappedGet = (withRequestError(getCollections))

export {
    wrappedGet as GET
}