import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { connectDB, dropDB, dropCollections } from '../db.connect';
import {
    createAccount,
} from '@/lib/handlers/account'

import {
    createContract,
    getContractByAddress,
    getContractsByOwner,
    getContractById,
    getOrCreateContractByQuery,
    countContractByQuery,
} from '@/lib/handlers/contract'

describe('Contract handler functions', () => {
    beforeAll(async () => {
        await connectDB();
    });
    
    afterAll(async () => {
        await dropCollections();
        await dropDB();
    })

    const testContract = {
        contractAddress: '0xA58950F05FeA2277d2608748412bf9F802eA4901',
        chainId: 1,
        royalty: 0,
        nftSchema: 'erc1155',
        version: '1',
        owner: '0xfc3ab3cb662da997592ceb18d357a07fc898cb2e'
    } as const

    it('should create a new contract', async () => {
        const account = await createAccount({address: testContract.owner})
        const newContract = await createContract({...testContract, owner: account})

        expect(newContract).toBeDefined()
        expect(typeof newContract.owner === 'object' && newContract.owner.address).toBe(testContract.owner)
        expect(newContract.nftSchema).toBe('erc1155')
    })

    it('should get contract by contract address', async () => {
        const contract = await getContractByAddress(testContract.contractAddress)

        expect(contract).toBeDefined()
        expect(typeof contract?.owner === 'object' && contract.owner.address).toBe(testContract.owner)
        expect(contract?.nftSchema).toBe('erc1155')

        await expect(getContractById(contract?._id as any)).resolves.toBeDefined()
    })

    it('should get contracts owned by an account address', async () => {
        // create another contract
        await createContract({...testContract, contractAddress: '0x2E6E152d29053B6337E434bc9bE17504170f8a5B'})
        const contracts = await getContractsByOwner(testContract.owner)
        const contract = contracts[0]

        expect(contracts.length).toBe(2)
        expect(contract).toBeDefined()
        expect(typeof contract?.owner === 'object' && contract.owner.address).toBe(testContract.owner)
        expect(contract?.nftSchema).toBe('erc1155')
    })

    it('should return or create a new contract if passed validation', async () => {
        expect.assertions(2)
        
        // This document will not be found and will not upsert because it's missing chainId
        const nullContract = await getOrCreateContractByQuery({
            contractAddress: '0x35Bec6549FEc50B70486ab30459bfF322c2Fb953',
            owner: testContract.owner,
        }, {
            nftSchema: 'ERC1155'
        })

        expect(nullContract).toBeNull()
        //this document should return
        await expect(getOrCreateContractByQuery({owner: testContract.owner}, {})).resolves.toBeDefined()
    })

    it('should return correct contract count', async () => {
        await expect(countContractByQuery({owner: testContract.owner})).resolves.toBe(2)
        await expect(countContractByQuery({contractAddress: testContract.contractAddress})).resolves.toBe(1)
    })
})