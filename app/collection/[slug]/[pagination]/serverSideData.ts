import type { PopulatedNftTokenType } from "@/lib/types/token"
// Server
import mongoooseConnectionPromise from '@/wrapper/mongoose_connect'
import { getCollectionBySlug, getCollectionValueInDollar, estimateCollectionByQuery, getTokensByQuery } from "@/lib/handlers"

const TOKEN_BATCH = 25

export default async function getServerSideData({slug, pageNumber}: {slug: string, pageNumber?: number}) {
    await mongoooseConnectionPromise
    const [collection, collectionValueInDollar] = await Promise.all([
        getCollectionBySlug(slug),
        getCollectionValueInDollar({slug: slug.toLowerCase()})
    ])

    let collectionTokens, collectionTokensCount;
    if (collection && pageNumber) {
        [collectionTokens, collectionTokensCount] = await Promise.all([
            getTokensByQuery({
                xcollection: collection._id,
                tokenId: { $exists: true, $ne: null },
            }, {
                limit: TOKEN_BATCH, 
                sort: {createdAt: -1},
                skip: TOKEN_BATCH * (pageNumber - 1)
            }),
            estimateCollectionByQuery({xcollection: collection._id})
        ])
    }
   
    return {
        limit: TOKEN_BATCH,
        collection,
        collectionValueInDollar,
        collectionTokensCount,
        collectionTokens: collectionTokens as PopulatedNftTokenType[],
    }
}