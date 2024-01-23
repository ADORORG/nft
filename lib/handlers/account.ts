import type { EthereumAddress } from '../types/common'
import type AccountType from '../types/account'
import AccountModel from '../models/account'

/**
 * Create a new user account
 * @param account 
 * @returns 
 */
export function createAccount(account: AccountType): Promise<AccountType>{
    return new AccountModel(account).save();
}

/**
 * Update a user account details or create new one if not exist
 * This can be used to get an account by _id
 * @param _id - The account ETH Address
 * @param details - The details to update
 * @returns - The updated account
 * @example setAccountDetails(_id, {}) returns matching account
 */
export function setAccountDetails(_id: EthereumAddress, details: Partial<AccountType>) {
    return AccountModel.findByIdAndUpdate(_id, details, {
        new: true,
        upsert: true, /** Create new if not exist */
        runValidators: true
    })
}

/**
 * Set Account emailVerified to `true`
 * @param _id - The account ETH Address
 * @param email 
 * @returns - The updated account
 */
export function setAccountEmailVerified(_id: EthereumAddress, email: string) {
    return AccountModel.findByIdAndUpdate(_id, {
        emailVerified: true,
        email: email.toLowerCase()
    }, {
        new: true,
    })
    .lean()
    .exec();
}

/**
 * Find user account by email address
 * @param email - Account email address
 * @returns An array of account matching the provided email address
 */
export function getAccountsByEmail(email: string | string[]): Promise<AccountType[]> {
    return AccountModel
    .find({email})
    .lean().exec()
}

/**
 * Get account by query, sorted by created date in descending order
 * @param query - a query object
 * @param skip - Accounts to skip in find query
 * @returns a maximum of 100 accounts
 */
export function getAccountsByQuery(
    query: Record<string, any>, 
    options: {
        limit?: number,
        skip?: number,
        sort?: Record<string, any>,
        select?: string
}) {
    const {
        limit = 20,
        skip = 0,
        sort = {createdAt: -1},
        select = ''
    } = options

    return AccountModel.find(query)
    .skip(skip)
    .limit(limit)
    .sort(sort)
    .select(select)
    .lean()
    .exec()
}

/**
 * Count account by query filter
 * @param query - a filter object
 * @returns a document count
 */
export function countAccountByQuery(query: Record<string, unknown>) {
    return AccountModel.countDocuments({
        ...query
    })
    .exec()
}


/**
 * Get account ESTIMATE by optional query
 * @param query - a filter object
 * @returns a document count
 */
export function estimateAccountByQuery(query: Record<string, unknown>) {
    return AccountModel.estimatedDocumentCount({
        ...query
    })
    .exec()
}