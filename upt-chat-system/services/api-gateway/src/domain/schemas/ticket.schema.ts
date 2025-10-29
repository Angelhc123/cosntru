import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TicketDocument = Ticket & Document;

export enum TicketStatus {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  RESOLVED = 'resolved',
}

@Schema({ _id: false })
export class TicketMessage {
  @Prop({ required: true })
  sender: string; // 'user' o 'admin'

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const TicketMessageSchema = SchemaFactory.createForClass(TicketMessage);

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ required: true, unique: true })
  ticketId: string; // Formato: TKT-YYYYMMDD-XXXX

  @Prop({ required: true })
  sessionId: string; // ID de la sesión de chat que escaló

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userEmail: string;

  @Prop({ default: null })
  adminId: string;

  @Prop({ default: null })
  adminName: string;

  @Prop({ default: null })
  adminEmail: string;

  @Prop({ 
    type: String,
    enum: Object.values(TicketStatus),
    default: TicketStatus.PENDING 
  })
  status: TicketStatus;

  @Prop({ required: true })
  subject: string; // Título del ticket (primer mensaje del usuario)

  @Prop({ type: [TicketMessageSchema], default: [] })
  messages: TicketMessage[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: null })
  assignedAt: Date;

  @Prop({ default: null })
  resolvedAt: Date;

  @Prop({ default: null })
  originalQuery: string; // La consulta que disparó la escalación

  @Prop({ default: null })
  escalationReason: string; // Por qué se escaló (baja confianza, usuario pidió soporte, etc.)
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

// Índices para búsquedas eficientes
TicketSchema.index({ userId: 1, status: 1 });
TicketSchema.index({ adminId: 1, status: 1 });
TicketSchema.index({ ticketId: 1 }, { unique: true });
TicketSchema.index({ createdAt: -1 });
