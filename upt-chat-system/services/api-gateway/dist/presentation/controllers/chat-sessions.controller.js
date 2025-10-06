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
exports.ChatSessionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_session_use_cases_1 = require("../../application/use-cases/chat-session.use-cases");
const chat_session_dto_1 = require("../../application/dtos/chat-session.dto");
let ChatSessionsController = class ChatSessionsController {
    startChatSessionUseCase;
    getActiveChatSessionUseCase;
    endChatSessionUseCase;
    validateSessionTokenUseCase;
    recordUserMessageUseCase;
    setSessionSatisfactionUseCase;
    updateSessionMetadataUseCase;
    getSessionAnalyticsUseCase;
    cleanupExpiredSessionsUseCase;
    constructor(startChatSessionUseCase, getActiveChatSessionUseCase, endChatSessionUseCase, validateSessionTokenUseCase, recordUserMessageUseCase, setSessionSatisfactionUseCase, updateSessionMetadataUseCase, getSessionAnalyticsUseCase, cleanupExpiredSessionsUseCase) {
        this.startChatSessionUseCase = startChatSessionUseCase;
        this.getActiveChatSessionUseCase = getActiveChatSessionUseCase;
        this.endChatSessionUseCase = endChatSessionUseCase;
        this.validateSessionTokenUseCase = validateSessionTokenUseCase;
        this.recordUserMessageUseCase = recordUserMessageUseCase;
        this.setSessionSatisfactionUseCase = setSessionSatisfactionUseCase;
        this.updateSessionMetadataUseCase = updateSessionMetadataUseCase;
        this.getSessionAnalyticsUseCase = getSessionAnalyticsUseCase;
        this.cleanupExpiredSessionsUseCase = cleanupExpiredSessionsUseCase;
    }
    async startSession(userId, startSessionDto) {
        try {
            const session = await this.startChatSessionUseCase.execute(userId, startSessionDto);
            return {
                status: 'success',
                message: 'Sesión de chat iniciada exitosamente',
                data: session
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: error.message,
                errorCode: 'SESSION_START_ERROR'
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getActiveSession(userId) {
        try {
            const session = await this.getActiveChatSessionUseCase.execute(userId);
            if (!session) {
                return {
                    status: 'success',
                    message: 'No hay sesión activa para el usuario',
                    data: undefined
                };
            }
            return {
                status: 'success',
                message: 'Sesión activa obtenida exitosamente',
                data: session
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
    async endSession(sessionId) {
        try {
            const ended = await this.endChatSessionUseCase.execute(sessionId);
            return {
                status: 'success',
                message: 'Sesión finalizada exitosamente',
                data: { ended }
            };
        }
        catch (error) {
            if (error.message.includes('no encontrada')) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: error.message,
                    errorCode: 'SESSION_NOT_FOUND'
                }, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException({
                status: 'error',
                message: 'Error interno del servidor',
                errorCode: 'INTERNAL_ERROR'
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async validateToken(token) {
        try {
            const session = await this.validateSessionTokenUseCase.execute(token);
            if (!session) {
                throw new common_1.HttpException({
                    status: 'error',
                    message: 'Token inválido o expirado',
                    errorCode: 'INVALID_TOKEN'
                }, common_1.HttpStatus.UNAUTHORIZED);
            }
            return {
                status: 'success',
                message: 'Token validado exitosamente',
                data: {
                    session,
                    valid: true
                }
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
    async recordMessage(sessionId, messageData) {
        try {
            await this.recordUserMessageUseCase.execute(sessionId, messageData.responseTime);
            return {
                status: 'success',
                message: 'Mensaje registrado exitosamente'
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: error.message,
                errorCode: 'MESSAGE_RECORD_ERROR'
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async setSatisfaction(sessionId, satisfactionDto) {
        try {
            await this.setSessionSatisfactionUseCase.execute(sessionId, satisfactionDto);
            return {
                status: 'success',
                message: 'Puntuación de satisfacción establecida exitosamente'
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: error.message,
                errorCode: 'SATISFACTION_ERROR'
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateMetadata(sessionId, updateDto) {
        try {
            const session = await this.updateSessionMetadataUseCase.execute(sessionId, updateDto);
            return {
                status: 'success',
                message: 'Metadatos actualizados exitosamente',
                data: session
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: 'error',
                message: error.message,
                errorCode: 'METADATA_UPDATE_ERROR'
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getAnalytics(userId) {
        try {
            const analytics = await this.getSessionAnalyticsUseCase.execute(userId);
            return {
                status: 'success',
                message: 'Analíticas obtenidas exitosamente',
                data: analytics
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
    async cleanupSessions() {
        try {
            const result = await this.cleanupExpiredSessionsUseCase.execute();
            return {
                status: 'success',
                message: 'Sesiones expiradas limpiadas exitosamente',
                data: result
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
exports.ChatSessionsController = ChatSessionsController;
__decorate([
    (0, common_1.Post)('start/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar nueva sesión de chat para usuario UPT' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Sesión de chat iniciada exitosamente',
        type: chat_session_dto_1.ChatSessionResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Datos de entrada inválidos'
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_session_dto_1.StartChatSessionDto]),
    __metadata("design:returntype", Promise)
], ChatSessionsController.prototype, "startSession", null);
__decorate([
    (0, common_1.Get)('active/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener sesión activa del usuario' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sesión activa obtenida exitosamente',
        type: chat_session_dto_1.ChatSessionResponseDto
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'No hay sesión activa para el usuario'
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatSessionsController.prototype, "getActiveSession", null);
__decorate([
    (0, common_1.Put)('end/:sessionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Finalizar sesión de chat' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sesión finalizada exitosamente'
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Sesión no encontrada'
    }),
    __param(0, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatSessionsController.prototype, "endSession", null);
__decorate([
    (0, common_1.Get)('validate'),
    (0, swagger_1.ApiOperation)({ summary: 'Validar token de sesión' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Token validado exitosamente'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Token inválido o expirado'
    }),
    __param(0, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatSessionsController.prototype, "validateToken", null);
__decorate([
    (0, common_1.Post)(':sessionId/message'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar mensaje del usuario en la sesión' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Mensaje registrado exitosamente'
    }),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChatSessionsController.prototype, "recordMessage", null);
__decorate([
    (0, common_1.Put)(':sessionId/satisfaction'),
    (0, swagger_1.ApiOperation)({ summary: 'Establecer puntuación de satisfacción' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Puntuación establecida exitosamente'
    }),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_session_dto_1.SessionSatisfactionDto]),
    __metadata("design:returntype", Promise)
], ChatSessionsController.prototype, "setSatisfaction", null);
__decorate([
    (0, common_1.Put)(':sessionId/metadata'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar metadatos de la sesión' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Metadatos actualizados exitosamente'
    }),
    __param(0, (0, common_1.Param)('sessionId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, chat_session_dto_1.UpdateSessionMetadataDto]),
    __metadata("design:returntype", Promise)
], ChatSessionsController.prototype, "updateMetadata", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener analíticas de sesiones' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Analíticas obtenidas exitosamente'
    }),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChatSessionsController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Post)('cleanup'),
    (0, swagger_1.ApiOperation)({ summary: 'Limpiar sesiones expiradas' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Sesiones expiradas limpiadas exitosamente'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChatSessionsController.prototype, "cleanupSessions", null);
exports.ChatSessionsController = ChatSessionsController = __decorate([
    (0, swagger_1.ApiTags)('Chat Sessions'),
    (0, common_1.Controller)('chat-sessions'),
    __metadata("design:paramtypes", [chat_session_use_cases_1.StartChatSessionUseCase,
        chat_session_use_cases_1.GetActiveChatSessionUseCase,
        chat_session_use_cases_1.EndChatSessionUseCase,
        chat_session_use_cases_1.ValidateSessionTokenUseCase,
        chat_session_use_cases_1.RecordUserMessageUseCase,
        chat_session_use_cases_1.SetSessionSatisfactionUseCase,
        chat_session_use_cases_1.UpdateSessionMetadataUseCase,
        chat_session_use_cases_1.GetSessionAnalyticsUseCase,
        chat_session_use_cases_1.CleanupExpiredSessionsUseCase])
], ChatSessionsController);
//# sourceMappingURL=chat-sessions.controller.js.map