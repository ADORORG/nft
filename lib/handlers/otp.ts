import type OtpType from '../types/otp';
import OtpModel from '../models/otp'

/**
 * Create a new otp document
 * @param otp 
 * @returns 
 */
export function createOtp(otp: OtpType): Promise<OtpType>{
    return new OtpModel(otp).save()
}

/**
 * Set otp verified at date
 * @param query Find query
 * @returns 
 */
export function setOtpVerified(query: Record<string, unknown>) {
    return OtpModel.findOneAndUpdate(query, {
        $set: {otpVerifiedAt: new Date()}
    })
    .lean()
    .exec()
}

/**
 * Get a one Otp document
 * @param query - Find one query
 * @returns 
 */
export function getOtpByQuery(query: Record<string, unknown>) {
    return OtpModel.findOne(query).lean().exec()
}