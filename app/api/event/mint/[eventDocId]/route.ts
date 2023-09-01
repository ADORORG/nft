import mongooseConnectPromise from '@/wrapper/mongoose_connect'
import { CustomRequestError } from '@/lib/error/request'
import { getEventById, setEventData, setAccountDetails, createManyTokens, createManyOrders} from '@/lib/handlers'
import { withRequestError, withSession } from '@/wrapper'
import { type NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import type { OnchainMintResponse } from "@/lib/types/common"
import type { PopulatedNftContractEventType } from '@/lib/types/event'
import type AccountType from '@/lib/types/account'
import type NftTokenType from '@/lib/types/token'
import type MarketOrderType from '@/lib/types/market'

async function mintOnSaleEvent(request: NextRequest, { params }: {params: {eventDocId: string}}, { user }: {user: AccountType}) {
    const mintData = await request.json() as OnchainMintResponse[]

    if (!mintData || !Array.isArray(mintData)) {
        throw new CustomRequestError('Invalid mint data', 400)
    }

    // Connect to mongoose
    await mongooseConnectPromise
    const mintEventData = await getEventById(params.eventDocId) as PopulatedNftContractEventType
    if (!mintEventData) {
        throw new CustomRequestError('Invalid event data', 400)
    }

    // Get the owner of the minted tokens from the database if they are not current user
    const owners = await Promise.all(mintData.map(mint => {
        if (mint.to.toLowerCase() === user.address.toLowerCase()) {
            // return current session user
            return {_id: user.address, address: user.address}
        }
        // return a promise to fetch the owner from the database
        return setAccountDetails(mint.to, {address: mint.to})
    }))

    // Mint the tokens
    const tokens = await createManyTokens(mintData.map((mint, index) => {
        return {
            tokenId: Number(mint.tokenId),
            supply: mint.quantity,
            // Use contract name/label as token name
            name: mintEventData.contract.label,
            // Use xcollection to which this event belong as the description
            description: mintEventData.xcollection.description,
            image: mintEventData.media,
            media: mintEventData.media,
            mediaType: mintEventData.mediaType,
            attributes: mintEventData.attributes,
            royalty: mintEventData.royalty,
            transferrable: mintEventData.transferrable,
            contract: mintEventData.contract,
            xcollection: mintEventData.xcollection,
            owner: owners[index]._id as string,
        } satisfies NftTokenType
    }), {
        // Do not validate because we are manually creating the token
        lean: true
    })
    // Create the market order for the minted tokens
    await createManyOrders(tokens.map(token => {
        return {
            token: token._id,
            price: mintEventData.price.toString(),
            soldPrice: mintEventData.price.toString(),
            saleType: 'fixed',
            quantity: 1,
            seller: mintEventData.owner._id as string,
            buyer: token.owner,
            permitType: 'onchain',
            status: 'sold',
            /** 
             * Option to select event currency is not provided on the fronted.
             * Whenever we create a new event, we manually set the default event currency
             * to the blockchain network default coin.
             */
            currency: mintEventData.currency,
            // Not really needed for sold orders
            // Because we are not using this order to create a onchain transaction
            version: 'event',
        } satisfies MarketOrderType
    }), {
        // Do not validate because we are manually creating the order
        lean: true
    })

    // Update the sale event
    const updatedEvent = await setEventData(mintEventData._id as Types.ObjectId, {
        $inc: {
            supplyMinted: mintData.length,
            ethRaised: mintEventData.price * mintData.length
        }
    })

    return NextResponse.json({
        success: true,
        message: 'Operation completed successfully',
        data: updatedEvent,
        code: 201
    }, {status: 201})
}

// wrap error and session handler
const wrappedPost = withRequestError(withSession(mintOnSaleEvent))

export { wrappedPost as POST}