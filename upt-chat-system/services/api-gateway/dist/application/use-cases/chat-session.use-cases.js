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
exports.CleanupExpiredSessionsUseCase = exports.GetSessionAnalyticsUseCase = exports.UpdateSessionMetadataUseCase = exports.SetSessionSatisfactionUseCase = exports.RecordUserMessageUseCase = exports.ValidateSessionTokenUseCase = exports.EndChatSessionUseCase = exports.GetActiveChatSessionUseCase = exports.StartChatSessionUseCase = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_session_domain_service_1 = require("../../domain/services/chat-session-domain.service");
const chat_session_dto_1 = require("../dtos/chat-session.dto");
let StartChatSessionUseCase = class StartChatSessionUseCase {
    sessionDomainService;
    constructor(sessionDomainService) {
        this.sessionDomainService = sessionDomainService;
    }
    async execute(userId, startSessionDto) {
        const metadata = {
            userAgent: startSessionDto.userAgent,
            ipAddress: startSessionDto.ipAddress,
            platform: startSessionDto.platform,
            initialQuery: startSessionDto.initialQuery,
            totalMessages: 0,
            avgResponseTime: 0
        };
        const session = await this.sessionDomainService.startNewSession(userId, metadata);
        return chat_session_dto_1.ChatSessionResponseDto.fromDomain(session);
    }
};
exports.StartChatSessionUseCase = StartChatSessionUseCase;
exports.StartChatSessionUseCase = StartChatSessionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_session_domain_service_1.ChatSessionDomainService])
], StartChatSessionUseCase);
let GetActiveChatSessionUseCase = class GetActiveChatSessionUseCase {
    sessionDomainService;
    constructor(sessionDomainService) {
        this.sessionDomainService = sessionDomainService;
    }
    async execute(userId) {
        const session = await this.sessionDomainService.getActiveSession(userId);
        if (!session) {
            return null;
        }
        return chat_session_dto_1.ChatSessionResponseDto.fromDomain(session);
    }
};
exports.GetActiveChatSessionUseCase = GetActiveChatSessionUseCase;
exports.GetActiveChatSessionUseCase = GetActiveChatSessionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_session_domain_service_1.ChatSessionDomainService])
], GetActiveChatSessionUseCase);
let EndChatSessionUseCase = class EndChatSessionUseCase {
    sessionDomainService;
    constructor(sessionDomainService) {
        this.sessionDomainService = sessionDomainService;
    }
    async execute(sessionId) {
        return await this.sessionDomainService.endSession(sessionId);
    }
};
exports.EndChatSessionUseCase = EndChatSessionUseCase;
exports.EndChatSessionUseCase = EndChatSessionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_session_domain_service_1.ChatSessionDomainService])
], EndChatSessionUseCase);
let ValidateSessionTokenUseCase = class ValidateSessionTokenUseCase {
    sessionDomainService;
    constructor(sessionDomainService) {
        this.sessionDomainService = sessionDomainService;
    }
    async execute(token) {
        const session = await this.sessionDomainService.validateSessionToken(token);
        if (!session) {
            return null;
        }
        return chat_session_dto_1.ChatSessionResponseDto.fromDomain(session);
    }
};
exports.ValidateSessionTokenUseCase = ValidateSessionTokenUseCase;
exports.ValidateSessionTokenUseCase = ValidateSessionTokenUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_session_domain_service_1.ChatSessionDomainService])
], ValidateSessionTokenUseCase);
let RecordUserMessageUseCase = class RecordUserMessageUseCase {
    sessionDomainService;
    messageModel;
    constructor(sessionDomainService, messageModel) {
        this.sessionDomainService = sessionDomainService;
        this.messageModel = messageModel;
    }
    async execute(sessionId, text, sender = 'user', responseTime) {
        const message = new this.messageModel({
            sessionId,
            sender,
            text,
            timestamp: new Date(),
            metadata: responseTime ? { responseTime } : {}
        });
        const savedMessage = await message.save();
        if (responseTime) {
            await this.sessionDomainService.recordUserMessage(sessionId, responseTime);
        }
        return {
            id: savedMessage._id,
            sessionId: savedMessage.sessionId,
            sender: savedMessage.sender,
            text: savedMessage.text,
            timestamp: savedMessage.timestamp
        };
    }
};
exports.RecordUserMessageUseCase = RecordUserMessageUseCase;
exports.RecordUserMessageUseCase = RecordUserMessageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)('Message')),
    __metadata("design:paramtypes", [chat_session_domain_service_1.ChatSessionDomainService,
        mongoose_2.Model])
], RecordUserMessageUseCase);
let SetSessionSatisfactionUseCase = class SetSessionSatisfactionUseCase {
    sessionDomainService;
    constructor(sessionDomainService) {
        this.sessionDomainService = sessionDomainService;
    }
    async execute(sessionId, satisfactionDto) {
        await this.sessionDomainService.setSessionSatisfaction(sessionId, satisfactionDto.score);
    }
};
exports.SetSessionSatisfactionUseCase = SetSessionSatisfactionUseCase;
exports.SetSessionSatisfactionUseCase = SetSessionSatisfactionUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_session_domain_service_1.ChatSessionDomainService])
], SetSessionSatisfactionUseCase);
let UpdateSessionMetadataUseCase = class UpdateSessionMetadataUseCase {
    sessionDomainService;
    constructor(sessionDomainService) {
        this.sessionDomainService = sessionDomainService;
    }
    async execute(sessionId, updateDto) {
        const session = await this.sessionDomainService.updateSessionMetadata(sessionId, updateDto.metadata || {});
        return chat_session_dto_1.ChatSessionResponseDto.fromDomain(session);
    }
};
exports.UpdateSessionMetadataUseCase = UpdateSessionMetadataUseCase;
exports.UpdateSessionMetadataUseCase = UpdateSessionMetadataUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_session_domain_service_1.ChatSessionDomainService])
], UpdateSessionMetadataUseCase);
let GetSessionAnalyticsUseCase = class GetSessionAnalyticsUseCase {
    sessionDomainService;
    constructor(sessionDomainService) {
        this.sessionDomainService = sessionDomainService;
    }
    async execute(userId) {
        return await this.sessionDomainService.getSessionAnalytics(userId);
    }
};
exports.GetSessionAnalyticsUseCase = GetSessionAnalyticsUseCase;
exports.GetSessionAnalyticsUseCase = GetSessionAnalyticsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_session_domain_service_1.ChatSessionDomainService])
], GetSessionAnalyticsUseCase);
let CleanupExpiredSessionsUseCase = class CleanupExpiredSessionsUseCase {
    sessionDomainService;
    constructor(sessionDomainService) {
        this.sessionDomainService = sessionDomainService;
    }
    async execute() {
        const cleanedCount = await this.sessionDomainService.cleanupExpiredSessions();
        return { cleanedSessions: cleanedCount };
    }
};
exports.CleanupExpiredSessionsUseCase = CleanupExpiredSessionsUseCase;
exports.CleanupExpiredSessionsUseCase = CleanupExpiredSessionsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chat_session_domain_service_1.ChatSessionDomainService])
], CleanupExpiredSessionsUseCase);
//# sourceMappingURL=chat-session.use-cases.js.map