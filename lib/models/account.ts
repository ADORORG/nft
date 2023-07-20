import { Schema, model } from 'mongoose';
import { dbCollections } from '../app.config';
import { isEthereumAddress } from '../utils/main';
import { invalidAccountAddress } from '../error/message';
import type AccountType from '../types/account';

const { accounts } = dbCollections;

const AccountSchema = new Schema<AccountType>({
    _id: {type: String, lowercase: true}, // same as address
	address: {
        type: String, 
        required: true, 
        lowercase: true, 
        index: true, 
        unique: true, 
        validate: function(v: string) { return isEthereumAddress(v)}
    }, // eth address, same as _id
    name: String,
    email: String,
    emailVerified: {type: Boolean, default: false},
    image: String,
    banner: String,
    twitter: String,
    discord: String,
    telegram: String,
    createdAt: {type: Date, get: (v: Date) => v.getTime()},
    updatedAt: {type: Date, get: (v: Date) => v.getTime()}
}, {
    collection: accounts,
    timestamps: true,
    _id: false,
});

/**
 * Ensure that the 'address' is a valid format ETH address
 * @param {function} next - Tell mongoose that we are done validating our data or notify an error 
 */
function requireValidAccountAddress(next: (arg?: Error) => void) {
    // @ts-ignore
    if (isEthereumAddress(this.address)) {
        // @ts-ignore
        this._id = this.address;
        next();
    } else {
        next(new Error(invalidAccountAddress));
    }
}

/** 
* 'address' and '_id' should always be the same
* This function modifies the query to include '_id' and/or 'address', both to lowercase
* This is important when using findOneAndUpdate or updateOne method because
* If the '_id' field is missing during findOneAndUpdate (with upsert: true)
* mongoose will generate '_id' type of ObjectId, however, we are using eth address instead
* @param {function} next - Tell mongoose that we are done merging our update or notify of an error
*/
function _idAndAddressUpdateMerging(next: (arg?: Error) => void) {
    // @ts-ignore
    if (this._update._id && isEthereumAddress(this._update._id)) {
        // @ts-ignore
        this._update._id = this._update._id.toLowerCase();
        // @ts-ignore
        this._update.address = this._update._id;
        // @ts-ignore
    } else if (this._update.address && isEthereumAddress(this._update.address)) {
        // @ts-ignore
        this._update.address = this._update.address.toLowerCase();
        // @ts-ignore
        this._update._id = this._update.address;
    }

    next();
}

AccountSchema.pre('save', requireValidAccountAddress);
AccountSchema.pre(['findOneAndUpdate', 'updateOne'], _idAndAddressUpdateMerging);

export default model<AccountType>(accounts, AccountSchema);