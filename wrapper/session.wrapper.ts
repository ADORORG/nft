import type { NextRequest } from 'next/server'
import { getAccountSession } from '@/app/api/auth/[...nextauth]/route'
import { CustomRequestError } from '@/lib/error/request'

/**
 * Session checker and wrapper for request that requires authentication
 * App router exported function takes (request, context) as argument.
 * We are passing 'session' as the last argument to request&response function handler
 * @param func - app router req handler function
 * @returns 
 */
export default function withSession<T extends Function>(func: T, adminOnly: boolean = false) {
    return async function withSession(request: NextRequest, ...restParams: any[]) {
        const session = await getAccountSession(request as any)
        if (!session ||  session?.user?.banned) {
            return Promise.reject(new CustomRequestError('Unauthorized', 401))
        }
        if (adminOnly && (!session?.user?.roles || !session?.user?.roles.includes('admin'))) {
            return Promise.reject(new CustomRequestError('Unauthorized', 403))
        }
        return func(request, ...restParams, session)
    }
}