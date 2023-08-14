import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { connectDB, dropDB, dropCollections } from '../db.connect';
import {
    createAccount,
} from '@/lib/handlers/account'

import {
    createContract,
    getContractsByOwner
} from '@/lib/handlers/contract'

import {
    createCollection,
    getCollectionsByOwner
} from '@/lib/handlers/collection'

import {
    createToken,
    getTokensByOwner,
    getTokensByCollection, 
    getTokensByContract,
    getTokensByQuery,
    setTokenOwner,
    countTokenByQuery
} from '@/lib/handlers/token'
import type AccountType from '@/lib/types/account'
import type CollectionType from '@/lib/types/collection'
import type ContractType from '@/lib/types/contract'
import type NftTokenType from '@/lib/types/token'


describe('Token handler functions', () => {
    beforeAll(async () => {
        await connectDB();
    });
    
    afterAll(async () => {
        await dropCollections();
        await dropDB();
    })

    const testAccount = {
        address: '0x13D7F8778A077F55c0330De548C296E278bbC8D5'.toLowerCase()
    }

    const testContract = {
        contractAddress: '0xA58950F05FeA2277d2608748412bf9F802eA4901',
        chainId: 1,
        royalty: 0,
        nftSchema: 'ERC1155',
        version: '1',
        owner: testAccount.address
    } as const

    const testCollection = {
        name: 'My collection',
        slug: 'My collection',
        description: 'A collection of amazing art work',
        image: 'someipfshash',
        banner: 'someipfshash',
        tags: 'art,work,amazing'.split(','),
        category: 'painting',
        owner: testAccount.address
    }

    const testToken = {
        tokenId: '1',
        supply: 1
    }

    it('should create token', async () => {
        const account = await createAccount(testAccount)
        const collection = await createCollection(testCollection)
        const contract = await createContract(testContract)

        const newToken = await createToken({
            ...testToken,
            owner: account,
            xcollection: collection,
            contract: contract,
        }) as NftTokenType & {xcollection: CollectionType, owner: AccountType, contract: ContractType}

        expect(newToken).toBeDefined()
        expect(newToken.owner._id).toBe(account._id)
        expect(newToken.xcollection._id).toStrictEqual(collection._id)
        expect(newToken.contract._id).toStrictEqual(contract._id)
    })

    it('should get tokens by owner', async () => {
        const tokens = await getTokensByOwner(testAccount.address) as Array<NftTokenType & {xcollection: CollectionType, owner: AccountType, contract: ContractType}>

        expect(tokens[0]).toBeDefined()
        // we create a single document
        expect(tokens).toHaveLength(1)
        expect(tokens[0]._id).toBeDefined()
        // must be populated by default
        expect(tokens[0].owner._id).toBe(testAccount.address)
        expect(tokens[0].xcollection._id).toBeDefined()
        expect(tokens[0].contract._id).toBeDefined()

    })

    it('should get tokens by collection', async () => {
        const collections = await getCollectionsByOwner(testAccount.address) as Array<CollectionType & {owner: AccountType}>
        const tokens = await getTokensByCollection(collections[0]?._id as string) as Array<NftTokenType & {xcollection: CollectionType, owner: AccountType, contract: ContractType}>

        // we create a single contract
        expect(collections).toHaveLength(1)
        expect(collections[0].owner?._id).toBe(testAccount.address)
        expect(tokens[0]).toBeDefined()
        // we create a single document
        expect(tokens).toHaveLength(1)
        expect(tokens[0]._id).toBeDefined()
        // must be populated by default
        expect(tokens[0].owner._id).toBe(testAccount.address)
        expect(tokens[0].xcollection._id).toBeDefined()
        expect(tokens[0].contract._id).toBeDefined()
    })

    it('should get tokens by contract', async () => {
        const contracts = await getContractsByOwner(testAccount.address) as Array<ContractType & {owner: AccountType}>
        const tokens = await getTokensByContract(contracts[0]?._id as string) as Array<NftTokenType & {xcollection: CollectionType, owner: AccountType, contract: ContractType}>
        
        // we create a single contract
        expect(contracts).toHaveLength(1)
        expect(contracts[0].owner?._id).toBe(testAccount.address)
        expect(tokens[0]).toBeDefined()
        // we create a single token
        expect(tokens).toHaveLength(1)
        expect(tokens[0]._id).toBeDefined()
        // must be populated by default
        expect(tokens[0].owner._id).toBe(testAccount.address)
        expect(tokens[0].xcollection._id).toBeDefined()
        expect(tokens[0].contract._id).toBeDefined()
    })

    it('should transfer token to a new owner', async () => {
        const newOwner = '0x425E244db4De61348c5bD89245aA513E7eA4C009'.toLowerCase()
        // create newOwner
        await createAccount({address: newOwner})

        const tokens = await getTokensByOwner(testAccount.address) as NftTokenType[]
        const tokenId = tokens[0]._id as string
        const transferredOwnership = await setTokenOwner(tokenId, newOwner) as NftTokenType & {owner: AccountType}

        expect(transferredOwnership).toBeDefined()
        expect(transferredOwnership?.owner._id).toBe(newOwner)
    })

    it('should return tokens by querying', async () => {
        // ownership transferred, `testAccount.address` should not own any token
        await expect(getTokensByQuery({owner: testAccount.address}, {})).resolves.toHaveLength(0) 
        await expect(getTokensByQuery({}, {})).resolves.toHaveLength(1) // all tokens in the database
        await expect(getTokensByQuery({tokenId: '1'}, {skip: 1})).resolves.toHaveLength(0)
    })

    it('should count tokens correctly', async () => {

        // ownership transferred, `testAccount.address` should not own any token
        await expect(countTokenByQuery({owner: testAccount.address})).resolves.toBe(0) 
        await expect(countTokenByQuery({})).resolves.toBe(1) // all tokens in the database
        await expect(countTokenByQuery({tokenId: '1'})).resolves.toBe(1)
        
    })
})