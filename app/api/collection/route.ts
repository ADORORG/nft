import type { NextRequest, NextResponse } from 'next/server'
import { withRequestError } from '@/wrapper'


async function getCollections(request: NextRequest) {

}


const wrappedGet = (withRequestError(getCollections))

export {
    wrappedGet as GET
}