import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * MongoDB Schema: FAQ (Preguntas Frecuentes)
 * Para el sistema de respuestas rápidas en el chatbot
 */
@Schema({
  collection: 'faqs',
  timestamps: true,
  versionKey: false
})
export class FaqDocument extends Document {
  @Prop({ 
    required: true,
    trim: true,
    unique: true
  })
  nombre: string;

  @Prop({ 
    required: true,
    trim: true
  })
  texto_chat: string;

  @Prop({ 
    default: true,
    type: Boolean,
    index: true
  })
  activo: boolean;

  @Prop({ 
    required: true,
    type: Number,
    default: 0
  })
  orden: number;

  @Prop({ 
    type: Date,
    default: Date.now
  })
  createdAt: Date;

  @Prop({ 
    type: Date,
    default: Date.now
  })
  updatedAt: Date;
}

export const FaqSchema = SchemaFactory.createForClass(FaqDocument);

// Índices
FaqSchema.index({ activo: 1, orden: 1 });
FaqSchema.index({ nombre: 1 }, { unique: true });
