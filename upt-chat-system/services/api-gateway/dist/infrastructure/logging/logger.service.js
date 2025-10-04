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
exports.AppLoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
let AppLoggerService = class AppLoggerService {
    logger;
    context;
    constructor(logger) {
        this.logger = logger;
    }
    setContext(context) {
        this.context = context;
    }
    log(message, context) {
        const logContext = context || this.context;
        this.logger.info(message, { context: logContext });
    }
    error(message, trace, context) {
        const logContext = context || this.context;
        this.logger.error(message, {
            context: logContext,
            trace,
        });
    }
    warn(message, context) {
        const logContext = context || this.context;
        this.logger.warn(message, { context: logContext });
    }
    debug(message, context) {
        const logContext = context || this.context;
        this.logger.debug(message, { context: logContext });
    }
    verbose(message, context) {
        const logContext = context || this.context;
        this.logger.verbose(message, { context: logContext });
    }
    logWithMetadata(message, metadata, context) {
        const logContext = context || this.context;
        this.logger.info(message, {
            context: logContext,
            ...metadata,
        });
    }
    logAuth(action, email, success, reason) {
        this.logger.info('Authentication attempt', {
            context: 'Auth',
            action,
            email,
            success,
            reason,
            timestamp: new Date().toISOString(),
        });
    }
    logPerformance(operation, duration, context) {
        const logContext = context || this.context;
        this.logger.info('Performance metric', {
            context: logContext,
            operation,
            duration: `${duration}ms`,
            timestamp: new Date().toISOString(),
        });
    }
};
exports.AppLoggerService = AppLoggerService;
exports.AppLoggerService = AppLoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [winston_1.Logger])
], AppLoggerService);
//# sourceMappingURL=logger.service.js.map