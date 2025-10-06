import { Injectable, LoggerService as NestLoggerService, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

/**
 * Servicio de Logger personalizado usando Winston
 * 
 * Uso:
 * constructor(private readonly logger: AppLoggerService) {}
 * 
 * this.logger.log('Mensaje informativo');
 * this.logger.error('Error crítico', trace);
 * this.logger.warn('Advertencia');
 * this.logger.debug('Debug info');
 */
@Injectable()
export class AppLoggerService implements NestLoggerService {
  private context?: string;

  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  /**
   * Establece el contexto del logger (nombre del servicio/controlador)
   */
  setContext(context: string) {
    this.context = context;
  }

  /**
   * Log informativo - eventos importantes del sistema
   */
  log(message: string, context?: string) {
    const logContext = context || this.context;
    this.logger.info(message, { context: logContext });
  }

  /**
   * Error crítico - requiere atención inmediata
   */
  error(message: string, trace?: string, context?: string) {
    const logContext = context || this.context;
    this.logger.error(message, {
      context: logContext,
      trace,
    });
  }

  /**
   * Advertencia - situación inesperada pero no crítica
   */
  warn(message: string, context?: string) {
    const logContext = context || this.context;
    this.logger.warn(message, { context: logContext });
  }

  /**
   * Debug - información detallada para desarrollo
   */
  debug(message: string, context?: string) {
    const logContext = context || this.context;
    this.logger.debug(message, { context: logContext });
  }

  /**
   * Verbose - información muy detallada
   */
  verbose(message: string, context?: string) {
    const logContext = context || this.context;
    this.logger.verbose(message, { context: logContext });
  }

  /**
   * Log con metadata adicional
   */
  logWithMetadata(message: string, metadata: Record<string, any>, context?: string) {
    const logContext = context || this.context;
    this.logger.info(message, {
      context: logContext,
      ...metadata,
    });
  }

  /**
   * Log de autenticación
   */
  logAuth(action: string, email: string, success: boolean, reason?: string) {
    this.logger.info('Authentication attempt', {
      context: 'Auth',
      action,
      email,
      success,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Log de performance
   */
  logPerformance(operation: string, duration: number, context?: string) {
    const logContext = context || this.context;
    this.logger.info('Performance metric', {
      context: logContext,
      operation,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  }
}
