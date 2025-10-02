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
let UsersController = class UsersController {
    createUserUseCase;
    authenticateUserUseCase;
    getUserProfileUseCase;
    validateUserForChatUseCase;
    getUsersByTypeUseCase;
    constructor(createUserUseCase, authenticateUserUseCase, getUserProfileUseCase, validateUserForChatUseCase, getUsersByTypeUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.authenticateUserUseCase = authenticateUserUseCase;
        this.getUserProfileUseCase = getUserProfileUseCase;
        this.validateUserForChatUseCase = validateUserForChatUseCase;
        this.getUsersByTypeUseCase = getUsersByTypeUseCase;
    }
    async register(createUserDto) {
        try {
            const user = await this.createUserUseCase.execute(createUserDto);
            return {
                status: 'success',
                message: 'Usuario registrado exitosamente',
                data: user
            };
        }
        catch (error) {
            if (error.message.includes('ya está registrado')) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: error.message,
                    errorCode: 'EMAIL_ALREADY_EXISTS'
                }, common_1.HttpStatus.CONFLICT);
            }
            throw new common_1.HttpException({
                status: 'error',
                message: error.message,
                errorCode: 'VALIDATION_ERROR'
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async login(loginDto) {
        try {
            const result = await this.authenticateUserUseCase.execute(loginDto);
            if (!result) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'Credenciales inválidas',
                    errorCode: 'INVALID_CREDENTIALS'
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            return {
                status: 'success',
                message: 'Usuario autenticado exitosamente',
                data: result
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Error interno del servidor',
                errorCode: 'INTERNAL_ERROR'
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProfile(userId) {
        try {
            const user = await this.getUserProfileUseCase.execute(userId);
            if (!user) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'Usuario no encontrado',
                    errorCode: 'USER_NOT_FOUND'
                }, common_1.HttpStatus.NOT_FOUND);
            }
            return {
                status: 'success',
                message: 'Perfil obtenido exitosamente',
                data: user
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Error interno del servidor',
                errorCode: 'INTERNAL_ERROR'
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateForChat(userId) {
        try {
            const canChat = await this.validateUserForChatUseCase.execute(userId);
            return {
                status: 'success',
                message: 'Validación completada',
                data: { canChat }
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Error interno del servidor',
                errorCode: 'INTERNAL_ERROR'
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUsersByType(userType) {
        try {
            const users = await this.getUsersByTypeUseCase.execute(userType);
            return {
                status: 'success',
                message: 'Usuarios obtenidos exitosamente',
                data: {
                    users,
                    count: users.length
                }
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: 'Error interno del servidor',
                errorCode: 'INTERNAL_ERROR'
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo usuario en el sistema UPT' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Usuario creado exitosamente',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Datos de entrada inválidos'
    }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'El email ya está registrado'
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Autenticar usuario en el sistema' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuario autenticado exitosamente'
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
    (0, swagger_1.ApiOperation)({ summary: 'Obtener perfil de usuario' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Perfil obtenido exitosamente',
        type: user_dto_1.UserResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Usuario no encontrado'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('validate-for-chat/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Validar si usuario puede usar el chat' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Validación completada'
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "validateForChat", null);
__decorate([
    (0, common_1.Get)('by-type/:type'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener usuarios por tipo' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Usuarios obtenidos exitosamente'
    }),
    __param(0, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersByType", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('api/v1/users'),
    __metadata("design:paramtypes", [user_use_cases_1.CreateUserUseCase,
        user_use_cases_1.AuthenticateUserUseCase,
        user_use_cases_1.GetUserProfileUseCase,
        user_use_cases_1.ValidateUserForChatUseCase,
        user_use_cases_1.GetUsersByTypeUseCase])
], UsersController);
//# sourceMappingURL=users.controller.js.map