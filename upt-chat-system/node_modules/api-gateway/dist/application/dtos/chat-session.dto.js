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
exports.ChatSessionResponseDto = exports.SessionSatisfactionDto = exports.UpdateSessionMetadataDto = exports.StartChatSessionDto = void 0;
const class_validator_1 = require("class-validator");
class StartChatSessionDto {
    userAgent;
    ipAddress;
    platform;
    initialQuery;
}
exports.StartChatSessionDto = StartChatSessionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartChatSessionDto.prototype, "userAgent", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartChatSessionDto.prototype, "ipAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartChatSessionDto.prototype, "platform", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StartChatSessionDto.prototype, "initialQuery", void 0);
class UpdateSessionMetadataDto {
    metadata;
}
exports.UpdateSessionMetadataDto = UpdateSessionMetadataDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateSessionMetadataDto.prototype, "metadata", void 0);
class SessionSatisfactionDto {
    score;
}
exports.SessionSatisfactionDto = SessionSatisfactionDto;
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'La puntuación debe ser un número' }),
    (0, class_validator_1.Min)(1, { message: 'La puntuación mínima es 1' }),
    (0, class_validator_1.Max)(5, { message: 'La puntuación máxima es 5' }),
    __metadata("design:type", Number)
], SessionSatisfactionDto.prototype, "score", void 0);
class ChatSessionResponseDto {
    id;
    userId;
    sessionToken;
    isActive;
    startedAt;
    endedAt;
    duration;
    metadata;
    status;
    static fromDomain(session) {
        return {
            id: session.id,
            userId: session.userId,
            sessionToken: session.sessionToken,
            isActive: session.isActive,
            startedAt: session.startedAt,
            endedAt: session.endedAt,
            duration: session.duration,
            metadata: session.metadata,
            status: session.status
        };
    }
}
exports.ChatSessionResponseDto = ChatSessionResponseDto;
//# sourceMappingURL=chat-session.dto.js.map