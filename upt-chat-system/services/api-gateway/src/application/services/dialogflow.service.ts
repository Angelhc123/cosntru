import { Injectable, Logger } from '@nestjs/common';

/**
 * Servicio para integración con Dialogflow Analytics
 * 
 * NOTA: Dialogflow CX Analytics API requiere plan Enterprise ($$$)
 * Para tier gratuito/estándar, usamos métricas locales solamente.
 * 
 * Si en el futuro se migra a Enterprise, descomentar código de API client.
 */
@Injectable()
export class DialogflowService {
  private readonly logger = new Logger(DialogflowService.name);
  private readonly isEnterpriseEnabled = false; // Cambiar a true si tienes plan Enterprise

  constructor() {
    this.logger.log('DialogflowService initialized - Enterprise mode: ' + this.isEnterpriseEnabled);
  }

  /**
   * Obtiene métricas de Dialogflow Analytics
   * 
   * LIMITACIÓN: Dialogflow Analytics API solo disponible en Enterprise plan
   * https://cloud.google.com/dialogflow/cx/docs/concept/analytics
   * 
   * @param period - Período de tiempo (day, week, month)
   * @returns Métricas agregadas o mensaje de limitación
   */
  async getDialogflowMetrics(period: string = 'day') {
    if (!this.isEnterpriseEnabled) {
      this.logger.warn('Dialogflow Analytics API no disponible en tier gratuito');
      return {
        available: false,
        message: 'Dialogflow Analytics requiere plan Enterprise. Usando métricas locales.',
        recommendation: 'Upgrade a Dialogflow CX Enterprise para analytics avanzado',
        localMetricsEndpoint: '/api/v1/analytics/dashboard'
      };
    }

    // TODO: Implementar cuando se tenga plan Enterprise
    // const sessionClient = new SessionsClient();
    // const projectId = process.env.DIALOGFLOW_PROJECT_ID;
    // const location = process.env.DIALOGFLOW_LOCATION || 'us-central1';
    
    try {
      this.logger.log(`Fetching Dialogflow metrics for period: ${period}`);
      
      // Placeholder para futura implementación
      return {
        available: true,
        period,
        metrics: {
          totalSessions: 0,
          intentMatchRate: 0,
          fallbackRate: 0,
          avgConfidence: 0,
          topIntents: []
        }
      };
    } catch (error) {
      this.logger.error('Error fetching Dialogflow metrics:', error);
      throw error;
    }
  }

  /**
   * Verifica disponibilidad de Analytics API
   */
  async checkAnalyticsAvailability(): Promise<boolean> {
    return this.isEnterpriseEnabled;
  }
}
