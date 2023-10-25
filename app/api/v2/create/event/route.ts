import { type NextRequest, NextResponse } from 'next/server'
import type AccountType from '@/lib/types/account'
import type { default as NftContractEventType, PopulatedNftContractEventType } from '@/lib/types/event'
import type { PopulatedContractType } from '@/lib/types/contract'
import { Types } from 'mongoose'
import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { validateContract, getAndUpdateEventByQuery, createNftContractEvent, validateNftContractEvent, getCurrencyByQuery } from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { zeroAddress } from '@/config/addresses'
import { nftEditionChecker } from "@/utils/contract"
import { isEthereumAddress } from '@/lib/utils/main'
import createOrUpdateContract from '../contract'

async function createNewEvent(request: NextRequest, _: any, { user }: {user: AccountType}) {
    const eventData = await request.json() as Partial<PopulatedNftContractEventType>
    // Connect to mongoose
    await mongooseConnectPromise
    /**
     * We do not provide an option to set the event currency on the frontend.
     * We are manually fetching the default event currency using the event
     * blockchain network native coin.
     * @todo - Enable currency selection on the frontend and in smart contract
    */
    const currency = await getCurrencyByQuery({
        address: zeroAddress,// use Zero address to fetch the default currency (blockchain native coin)
        chainId: eventData?.contract?.chainId
    })

    if (!currency) {
        throw new CustomRequestError('The blockchain native currency is not found', 400)
    }

    // Copy the event contract to a new contract object
    const contract = {...eventData.contract} as Partial<PopulatedContractType>
    
    // Attach owner
    contract.owner = user
    eventData.owner = user

    /** @todo - Implement currency select on the frontend */
    eventData.currency = currency
    /** @todo - Implement fixed & auction sale on the frontend */
    eventData.saleType = 'fixed'

    // validate the event. Attach a temporary contract _id to the event for validation purpose
    eventData.contract = new Types.ObjectId() as any

    const isValidEvent = await validateNftContractEvent(eventData)
    if (!isValidEvent) {
        throw new CustomRequestError('Event data is invalid', 400)
    }

    let newEvent: NftContractEventType | null = null

    if (eventData?._id) {
        // Event was previously created as draft

        // validate the contract
        const isValidContract = await validateContract(contract)
        if (!isValidContract) {
            throw new CustomRequestError('Contract data is invalid', 400)
        }
        // Update the contract
        eventData.contract = await createOrUpdateContract(contract as PopulatedContractType)
        // Determine draft status
        // A limited supply will have a contract address and a partition id
        // Open_edition will have a contract address but no partition id
        const editionType = nftEditionChecker(eventData.nftEdition)
        const isDraft = (
                (editionType.isLimitedSupply || editionType.isOneOfOne) && eventData.partitionId !== undefined 
                ? false 
                :
                editionType.isOpenEdition && isEthereumAddress(contract?.contractAddress)
                ? false
                : true
            )

        newEvent = await getAndUpdateEventByQuery(
            {
                _id: eventData._id,
                owner: user._id,
                draft: true,
            }, {
                ...eventData,
                draft: isDraft,
            }, false)
    } else {
        // Create a new event as a draft
        
        // Add owner, royalty, royaltyReceiver, and nftEdition to the contract
        const newContract = {
            royalty: eventData.royalty || 0,
            royaltyReceiver: eventData.royaltyReceiver,
            nftEdition: eventData.nftEdition as any,
            contractAddress: "",
            ...contract
        } as PopulatedContractType

        const isValidContract = await validateContract(newContract)
        if (!isValidContract) {
            throw new CustomRequestError('New Contract data is invalid', 400)
        }

        // Create the contract
        eventData.contract = await createOrUpdateContract(newContract as PopulatedContractType)
        // set to draft by default
        eventData.draft = true
        newEvent = await createNftContractEvent(eventData as NftContractEventType)
    }

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