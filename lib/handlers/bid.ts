import type { Types } from 'mongoose'
import type { EthereumAddress } from '../types/common'
import type MarketBidType from '../types/bid'
import type AccountType from '../types/account'
import type MarketOrderType from '../types/market'
import MarketBidModel from '../models/bid'

type MarketBidTypePopulated = MarketBidType & {bidder: AccountType, marketOrder: MarketOrderType}

/**
 * Create a bid
 * @param bid - The bid object to create
 * @returns A populated bid with the market and bidder
 */
export async function createBid(bid: MarketBidType): Promise<MarketBidTypePopulated> {
    const populate = [
        {
            path: 'bidder',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'marketOrder'
        }
    ]

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
    const populate = [
        {
            path: 'bidder',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'marketOrder'
        }
    ]
    
    return MarketBidModel.findById(_id).populate(populate).lean().exec()
}

/**
 * Get bid on a market item sorted by created date in descending order
 * @param marketOrderId - The market order _id
 * @param skip - The number of bids to skip
 * @returns - an array of bids (100 bid maximum on every request)
 */
export function getBidsByMarketOrderId(marketOrderId: Types.ObjectId | string, skip: number = 0) {
    const populate = [
        {
            path: 'bidder',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'marketOrder'
        }
    ]

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
    const populate = [
        {
            path: 'bidder',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'marketOrder'
        }
    ]

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
export function countBidByQuery(query: Partial<Record<keyof MarketBidType, unknown>>) {
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
export function estimateBidByQuery(query: Partial<Record<keyof MarketBidType, unknown>>) {
    return MarketBidModel.estimatedDocumentCount({
        ...query
    })
    .exec()
}