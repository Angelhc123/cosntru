import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { SessionMetadata } from '../../../domain/entities/chat-session.entity';

/**
 * MongoDB Schema: ChatSession
 * Define el esquema de base de datos para la entidad ChatSession
 */
@Schema({
  collection: 'chat_sessions',
  timestamps: true,
  versionKey: false
})
export class ChatSessionDocument extends Document {
  @Prop({ 
    required: true,
    trim: true,
    index: true
  })
  userId: string;

  @Prop({ 
    required: true,
    unique: true,
    trim: true
  })
  sessionToken: string;

  @Prop({ 
    default: true,
    type: Boolean,
    index: true
  })
  isActive: boolean;

  @Prop({ 
    default: Date.now,
    type: Date,
    index: true
  })
  startedAt: Date;

  @Prop({ 
    type: Date,
    default: null
  })
  endedAt: Date;

  @Prop({
    type: {
      userAgent: { type: String, default: null },
      ipAddress: { type: String, default: null },
      platform: { type: String, default: null },
      initialQuery: { type: String, default: null },
      totalMessages: { type: Number, default: 0 },
      avgResponseTime: { type: Number, default: 0 },
      satisfactionScore: { type: Number, min: 1, max: 5, default: null }
    },
    default: {}
  })
  metadata: SessionMetadata;

  // Virtual para duración
  get duration(): number | null {
    if (!this.endedAt) return null;
    return this.endedAt.getTime() - this.startedAt.getTime();
  }

  // Virtual para status
  get status(): string {
    if (this.isActive) return 'active';
    if (this.endedAt) return 'ended';
    return 'timeout';
  }
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSessionDocument);

// Índices para optimizar consultas
ChatSessionSchema.index({ userId: 1, isActive: 1 });
ChatSessionSchema.index({ sessionToken: 1 }, { unique: true });
ChatSessionSchema.index({ startedAt: -1 });
ChatSessionSchema.index({ endedAt: -1 });
ChatSessionSchema.index({ 
  isActive: 1, 
  startedAt: 1 
}, { 
  name: 'active_sessions_index' 
});

// TTL index para limpiar sesiones muy antiguas (30 días)
ChatSessionSchema.index({ 
  startedAt: 1 
}, { 
  expireAfterSeconds: 30 * 24 * 60 * 60,
  name: 'session_ttl_index' 
});

// Virtuals para duration y status
ChatSessionSchema.virtual('duration').get(function() {
  if (!this.endedAt) return null;
  return this.endedAt.getTime() - this.startedAt.getTime();
});

ChatSessionSchema.virtual('status').get(function() {
  if (this.isActive) return 'active';
  if (this.endedAt) return 'ended';
  return 'timeout';
});

// Asegurar que los virtuals se incluyan en JSON
ChatSessionSchema.set('toJSON', { virtuals: true });
ChatSessionSchema.set('toObject', { virtuals: true });