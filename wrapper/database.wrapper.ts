
import mongoose from 'mongoose'
import mongodbConnectionPromise from './mongodb_connect'
import type { NextRequest } from 'next/server'

/* 
* Establish database connection using an existing Mongoclient connection
* Close database connection (optional) for our app
*/

const readyState = mongoose.connection.readyState

export default function withDatabase<T extends Function>(func: T) {
    return async function withDbWrapper(request: NextRequest, ...restParams: any[]) {
        if (readyState !== 1) {
            // not connected
            const mongodbConnectionClient = await mongodbConnectionPromise
            const connection = mongoose.createConnection().setClient(mongodbConnectionClient)
            
            await connection.asPromise()
        }

        return func(request, ...restParams)
    }
}