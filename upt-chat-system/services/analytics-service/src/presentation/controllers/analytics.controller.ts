import { Controller, Get, Query, Logger, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AnalyticsService } from '../../application/analytics/analytics.service';
import { ReportExportService } from '../../application/analytics/report-export.service';

/**
 * Presentation Controller - Analytics
 * Controlador REST para endpoints de analytics
 */
@Controller('analytics')
export class AnalyticsController {
  private readonly logger = new Logger(AnalyticsController.name);

  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly reportExportService: ReportExportService,
  ) {}

  /**
   * GET /analytics/dashboard
   * Obtener estadísticas generales del dashboard
   */
  @Get('dashboard')
  async getDashboardStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 días atrás
    const end = endDate ? new Date(endDate) : new Date();

    this.logger.log(`GET /analytics/dashboard - Período: ${start} - ${end}`);

    const stats = await this.analyticsService.getDashboardStats(start, end);

    return {
      success: true,
      data: stats,
    };
  }

  /**
   * GET /analytics/queries
   * Obtener consultas por período
   */
  @Get('queries')
  async getQueriesByPeriod(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('granularity') granularity?: 'hour' | 'day' | 'week',
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 días
    const end = endDate ? new Date(endDate) : new Date();
    const gran = granularity || 'day';

    this.logger.log(`GET /analytics/queries - Período: ${start} - ${end}, Granularidad: ${gran}`);

    const queries = await this.analyticsService.getQueriesByPeriod(start, end, gran);

    return {
      success: true,
      data: queries,
    };
  }

  /**
   * GET /analytics/feedback
   * Obtener distribución de feedback
   */
  @Get('feedback')
  async getFeedbackDistribution(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    this.logger.log(`GET /analytics/feedback - Período: ${start} - ${end}`);

    const feedback = await this.analyticsService.getFeedbackDistribution(start, end);

    return {
      success: true,
      data: feedback,
    };
  }

  /**
   * GET /analytics/low-confidence
   * Obtener intents con baja confianza
   */
  @Get('low-confidence')
  async getLowConfidenceIntents(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('threshold') threshold?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    const conf = threshold ? parseFloat(threshold) : 0.7;

    this.logger.log(`GET /analytics/low-confidence - Umbral: ${conf}`);

    const intents = await this.analyticsService.getLowConfidenceIntents(start, end, conf);

    return {
      success: true,
      data: intents,
    };
  }

  /**
   * GET /analytics/usage-patterns
   * Obtener patrones de uso por hora
   */
  @Get('usage-patterns')
  async getUsagePatterns(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    this.logger.log(`GET /analytics/usage-patterns - Período: ${start} - ${end}`);

    const patterns = await this.analyticsService.getUsagePatternsByHour(start, end);

    return {
      success: true,
      data: patterns,
    };
  }

  /**
   * GET /analytics/tickets/status
   * Obtener tickets por estado
   */
  @Get('tickets/status')
  async getTicketsByStatus(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    this.logger.log(`GET /analytics/tickets/status - Período: ${start} - ${end}`);

    const tickets = await this.analyticsService.getTicketsByStatus(start, end);

    return {
      success: true,
      data: tickets,
    };
  }

  /**
   * GET /analytics/tickets/escalation-reasons
   * Obtener razones de escalación
   */
  @Get('tickets/escalation-reasons')
  async getEscalationReasons(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    this.logger.log(`GET /analytics/tickets/escalation-reasons`);

    const reasons = await this.analyticsService.getEscalationReasons(start, end);

    return {
      success: true,
      data: reasons,
    };
  }

  /**
   * GET /analytics/tickets/resolution-time
   * Obtener tiempo promedio de resolución
   */
  @Get('tickets/resolution-time')
  async getResolutionTime(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    this.logger.log(`GET /analytics/tickets/resolution-time`);

    const time = await this.analyticsService.getAverageResolutionTime(start, end);

    return {
      success: true,
      data: time,
    };
  }

  /**
   * GET /analytics/faqs/feedback
   * Obtener FAQs con mejor/peor feedback
   */
  @Get('faqs/feedback')
  async getFaqsByFeedback(@Query('limit') limit?: string) {
    const lim = limit ? parseInt(limit) : 10;

    this.logger.log(`GET /analytics/faqs/feedback - Límite: ${lim}`);

    const faqs = await this.analyticsService.getFaqsByFeedback(lim);

    return {
      success: true,
      data: faqs,
    };
  }

  /**
   * GET /analytics/sessions/active
   * Obtener sesiones activas
   */
  @Get('sessions/active')
  async getActiveSessions() {
    this.logger.log(`GET /analytics/sessions/active`);

    const sessions = await this.analyticsService.getActiveSessions();

    return {
      success: true,
      data: sessions,
    };
  }

  /**
   * GET /health
   * Health check del servicio
   */
  @Get('health')
  getHealth() {
    return {
      success: true,
      service: 'analytics-service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * GET /analytics/export/excel
   * Exportar reporte en Excel
   */
  @Get('export/excel')
  async exportExcel(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res?: Response,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    this.logger.log(`Exportando reporte Excel: ${start} - ${end}`);

    try {
      const buffer = await this.reportExportService.generateExcelReport(start, end);

      const filename = `reporte_analytics_${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);

      return res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      this.logger.error('Error al exportar Excel:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al generar reporte Excel',
        error: error.message,
      });
    }
  }

  /**
   * GET /analytics/export/pdf
   * Exportar reporte en PDF
   */
  @Get('export/pdf')
  async exportPDF(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Res() res?: Response,
  ) {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    this.logger.log(`Exportando reporte PDF: ${start} - ${end}`);

    try {
      const buffer = await this.reportExportService.generatePDFReport(start, end);

      const filename = `reporte_analytics_${start.toISOString().split('T')[0]}_${end.toISOString().split('T')[0]}.pdf`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', buffer.length);

      return res.status(HttpStatus.OK).send(buffer);
    } catch (error) {
      this.logger.error('Error al exportar PDF:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Error al generar reporte PDF',
        error: error.message,
      });
    }
  }

  /**
   * GET /analytics/debug/count
   * Contar mensajes sin filtros (DEBUG)
   */
  @Get('debug/count')
  async debugCount() {
    const Message = this.analyticsService['messageModel'];
    const totalMessages = await Message.countDocuments({});
    const botMessages = await Message.countDocuments({ sender: 'bot' });
    const userMessages = await Message.countDocuments({ sender: 'user' });
    const withFeedback = await Message.countDocuments({ feedback: { $exists: true, $ne: null } });
    const sampleMessage = await Message.findOne({});
    
    // Debug info
    const dbName = Message.db.name;
    const collectionName = Message.collection.name;
    
    return {
      success: true,
      data: {
        connectionInfo: {
          database: dbName,
          collection: collectionName,
          mongoUri: process.env.MONGODB_URI ? 'Usando .env' : 'Usando default localhost',
        },
        totalMessages,
        botMessages,
        userMessages,
        withFeedback,
        sampleMessage,
      },
    };
  }
}
