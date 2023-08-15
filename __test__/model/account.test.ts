import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { connectDB, dropDB, dropCollections } from '../db.connect';
import { MongooseError } from 'mongoose';
import AccountModel from '@/lib/models/account';

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await dropDB();
})

afterEach(async () => {
    await dropCollections();
})

describe('Saving and updating Account Model', () => {
    it('should create and update account in the db', async () => {
        const account = {
            address: '0xFC3AB3Cb662DA997592cEB18D357a07Fc898cB2e'
        }

        const newAccount = await new AccountModel(account).save();
        expect(newAccount._id).toBeDefined();
        expect(newAccount._id).toBe(newAccount.address);
        expect(newAccount._id).toBe(account.address.toLowerCase());
        expect(newAccount.emailVerified).toBeFalsy();
        expect(newAccount.email).toBeUndefined();

        // update using save
        const testEmail = 'test@gmail.com';
        await newAccount.set({
            email: testEmail,
            emailVerified: true,
        }).save();

        expect(newAccount.emailVerified).toBeTruthy();
        expect(newAccount.email).toBe(testEmail);
        expect(newAccount._id).toBe(newAccount.address);
        expect(newAccount._id).toBe(account.address.toLowerCase());
    })

    it('should find and return an account for any case insensitive valid eth address', async () => {
        const account = {
            address: '0xFC3AB3Cb662DA997592cEB18D357a07Fc898cB2e'
        }
        await new AccountModel(account).save();
        // find using _id, 
        // expected to return result for any valid eth address
        const myAccount = await AccountModel.findOne({_id: account.address});
        const allAccounts = await AccountModel.find({address: account.address}); // expect an array of one account
        
        expect(myAccount?.address).toBe(account.address.toLowerCase());
        expect(myAccount?._id).toBe(account.address.toLowerCase());
        expect(allAccounts).toHaveLength(1);
    })

    it('should fail with invalid user account', async () => {
        const account = {
            address: 'FC3AB3Cb662DA997592cEB18D357a07Fc898cB2e' // invalid address
        }
        expect.assertions(1)
        try {
            await new AccountModel(account).save();
        } catch(error: unknown) {
            expect(error).toBeInstanceOf(MongooseError);
        }
    })

    it('should findOneAndUpdate with upsert:true and enforce a valid address and _id', async () => {
        const account = {
            address: '0xFC3AB3Cb662DA997592cEB18D357a07Fc898cB2e'
        }
        const newAccount = await AccountModel.findOneAndUpdate(account, account, {upsert: true, new: true});
        expect(newAccount._id).toBeDefined();
        expect(newAccount._id).toBe(newAccount.address);
        expect(newAccount._id).toBe(account.address.toLowerCase());
        expect(newAccount.emailVerified).toBeFalsy();
        expect(newAccount.email).toBeUndefined();
    })

    it('should fail for findOneAndUpdate for invalid address', async () => {
        const account = {
            address: 'FC3AB3Cb662DA997592cEB18D357a07Fc898cB2e'
        }

        expect.assertions(1)
        try {
            await AccountModel.findOneAndUpdate(account, account, {upsert: true, new: true, runValidators: true});
        } catch(error) {
            expect(error).toBeInstanceOf(MongooseError);
        }
    })
})
