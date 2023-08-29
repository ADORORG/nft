import type { PopulateOptions } from 'mongoose'
import type NftContractEventType from '../types/event'
import NftContractEventModel from '../models/event'

export async function validateNftContractEvent(document: any) {
    try {
        await NftContractEventModel.validate(document)
        return true
    } catch(error) {
        // console.log(error)
        return false
    }
}

/**
 * Create a new nft contract sale event
 * @param contract - The nft contract sale event data to create
 * @returns a `xcollection` and `owner` account populated newly created nft contract sale event or `null`
 */
export async function createNftContractEvent(contract: NftContractEventType) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'xcollection',
            options: leanOption
        },
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return new NftContractEventModel(
        contract
    ).save()
    /** How do we annotate a discriminator return type from .save()? */
    .then( (newContractSaleEvent: any) => newContractSaleEvent.populate(populate))
}
