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
exports.GetUsersByTypeUseCase = exports.ValidateUserForChatUseCase = exports.GetUserProfileUseCase = exports.AuthenticateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_domain_service_1 = require("../../domain/services/user-domain.service");
const user_dto_1 = require("../dtos/user.dto");
const logger_service_1 = require("../../infrastructure/logging/logger.service");
let AuthenticateUserUseCase = class AuthenticateUserUseCase {
    userDomainService;
    jwtService;
    logger;
    constructor(userDomainService, jwtService, logger) {
        this.userDomainService = userDomainService;
        this.jwtService = jwtService;
        this.logger = logger;
        this.logger.setContext('AuthenticateUserUseCase');
    }
    async execute(loginDto) {
        this.logger.debug(`Intento de autenticación para: ${loginDto.email}`);
        const user = await this.userDomainService.authenticateUserFromUptDatabase(loginDto.email, loginDto.password);
        if (!user) {
            this.logger.warn(`Autenticación fallida para: ${loginDto.email}`);
            return null;
        }
        const token = this.generateJwtToken(user);
        this.logger.logAuth('login', loginDto.email, true);
        this.logger.log(`Usuario autenticado exitosamente: ${user.email} (${user.userType})`);
        return {
            user: user_dto_1.UserResponseDto.fromDomain(user),
            access_token: token,
            token_type: 'Bearer',
            expires_in: process.env.JWT_EXPIRES_IN || '7d',
        };
    }
    generateJwtToken(user) {
        const payload = {
            userId: user.id,
            email: user.email,
            userType: user.userType,
        };
        return this.jwtService.sign(payload);
    }
};
exports.AuthenticateUserUseCase = AuthenticateUserUseCase;
exports.AuthenticateUserUseCase = AuthenticateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_domain_service_1.UserDomainService,
        jwt_1.JwtService,
        logger_service_1.AppLoggerService])
], AuthenticateUserUseCase);
let GetUserProfileUseCase = class GetUserProfileUseCase {
    userDomainService;
    constructor(userDomainService) {
        this.userDomainService = userDomainService;
    }
    async execute(userId) {
        const user = await this.userDomainService.getUserProfile(userId);
        if (!user) {
            return null;
        }
        return user_dto_1.UserResponseDto.fromDomain(user);
    }
};
exports.GetUserProfileUseCase = GetUserProfileUseCase;
exports.GetUserProfileUseCase = GetUserProfileUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_domain_service_1.UserDomainService])
], GetUserProfileUseCase);
let ValidateUserForChatUseCase = class ValidateUserForChatUseCase {
    userDomainService;
    constructor(userDomainService) {
        this.userDomainService = userDomainService;
    }
    async execute(userId) {
        return await this.userDomainService.validateUserForChat(userId);
    }
};
exports.ValidateUserForChatUseCase = ValidateUserForChatUseCase;
exports.ValidateUserForChatUseCase = ValidateUserForChatUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_domain_service_1.UserDomainService])
], ValidateUserForChatUseCase);
let GetUsersByTypeUseCase = class GetUsersByTypeUseCase {
    userDomainService;
    constructor(userDomainService) {
        this.userDomainService = userDomainService;
    }
    async execute(userType) {
        const users = await this.userDomainService.getUsersByType(userType);
        return users.map(user => user_dto_1.UserResponseDto.fromDomain(user));
    }
};
exports.GetUsersByTypeUseCase = GetUsersByTypeUseCase;
exports.GetUsersByTypeUseCase = GetUsersByTypeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_domain_service_1.UserDomainService])
], GetUsersByTypeUseCase);
//# sourceMappingURL=user.use-cases.js.map