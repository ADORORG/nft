import type { PopulateOptions } from 'mongoose'
import type { EthereumAddress } from '../types/common'
import type CollectionType from '../types/collection'
import CollectionModel from '../models/collection'

export async function validateCollection(document: any) {
    try {
        await CollectionModel.validate(document)
        return true
    } catch(error) {
        console.log(error)
        return false
    }
}

/**
 * Create a new collection
 * @param collection 
 * @returns an `owner` account populated collection
 */
export async function createCollection(collection: CollectionType) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return new CollectionModel(collection).save()
    .then(newCollection => newCollection.populate(populate))
}

/**
 * Get collections owned by an account (eth address)
 * @param ownerId - Owner id 
 * @param skip - Collections to skip in find query
 * @returns an array of `owner' account populated collections
 */
export function getCollectionsByOwner(ownerId: EthereumAddress, skip: number = 0) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return CollectionModel.find({
        owner: ownerId
    })
    .skip(skip)
    .limit(100)
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Get a collection by unique collection slug
 * @param slug - A unique collection slug
 * @returns an `owner' account populated collection or `null`
 */
export function getCollectionBySlug(slug: string) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return CollectionModel.findOne({
        slug
    })
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Get collections by query, sorted by created date in descending order
 * @param query - a query object
 * @param skip - Collections to skip in find query
 * @returns a maximum of 100 `owner` account populated collections
 */
export function getCollectionsByQuery(query: Partial<Record<keyof CollectionType, unknown>>, skip: number = 0) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return CollectionModel.find({...query})
    .skip(skip)
    .limit(100)
    .sort({createdAt: -1})
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Count collection by query filter
 * @param query - a filter object
 * @returns a document count
 */
export function countCollectionByQuery(query: Partial<Record<keyof CollectionType, unknown>>) {
    return CollectionModel.countDocuments({
        ...query
    })
    .exec()
}

/**
 * Get collection estimate by optional query filter
 * @param query - a filter object
 * @returns a document count
 */
export function estimateCollectionByQuery(query: Partial<Record<keyof CollectionType, unknown>>) {
    return CollectionModel.estimatedDocumentCount({
        ...query
    })
    .exec()
}