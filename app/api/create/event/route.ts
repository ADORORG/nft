import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { Types } from 'mongoose'
import { CustomRequestError } from '@/lib/error/request'
import { validateContract, createContract, getContractById, createNftContractEvent, validateNftContractEvent, getCurrencyByQuery } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { dataUrlToReadableStream } from '@/lib/utils/file'
import { uploadMediaToIPFS } from '@/lib/utils/pinata'
import { zeroAddress } from '@/config/addresses'
import { type NextRequest, NextResponse } from 'next/server'
import type AccountType from '@/lib/types/account'
import type NftContractSaleEventType from '@/lib/types/event'
import type ContractType from '@/lib/types/contract'

async function createNewEvent(request: NextRequest, _: any, { user }: {user: AccountType}) {
    const body = await request.json()
    // We expect Contract and Event data to be in the body
    let { contract, event }: {contract: ContractType, event: NftContractSaleEventType} = body

    // Connect to mongoose
    await mongooseConnectPromise

    /**
     * We do not provide an option to set the event currency on the frontend.
     * We are manually fetching the default event currency using the event
     * blockchain network default coin.
     * @todo - Enable currency selection on the frontend and in smart contract
    */
    const currency = await getCurrencyByQuery({
        address: zeroAddress,// use Zero address to  default currency
        chainId: contract.chainId
    })

    if (!currency) {
        throw new CustomRequestError('The blockchain currency needs to be created first.', 400)
    }

    event.owner = user.address
    /** @todo - Implement currency select on the frontend */
    event.currency = currency
    /** @todo - Implement fixed & auction sale on the frontend */
    event.saleType = 'fixed'

    let isNewContract = false
    // If _id is in contract, we are using existing contract to create event
    if (contract._id) {
        // fetch the contract
        const existingContract = await getContractById(contract._id)
        if (!existingContract) {
            throw new CustomRequestError('Invalid contract selected for event', 400)
        }
        // Attach the contract to the event
        event.contract = existingContract
    } else {
        // validate the contract and create it
        // Add owner, royalty, royaltyReceiver, and nftEdition to the contract
        contract.owner = user.address
        contract.royalty = event.royalty
        contract.royaltyReceiver = event.royaltyReceiver
        contract.nftEdition = event.nftEdition
        // Manually create _id for contract document
        contract._id = new Types.ObjectId()

        const isValidContract = await validateContract(contract)

        if (!isValidContract) {
            throw new CustomRequestError('New Contract data is invalid', 400)
        }

        event.contract = contract
        // we need to create the contract
        isNewContract = true
    }

     // validate the event
    const isValidEvent = await validateNftContractEvent(event)
    if (!isValidEvent) {
        throw new CustomRequestError('Event data is invalid', 400)
    }

    /** 
     * Upload media to ipfs
     * @todo Convert media to stream and upload to decentralized storage 
    */
    // Convert dataURI to readable stream
    const mediaId = `${contract.contractAddress}#media`
    const mediaStream = dataUrlToReadableStream(event.media, mediaId)
    const mediaHash = await uploadMediaToIPFS(mediaStream, mediaId)
   
    // Create the contract
    if (isNewContract) {
        contract = await createContract(contract)
    }

    // Create the event
    const newEvent = await createNftContractEvent({
        ...event,
        media: mediaHash,
        contract: contract
    })

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: newEvent,
        code: 201
    }, {status: 201})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(createNewEvent))

export { wrappedPost as POST}