import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { connectDB, dropDB, dropCollections } from '../db.connect';
import {
    createCollection,
    getCollectionsByOwner,
    getCollectionBySlug, 
    getCollectionsByQuery,
    countCollectionByQuery,
} from '@/lib/handlers/collection'

import {
    createAccount,
} from '@/lib/handlers/account'


import { Types } from 'mongoose'
import { MongoServerError } from 'mongodb'

describe('Collection handler functions', () => {
    beforeAll(async () => {
        await connectDB();
    });
    
    afterAll(async () => {
        await dropCollections();
        await dropDB();
    })

    const expectedSlug = 'mycollection'
    const testCollection = {
        name: 'My collection',
        slug: 'My collection',
        description: 'A collection of amazing art work',
        image: 'someipfshash',
        banner: 'someipfshash',
        tags: 'art,work,amazing',
        category: 'painting',
        owner: '0xfc3ab3cb662da997592ceb18d357a07fc898cb2e'
    }

    it('should create a new collection', async() => {
        const account = await createAccount({address: testCollection.owner})
        const newCollection = await createCollection({...testCollection, owner: account})
        
        expect(newCollection.slug).toBe(expectedSlug)
        expect(newCollection.tags).toHaveLength(testCollection.tags.length)
        expect(typeof newCollection.owner === 'object' && newCollection.owner.address).toBe(testCollection.owner)
        expect(typeof newCollection._id).toBe(typeof new Types.ObjectId())
    })

    it('should return collection by owner', async() => {
        const ownedCollection = await getCollectionsByOwner(testCollection.owner)
        const notExistingCollection = await getCollectionsByOwner('0x')
        
        expect(notExistingCollection).toHaveLength(0)
        expect(ownedCollection).toHaveLength(1)
        expect(ownedCollection[0]).toBeDefined()
        expect(ownedCollection[0].slug).toBe(expectedSlug)
        expect(ownedCollection[0].category).toBe(testCollection.category)
    })

    it('should get collection by slug', async () => {
        const slugCollection = await getCollectionBySlug(expectedSlug)
        const slugCollectionNull = await getCollectionBySlug('')
        expect(slugCollectionNull).toBeNull()
        expect(slugCollection).toBeDefined()
        expect(typeof slugCollection?.owner === 'object' && slugCollection?.owner.address === testCollection.owner.toLowerCase()).toBeTruthy()
        expect(slugCollection?.slug).toBe(expectedSlug)
    })

    it('should get collection by query', async () => {
        const nonZeroReturnQuery1 = {owner: testCollection.owner}
        const nonZeroReturnQuery2 = {slug: expectedSlug}
        const zeroReturnQuery = {slug: ''}

        await expect(getCollectionsByQuery(nonZeroReturnQuery1)).resolves.toHaveLength(1)
        await expect(getCollectionsByQuery(nonZeroReturnQuery2)).resolves.toHaveLength(1)
        await expect(getCollectionsByQuery(zeroReturnQuery)).resolves.toHaveLength(0)
    })

    it('should return a correct collection count', async () => {
        
        await expect(countCollectionByQuery({category: testCollection.category})).resolves.toBe(1)
        await expect(countCollectionByQuery({category: ''})).resolves.toBe(0)
        await expect(countCollectionByQuery({})).resolves.toBe(1)
    })
})