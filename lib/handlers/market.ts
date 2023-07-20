import type { Types } from 'mongoose'
import type { EthereumAddress } from '../types/common'
import type MarketOrderType from '../types/market'
import MarketOrderModel from '../models/market'

/**
 * Create a new market order
 * @param marketOrder - Market order data
 * @returns a populated newly created market order
 */
export async function createMarketOrder(marketOrder: MarketOrderType) {
    const populate = [
        {
            path: 'seller',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'buyer',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'token',
            populate: {
                path: 'xcollection contract owner',
            }
        },
        {
            path: 'currency',
        }
    ]

    const createdDocument = await  new MarketOrderModel(marketOrder).save()
    .then( newMarketOrder => newMarketOrder.populate(populate))

    return createdDocument.toObject()
}

/**
 * Get a single market order by query filter
 * @param query - A filter query object
 * @param select - Fields to select or deselect
 * @returns a market order document
 */
export function getMarketOrderByQuery(query: Partial<Record<keyof MarketOrderType, unknown>>, select: string = '') {
    const populate = [
        {
            path: 'seller',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'buyer',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'token',
            populate: {
                path: 'xcollection contract owner',
            }
        },
        {
            path: 'currency',
        }
    ]

    return MarketOrderModel.findOne({
        ...query
    })
    .select(select)
    .populate(populate)
    .lean()
    .exec();

}

/**
 * Get many market order by query filter
 * @param query - A filter query object
 * @param options - A option object
 * @returns 
 */
export function getMarketOrdersByQuery(
    query: Partial<Record<keyof MarketOrderType, unknown>>, 
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
            path: 'seller',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'buyer',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'token',
            populate: {
                path: 'xcollection contract owner',
            }
        },
        {
            path: 'currency',
        }
    ]

    return MarketOrderModel.find({
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
 * Set market order status to `cancelled`
 * @param marketOrderId - Market order id
 * @param cancelTxHash - Optional cancel transaction hash if it's onchain listing
 * @returns - an updated market order
 */
export function setMarketOrderStatusToCancelled(marketOrderId: Types.ObjectId | string, cancelTxHash?: string) {
    const populate = [
        {
            path: 'seller',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'buyer',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'token',
            populate: {
                path: 'xcollection contract',
            }
        },
        {
            path: 'currency',
        }
    ]

    return MarketOrderModel.findByIdAndUpdate({
        _id: marketOrderId,
        status: 'active'
    }, {
        cancelTxHash,
        approvalSignature: '',
        orderSignature: '',
        orderDeadline: '',
        status: 'cancelled'
    }, {
        new: true
    })
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Set market order status to `sold`
 * @param marketOrderId - Market order id
 * @param params - other parameters to update
 * @returns - an updated market order
 */
export function setMarketOrderStatusToSold(
    marketOrderId: Types.ObjectId | string, params: {
        saleTxHash: string,
        buyerId: EthereumAddress,
        soldPrice: string
    }) {

    const {
        saleTxHash,
        buyerId,
        soldPrice
    } = params

    const populate = [
        {
            path: 'seller',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'buyer',
            select: '-email -roles -emailVerified -__v'
        },
        {
            path: 'token',
            populate: {
                path: 'xcollection contract owner',
            }
        },
        {
            path: 'currency',
        }
    ]

    return MarketOrderModel.findOneAndUpdate({
        _id: marketOrderId,
        status: 'active'
    }, {
        saleTxHash,
        buyer: buyerId,
        soldPrice,
        approvalSignature: '',
        orderSignature: '',
        orderDeadline: '',
        status: 'sold'
    }, {
        new: true
    })
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Count market order by query filter
 * @param query - a filter object
 * @returns a document count
 */
export function countMarketOrderByQuery(query: Partial<Record<keyof MarketOrderType, unknown>>) {
    return MarketOrderModel.countDocuments({
        ...query
    })
    .exec()
}

/**
 * Estimate market order by optional query filter
 * @param query - a filter object
 * @returns a document count
 */
export function estimateMarketOrderByQuery(query: Partial<Record<keyof MarketOrderType, unknown>>) {
    return MarketOrderModel.estimatedDocumentCount({
        ...query
    })
    .exec()
}