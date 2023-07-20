import type { Types } from 'mongoose'
import type { EthereumAddress } from '../types/common'
import type ContractType from '../types/contract'
import ContractModel from '../models/contract'

/**
 * Create a new contract
 * @param contract - The contract data to create
 * @returns an `owner` account populated newly created contract or `null`
 */
export async function createContract(contract: ContractType) {
    const populate = [
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ]

    return new ContractModel(
        contract
    ).save()
    .then( newContract => newContract.populate(populate))
}

/**
 * Get a contract data
 * @param contractAddress - Contract Address
 * @returns an `owner` account populated contract data
 */
export function getContractByAddress(contractAddress: EthereumAddress) {
    const populate = [
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ]

    return ContractModel.findOne({
        contractAddress
    })
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Get a list of contracts owned by an account
 * @param ownerId - The owner id of the contract address
 * @returns an array of `owner` account populated contract
 */
export function getContractsByOwner(ownerId: EthereumAddress) {
    const populate = [
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ]

    return ContractModel.find({
        owner: ownerId
    })
    .populate(populate)
    .lean()
}

/**
 * Get a contract data by _id
 * @param _id - Contract objectId 
 * @returns an `owner` account populated contract data
 */
export function getContractById(_id: Types.ObjectId | string) {
    const populate = [
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ]

    return ContractModel.findById(_id)
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Get or create a contract
 * @param query - Filter object
 * @param update - Update object
 * @returns - an updated contract or a newly created contract
 */
export async function getOrCreateContractByQuery(query: Partial<Record<keyof ContractType, unknown>>, update: Partial<Record<keyof ContractType, unknown>>) {
    const populate = [
        {
            path: 'owner',
            select: '-email -roles -emailVerified -__v'
        }
    ];

    /**
     * Mongoose only provide option to validate each field in an update
     * However, we need to validate the whole document that'll be inserted because of upsert:true
     * To validate, we merge the query and update then validate
     * If validation is passed, we can upsert otherwise, we'll attempt to perform only update
     */
    let isValidateDocToUpsert = true;

    try {
        await ContractModel.validate({...query, ...update});
    } catch(error) {
        isValidateDocToUpsert = false
    }

    return ContractModel.findOneAndUpdate(
        {...query}, 
        {...update}, {
        new: true,
        upsert: isValidateDocToUpsert,
    })
    .populate(populate)
    .lean()
    .exec()
}


/**
 * Count contract by query filter
 * @param query - a filter object
 * @returns a document count
 */
export function countContractByQuery(query: Partial<Record<keyof ContractType, unknown>>) {
    return ContractModel.countDocuments({
        ...query
    })
    .exec()
}

/**
 * Get contract estimate by optional query filter
 * @param query - a filter object
 * @returns a document count
 */
export function estimateContractByQuery(query: Partial<Record<keyof ContractType, unknown>>) {
    return ContractModel.estimatedDocumentCount({
        ...query
    })
    .exec()
}