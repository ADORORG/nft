import type { Types } from 'mongoose'
import type { PopulateOptions } from 'mongoose'
import type NftContractEventType from '../types/event'
import NftContractEventModel from '../models/event'

export async function validateNftContractEvent(document: any) {
    try {
        await NftContractEventModel.validate(document)
        return true
    } catch(error) {
        console.log(error)
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
            path: 'contract',
            options: leanOption
        },
        {
            path: 'currency',
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
    .then( (newContractSaleEvent) => newContractSaleEvent.populate(populate))
}


/**
 * Get a event data by _id
 * @param _id - Event objectId 
 * @returns a populated event data
 */
export function getEventById(_id: Types.ObjectId | string) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'xcollection',
            options: leanOption
        },
        {
            path: 'contract',
            options: leanOption
        },
        {
            path: 'currency',
            options: leanOption
        },
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return NftContractEventModel.findById(_id)
    .populate(populate)
    .lean()
    .exec()
}


/**
 * Get a events data by query
 * @param query - Filter object
 * @returns - an array of populated events
 */
export async function getEventsByQuery(
    query: Record<string, unknown>,
    options: {
        limit?: number,
        skip?: number,
        sort?: Record<string, any>,
        select?: string
    }) {
    const {
        limit = 100,
        skip = 0,
        sort = {createdAt: -1},
        select = ''
    } = options

    const leanOption = {lean: true}
    const populate = [
        {
            path: 'xcollection',
            options: leanOption
        },
        {
            path: 'contract',
            options: leanOption
        },
        {
            path: 'currency',
            options: leanOption
        },
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

   
    return NftContractEventModel.find({
        ...query
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(select)
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Update Event data
 * @param _id 
 * @param updateData 
 * @returns 
 */
export function setEventData(_id: Types.ObjectId | string, updateData: Record<string, unknown>) {
    return NftContractEventModel.findByIdAndUpdate(_id, updateData, {
        new: true
    })
    .lean()
    .exec()
}


/**
 * Count events by query filter
 * @param query - a filter object
 * @returns a document count
 */
export function countEventByQuery(query: Record<string, unknown>) {
    return NftContractEventModel.countDocuments({
        ...query
    })
    .exec()
}

/**
 * Get event estimate by optional query filter
 * @param query - a filter object
 * @returns a document count
 */
export function estimateEventByQuery(query: Record<string, unknown>) {
    return NftContractEventModel.estimatedDocumentCount({
        ...query
    })
    .exec()
}