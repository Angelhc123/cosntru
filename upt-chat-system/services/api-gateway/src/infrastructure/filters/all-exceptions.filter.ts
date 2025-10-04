import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLoggerService } from '../logging/logger.service';

/**
 * All Exceptions Filter (Catch-All)
 * 
 * Captura CUALQUIER excepción no manejada, incluyendo:
 * - Errores de MongoDB
 * - Errores de validación
 * - Errores de red
 * - Errores no esperados
 * 
 * Asegura que SIEMPRE se retorne una respuesta JSON consistente,
 * incluso si el error no es un HttpException.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext('AllExceptionsFilter');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'InternalServerError';

    // Si es una HttpException, extraer datos
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const exceptionResponseObj = exceptionResponse as any;
        message = exceptionResponseObj.message || exception.message;
        error = exceptionResponseObj.error || exception.name;
      } else {
        message = exceptionResponse as string;
        error = exception.name;
      }
    }
    // Error de MongoDB
    else if (exception instanceof Error && exception.name === 'MongoError') {
      status = HttpStatus.SERVICE_UNAVAILABLE;
      message = 'Database error';
      error = 'DatabaseError';
    }
    // Cualquier otro error
    else if (exception instanceof Error) {
      message = exception.message || 'Unknown error';
      error = exception.name || 'Error';
    }

    // Construir respuesta consistente
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    // Log crítico para errores no controlados
    this.logger.error(
      `Unhandled Exception: ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : JSON.stringify(exception),
    );

    // En desarrollo, agregar stack trace
    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
      (errorResponse as any).stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }
}
