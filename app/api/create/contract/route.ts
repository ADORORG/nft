import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateContract, createContract } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'
import AccountType from '@/lib/types/account'


async function createNewContract(request: NextRequest, _: any, { user }: {user: AccountType}) {
    const body = await request.json()
    /** Overwrite owner to address in session */
    body.owner = user.address
   
    const isValidContract = await validateContract(body)
    if (!isValidContract) {
        throw new CustomRequestError('Contract data is invalid', 400)
    }
    
    await mongooseConnectPromise
    const newContract = await createContract(body)

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: newContract,
        code: 201
    }, {status: 201})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(createNewContract))

export { wrappedPost as POST}