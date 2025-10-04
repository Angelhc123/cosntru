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
const user_entity_1 = require("../../domain/entities/user.entity");
const jwt_auth_guard_1 = require("../../infrastructure/auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../infrastructure/auth/decorators/current-user.decorator");
const logger_service_1 = require("../../infrastructure/logging/logger.service");
let UsersController = class UsersController {
    authenticateUserUseCase;
    getUserProfileUseCase;
    validateUserForChatUseCase;
    getUsersByTypeUseCase;
    logger;
    constructor(authenticateUserUseCase, getUserProfileUseCase, validateUserForChatUseCase, getUsersByTypeUseCase, logger) {
        this.authenticateUserUseCase = authenticateUserUseCase;
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.validateUserForChatUseCase = validateUserForChatUseCase;
        this.getUsersByTypeUseCase = getUsersByTypeUseCase;
        this.logger = logger;
        this.logger.setContext('UsersController');
    }
    async login(loginDto) {
        this.logger.debug(`Intento de login para: ${loginDto.email}`);
        const result = await this.authenticateUserUseCase.execute(loginDto);
        if (!result) {
            this.logger.warn(`Login fallido para: ${loginDto.email}`);
            throw new common_1.HttpException('Credenciales inválidas. Verifica tu email y contraseña.', common_1.HttpStatus.UNAUTHORIZED);
        }
        this.logger.log(`Login exitoso para: ${loginDto.email}`);
        return result;
    }
    async getProfile(userId, currentUser) {
        this.logger.debug(`Usuario ${currentUser.email} solicitando perfil de: ${userId}`);
        const user = await this.getUserProfileUseCase.execute(userId);
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async validateForChat(userId, currentUser) {
        this.logger.debug(`Validando permisos de chat para usuario: ${userId}`);
        const canChat = await this.validateUserForChatUseCase.execute(userId);
        return { canChat };
    }
    async getUsersByType(userType, currentUser) {
        this.logger.debug(`Usuario ${currentUser.email} solicitando usuarios tipo: ${userType}`);
        const users = await this.getUsersByTypeUseCase.execute(userType);
        return {
            users,
            count: users.length,
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Autenticar usuario UPT',
        description: 'Valida credenciales contra sistema UPT y genera JWT token válido por 7 días',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuario autenticado exitosamente',
        schema: {
            example: {
                user: {
                    id: '507f1f77bcf86cd799439011',
                    email: 'estudiante@upt.edu.pe',
                    firstName: 'Juan',
                    lastName: 'Pérez',
                    userType: 'student',
                    isActive: true,
                },
                access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                token_type: 'Bearer',
                expires_in: '7d',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Credenciales inválidas'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('profile/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener perfil de usuario',
        description: 'Obtiene información detallada del perfil de un usuario. Requiere autenticación.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil obtenido exitosamente',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado - Token inválido o expirado'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Usuario no encontrado'
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
        description: 'Verifica si un usuario puede iniciar sesiones de chat',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Validación completada',
        schema: {
            example: {
                canChat: true,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado'
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "validateForChat", null);
__decorate([
    (0, common_1.Get)('by-type/:type'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtener usuarios por tipo',
        description: 'Lista usuarios filtrados por tipo: student, teacher, admin, staff',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuarios obtenidos exitosamente',
        schema: {
            example: {
                users: [
                    {
                        id: '507f1f77bcf86cd799439011',
                        email: 'estudiante@upt.edu.pe',
                        firstName: 'Juan',
                        lastName: 'Pérez',
                        userType: 'student',
                        isActive: true,
                    },
                ],
                count: 1,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'No autorizado'
    }),
    __param(0, (0, common_1.Param)('type')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersByType", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_use_cases_1.AuthenticateUserUseCase,
        user_use_cases_1.GetUserProfileUseCase,
        user_use_cases_1.ValidateUserForChatUseCase,
        user_use_cases_1.GetUsersByTypeUseCase,
        logger_service_1.AppLoggerService])
], UsersController);
//# sourceMappingURL=users.controller.js.map