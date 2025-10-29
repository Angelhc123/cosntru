import { Schema, Document } from 'mongoose';

export interface TicketMessageDocument extends Document {
    ticketId: string;
    sender: 'admin' | 'user';
    senderName: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

export const TicketMessageSchema = new Schema({
    ticketId: { type: String, required: true },
    sender: { type: String, enum: ['admin', 'user'], required: true },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

TicketMessageSchema.index({ ticketId: 1, timestamp: 1 });
