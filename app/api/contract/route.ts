import type { NextRequest, NextResponse } from 'next/server'
import databaseWrapper from '@/wrapper/database.wrapper'
import requestErrorWrapper from '@/wrapper/error.wrapper'

async function createContract(request: NextRequest, response: NextResponse) {

}

async function getContracts(request: NextRequest, response: NextResponse) {

}


const wrappedGet = databaseWrapper(requestErrorWrapper(getContracts))
const wrappedPost = databaseWrapper(requestErrorWrapper(createContract))

export {
    wrappedPost as POST,
    wrappedGet as GET
}