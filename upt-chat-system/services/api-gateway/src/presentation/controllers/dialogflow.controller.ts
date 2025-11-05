import { Controller, Get, Query, Logger } from '@nestjs/common';
import { DialogflowService } from '../../application/services/dialogflow.service';

@Controller('dialogflow')
export class DialogflowController {
  private readonly logger = new Logger(DialogflowController.name);

  constructor(private readonly dialogflowService: DialogflowService) {}

  /**
   * GET /api/v1/dialogflow/analytics?period=day|week|month
   * 
   * Obtiene métricas de Dialogflow Analytics (solo Enterprise)
   * Para tier gratuito retorna mensaje de limitación
   */
  @Get('analytics')
  async getAnalytics(@Query('period') period: string = 'day') {
    try {
      const metrics = await this.dialogflowService.getDialogflowMetrics(period);
      
      return {
        success: true,
        data: metrics
      };
    } catch (error) {
      this.logger.error('Error getting Dialogflow analytics:', error);
      return {
        success: false,
        error: error.message || 'Error obteniendo métricas de Dialogflow'
      };
    }
  }

  /**
   * GET /api/v1/dialogflow/availability
   * 
   * Verifica si Analytics API está disponible
   */
  @Get('availability')
  async checkAvailability() {
    try {
      const isAvailable = await this.dialogflowService.checkAnalyticsAvailability();
      
      return {
        success: true,
        data: {
          analyticsAvailable: isAvailable,
          plan: isAvailable ? 'Enterprise' : 'Free/Standard',
          message: isAvailable 
            ? 'Dialogflow Analytics API disponible' 
            : 'Analytics requiere plan Enterprise. Usando métricas locales.'
        }
      };
    } catch (error) {
      this.logger.error('Error checking availability:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
