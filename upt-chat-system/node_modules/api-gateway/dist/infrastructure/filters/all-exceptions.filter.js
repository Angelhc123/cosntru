"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const logger_service_1 = require("../logging/logger.service");
let AllExceptionsFilter = class AllExceptionsFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
        this.logger.setContext('AllExceptionsFilter');
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'InternalServerError';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const exceptionResponseObj = exceptionResponse;
                message = exceptionResponseObj.message || exception.message;
                error = exceptionResponseObj.error || exception.name;
            }
            else {
                message = exceptionResponse;
                error = exception.name;
            }
        }
        else if (exception instanceof Error && exception.name === 'MongoError') {
            status = common_1.HttpStatus.SERVICE_UNAVAILABLE;
            message = 'Database error';
            error = 'DatabaseError';
        }
        else if (exception instanceof Error) {
            message = exception.message || 'Unknown error';
            error = exception.name || 'Error';
        }
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            error,
        };
        this.logger.error(`Unhandled Exception: ${request.method} ${request.url}`, exception instanceof Error ? exception.stack : JSON.stringify(exception));
        if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
            errorResponse.stack = exception.stack;
        }
        response.status(status).json(errorResponse);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [logger_service_1.AppLoggerService])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map