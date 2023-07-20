import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { connectDB, dropDB, dropCollections } from '../db.connect';
import {
    createAccount,
    setAccountDetails,
    setAccountEmailVerified, 
    getAccountsByEmail,
    countAccountByQuery,
    getAccountsByQuery
} from '@/lib/handlers/account'

// similar to ../model/account.test.ts, however, testing the handlers function
describe('Account handler functions', () => {
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
        address: '0xFC3AB3Cb662DA997592cEB18D357a07Fc898cB2e'.toLowerCase()
    }

    it('should create account', async () => {
        const newAccount = await createAccount(testAccountA)

        expect(newAccount.address).toBe(testAccountA.address)
        expect(newAccount._id).toBe(testAccountA.address)
        expect(newAccount?.emailVerified).toBeFalsy()
    })

    it('should upsert a new account and update account details', async () => {
        const getAccountA = await setAccountDetails(testAccountA.address, {})
        const upsertAccountB = await setAccountDetails(testAccountB.address, {...testAccountB})

        // Account A
        expect(getAccountA.address).toBe(testAccountA.address)
        expect(getAccountA._id).toBe(testAccountA.address)
        expect(getAccountA?.emailVerified).toBeFalsy()
        // Account B
        expect(upsertAccountB.address).toBe(testAccountB.address)
        expect(upsertAccountB._id).toBe(testAccountB.address)
        expect(upsertAccountB?.emailVerified).toBeFalsy()
    })

    it('should update the email and verification status', async () => {
        const testEmail = "testAccountA@gmail.com".toLowerCase()
        const accountAUpdate = await setAccountEmailVerified(testAccountA.address, testEmail)

        expect(accountAUpdate?.email).toBe(testEmail)
        expect(accountAUpdate?.emailVerified).toBeTruthy()
    })

    it('should get an account by email', async () => {
        const anotherTestEmail = 'testAccountB@gmail.com'.toLowerCase()
        await setAccountDetails(testAccountB.address, {email: anotherTestEmail})

        const accountByEmail = await getAccountsByEmail(anotherTestEmail);
        // get an account using setAccountDetails
        expect(accountByEmail).toHaveLength(1)
        expect(accountByEmail[0].email).toBe(anotherTestEmail)
        expect(accountByEmail[0].emailVerified).toBeFalsy()
    })

    it('should return document count', async () => {
        const verifiedAccounts = await getAccountsByQuery({emailVerified: true})

        expect(verifiedAccounts).toHaveLength(1);
        await expect(countAccountByQuery({emailVerified: true})).resolves.toBe(1)
        await expect(countAccountByQuery({email: 'testaccountb@gmail.com'})).resolves.toBe(1)
        await expect(countAccountByQuery({})).resolves.toBe(2)
    })
})