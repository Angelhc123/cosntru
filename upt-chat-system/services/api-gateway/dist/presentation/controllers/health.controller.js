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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_use_cases_1 = require("../../application/use-cases/health.use-cases");
let HealthController = class HealthController {
    healthCheckUseCase;
    constructor(healthCheckUseCase) {
        this.healthCheckUseCase = healthCheckUseCase;
    }
    async healthCheck() {
        return this.healthCheckUseCase.execute();
    }
    ping() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
        };
    }
    async databaseCheck() {
        return this.healthCheckUseCase.checkDatabaseConnection();
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check completo',
        description: 'Verifica el estado de salud del sistema incluyendo base de datos, memoria y tiempo de actividad',
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'Sistema degradado o sin conexión a base de datos',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)('/ping'),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check rápido',
        description: 'Verifica solo que el servidor responda (sin verificar dependencias)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Servidor activo',
        schema: {
            example: {
                status: 'ok',
                timestamp: '2025-10-04T10:30:00.000Z',
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "ping", null);
__decorate([
    (0, common_1.Get)('/database'),
    (0, swagger_1.ApiOperation)({
        summary: 'Health check de base de datos',
        description: 'Verifica solo la conexión a MongoDB',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Base de datos conectada',
        schema: {
            example: {
                status: 'connected',
                type: 'MongoDB',
                responseTime: 12,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'Base de datos desconectada',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "databaseCheck", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [health_use_cases_1.HealthCheckUseCase])
], HealthController);
//# sourceMappingURL=health.controller.js.map