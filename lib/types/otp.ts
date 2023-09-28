import type { Types, /* Document */ } from 'mongoose'

export default interface OtpType /* extends Partial<Document> */ {
    /** Document _id */
    _id?: Types.ObjectId;
    /** What the otp is for */
    otpFor: 'email' | 'phone';
    /** The otp code. Not encrypted */
    otpCode: string;
    /** The time and date when the otp was verified. 
     * It's `null` if not verified yet */
    otpVerifiedAt?: Date | null;
    /** The account that initiate this authentication */
    owner: string;
    /** The data being verified */
    data: unknown;
    createdAt?: Date;
    updatedAt?: Date;
}