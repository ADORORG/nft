import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateContract } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'
import createOrUpdateContract from '.'
import type AccountType from '@/lib/types/account'
import type { PopulatedContractType } from '@/lib/types/contract'

async function createNewContract(request: NextRequest, _: any, { user }: {user: AccountType}) {
    const contract = await request.json() as PopulatedContractType
    /** Overwrite owner to address in session */
    contract.owner = user
    const isValidContract = await validateContract(contract)

    if (!isValidContract) {
        throw new CustomRequestError('Contract data is invalid', 400)
    }
    
    await mongooseConnectPromise

    let newContract = await createOrUpdateContract(contract)

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