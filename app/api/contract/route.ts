import type { NextRequest, NextResponse } from 'next/server'
import { withRequestError } from '@/wrapper'

async function getContracts(request: NextRequest, response: NextResponse) {

}


const wrappedGet = withRequestError(getContracts)

export {
    wrappedGet as GET
}