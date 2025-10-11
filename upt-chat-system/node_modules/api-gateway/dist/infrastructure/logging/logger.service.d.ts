import { LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger } from 'winston';
export declare class AppLoggerService implements NestLoggerService {
    private readonly logger;
    private context?;
    constructor(logger: Logger);
    setContext(context: string): void;
    log(message: string, context?: string): void;
    error(message: string, trace?: string, context?: string): void;
    warn(message: string, context?: string): void;
    debug(message: string, context?: string): void;
    verbose(message: string, context?: string): void;
    logWithMetadata(message: string, metadata: Record<string, any>, context?: string): void;
    logAuth(action: string, email: string, success: boolean, reason?: string): void;
    logPerformance(operation: string, duration: number, context?: string): void;
}
