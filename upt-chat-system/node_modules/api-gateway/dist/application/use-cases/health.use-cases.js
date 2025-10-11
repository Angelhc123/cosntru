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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckUseCase = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let HealthCheckUseCase = class HealthCheckUseCase {
    connection;
    constructor(connection) {
        this.connection = connection;
    }
    async execute() {
        const dbStatus = await this.checkDatabaseConnection();
        const memoryUsage = this.getMemoryUsage();
        const health = {
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
    async checkDatabaseConnection() {
        try {
            const startTime = Date.now();
            if (this.connection.db) {
                await this.connection.db.admin().ping();
            }
            const responseTime = Date.now() - startTime;
            return {
                status: this.connection.readyState === 1 ? 'connected' : 'disconnected',
                responseTime,
            };
        }
        catch (error) {
            return {
                status: 'disconnected',
            };
        }
    }
    getMemoryUsage() {
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
};
exports.HealthCheckUseCase = HealthCheckUseCase;
exports.HealthCheckUseCase = HealthCheckUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], HealthCheckUseCase);
//# sourceMappingURL=health.use-cases.js.map