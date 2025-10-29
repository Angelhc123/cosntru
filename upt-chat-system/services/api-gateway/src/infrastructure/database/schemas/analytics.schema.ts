import { Schema, Document } from 'mongoose';

export interface AnalyticsDocument extends Document {
    period: string; // 'hour' | 'day' | 'week' | 'month'
    date: Date;
    total_queries: number;
    intents_distribution: Map<string, number>;
    confidence_avg: number;
    low_confidence_count: number;
    escalated_tickets: number;
    feedback_stats: {
        positive: number;
        negative: number;
        neutral: number;
    };
    top_intents: Array<{ intent: string; count: number }>;
    createdAt: Date;
}

export const AnalyticsSchema = new Schema({
    period: { type: String, enum: ['hour', 'day', 'week', 'month'], required: true },
    date: { type: Date, required: true },
    total_queries: { type: Number, default: 0 },
    intents_distribution: { type: Map, of: Number, default: {} },
    confidence_avg: { type: Number, default: 0 },
    low_confidence_count: { type: Number, default: 0 },
    escalated_tickets: { type: Number, default: 0 },
    feedback_stats: {
        positive: { type: Number, default: 0 },
        negative: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 }
    },
    top_intents: [{ intent: String, count: Number }],
    createdAt: { type: Date, default: Date.now }
});

AnalyticsSchema.index({ period: 1, date: -1 });
AnalyticsSchema.index({ date: -1 });
