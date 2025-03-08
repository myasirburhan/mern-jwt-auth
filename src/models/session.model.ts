import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";

export interface SessionDocument extends mongoose.Document {
    // userId: mongoose.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    userAgent?: string;
    createdAt: Date;
    expiredAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userAgent: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    expiredAt: { type: Date, required: true, default: thirtyDaysFromNow() },
});

const SessionModel = mongoose.model<SessionDocument>('Session', sessionSchema);
export default SessionModel;