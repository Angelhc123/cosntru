import { Injectable, Logger } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import * as ExcelJS from 'exceljs';

// Para PDFKit sin tipos en producción
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit');

/**
 * Application Service - Report Export
 * Servicio para exportar reportes en PDF y Excel
 */
@Injectable()
export class ReportExportService {
  private readonly logger = new Logger(ReportExportService.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Generar reporte en Excel
   */
  async generateExcelReport(startDate: Date, endDate: Date): Promise<Buffer> {
    this.logger.log(`Generando reporte Excel: ${startDate} - ${endDate}`);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'UPT Chat System';
    workbook.created = new Date();

    // Hoja 1: Resumen General
    const summarySheet = workbook.addWorksheet('Resumen General');
    const stats = await this.analyticsService.getDashboardStats(startDate, endDate);

    summarySheet.columns = [
      { header: 'Métrica', key: 'metric', width: 30 },
      { header: 'Valor', key: 'value', width: 20 },
    ];

    summarySheet.addRows([
      { metric: 'Consultas Totales', value: stats.totalQueries },
      { metric: 'Confianza Promedio NLP', value: `${stats.averageConfidence.toFixed(2)}%` },
      { metric: 'Tasa de Feedback Positivo', value: `${stats.positiveRate.toFixed(2)}%` },
      { metric: 'Tasa de Escalación', value: `${stats.escalationRate.toFixed(2)}%` },
    ]);

    // Estilo de header
    summarySheet.getRow(1).font = { bold: true };
    summarySheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' },
    };

    // Hoja 2: Top Intents
    const intentsSheet = workbook.addWorksheet('Top Intents');
    intentsSheet.columns = [
      { header: 'Intent', key: 'intent', width: 40 },
      { header: 'Cantidad', key: 'count', width: 15 },
    ];

    intentsSheet.addRows(stats.topIntents);
    intentsSheet.getRow(1).font = { bold: true };
    intentsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' },
    };

    // Hoja 3: Top FAQs
    const faqsSheet = workbook.addWorksheet('Top FAQs');
    faqsSheet.columns = [
      { header: 'Pregunta', key: 'question', width: 50 },
      { header: 'Usos', key: 'count', width: 15 },
    ];

    faqsSheet.addRows(stats.topFaqs);
    faqsSheet.getRow(1).font = { bold: true };
    faqsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' },
    };

    // Hoja 4: Tickets por Estado
    const ticketsSheet = workbook.addWorksheet('Tickets');
    const ticketStats = await this.analyticsService.getTicketsByStatus(startDate, endDate);
    const resolutionTime = await this.analyticsService.getAverageResolutionTime(startDate, endDate);

    ticketsSheet.columns = [
      { header: 'Estado', key: 'status', width: 20 },
      { header: 'Cantidad', key: 'count', width: 15 },
    ];

    ticketsSheet.addRows(ticketStats);
    ticketsSheet.addRow({});
    ticketsSheet.addRow({
      status: 'Tiempo Promedio de Resolución',
      count: `${resolutionTime.avgTimeHours}h ${resolutionTime.avgTimeMinutes}m`,
    });

    ticketsSheet.getRow(1).font = { bold: true };
    ticketsSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' },
    };

    // Hoja 5: Feedback
    const feedbackSheet = workbook.addWorksheet('Feedback');
    const feedbackData = await this.analyticsService.getFeedbackDistribution(startDate, endDate);

    feedbackSheet.columns = [
      { header: 'Tipo', key: 'type', width: 20 },
      { header: 'Cantidad', key: 'count', width: 15 },
    ];

    feedbackSheet.addRows(feedbackData);
    feedbackSheet.getRow(1).font = { bold: true };
    feedbackSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF667EEA' },
    };

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  /**
   * Generar reporte en PDF
   */
  async generatePDFReport(startDate: Date, endDate: Date): Promise<Buffer> {
    this.logger.log(`Generando reporte PDF: ${startDate} - ${endDate}`);

    return new Promise(async (resolve, reject) => {
      try {
        this.logger.log(`🔍 Creando documento PDF...`);
        this.logger.log(`📦 PDFDocument type: ${typeof PDFDocument}`);
        
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => {
          this.logger.log(`✅ PDF generado exitosamente, tamaño: ${Buffer.concat(chunks).length} bytes`);
          resolve(Buffer.concat(chunks));
        });

        // Obtener datos
        const stats = await this.analyticsService.getDashboardStats(startDate, endDate);
        const ticketStats = await this.analyticsService.getTicketsByStatus(startDate, endDate);
        const resolutionTime = await this.analyticsService.getAverageResolutionTime(startDate, endDate);

        // Título
        doc
          .fontSize(24)
          .fillColor('#667EEA')
          .text('Reporte de Analytics', { align: 'center' });

        doc
          .fontSize(12)
          .fillColor('#666')
          .text(`UPT Chat System - Chatbot Inteligente`, { align: 'center' })
          .moveDown(0.5);

        doc
          .fontSize(10)
          .fillColor('#999')
          .text(`Período: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, {
            align: 'center',
          })
          .moveDown(2);

        // Línea separadora
        doc
          .strokeColor('#667EEA')
          .lineWidth(2)
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke()
          .moveDown(1);

        // Sección 1: Resumen General
        doc.fontSize(16).fillColor('#333').text('📊 Resumen General').moveDown(0.5);

        doc
          .fontSize(12)
          .fillColor('#666')
          .text(`Total de Consultas: ${stats.totalQueries}`)
          .text(`Confianza Promedio NLP: ${stats.averageConfidence.toFixed(2)}%`)
          .text(`Tasa de Feedback Positivo: ${stats.positiveRate.toFixed(2)}%`)
          .text(`Tasa de Escalación: ${stats.escalationRate.toFixed(2)}%`)
          .moveDown(1.5);

        // Sección 2: Top Intents
        doc.fontSize(16).fillColor('#333').text('🎯 Top 5 Intents').moveDown(0.5);

        stats.topIntents.slice(0, 5).forEach((intent, index) => {
          doc
            .fontSize(11)
            .fillColor('#666')
            .text(`${index + 1}. ${intent.intent}: ${intent.count} usos`);
        });
        doc.moveDown(1.5);

        // Sección 3: Top FAQs
        doc.fontSize(16).fillColor('#333').text('❓ Top 5 Preguntas Frecuentes').moveDown(0.5);

        stats.topFaqs.slice(0, 5).forEach((faq, index) => {
          doc
            .fontSize(11)
            .fillColor('#666')
            .text(`${index + 1}. ${faq.question.substring(0, 60)}... (${faq.count} usos)`);
        });
        doc.moveDown(1.5);

        // Nueva página para tickets
        doc.addPage();

        // Sección 4: Tickets
        doc.fontSize(16).fillColor('#333').text('🎫 Tickets de Soporte').moveDown(0.5);

        ticketStats.forEach((ticket) => {
          doc
            .fontSize(11)
            .fillColor('#666')
            .text(`${ticket.status}: ${ticket.count} tickets`);
        });

        doc
          .moveDown(0.5)
          .text(
            `Tiempo Promedio de Resolución: ${resolutionTime.avgTimeHours}h ${resolutionTime.avgTimeMinutes}m`,
          )
          .moveDown(1.5);

        // Footer
        doc
          .fontSize(8)
          .fillColor('#999')
          .text(`Generado el ${new Date().toLocaleString()}`, 50, doc.page.height - 50, {
            align: 'center',
          });

        doc.end();
      } catch (error) {
        this.logger.error(`❌ Error generando PDF: ${error.message}`, error.stack);
        reject(error);
      }
    });
  }
}
