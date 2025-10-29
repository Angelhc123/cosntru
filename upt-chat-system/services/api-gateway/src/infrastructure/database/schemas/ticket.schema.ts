import { Schema, Document } from 'mongoose';

export interface TicketMessageDocument {
    sender: string; // 'user', 'admin', or 'system'
    senderName: string;
    text: string;
    timestamp: Date;
}

export interface TicketDocument extends Document {
    ticketId: string; // TKT-YYYYMMDD-XXXX
    sessionId: string;
    userId: string;
    userName: string;
    userEmail: string;
    adminId?: string;
    adminName?: string;
    adminEmail?: string;
    status: 'pending' | 'assigned' | 'resolved';
    subject: string;
    messages: TicketMessageDocument[];
    createdAt: Date;
    assignedAt?: Date;
    resolvedAt?: Date;
    originalQuery?: string;
    escalationReason?: string;
}

export const TicketMessageSchema = new Schema({
    sender: { type: String, required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });

export const TicketSchema = new Schema({
    ticketId: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    adminId: { type: String, default: null },
    adminName: { type: String, default: null },
    adminEmail: { type: String, default: null },
    status: { 
        type: String, 
        enum: ['pending', 'assigned', 'resolved'], 
        default: 'pending' 
    },
    subject: { type: String, required: true },
    messages: { type: [TicketMessageSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    assignedAt: { type: Date, default: null },
    resolvedAt: { type: Date, default: null },
    originalQuery: { type: String, default: null },
    escalationReason: { type: String, default: null }
});

// Índices para búsquedas eficientes
TicketSchema.index({ ticketId: 1 }, { unique: true });
TicketSchema.index({ userId: 1, status: 1 });
TicketSchema.index({ adminId: 1, status: 1 });
TicketSchema.index({ createdAt: -1 });
TicketSchema.index({ status: 1, createdAt: -1 });

