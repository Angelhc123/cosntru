import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheckUseCase } from '../../application/use-cases/health.use-cases';

/**
 * Health Controller
 * 
 * Endpoints para verificar el estado del sistema.
 * Usado por:
 * - Docker healthcheck
 * - Railway/Render health checks
 * - Kubernetes liveness/readiness probes
 * - Monitoreo externo (UptimeRobot, Pingdom, etc.)
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthCheckUseCase: HealthCheckUseCase) {}

  /**
   * Health check completo
   * 
   * GET /api/v1/health
   * 
   * Retorna estado detallado del sistema:
   * - Estado de MongoDB
   * - Tiempo de actividad
   * - Uso de memoria
   * - Versión de la API
   */
  @Get()
  @ApiOperation({ 
    summary: 'Health check completo',
    description: 'Verifica el estado de salud del sistema incluyendo base de datos, memoria y tiempo de actividad',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sistema operando correctamente',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-10-04T10:30:00.000Z',
        uptime: 3600,
        environment: 'production',
        version: '1.0.0',
        database: {
          status: 'connected',
          type: 'MongoDB',
          responseTime: 15,
        },
        memory: {
          used: '45.23 MB',
          total: '128.00 MB',
          percentage: '35.34%',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Sistema degradado o sin conexión a base de datos',
  })
  async healthCheck() {
    return this.healthCheckUseCase.execute();
  }

  /**
   * Health check simple (para Docker)
   * 
   * GET /api/v1/health/ping
   * 
   * Retorna solo estado básico (más rápido)
   */
  @Get('/ping')
  @ApiOperation({ 
    summary: 'Health check rápido',
    description: 'Verifica solo que el servidor responda (sin verificar dependencias)',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Servidor activo',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-10-04T10:30:00.000Z',
      },
    },
  })
  ping() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Health check de base de datos
   * 
   * GET /api/v1/health/database
   * 
   * Verifica solo la conexión a MongoDB
   */
  @Get('/database')
  @ApiOperation({ 
    summary: 'Health check de base de datos',
    description: 'Verifica solo la conexión a MongoDB',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Base de datos conectada',
    schema: {
      example: {
        status: 'connected',
        type: 'MongoDB',
        responseTime: 12,
      },
    },
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Base de datos desconectada',
  })
  async databaseCheck() {
    return this.healthCheckUseCase.checkDatabaseConnection();
  }
}
