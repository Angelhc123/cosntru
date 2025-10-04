import { HealthCheckUseCase } from '../../application/use-cases/health.use-cases';
export declare class HealthController {
    private readonly healthCheckUseCase;
    constructor(healthCheckUseCase: HealthCheckUseCase);
    healthCheck(): Promise<import("../../application/use-cases/health.use-cases").HealthStatus>;
    ping(): {
        status: string;
        timestamp: string;
    };
    databaseCheck(): Promise<{
        status: "connected" | "disconnected";
        responseTime?: number;
    }>;
}
