import type { NextRequest, NextResponse } from 'next/server'
import databaseWrapper from '@/wrapper/database.wrapper'
import requestErrorWrapper from '@/wrapper/error.wrapper'

async function createCollection(request: NextRequest, response: NextResponse) {

}

async function getCollections(request: NextRequest, response: NextResponse) {

}


const wrappedGet = databaseWrapper(requestErrorWrapper(getCollections))
const wrappedPost = databaseWrapper(requestErrorWrapper(createCollection))

export {
    wrappedPost as POST,
    wrappedGet as GET
}