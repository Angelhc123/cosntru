import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/**
 * Health Check Use Cases
 * 
 * Verifica el estado de salud del sistema:
 * - Conexión a MongoDB
 * - Tiempo de actividad
 * - Información del sistema
 */

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  database: {
    status: 'connected' | 'disconnected';
    type: string;
    responseTime?: number;
  };
  memory: {
    used: string;
    total: string;
    percentage: string;
  };
}

@Injectable()
export class HealthCheckUseCase {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /**
   * Verifica el estado completo del sistema
   */
  async execute(): Promise<HealthStatus> {
    const dbStatus = await this.checkDatabaseConnection();
    const memoryUsage = this.getMemoryUsage();

    const health: HealthStatus = {
      status: dbStatus.status === 'connected' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      database: {
        status: dbStatus.status,
        type: 'MongoDB',
        responseTime: dbStatus.responseTime,
      },
      memory: memoryUsage,
    };

    return health;
  }

  /**
   * Verifica solo la conexión a la base de datos (health check rápido)
   */
  async checkDatabaseConnection(): Promise<{
    status: 'connected' | 'disconnected';
    responseTime?: number;
  }> {
    try {
      const startTime = Date.now();
      
      // Ping a MongoDB
      if (this.connection.db) {
        await this.connection.db.admin().ping();
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: this.connection.readyState === 1 ? 'connected' : 'disconnected',
        responseTime,
      };
    } catch (error) {
      return {
        status: 'disconnected',
      };
    }
  }

  /**
   * Obtiene información de uso de memoria
   */
  private getMemoryUsage(): {
    used: string;
    total: string;
    percentage: string;
  } {
    const used = process.memoryUsage();
    const total = used.heapTotal;
    const usedHeap = used.heapUsed;
    const percentage = ((usedHeap / total) * 100).toFixed(2);

    return {
      used: `${(usedHeap / 1024 / 1024).toFixed(2)} MB`,
      total: `${(total / 1024 / 1024).toFixed(2)} MB`,
      percentage: `${percentage}%`,
    };
  }
}
