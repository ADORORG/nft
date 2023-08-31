import { Types } from 'mongoose';
import type { CryptocurrencyType } from '../types/currency'
import CurrencyModel from '../models/currency'


export async function validateCurrency(document: any) {
    try {
        await CurrencyModel.validate(document)
        return true
    } catch(error) {
        // console.log(error)
        return false
    }
}

/**
 * Add a new cryptocurrency to the data
 * @param currency 
 * @returns the newly added cryptocurrency data
 */
export function createCurrency(currency: CryptocurrencyType) {
    return new CurrencyModel(currency).save()
}

/**
 * Update Currency data
 * @param _id 
 * @param updateData 
 * @returns 
 */
export function setCurrencyData(_id: Types.ObjectId | string, updateData: Partial<CryptocurrencyType>) {
    return CurrencyModel.findByIdAndUpdate(_id, updateData, {
        new: true
    })
    .lean()
    .exec()
}

/**
 * Get a cryptocurrency by its address
 * @param address - The onchain address of the crypto currency
 * @returns the cryptocurrency data
 */
export function getCurrencyByAddress(address: string) {
    return CurrencyModel.findOne({
        address: address
    })
    .lean()
    .exec();
}

/**
 * Get a cryptocurrency by coin id
 * @param cid - Coin id used when created
 * @returns cryptocurrency data
 */
export function getCurrencyById(cid: string) {
    return CurrencyModel.findOne({
        cid
    })
    .lean()
    .exec();
}

/**
 * Get cryptocurrencies by chain id
 * @param chainId - The crypto currency blockchain chain id
 * @returns all cryptocurrency with matching chain id
 */
export function getCurrenciesByChainId(chainId: number) {
    return CurrencyModel.find({
        chainId
    })
    .lean()
    .exec();
}

/**
 * Get a single currency by query
 * @param query - A filter query object
 * @returns a currency document
 */
export function getCurrencyByQuery(query: Record<string, unknown>) {
    return CurrencyModel.findOne(query)
    .lean()
    .exec()
}

/**
 * Get all the cryptocurrencies
 * @returns all cryptocurrencies
 */
export function getAllCurrencies() {
    return CurrencyModel.find()
    .lean()
    .exec();
}