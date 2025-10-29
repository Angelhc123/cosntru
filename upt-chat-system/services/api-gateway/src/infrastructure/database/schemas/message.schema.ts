import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * MongoDB Schema: Message
 * Define el esquema de base de datos para los mensajes del chat
 */
@Schema({
  collection: 'messages',
  timestamps: true,
  versionKey: false
})
export class MessageDocument extends Document {
  @Prop({ 
    required: true,
    type: String,
    index: true
  })
  sessionId: string;

  @Prop({ 
    required: true,
    enum: ['user', 'bot', 'system'],
    type: String
  })
  sender: string;

  @Prop({ 
    required: true,
    type: String,
    trim: true
  })
  text: string;

  @Prop({ 
    default: Date.now,
    type: Date,
    index: true
  })
  timestamp: Date;

  @Prop({
    type: Object,
    default: {}
  })
  metadata: Record<string, any>;

  @Prop({
    type: String,
    enum: ['positive', 'negative'],
    required: false,
    default: null
  })
  feedback: string | null;

  @Prop({
    type: Date,
    required: false,
    default: null
  })
  feedbackTimestamp: Date | null;
}

export const MessageSchema = SchemaFactory.createForClass(MessageDocument);

// Índice compuesto para optimizar consultas por sesión y timestamp
MessageSchema.index({ sessionId: 1, timestamp: 1 });
