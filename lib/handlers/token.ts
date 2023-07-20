import type { Types } from 'mongoose'
import type { AnyBulkWriteOperation } from 'mongodb'
import type { EthereumAddress } from '../types/common'
import NftTokenType from '../types/token'
import TokenModel from '../models/token'

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
    const populate = [
        {
            path: 'contract',
        },
        {
            path: 'xcollection',
        },
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ]

    return new TokenModel(token).save()
    .then( newToken => newToken.populate(populate))
}

/**
 * Get tokens by owner id
 * @param ownerId - Owner id
 * @param skip - Tokens to skip
 * @returns an array of tokens owned by ownerId
 */
export function getTokensByOwner(ownerId: EthereumAddress, skip: number = 0) {
    const populate = [
        {
            path: 'contract',
        },
        {
            path: 'xcollection',
        },
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ]

    return TokenModel.find({
        owner: ownerId
    })
    .populate(populate)
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
    const populate = [
        {
            path: 'contract',
        },
        {
            path: 'xcollection',
        },
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ]

    return TokenModel.find({
        xcollection: collectionId
    })
    .sort({createdAt: -1})
    .skip(skip)
    .limit(100)
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
export function getTokensByContract(contractId: Types.ObjectId  | string, skip: number = 0) {
    const populate = [
        {
            path: 'contract',
        },
        {
            path: 'xcollection',
        },
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ]

    return TokenModel.find({
        contract: contractId
    })
    .sort({createdAt: -1})
    .skip(skip)
    .limit(100)
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
    query: Partial<Record<keyof NftTokenType, unknown>>, 
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
    
    const populate = [
        {
            path: 'contract',
        },
        {
            path: 'xcollection',
        },
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ]

    return TokenModel.find({
        ...query
    })
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select(select)
    .populate(populate)
    .lean()
    .exec();
}

/**
 * Transfer a token to a different account
 * @param _id Token document _id
 * @param newOwnerId New owner account _id
 * @returns a populated token with the new owner
 */
export function setTokenOwner(_id: Types.ObjectId | string, newOwnerId: EthereumAddress) {
    const populate = [
        {
            path: 'contract',
        },
        {
            path: 'xcollection',
        },
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ]

    return TokenModel.findByIdAndUpdate(_id, {
        owner: newOwnerId
    }, {
        new: true,
        runValidators: true
    })
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Count token by query filter
 * @param query a filter object
 * @returns a document count
 */
export function countTokenByQuery(query: Partial<Record<keyof NftTokenType, unknown>>) {
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
export function estimateTokenByQuery(query: Partial<Record<keyof NftTokenType, unknown>>) {
    return TokenModel.estimatedDocumentCount({
        ...query
    })
    .exec()
}