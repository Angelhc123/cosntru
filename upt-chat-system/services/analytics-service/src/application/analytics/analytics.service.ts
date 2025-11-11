import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDocument } from '../../infrastructure/database/schemas/message.schema';
import { ChatSession, ChatSessionDocument } from '../../infrastructure/database/schemas/chat-session.schema';
import { Faq, FaqDocument } from '../../infrastructure/database/schemas/faq.schema';
import { Ticket, TicketDocument } from '../../infrastructure/database/schemas/ticket.schema';
import { DashboardStats } from '../../domain/analytics/dashboard-stats.entity';

/**
 * Application Service - Analytics
 * Lógica de negocio para análisis y métricas
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(MessageDocument.name) private messageModel: Model<MessageDocument>,
    @InjectModel(ChatSession.name) private sessionModel: Model<ChatSessionDocument>,
    @InjectModel(Faq.name) private faqModel: Model<FaqDocument>,
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  /**
   * Obtener estadísticas generales del dashboard
   */
  async getDashboardStats(startDate: Date, endDate: Date): Promise<DashboardStats> {
    this.logger.log(`🔍 Generando estadísticas del dashboard: ${startDate} - ${endDate}`);

    // DEBUG: Verificar conexión y datos
    const totalMessages = await this.messageModel.countDocuments({});
    const totalSessionsDebug = await this.sessionModel.countDocuments({});
    const totalFaqs = await this.faqModel.countDocuments({});
    
    this.logger.log(`📊 DATOS EN BD: Messages: ${totalMessages}, Sessions: ${totalSessionsDebug}, FAQs: ${totalFaqs}`);

    // Consultas totales (mensajes del bot)
    const totalQueries = await this.messageModel.countDocuments({
      sender: 'bot',
      timestamp: { $gte: startDate, $lte: endDate },
    });
    
    this.logger.log(`🔢 Consultas encontradas en período: ${totalQueries}`);

    // Confianza promedio del NLP
    const confidenceAgg = await this.messageModel.aggregate([
      {
        $match: {
          sender: 'bot',
          'metadata.confidence': { $exists: true },
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          avgConfidence: { $avg: '$metadata.confidence' },
        },
      },
    ]);

    const averageConfidence = confidenceAgg.length > 0 ? confidenceAgg[0].avgConfidence : 0;

    // Tasa de feedback positivo
    const totalFeedback = await this.messageModel.countDocuments({
      feedback: { $exists: true, $ne: null },
      timestamp: { $gte: startDate, $lte: endDate },
    });

    const positiveFeedback = await this.messageModel.countDocuments({
      feedback: 'positive',
      timestamp: { $gte: startDate, $lte: endDate },
    });

    const positiveRate = totalFeedback > 0 ? (positiveFeedback / totalFeedback) * 100 : 0;

    // Tasa de escalación (tickets creados)
    const totalSessions = await this.sessionModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const totalTickets = await this.ticketModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const escalationRate = totalSessions > 0 ? (totalTickets / totalSessions) * 100 : 0;

    // Top intents - Corregido para extraer el nombre del intent correctamente
    const topIntents = await this.messageModel.aggregate([
      {
        $match: {
          sender: 'bot',
          'metadata.intent': { $exists: true },
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $type: '$metadata.intent' },
              then: {
                $cond: {
                  if: { $eq: [{ $type: '$metadata.intent' }, 'object'] },
                  then: { 
                    $cond: {
                      if: '$metadata.intent.name',
                      then: '$metadata.intent.name',
                      else: { 
                        $cond: {
                          if: '$metadata.intent.id',
                          then: '$metadata.intent.id',
                          else: 'Intent Desconocido'
                        }
                      }
                    }
                  },
                  else: '$metadata.intent'
                }
              },
              else: 'Intent Desconocido'
            }
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          intent: '$_id',
          count: 1,
        },
      },
    ]);

    return DashboardStats.create({
      totalQueries,
      averageConfidence,
      positiveRate,
      escalationRate,
      topIntents,
      topFaqs: [],
      period: { start: startDate, end: endDate },
    });
  }

  /**
   * Obtener métricas de consultas por período
   */
  async getQueriesByPeriod(startDate: Date, endDate: Date, granularity: 'hour' | 'day' | 'week' = 'day') {
    this.logger.log(`Obteniendo consultas por ${granularity}: ${startDate} - ${endDate}`);

    let dateFormat: string;
    switch (granularity) {
      case 'hour':
        dateFormat = '%Y-%m-%d %H:00';
        break;
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        dateFormat = '%Y-W%V';
        break;
    }

    const queries = await this.messageModel.aggregate([
      {
        $match: {
          sender: 'bot',
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          period: '$_id',
          count: 1,
        },
      },
    ]);

    return queries;
  }

  /**
   * Obtener distribución de feedback
   */
  async getFeedbackDistribution(startDate: Date, endDate: Date) {
    this.logger.log(`Obteniendo distribución de feedback: ${startDate} - ${endDate}`);

    const feedbackStats = await this.messageModel.aggregate([
      {
        $match: {
          feedback: { $exists: true, $ne: null },
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$feedback',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
        },
      },
    ]);

    return feedbackStats;
  }

  /**
   * Obtener intents con menor confianza (candidatos a mejora)
   */
  async getLowConfidenceIntents(startDate: Date, endDate: Date, threshold = 0.7) {
    this.logger.log(`Obteniendo intents con baja confianza (< ${threshold})`);

    const lowConfidence = await this.messageModel.aggregate([
      {
        $match: {
          sender: 'bot',
          'metadata.intent': { $exists: true },
          'metadata.confidence': { $exists: true, $lt: threshold },
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $type: '$metadata.intent' },
              then: {
                $cond: {
                  if: { $eq: [{ $type: '$metadata.intent' }, 'object'] },
                  then: { 
                    $cond: {
                      if: '$metadata.intent.name',
                      then: '$metadata.intent.name',
                      else: { 
                        $cond: {
                          if: '$metadata.intent.id',
                          then: '$metadata.intent.id',
                          else: 'Intent Desconocido'
                        }
                      }
                    }
                  },
                  else: '$metadata.intent'
                }
              },
              else: 'Intent Desconocido'
            }
          },
          avgConfidence: { $avg: '$metadata.confidence' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          intent: '$_id',
          avgConfidence: 1,
          count: 1,
        },
      },
    ]);

    return lowConfidence;
  }

  /**
   * Obtener patrones de uso por hora del día
   */
  async getUsagePatternsByHour(startDate: Date, endDate: Date) {
    this.logger.log(`Obteniendo patrones de uso por hora`);

    const hourlyUsage = await this.messageModel.aggregate([
      {
        $match: {
          sender: 'user',
          timestamp: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          hour: '$_id',
          count: 1,
        },
      },
    ]);

    return hourlyUsage;
  }

  /**
   * Obtener tickets por estado
   */
  async getTicketsByStatus(startDate: Date, endDate: Date) {
    this.logger.log(`Obteniendo tickets por estado`);

    const ticketStats = await this.ticketModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);

    return ticketStats;
  }

  /**
   * Obtener razones de escalación más comunes
   */
  async getEscalationReasons(startDate: Date, endDate: Date) {
    this.logger.log(`Obteniendo razones de escalación`);

    const reasons = await this.ticketModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$escalationReason',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          reason: {
            $switch: {
              branches: [
                { case: { $eq: ['$_id', 'password'] }, then: 'Problemas de Contraseña Institucional' },
                { case: { $eq: ['$_id', 'technical'] }, then: 'Problemas Técnicos del Sistema' },
                { case: { $eq: ['$_id', 'academic'] }, then: 'Consultas Académicas Complejas' },
                { case: { $eq: ['$_id', 'administrative'] }, then: 'Trámites Administrativos' },
                { case: { $eq: ['$_id', 'general'] }, then: 'Consultas Generales' },
                { case: { $eq: ['$_id', 'enrollment'] }, then: 'Problemas de Matrícula' },
                { case: { $eq: ['$_id', 'low_confidence'] }, then: 'Respuestas de Baja Confianza' },
                { case: { $eq: ['$_id', 'complex_query'] }, then: 'Consultas Complejas' }
              ],
              default: {
                $cond: {
                  if: { $ne: ['$_id', null] },
                  then: '$_id',
                  else: 'Sin Categoría Específica'
                }
              }
            }
          },
          count: 1,
        },
      },
    ]);

    return reasons;
  }

  /**
   * Obtener tiempo promedio de resolución de tickets
   */
  async getAverageResolutionTime(startDate: Date, endDate: Date) {
    this.logger.log(`Calculando tiempo promedio de resolución`);

    const avgTime = await this.ticketModel.aggregate([
      {
        $match: {
          status: 'resolved',
          createdAt: { $gte: startDate, $lte: endDate },
          resolvedAt: { $exists: true },
        },
      },
      {
        $project: {
          resolutionTime: {
            $subtract: ['$resolvedAt', '$createdAt'],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgTimeMs: { $avg: '$resolutionTime' },
        },
      },
    ]);

    if (avgTime.length === 0) {
      return { avgTimeHours: 0, avgTimeMinutes: 0 };
    }

    const avgTimeMs = avgTime[0].avgTimeMs;
    const avgTimeHours = avgTimeMs / (1000 * 60 * 60);
    const avgTimeMinutes = (avgTimeMs / (1000 * 60)) % 60;

    return {
      avgTimeHours: Math.floor(avgTimeHours),
      avgTimeMinutes: Math.floor(avgTimeMinutes),
    };
  }

  /**
   * Obtener FAQs con mejor/peor feedback
   */
  async getFaqsByFeedback(limit = 10) {
    this.logger.log(`Obteniendo FAQs por feedback`);

    const bestFaqs = await this.faqModel
      .find({ status: 'active' })
      .sort({ positive_feedback: -1 })
      .limit(limit)
      .select('question positive_feedback negative_feedback usage_count')
      .lean();

    const worstFaqs = await this.faqModel
      .find({ status: 'active' })
      .sort({ negative_feedback: -1 })
      .limit(limit)
      .select('question positive_feedback negative_feedback usage_count')
      .lean();

    return {
      bestFaqs: bestFaqs.map(faq => ({
        question: faq.question,
        positiveFeedback: faq.positive_feedback,
        negativeFeedback: faq.negative_feedback,
        usageCount: faq.usage_count,
        successRate:
          faq.positive_feedback + faq.negative_feedback > 0
            ? (faq.positive_feedback / (faq.positive_feedback + faq.negative_feedback)) * 100
            : 0,
      })),
      worstFaqs: worstFaqs.map(faq => ({
        question: faq.question,
        positiveFeedback: faq.positive_feedback,
        negativeFeedback: faq.negative_feedback,
        usageCount: faq.usage_count,
        successRate:
          faq.positive_feedback + faq.negative_feedback > 0
            ? (faq.positive_feedback / (faq.positive_feedback + faq.negative_feedback)) * 100
            : 0,
      })),
    };
  }

  /**
   * Obtener sesiones activas
   */
  async getActiveSessions() {
    const activeSessions = await this.sessionModel.countDocuments({
      status: 'active',
    });

    return { activeSessionsCount: activeSessions };
  }

  /**
   * Obtener top intents más utilizados
   */
  async getTopIntents(startDate: Date, endDate: Date, limit: number = 10) {
    this.logger.log(`📊 Obteniendo top ${limit} intents: ${startDate} - ${endDate}`);

    const intentsAgg = await this.messageModel.aggregate([
      {
        $match: {
          sender: 'bot',
          timestamp: { $gte: startDate, $lte: endDate },
          'metadata.intent': { 
            $exists: true, 
            $ne: null, 
            $nin: ['unknown', '', undefined] 
          },
        },
      },
      {
        $group: {
          _id: '$metadata.intent',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$metadata.confidence' },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    this.logger.log(`🎯 Intents encontrados: ${intentsAgg.length}`);

    return intentsAgg.map(intent => ({
      name: intent._id || 'unknown',
      count: intent.count,
      confidence: Math.round(intent.avgConfidence * 100) / 100,
    }));
  }

  /**
   * Obtener top FAQs más consultadas
   */
  async getTopFaqs(startDate: Date, endDate: Date, limit: number = 10) {
    this.logger.log(`❓ Top FAQs deshabilitado - devolviendo lista vacía`);
    return [];
  }
}
