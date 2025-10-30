import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatSessionDocument = ChatSession & Document;

/**
 * Infrastructure Schema - Chat Session
 * Esquema de MongoDB para sesiones de chat
 */
@Schema({ collection: 'chat_sessions', timestamps: true })
export class ChatSession {
  @Prop({ required: true, unique: true })
  sessionToken: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ default: Date.now })
  startedAt: Date;

  @Prop({ default: null })
  endedAt: Date;

  @Prop({ type: Object, default: {} })
  metadata?: Record<string, any>;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);

