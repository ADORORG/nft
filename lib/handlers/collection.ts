import type { PipelineStage, PopulateOptions } from 'mongoose'
import type { EthereumAddress, TotalMarketValueInDollarType } from '../types/common'
import type CollectionType from '../types/collection'
import CollectionModel from '../models/collection'
import { dbCollections } from '../app.config';

export async function validateCollection(document: any) {
    try {
        await CollectionModel.validate(document)
        return true
    } catch(error) {
        // console.log(error)
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
export function getCollectionBySlug(slug: string): Promise<CollectionType | null> {
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
 * Get total market value of a collection in US dollar
 * @param query Query object filter
 * return an object with dollarValue
 */
export function getCollectionValueInDollar(query: Record<string, unknown>) {
    const { currencies, marketOrders, tokens } = dbCollections;

    const aggregateQuery = [
        {
          $match: {
            query,
          },
        },
        {
          // we only need the collection _id
          $project: {
            _id: 1,
          },
        },
        {
          // lookup collection _id in nft_tokens
          $lookup: {
            from: tokens,
            localField: '_id',
            foreignField: 'xcollection',
            as: 'tokens',
            pipeline: [
              // tokens pipeline
              {
                // we only need the token _ids
                $project: {
                  _id: 1,
                },
              },
              // get each token market_orders
              // markets: marketOrders[]
              {
                $lookup: {
                  from: marketOrders,
                  localField: '_id',
                  foreignField: 'token',
                  as: 'markets',
                },
              },
            ],
          },
        },
        // we now have an array of tokens,
        // each token containing an array of market data
        {
          // unwind the tokens
          $unwind: {
            path: '$tokens',
            includeArrayIndex: 'i',
            preserveNullAndEmptyArrays: false,
          },
        },
        // we now have an array of tokens at the top-level
        // each containing an array of markets
        {
          // unwind the tokens.markets
          $unwind: '$tokens.markets',
        },
        // we now have an array of tokens
        // each containing a single market data
        {
          // group by market currency and sum market order price to 'amount' field
          $group: {
            _id: '$tokens.markets.currency', // currency _id ref in market
            amount: {
              $sum: {
                $toDouble: '$tokens.markets.price',
              },
            },
          },
        },
      
        // Fetch each currency and get the dollar equivalent
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
            includeArrayIndex: 'i',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          // calculate total value in dollar
          $group: {
            _id: null,
            dollarValue: {
              $sum: {
                $multiply: [
                    // cast to double for backward compatibility for price in string
                  { $toDouble: '$currency.price.usd' },
                  '$amount',
                ],
              },
            },
          },
        },
      ] satisfies PipelineStage[]

    return CollectionModel.aggregate<TotalMarketValueInDollarType>(aggregateQuery).exec()
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