import type { Types, PopulateOptions } from 'mongoose'
import type { AnyBulkWriteOperation } from 'mongodb'
import type { EthereumAddress } from '../types/common'
import type NftTokenType from '../types/token'
import TokenModel from '../models/token'

export async function validateToken(document: any) {
    try {
        await TokenModel.validate(document)
        return true
    } catch(error) {
        // console.log(error)
        return false
    }
}

/**
 * Perform a bulk operation on token collection
 * @param bulkTokenOperation - Bulk operation
 * @returns - write result
 */
export function bulkWriteToken(bulkTokenOperation: AnyBulkWriteOperation[]) {
    return TokenModel.bulkWrite(bulkTokenOperation)
}

/**
 * Create a new token
 * @param token - Token data
 * @returns -  a populated newly created token
 */
export async function createToken(token: NftTokenType) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'contract',
            options: leanOption
        },
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

    return new TokenModel(token).save()
    .then( newToken => newToken.populate(populate))
}

/**
 * Get the redeemable content of a token. Callable by the token owner
 * @param tokenDocId - Token document _id
 * @param ownerId - The owner _id of the token
 * @returns a document with redeemable content or `null`
 */
export function getTokenRedeemableContent(tokenDocId: string | Types.ObjectId, ownerId: EthereumAddress) {

    return TokenModel.findOne({
        _id: tokenDocId,
        owner: ownerId
    })
    .select('redeemableContent') // only redeemable content needed
    .lean()
    .exec()
}

/**
 * Get tokens by owner id
 * @param ownerId - Owner id
 * @param skip - Tokens to skip
 * @returns an array of tokens owned by ownerId
 */
export function getTokensByOwner(ownerId: EthereumAddress, skip: number = 0) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'contract',
            options: leanOption
        },
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

    return TokenModel.find({
        owner: ownerId
    })
    .populate(populate)
    .select('-redeemableContent')
    .skip(skip)
    .limit(100)
    .lean()
    .exec()
}

/**
 * Get a list of tokens in a collection by id
 * @param collectionId - Collection id
 * @param skip - Number of token to skip
 * @returns a array of tokens matching the collection id
 */
export function getTokensByCollection(collectionId: Types.ObjectId | string, skip: number = 0) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'contract',
            options: leanOption
        },
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

    return TokenModel.find({
        xcollection: collectionId
    })
    .sort({createdAt: -1})
    .skip(skip)
    .limit(100)
    .select('-redeemableContent')
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Get a list of tokens in a contract by id
 * @param contractId - Contract id
 * @param skip - Number of token to skip
 * @returns a array of tokens matching the contract id
 */
export function getTokensByContract(contractId: Types.ObjectId | string, skip: number = 0) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'contract',
            options: leanOption
        },
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

    return TokenModel.find({
        contract: contractId
    })
    .sort({createdAt: -1})
    .skip(skip)
    .limit(100)
    .select('-redeemableContent')
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Get a token by query and increment the views
 * @param query - A filter query object
 * @param select - Optional fields to include/exclude
 * @returns a token populated document or `null`
 */
export function getTokenByQuery(
    query: Record<string, unknown>, 
    select: string = ''
    ) {
    
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'contract',
            options: leanOption
        },
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

    return TokenModel.findOneAndUpdate({
        ...query
    }, {
        // increase views everytime we request this token
        $inc: {views: 1}
    }, {
        new: true,
        upsert: false
    })
    .select(select + '-redeemableContent')
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Get many tokens by query
 * @param query - A filter query object
 * @param options - An option object
 * @returns 
 */
export function getTokensByQuery(
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
            path: 'contract',
            options: leanOption
        },
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

    return TokenModel.find({
        ...query
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(select + '-redeemableContent')
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Transfer a token to a different account
 * @param _id Token document _id
 * @param newOwnerId New owner account _id
 * @returns a populated token with the new owner
 */
export function setTokenOwner(_id: Types.ObjectId | string, newOwnerId: EthereumAddress) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'contract',
            options: leanOption
        },
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

    return TokenModel.findByIdAndUpdate(_id, {
        owner: newOwnerId
    }, {
        new: true,
        runValidators: true
    })
    .populate(populate)
    .select('-redeemableContent')
    .lean()
    .exec()
}

/**
 * Count token by query filter
 * @param query a filter object
 * @returns a document count
 */
export function countTokenByQuery(query: Record<string, unknown>) {
    return TokenModel.countDocuments({
        ...query
    })
    .exec()
}

/**
 * Estimate token by query filter
 * @param query a filter object
 * @returns a document count
 */
export function estimateTokenByQuery(query: Record<string, unknown>) {
    return TokenModel.estimatedDocumentCount({
        ...query
    })
    .exec()
}