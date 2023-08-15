import type { Types, PipelineStage, PopulateOptions } from 'mongoose'
import type { EthereumAddress } from '../types/common'
import type { default as MarketOrderType, PopulatedMarketOrderType } from '../types/market'
import type { TopTraderAccountType, TotalMarketValueByCryptoCurrencyType, TotalMarketValueInDollarType } from '../types/common'
import MarketOrderModel from '../models/market'
import { dbCollections } from '../app.config';

export async function validateMarket(document: any) {
  try {
      await MarketOrderModel.validate(document)
      return true
  } catch(error) {
      // console.log(error)
      return false
  }
}

/**
 * Create a new market order
 * @param marketOrder - Market order data
 * @returns a populated newly created market order
 */
export async function createMarketOrder(marketOrder: MarketOrderType) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'seller',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'buyer',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'token',
            populate: {
                path: 'xcollection contract owner',
                options: leanOption
            },
            options: leanOption
        },
        {
            path: 'currency',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return new MarketOrderModel(marketOrder).save()
    .then(newDoc => newDoc.populate(populate))
}

/**
 * Get a single market order by query filter
 * @param query - A filter query object
 * @param select - Fields to select or deselect
 * @returns a market order document
 */
export function getMarketOrderByQuery(query: Record<string, unknown>, select: string = '') {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'seller',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'buyer',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'token',
            populate: {
                path: 'xcollection contract owner',
                options: leanOption
            },
            options: leanOption
        },
        {
            path: 'currency',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return MarketOrderModel.findOne({
        ...query
    })
    .select(select)
    .populate(populate)
    .lean()
    .exec()
}

/**
 * Get many market order by query filter
 * @param query - A filter query object
 * @param options - A option object
 * @returns 
 */
export function getMarketOrdersByQuery(
    query: Record<string, unknown>, 
    options: {
        limit?: number,
        skip?: number,
        sort?: Record<string, any>,
        select?: string
    }): Promise<MarketOrderType[]> {
    const {
        limit = 100,
        skip = 0,
        sort = {createdAt: -1},
        select = ''
    } = options

    const leanOption = {lean: true}
    const populate = [
        {
            path: 'seller',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'buyer',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'token',
            options: leanOption,
            populate: {
                path: 'xcollection contract owner',
                options: leanOption
            }
        },
        {
            path: 'currency',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

    return MarketOrderModel.find({
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
 * Get trending auctions & fixed price market orders by query
 * Attempts to fetch equal number of auction & fixed orders
 * @param query - Filter query
 * @param limit - Limit for each saleType
 */
export async function getTrendingMarketOrders(query: Record<string, unknown>, limit: number = 8) {
  const leanOption = {lean: true}
  const populate = [
    {
        path: 'seller',
        select: '-email -roles -emailVerified -__v',
        options: leanOption
    },
    {
        path: 'buyer',
        select: '-email -roles -emailVerified -__v',
        options: leanOption
    },
    {
        path: 'token',
        options: leanOption,
        populate: {
            path: 'xcollection contract owner',
            options: leanOption
        }
    },
    {
        path: 'currency',
        options: leanOption
    }
] satisfies PopulateOptions[]

  const aggregatePipeline = [
    {
      /** Sort by createdAt */
      $sort: {
        createdAt: -1 
      }
    },
    {
      /** Fetch each saleType separately */
      $facet: {
        fixedSales: [
          {
            $match: {
              ...query,
              saleType: 'fixed',
            },
          },
          {
            $limit: limit,
          }
        ],
        auctionSales: [
          {
            $match: {
              ...query,
              saleType: 'auction',
            },
          },
          {
            $limit: limit,
          }
        ]
      }
    },
  
    {
      $project: {
        /** Merge the two results into 'documents */
        documents: {
          $concatArrays: ['$fixedSales', '$auctionSales']
        }
      }
    },
    {
      /** Unwind the document */
      $unwind: {
        path: '$documents',
        includeArrayIndex: '_',
        preserveNullAndEmptyArrays: false
      }
    },
    /** unwind the document to the root */
    { $replaceRoot: { newRoot: '$documents' } }
  
  ] satisfies PipelineStage[]

  const trendingOrders = await MarketOrderModel.aggregate<MarketOrderType>(aggregatePipeline).exec()
  const trendingOrdersPopulated = await MarketOrderModel.populate(trendingOrders, populate) as PopulatedMarketOrderType[]
  return trendingOrdersPopulated
}

/**
 * Get the market value for account. 
 * Passing an empty value returns top 8 account with the highest trade
 * @param query Query object filter
 * @param limit Number of Account to return
 * @returns 
 * @example getTraderAccountMarketValue({seller: '0x0...'}) returns the seller market value
 * @example getTraderAccountMarketValue({}, 4) returns top 4 account with highest trade
 */
export function getTraderAccountMarketValue(query: Record<string, unknown> = {}, limit = 8) {
    const { currencies, accounts } = dbCollections;

    const aggregateQuery = [
        {
          // match the orders
          $match: query
        },
        {
          // populate the currency
          $lookup: {
            from: currencies,
            localField: 'currency',
            foreignField: '_id',
            as: 'currency'
          }
        },
        {
          // Unwind the populated currency
          $unwind: {
            path: '$currency',
            includeArrayIndex: '__i',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          // calculate each order value in dollar as dollarValue
          $set: {
            dollarValue: {$multiply: [{$toDouble: '$price'}, {$toDouble: '$currency.price.usd'}]}
          }
        },
        {
          // group by seller field
          $group: {
            _id: '$seller',
            dollarValue: {$sum: '$dollarValue'}
          }
        },
        
        // $sort and $limit have no effect if get trade value for a single account
        {
          $sort: {
            dollarValue: -1
          }
        },
      
        {
          $limit: limit
        },
      
        {
          // populate each seller account as owner
          $lookup: {
            from: accounts,
            localField: '_id',
            foreignField: '_id',
            as: 'owner'
          }
        },
      
        {
          // Unwind owner to object
          $unwind: {
            path: '$owner',
            includeArrayIndex: '__i',
            preserveNullAndEmptyArrays: true
          }
        }
      ] satisfies PipelineStage[]

    return MarketOrderModel.aggregate<TopTraderAccountType>(aggregateQuery).exec()
}

/**
 * Get total market value, grouped by cryptocurrencies used in market
 * @param query Query object filter
 * return Array of market value by cryptocurrency
 */
export function getTotalMarketValueByCryptoCurrency(query: Record<string, unknown>) {
    const aggregateQuery = [
        {
          $match: query
        }, {
          $group: {
            // group by currency _id
            _id: '$currency', 
            // sum each market order price based on currency
            amount: {
              $sum: {
                $toDouble: '$price'
              }
            },
            // count the number of market order
            orderCount: {
                $sum: 1
            }
          }
        }
    ] satisfies PipelineStage[]

    return MarketOrderModel.aggregate<TotalMarketValueByCryptoCurrencyType>(aggregateQuery).exec()
}

/**
 * Get total market value in US dollar
 * @param query Query object filter
 * return an object with dollarValue and orderCount
 */
export function getTotalMarketValueInDollar(query: Record<string, unknown>) {
    const { currencies } = dbCollections;

    const aggregateQuery = [
        {
          $match: query,
        },
        {
          $group: {
            // group by currency _id
            _id: '$currency',
            // sum each market order price based on currency
            amount: {
              $sum: {
                $toDouble: '$price',
              },
            },
            // count the number of market order
            count: {
              $sum: 1,
            },
          },
        },
      
        {
          // lookup currencies
          $lookup: {
            from: currencies,
            localField: '_id',
            foreignField: '_id',
            as: 'currency',
          },
        },
        {
          // unwind
          $unwind: {
            path: '$currency',
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          // calculate total value in dollar & sum order count
          $group: {
            _id: null,
            dollarValue: {
              $sum: {
                $multiply: [
                  { $toDouble: '$currency.price.usd' },
                  '$amount',
                ],
              },
            },
            orderCount: { $sum: '$count' },
          },
        },
        
      ] satisfies PipelineStage[]

    return MarketOrderModel.aggregate<TotalMarketValueInDollarType>(aggregateQuery).exec()
}


/**
 * Set market order status to `cancelled`
 * @param marketOrderId - Market order id
 * @param cancelTxHash - Optional cancel transaction hash if it's onchain listing
 * @returns - an updated market order
 */
export function setMarketOrderStatusToCancelled(marketOrderId: Types.ObjectId | string, cancelTxHash?: string) {
    const leanOption = {lean: true}
    const populate = [
        {
            path: 'seller',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'buyer',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'token',
            populate: {
                path: 'xcollection contract owner',
                options: leanOption
            },
            options: leanOption
        },
        {
            path: 'currency',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

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

    const leanOption = {lean: true}
    const populate = [
        {
            path: 'seller',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'buyer',
            select: '-email -roles -emailVerified -__v',
            options: leanOption
        },
        {
            path: 'token',
            populate: {
                path: 'xcollection contract owner',
                options: leanOption
            },
            options: leanOption
        },
        {
            path: 'currency',
            options: leanOption
        }
    ] satisfies PopulateOptions[]

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
export function countMarketOrderByQuery(query: Record<string, unknown>) {
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
export function estimateMarketOrderByQuery(query: Record<string, unknown>) {
    return MarketOrderModel.estimatedDocumentCount({
        ...query
    })
    .exec()
}