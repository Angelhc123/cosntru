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
 * HTTP Exception Filter
 * 
 * Maneja todas las excepciones HTTP (4xx, 5xx) y las formatea de manera consistente.
 * 
 * Formato de respuesta:
 * {
 *   "statusCode": 404,
 *   "timestamp": "2025-10-04T10:30:00.123Z",
 *   "path": "/api/v1/users/123",
 *   "method": "GET",
 *   "message": "User not found",
 *   "error": "Not Found"
 * }
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {
    this.logger.setContext('HttpExceptionFilter');
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extraer mensaje del error
    let message: string | string[];
    let error: string;

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const exceptionResponseObj = exceptionResponse as any;
      message = exceptionResponseObj.message || exception.message;
      error = exceptionResponseObj.error || exception.name;
    } else {
      message = exceptionResponse as string;
      error = exception.name;
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

    // Log del error
    if (status >= 500) {
      // Errores del servidor - log como error
      this.logger.error(
        `HTTP ${status} Error: ${request.method} ${request.url}`,
        exception.stack,
      );
    } else if (status >= 400) {
      // Errores del cliente - log como warning
      this.logger.warn(
        `HTTP ${status} Client Error: ${request.method} ${request.url} - ${message}`,
      );
    }

    response.status(status).json(errorResponse);
  }
}
