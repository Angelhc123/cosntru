import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDocument } from '../../infrastructure/database/schemas/message.schema';
import { TicketDocument } from '../../infrastructure/database/schemas/ticket.schema';
import { AnalyticsDocument } from '../../infrastructure/database/schemas/analytics.schema';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectModel('Message') private readonly messageModel: Model<MessageDocument>,
        @InjectModel('Ticket') private readonly ticketModel: Model<TicketDocument>,
        @InjectModel('Analytics') private readonly analyticsModel: Model<AnalyticsDocument>
    ) {}

    async getDashboard(period: 'day' | 'week' | 'month' = 'day') {
        try {
            const now = new Date();
            let startDate: Date;

            switch (period) {
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default: // day
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            }

            // Consultas totales
            const totalQueries = await this.messageModel.countDocuments({
                sender: 'user',
                timestamp: { $gte: startDate }
            });

            // Distribución de intents
            const intentsPipeline = await this.messageModel.aggregate([
                {
                    $match: {
                        sender: 'bot',
                        timestamp: { $gte: startDate },
                        'metadata.intent': { $exists: true }
                    }
                },
                {
                    $group: {
                        _id: '$metadata.intent.name',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]);

            const intentBreakdown = intentsPipeline.reduce((acc, item) => {
                acc[item._id || 'unknown'] = item.count;
                return acc;
            }, {});

            // Confianza promedio
            const confidenceAgg = await this.messageModel.aggregate([
                {
                    $match: {
                        sender: 'bot',
                        timestamp: { $gte: startDate },
                        'metadata.confidence': { $exists: true }
                    }
                },
                {
                    $group: {
                        _id: null,
                        avgConfidence: { $avg: '$metadata.confidence' }
                    }
                }
            ]);

            const avgConfidence = confidenceAgg[0]?.avgConfidence || 0;

            // Consultas con baja confianza (<70%)
            const lowConfidenceCount = await this.messageModel.countDocuments({
                sender: 'bot',
                timestamp: { $gte: startDate },
                'metadata.confidence': { $lt: 0.7 }
            });

            // Tickets escalados
            const escalatedTickets = await this.ticketModel.countDocuments({
                createdAt: { $gte: startDate }
            });

            // Feedback stats
            const feedbackPositive = await this.messageModel.countDocuments({
                sender: 'bot',
                timestamp: { $gte: startDate },
                feedback: 'positive'
            });

            const feedbackNegative = await this.messageModel.countDocuments({
                sender: 'bot',
                timestamp: { $gte: startDate },
                feedback: 'negative'
            });

            const feedbackTotal = feedbackPositive + feedbackNegative;
            const feedbackRatio = feedbackTotal > 0 
                ? (feedbackPositive / feedbackTotal) * 100 
                : 0;

            // Tasa de escalamiento
            const totalBotResponses = await this.messageModel.countDocuments({
                sender: 'bot',
                timestamp: { $gte: startDate }
            });

            const escalationRate = totalBotResponses > 0
                ? (escalatedTickets / totalBotResponses) * 100
                : 0;

            return {
                period,
                startDate,
                endDate: now,
                totalQueries,
                intentBreakdown,
                avgConfidence: Math.round(avgConfidence * 100) / 100,
                lowConfidenceCount,
                escalatedTickets,
                escalationRate: Math.round(escalationRate * 100) / 100,
                feedbackStats: {
                    positive: feedbackPositive,
                    negative: feedbackNegative,
                    total: feedbackTotal,
                    ratio: Math.round(feedbackRatio * 100) / 100
                },
                topIntents: intentsPipeline.map(item => ({
                    intent: item._id || 'unknown',
                    count: item.count
                }))
            };
        } catch (error) {
            console.error('❌ Error obteniendo dashboard:', error);
            throw error;
        }
    }

    async getRealtime() {
        try {
            // Últimas 24 horas
            const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

            // Consultas por hora (últimas 24h)
            const queriesByHour = await this.messageModel.aggregate([
                {
                    $match: {
                        sender: 'user',
                        timestamp: { $gte: last24h }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d %H:00',
                                date: '$timestamp'
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]);

            // Últimos tickets creados
            const recentTickets = await this.ticketModel
                .find({ createdAt: { $gte: last24h } })
                .sort({ createdAt: -1 })
                .limit(10)
                .select('ticketId status priority createdAt userName')
                .lean();

            // Actividad en tiempo real (última hora)
            const lastHour = new Date(Date.now() - 60 * 60 * 1000);
            const activeNow = {
                queries: await this.messageModel.countDocuments({
                    sender: 'user',
                    timestamp: { $gte: lastHour }
                }),
                responses: await this.messageModel.countDocuments({
                    sender: 'bot',
                    timestamp: { $gte: lastHour }
                }),
                tickets: await this.ticketModel.countDocuments({
                    createdAt: { $gte: lastHour }
                })
            };

            return {
                queriesByHour,
                recentTickets,
                activeNow,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('❌ Error obteniendo métricas en tiempo real:', error);
            throw error;
        }
    }

    async getTimeSeriesData(period: 'day' | 'week' | 'month' = 'week') {
        try {
            const now = new Date();
            let startDate: Date;
            let groupFormat: string;

            switch (period) {
                case 'day':
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    groupFormat = '%Y-%m-%d %H:00';
                    break;
                case 'week':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    groupFormat = '%Y-%m-%d';
                    break;
                case 'month':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    groupFormat = '%Y-%m-%d';
                    break;
            }

            const timeSeriesData = await this.messageModel.aggregate([
                {
                    $match: {
                        timestamp: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: {
                            date: {
                                $dateToString: {
                                    format: groupFormat,
                                    date: '$timestamp'
                                }
                            },
                            sender: '$sender'
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { '_id.date': 1 } }
            ]);

            return timeSeriesData;
        } catch (error) {
            console.error('❌ Error obteniendo series temporales:', error);
            throw error;
        }
    }
}
