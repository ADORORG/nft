import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateContract, createContract, getContractsByQuery, getOrCreateContractByQuery } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'
import AccountType from '@/lib/types/account'
import NftContractType from '@/lib/types/contract'

async function createNewContract(request: NextRequest, _: any, { user }: {user: AccountType}) {
    const contract = await request.json() as NftContractType
    /** Overwrite owner to address in session */
    contract.owner = user.address
    const isValidContract = await validateContract(contract)

    if (!isValidContract) {
        throw new CustomRequestError('Contract data is invalid', 400)
    }
    
    await mongooseConnectPromise

    let newContract: NftContractType | null

    if (contract._id) {
        // we are updating the contract.
        // Contract address must be provided
        if (!contract.contractAddress) {
            throw new CustomRequestError('Contract address is missing', 400)
        }

        const draftQuery = {
            _id: contract._id,
            owner: contract.owner,
            draft: true
        }

        const prevContracts = await getContractsByQuery(draftQuery, {limit: 1})

        if (prevContracts.length) {
            throw new CustomRequestError('Draft contract not found', 400)
        }

        newContract = await getOrCreateContractByQuery(draftQuery, {
            version: contract.version,
            contractAddress: contract.contractAddress,
            chainId: contract.chainId,
            draft: false
        })

    } else {
        // create a draft contract pending deployment
        newContract = await createContract(contract)
    }

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