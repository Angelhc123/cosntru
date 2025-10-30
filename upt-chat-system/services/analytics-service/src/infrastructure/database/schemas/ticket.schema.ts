import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

/**
 * Infrastructure Schema - Ticket
 * Esquema de MongoDB para tickets de soporte
 */
@Schema({ collection: 'tickets', timestamps: true })
export class Ticket {
  @Prop({ required: true, unique: true })
  ticketId: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  originalQuery: string;

  @Prop({ required: true })
  escalationReason: string;

  @Prop({ default: 'pending' })
  status: string; // 'pending' | 'assigned' | 'resolved'

  @Prop()
  adminId?: string;

  @Prop()
  adminName?: string;

  @Prop()
  adminEmail?: string;

  @Prop({ type: Array, default: [] })
  messages: Array<{
    sender: string;
    senderName: string;
    text: string;
    timestamp: Date;
    visibleTo?: string;
  }>;

  @Prop()
  createdAt?: Date;

  @Prop()
  assignedAt?: Date;

  @Prop()
  resolvedAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

// Índices
TicketSchema.index({ userId: 1 });
TicketSchema.index({ adminId: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ createdAt: -1 });
