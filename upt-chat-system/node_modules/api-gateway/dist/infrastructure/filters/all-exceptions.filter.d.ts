import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { AppLoggerService } from '../logging/logger.service';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: AppLoggerService);
    catch(exception: unknown, host: ArgumentsHost): void;
}
