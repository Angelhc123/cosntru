import { Connection } from 'mongoose';
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
export declare class HealthCheckUseCase {
    private readonly connection;
    constructor(connection: Connection);
    execute(): Promise<HealthStatus>;
    checkDatabaseConnection(): Promise<{
        status: 'connected' | 'disconnected';
        responseTime?: number;
    }>;
    private getMemoryUsage;
}
