import { Schema, model, models, type Model } from 'mongoose';
import { dbCollections } from '../app.config';
import { isEthereumAddress } from '../utils/main';
import { invalidAccountAddress } from '../error/message';
import type {default as AccountType, AccountNotificationType} from '../types/account';

const { accounts } = dbCollections;

const NotificationSchema = new Schema<AccountNotificationType>({
    newMintOnEvent: {type: Boolean, default: true},
    eventMintedOut: {type: Boolean, default: true},
    marketOrderCreated: {type: Boolean, default: true},
    marketOrderCancelled: {type: Boolean, default: true},
    marketOrderSold: {type: Boolean, default: true},
    offerReceivedOnToken: {type: Boolean, default: true},
    offerAcceptedOnToken: {type: Boolean, default: true},
    marketAuctionEnded: {type: Boolean, default: true},
    newMarketBid: {type: Boolean, default: true}
}, {_id: false})

const AccountSchema = new Schema<AccountType>({
    _id: {type: String, lowercase: true}, // same as address
	address: {
        type: String, 
        required: true, 
        lowercase: true, 
        index: true,
        validate: function(v: string) { return isEthereumAddress(v)}
    }, // eth address, same as _id
    name: String,
    email: {type: String, lowercase: true},
    emailVerified: {type: Boolean, default: false},
    verified: {type: Boolean, default: false},
    banned: {type: Boolean, default: false},
    image: String,
    profileMedia: String,
    profileMediaType: String,
    twitter: String,
    discord: String,
    roles: [String], // a quick hack added to allow admin add currencies
    notification: NotificationSchema,
    createdAt: {type: Date},
    updatedAt: {type: Date}
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
/* AccountSchema.post('find', function(docs: AccountType[]) {
    docs.forEach(function(doc) {
        doc?.toObject?.({
            flattenMaps: true,
            flattenObjectIds: true,
            versionKey: false
        })
    })
}) */

export default (models[accounts] as Model<AccountType>) || model<AccountType>(accounts, AccountSchema);
