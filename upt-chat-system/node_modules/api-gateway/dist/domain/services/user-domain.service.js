"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDomainService = void 0;
const user_entity_1 = require("../entities/user.entity");
const email_vo_1 = require("../value-objects/email.vo");
class UserDomainService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async authenticateUser(email, password) {
        const emailVO = new email_vo_1.Email(email);
        const user = await this.userRepository.findByEmail(emailVO.value);
        if (!user || !user.isActive) {
            return null;
        }
        return user;
    }
    async createNewUser(userData) {
        const emailExists = await this.userRepository.existsByEmail(userData.email);
        if (emailExists) {
            throw new Error('El email ya está registrado en el sistema');
        }
        const emailVO = new email_vo_1.Email(userData.email);
        if ((userData.userType === user_entity_1.UserType.STUDENT || userData.userType === user_entity_1.UserType.TEACHER)
            && !emailVO.isUptEmail()) {
            throw new Error('Los estudiantes y docentes deben usar email institucional');
        }
        const user = user_entity_1.User.create(userData);
        return await this.userRepository.create(user);
    }
    async getUserProfile(userId) {
        return await this.userRepository.findById(userId);
    }
    async updateUserStatus(userId, isActive) {
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
        return await this.userRepository.update(userId, user);
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