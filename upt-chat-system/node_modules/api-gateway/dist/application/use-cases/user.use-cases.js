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
exports.GetUsersByTypeUseCase = exports.ValidateUserForChatUseCase = exports.GetUserProfileUseCase = exports.AuthenticateUserUseCase = exports.CreateUserUseCase = void 0;
const common_1 = require("@nestjs/common");
const user_domain_service_1 = require("../../domain/services/user-domain.service");
const user_dto_1 = require("../dtos/user.dto");
let CreateUserUseCase = class CreateUserUseCase {
    userDomainService;
    constructor(userDomainService) {
        this.userDomainService = userDomainService;
    }
    async execute(createUserDto) {
        const userId = this.generateUserId();
        const user = await this.userDomainService.createNewUser({
            id: userId,
            email: createUserDto.email,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            userType: createUserDto.userType
        });
        return user_dto_1.UserResponseDto.fromDomain(user);
    }
    generateUserId() {
        return `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    }
};
exports.CreateUserUseCase = CreateUserUseCase;
exports.CreateUserUseCase = CreateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_domain_service_1.UserDomainService])
], CreateUserUseCase);
let AuthenticateUserUseCase = class AuthenticateUserUseCase {
    userDomainService;
    constructor(userDomainService) {
        this.userDomainService = userDomainService;
    }
    async execute(loginDto) {
        const user = await this.userDomainService.authenticateUser(loginDto.email, loginDto.password);
        if (!user) {
            return null;
        }
        const token = this.generateJwtToken(user);
        return {
            user: user_dto_1.UserResponseDto.fromDomain(user),
            token
        };
    }
    generateJwtToken(user) {
        return `jwt_${user.id}_${Date.now()}`;
    }
};
exports.AuthenticateUserUseCase = AuthenticateUserUseCase;
exports.AuthenticateUserUseCase = AuthenticateUserUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_domain_service_1.UserDomainService])
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