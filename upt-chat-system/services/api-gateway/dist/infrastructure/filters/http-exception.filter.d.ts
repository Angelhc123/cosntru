import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { AppLoggerService } from '../logging/logger.service';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: AppLoggerService);
    catch(exception: HttpException, host: ArgumentsHost): void;
}
