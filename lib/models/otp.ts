import { Schema, model, models, type Model } from 'mongoose'
import { dbCollections } from '../app.config'
import type OtpType from '../types/otp'

const { authentication, accounts } = dbCollections

const OtpSchema = new Schema<OtpType>({
    otpFor: {type: String, enum: ['email', 'phone'], required: true},
    otpCode: {type: String, required: true},
    otpVerifiedAt: {type: Date, default: null},
	owner: {type: String, ref: accounts, required: true},
    data: {type: String, required: true},
}, {
    timestamps: true,
    collection: authentication
})

export default (models[authentication] as Model<OtpType>) || model<OtpType>(authentication, OtpSchema)