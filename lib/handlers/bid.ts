import type { Types, PopulateOptions } from 'mongoose'
import type { EthereumAddress } from '../types/common'
import type {default as MarketBidType, PopulatedMarketBidType} from '../types/bid'
import MarketBidModel from '../models/bid'

export async function validateBid(document: any) {
    try {
        await MarketBidModel.validate(document)
        return true
    } catch(error) {
        // console.log(error)
        return false
    }
}

/**
 * Create a bid
 * @param bid - The bid object to create
 * @returns A populated bid with the market and bidder
 */
export async function createBid(bid: MarketBidType): Promise<PopulatedMarketBidType> {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'bidder',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'marketOrder',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return new MarketBidModel(
        bid
    ).save()
    .then(newBid => newBid.populate(populate))
}

/**
 * Get a bid by _id
 * @param _id - Bid _id
 * @returns - The bid item or null
 */
export function getBidById(_id: Types.ObjectId | string) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'bidder',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'marketOrder',
            options: leanOption
        }
    ] satisfies PopulateOptions[]
    
    return MarketBidModel.findById(_id).populate(populate).lean().exec()
}

/**
 * Get bid on a market item sorted by created date in descending order
 * @param marketOrderId - The market order _id
 * @param skip - The number of bids to skip
 * @returns - an array of bids (100 bid maximum on every request)
 */
export function getBidsByMarketOrderId(marketOrderId: Types.ObjectId | string, skip: number = 0) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'bidder',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'marketOrder',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return MarketBidModel.find({
        marketOrder: marketOrderId
    })
    .sort({created: -1})
    .skip(skip)
    .limit(100)
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Get bids made by an account sorted by created date in descending order
 * @param bidderId - The bidder (account) _id (the eth address)
 * @param skip - The number of bids to skip
 * @returns an array of bids (100 bid maximum on every request)
 */
export function getBidsByBidder(bidderId: EthereumAddress, skip: number = 0) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'bidder',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'marketOrder',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return MarketBidModel.find({
        bidder: bidderId
    })
    .sort({created: -1})
    .skip(skip)
    .limit(100)
    .populate(populate)
    .lean()
    .exec()
}


/**
 * Count market bid by query filter
 * @param query - a filter object
 * @returns a document count
 */
export function countBidByQuery(query: Record<string, unknown>) {
    return MarketBidModel.countDocuments({
        ...query
    })
    .exec()
}


/**
 * Estimate market bid by optional query filter
 * @param query - a filter object
 * @returns a document count
 */
export function estimateBidByQuery(query: Record<string, unknown>) {
    return MarketBidModel.estimatedDocumentCount({
        ...query
    })
    .exec()
}