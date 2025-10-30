import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FaqDocument = Faq & Document;

/**
 * Infrastructure Schema - FAQ
 * Esquema de MongoDB para preguntas frecuentes
 */
@Schema({ collection: 'faqs', timestamps: true })
export class Faq {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], default: [] })
  keywords: string[];

  @Prop({ default: 0 })
  usage_count: number;

  @Prop({ default: 0 })
  positive_feedback: number;

  @Prop({ default: 0 })
  negative_feedback: number;

  @Prop({ default: 'active' })
  status: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const FaqSchema = SchemaFactory.createForClass(Faq);

// Índices
FaqSchema.index({ category: 1 });
FaqSchema.index({ usage_count: -1 });
FaqSchema.index({ status: 1 });
