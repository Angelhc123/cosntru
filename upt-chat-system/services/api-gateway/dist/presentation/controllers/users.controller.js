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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_use_cases_1 = require("../../application/use-cases/user.use-cases");
const user_dto_1 = require("../../application/dtos/user.dto");
const jwt_auth_guard_1 = require("../../infrastructure/auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../infrastructure/auth/decorators/current-user.decorator");
const logger_service_1 = require("../../infrastructure/logging/logger.service");
const mysql_connection_service_1 = require("../../infrastructure/services/mysql-connection.service");
let UsersController = class UsersController {
    getUserProfileUseCase;
    validateUserForChatUseCase;
    logger;
    mysqlService;
    constructor(getUserProfileUseCase, validateUserForChatUseCase, logger, mysqlService) {
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.validateUserForChatUseCase = validateUserForChatUseCase;
        this.logger = logger;
        this.mysqlService = mysqlService;
        this.logger.setContext('UsersController');
    }
    async getProfile(userId, currentUser) {
        this.logger.debug(`Consultando perfil de usuario: ${userId}`);
        const user = await this.getUserProfileUseCase.execute(userId);
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado en la base de datos UPT', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async validateForChat(userId, currentUser) {
        this.logger.debug(`Validando permisos de chat para usuario: ${userId}`);
        const canChat = await this.validateUserForChatUseCase.execute(userId);
        return {
            canChat,
            reason: canChat ? 'Usuario activo en sistema UPT' : 'Usuario inactivo o sin permisos'
        };
    }
    async verifyEmail(body) {
        this.logger.debug(`Verificando email: ${body.email}`);
        try {
            const verification = await this.mysqlService.verifyEmail(body.email);
            if (verification.exists) {
                return {
                    exists: true,
                    user_id: verification.user.username,
                    name: verification.user.name,
                };
            }
            return { exists: false };
        }
        catch (error) {
            this.logger.error(`Error verificando email: ${error.message}`);
            throw new common_1.HttpException('Error al verificar email', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Consultar perfil de usuario',
        description: 'Obtiene información de usuario desde BD UPT (solo lectura). Requiere JWT válido del sistema UPT.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil consultado exitosamente',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - JWT inválido o expirado'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Usuario no encontrado en BD UPT'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('validate-for-chat/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Validar permisos de chat',
        description: 'Verifica si un usuario UPT puede usar el chatbot (consulta estado en BD UPT)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Validación completada',
        schema: {
            example: {
                canChat: true,
                reason: 'Usuario activo en sistema UPT',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - JWT inválido'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "validateForChat", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verificar correo electrónico',
        description: 'Verifica si un email existe en la BD UPT (para recuperación de contraseña)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Verificación completada',
        schema: {
            example: {
                exists: true,
                user_id: '2018001234',
                name: 'Juan Pérez García',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyEmail", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_use_cases_1.GetUserProfileUseCase,
        user_use_cases_1.ValidateUserForChatUseCase,
        logger_service_1.AppLoggerService,
        mysql_connection_service_1.MySQLConnectionService])
], UsersController);
//# sourceMappingURL=users.controller.js.map