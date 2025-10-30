import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'messages',
  timestamps: true,
  versionKey: false
})
export class MessageDocument extends Document {
  @Prop({ required: true })
  sessionId: string;

  @Prop()
  userId?: string;

  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  text: string;

  @Prop()
  timestamp?: Date;

  @Prop({ type: Object })
  metadata?: {
    intent?: {
      id?: string;
      name?: string;
      category?: string;
      confidence?: number;
      matched_keywords?: string[];
    };
    confidence?: number;
    requires_escalation?: boolean;
    escalation_prompt?: boolean;
    language?: string;
  };

  @Prop()
  feedback?: string;
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);

MessageSchema.index({ sessionId: 1 });
MessageSchema.index({ userId: 1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ 'metadata.intent.name': 1 });
MessageSchema.index({ 'metadata.confidence': 1 });
MessageSchema.index({ feedback: 1 });
MessageSchema.index({ timestamp: -1 });
