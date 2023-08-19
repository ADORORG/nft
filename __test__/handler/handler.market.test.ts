import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { connectDB, dropDB, dropCollections } from '../db.connect';
import {
    createAccount,
} from '@/lib/handlers/account'

import {
    createContract,
} from '@/lib/handlers/contract'

import {
    createCollection,
} from '@/lib/handlers/collection'

import {
    createToken,
    setTokenOwner
} from '@/lib/handlers/token'

import {
    createMarketOrder,
    getMarketOrderByQuery,
    getMarketOrdersByQuery,
    setMarketOrderStatusToCancelled,
    setMarketOrderStatusToSold,
    countMarketOrderByQuery,
} from '@/lib/handlers/market'

import {
    createBid,
    getBidById,
    getBidsByMarketOrderId,
    getBidsByBidder,
    countBidByQuery
} from '@/lib/handlers/bid'

import {
    createCurrency
} from '@/lib/handlers/currency'

import type AccountType from '@/lib/types/account'
import type CollectionType from '@/lib/types/collection'
import type ContractType from '@/lib/types/contract'
import type NftTokenType from '@/lib/types/token'
import type MarketOrderType from '@/lib/types/market';
import MarketBidType from '@/lib/types/bid';

import type { CryptocurrencyType } from '@/lib/types/currency';
import { MongooseError } from 'mongoose';

describe('Market and bid handler functions', () => {
    beforeAll(async () => {
        await connectDB();
    });
    
    afterAll(async () => {
        await dropCollections();
        await dropDB();
    })

    const testAccountA = {
        address: '0x13D7F8778A077F55c0330De548C296E278bbC8D5'.toLowerCase()
    }

    const testAccountB = {
        address: '0x425E244db4De61348c5bD89245aA513E7eA4C009'.toLowerCase()
    }

    const testContract = {
        contractAddress: '0xA58950F05FeA2277d2608748412bf9F802eA4901',
        chainId: 1,
        royalty: 0,
        nftSchema: 'erc1155',
        version: '1',
        owner: testAccountA.address
    } as const

    const testCollection = {
        name: 'My collection',
        slug: 'My collection',
        description: 'A collection of amazing art work',
        image: 'someipfshash',
        banner: 'someipfshash',
        tags: 'art,work,amazing',
        category: 'painting',
        owner: testAccountA.address
    }

    const testToken = {
        tokenId: 1,
        supply: 1
    }

    const testCurrency = {
        name: 'Ethereum',
        cid: 'ethereum',
        symbol: 'ETH',
        decimals: 18,
        chainId: 1,
        address: '0x',
        logoURI: 'https://mylogo.png'
    }

    type TokenPopulated = NftTokenType & {xcollection: CollectionType, owner: AccountType, contract: ContractType}
    type MarketOrderPopulated = MarketOrderType & { token: TokenPopulated, currency: CryptocurrencyType, seller: AccountType, buyer: AccountType }
    type MarketBidPopulated = MarketBidType & { bidder: AccountType, marketOrder: MarketOrderType }
    let accountA: AccountType
    let accountB: AccountType
    let collection: CollectionType
    let contract: ContractType
    let currency: CryptocurrencyType
    let newToken: TokenPopulated

    it('should create a fixed price market order and execute trade', async () => {
        // setup
        accountA = await createAccount(testAccountA)
        accountB = await createAccount(testAccountB)
        collection = await createCollection(testCollection)
        contract = await createContract(testContract)
        currency = await createCurrency(testCurrency)

        newToken = await createToken({
            ...testToken,
            owner: accountA,
            xcollection: collection,
            contract,
        }) as TokenPopulated

        // create the market order
        const marketOrderFixed = await createMarketOrder({
            price: '1.2',
            saleType: 'fixed',
            quantity: 1,
            permitType: 'onchain',
            listTxHash: '0x',
            status: 'active',
            version: '1', 
            token: newToken, 
            seller: accountA,
            currency,
        }) as MarketOrderPopulated

        // transfer token to the new owner (account B)
        await setTokenOwner(newToken._id as any, accountB._id as string)

        // sell to account B
        const soldMarketOrder = await setMarketOrderStatusToSold(marketOrderFixed._id as any, {
            buyerId: accountB._id as string,
            soldPrice: marketOrderFixed.price,
            saleTxHash: '0x000'
        }) as MarketOrderPopulated

        expect(currency).not.toBeNull()
        expect(newToken).not.toBeNull()
        expect(marketOrderFixed).not.toBeNull()
        expect(soldMarketOrder).not.toBeNull()
        // check populated documents in marketOrderFixed
        expect(marketOrderFixed.seller._id).toBe(accountA._id)
        expect(marketOrderFixed.token.tokenId).toBe(newToken.tokenId)
        expect(marketOrderFixed.token.xcollection._id).toStrictEqual(collection._id)
        expect(marketOrderFixed.token.contract._id).toStrictEqual(contract._id)
        expect(marketOrderFixed.token.owner._id).toBe(accountA._id)

        // check populated documents in soldMarketOrder
        expect(soldMarketOrder.seller._id).toBe(accountA._id)
        expect(soldMarketOrder?.buyer?._id).toBe(accountB._id)
        expect(soldMarketOrder?.status).toBe('sold')
        expect(soldMarketOrder?.token.owner._id).toBe(accountB._id)
    })

    it('should throw for invalid market data', async () => {
        expect.assertions(2)

        try {
            // create invalid market order
            // auction is missing endsAt, buyNowPrice and listTxHash
            await createMarketOrder({
                price: '1.2',
                saleType: 'auction',
                quantity: 1,
                permitType: 'onchain',
                status: 'active',
                version: '1', 
                token: newToken, 
                seller: accountB,
                currency: currency,
            })
        } catch (error: any) {
            expect(error).toBeInstanceOf(MongooseError)
            expect(Object.keys(error.errors).sort().toString())
            .toStrictEqual(['endsAt', 'listTxHash', 'buyNowPrice'].sort().toString())
        }
    })

    it('should create an auction and bid on it', async () => {
        // create the market order
        const marketOrderAuction = await createMarketOrder({
            price: '1.2',
            buyNowPrice: '120',
            saleType: 'auction',
            quantity: 1,
            permitType: 'onchain',
            status: 'active',
            version: '1',
            endsAt: new Date(),
            listTxHash: '0x00',
            token: newToken, 
            seller: accountB,
            currency,
        }) as MarketOrderPopulated

        const auctionBid = await createBid({
            marketOrder: marketOrderAuction._id as any,
            bidder: accountA,
            price: '0.2',
            txHash: '0x00'
        })

        const bidById = await getBidById(auctionBid._id as any)
        // get Bid by bidder
        const bidsByBidder = await getBidsByBidder(accountA._id as string) as MarketBidPopulated[]
        // get Bid by market order id
        const bidsByMarketOrderId = await getBidsByMarketOrderId(marketOrderAuction._id as any) as MarketBidPopulated[]

        expect(auctionBid).not.toBeNull()
        expect(auctionBid._id).toStrictEqual(bidById?._id)
        // Bid should be populated
        expect(auctionBid.bidder._id).toBe(accountA._id)
        expect(auctionBid.marketOrder._id).toStrictEqual(marketOrderAuction._id)
        expect(marketOrderAuction.token._id).toStrictEqual(newToken._id)
        expect(marketOrderAuction.seller._id).toBe(accountB._id)

        // check bidsByBidder, it should be populated
        expect(bidsByBidder).toHaveLength(1)
        expect(bidsByBidder[0].marketOrder._id).toStrictEqual(marketOrderAuction._id)
        expect(bidsByBidder[0].bidder._id).toStrictEqual(accountA._id)
        
        // check bidsByMarketOrderId, it should be populated
        expect(bidsByMarketOrderId).toHaveLength(1)
        expect(bidsByMarketOrderId[0].marketOrder._id).toStrictEqual(marketOrderAuction._id)
        expect(bidsByMarketOrderId[0].bidder._id).toStrictEqual(accountA._id)
    })

    it('should require signature for offchain market order', async () => {
        expect.assertions(3)

        try {
            // create invalid market order
            // Market order is missing orderSignature, approvalSignature and orderDeadline
            await createMarketOrder({
                price: '1.2',
                saleType: 'fixed',
                quantity: 1,
                permitType: 'offchain',
                status: 'active',
                version: '1', 
                token: newToken, 
                seller: accountB,
                currency: currency,
            })
        } catch (error: any) {
            expect(error).toBeInstanceOf(MongooseError)
            expect(Object.keys(error.errors).sort())
            .toStrictEqual(['approvalSignature', 'orderSignature', 'orderDeadline'].sort())
        }

        const fixedMarketOrder = await createMarketOrder({
            price: '1.2',
            saleType: 'fixed',
            quantity: 1,
            permitType: 'offchain',
            status: 'active',
            version: '1', 
            token: newToken, 
            seller: accountB,
            currency: currency,
            orderDeadline: (+new Date()).toString(),
            orderSignature: 'somecryptographysignature',
            approvalSignature: 'signatureinhex'
        })

        expect(fixedMarketOrder).not.toBeNull()
    })

    it('should create market order for `offer` type order', async () => {
        expect.assertions(3)

        try {

            // buyer (offerrer) are missing
            await createMarketOrder({
                price: '1.2',
                saleType: 'offer',
                quantity: 1,
                permitType: 'offchain',
                status: 'active',
                version: '1', 
                token: newToken, 
                seller: accountB,
                currency: currency,
                orderDeadline: (+new Date()).toString(),
                orderSignature: 'somecryptographysignature',
            })
        } catch(error: any) {
            expect(error).toBeInstanceOf(MongooseError)
            expect(Object.keys(error.errors).sort())
            .toStrictEqual(['buyer'].sort())
        }

        const offerMarketOrder = await createMarketOrder({
            price: '1.2',
            saleType: 'offer',
            quantity: 1,
            permitType: 'offchain',
            status: 'active',
            version: '1', 
            token: newToken, 
            seller: accountB,
            buyer: accountA,
            currency: currency,
            endsAt: new Date(),
            orderDeadline: (+new Date()).toString(),
            orderSignature: 'somecryptographysignature',
        })

        expect(offerMarketOrder).not.toBeNull()
    })

    it('should cancel market order correctly', async () => {
        const offerMarketOrder = await createMarketOrder({
            price: '1.2',
            saleType: 'offer',
            quantity: 1,
            permitType: 'offchain',
            status: 'active',
            version: '1', 
            token: newToken, 
            seller: accountB,
            buyer: accountA,
            currency: currency,
            endsAt: new Date(),
            orderDeadline: (+new Date()).toString(),
            orderSignature: 'somecryptographysignature',
        })

        const cancelledMarketOrder = await setMarketOrderStatusToCancelled({_id: offerMarketOrder._id})

        expect(cancelledMarketOrder?._id).toStrictEqual(offerMarketOrder._id)
        expect(cancelledMarketOrder?.status).toBe('cancelled')
        expect(cancelledMarketOrder?.orderSignature).toBe('')
        expect(cancelledMarketOrder?.orderDeadline).toBe('')
    })

    it('should query market orders and bids', async () => {

        await expect(getMarketOrderByQuery({seller: accountB._id})).resolves.not.toBeNull()
        expect((await getMarketOrdersByQuery({seller: accountB._id}, {})).length).toBeGreaterThan(1)
        expect((await getMarketOrdersByQuery({permitType: 'offchain'}, {})).length).toBeGreaterThanOrEqual(3)
        await expect((getMarketOrdersByQuery({status: 'sold'}, {}))).resolves.toHaveLength(1)
    })

    it('should return correct document count for market order and bid', async () => {
        // we created a bid
        await expect(countBidByQuery({})).resolves.toBe(1)
        await expect(countMarketOrderByQuery({status: 'sold'})).resolves.toBe(1)
        await expect(countMarketOrderByQuery({status: 'cancelled'})).resolves.toBe(1)
        await expect(countMarketOrderByQuery({status: 'active'})).resolves.toBeGreaterThanOrEqual(2)
    })
})
