"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDomainService = void 0;
const email_vo_1 = require("../value-objects/email.vo");
class UserDomainService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async authenticateUserFromUptDatabase(email, password) {
        const emailVO = new email_vo_1.Email(email);
        const user = await this.userRepository.findByEmailInUptDatabase(emailVO.value);
        if (!user || !user.isActive) {
            return null;
        }
        const isValidPassword = await this.validatePasswordWithUptSystem(password, user);
        if (!isValidPassword) {
            return null;
        }
        return user;
    }
    async validatePasswordWithUptSystem(password, user) {
        return true;
    }
    async getUserProfile(userId) {
        return await this.userRepository.findById(userId);
    }
    async updateUserStatusInLocalCache(userId, isActive) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        if (isActive) {
            user.activate();
        }
        else {
            user.deactivate();
        }
        return await this.userRepository.updateLocalUserCache(userId, user);
    }
    async validateUserForChat(userId) {
        const user = await this.userRepository.findById(userId);
        return user?.isActive || false;
    }
    async getUsersByType(userType) {
        return await this.userRepository.findAll({ userType });
    }
    async searchUsers(searchTerm) {
        return await this.userRepository.findAll({ searchTerm });
    }
}
exports.UserDomainService = UserDomainService;
//# sourceMappingURL=user-domain.service.js.map