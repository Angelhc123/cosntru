"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionDomainService = void 0;
const chat_session_entity_1 = require("../entities/chat-session.entity");
class ChatSessionDomainService {
    sessionRepository;
    MAX_SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
    MAX_CONCURRENT_SESSIONS = 1;
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    async startNewSession(userId, metadata) {
        const activeSession = await this.sessionRepository.findActiveByUserId(userId);
        if (activeSession) {
            await this.endSession(activeSession.id);
        }
        const sessionToken = chat_session_entity_1.ChatSession.generateSessionToken();
        const session = chat_session_entity_1.ChatSession.create({
            id: this.generateSessionId(),
            userId,
            sessionToken,
            metadata
        });
        return await this.sessionRepository.create(session);
    }
    async getActiveSession(userId) {
        const session = await this.sessionRepository.findActiveByUserId(userId);
        if (session && session.isExpired(this.MAX_SESSION_DURATION_MS)) {
            await this.endSession(session.id);
            return null;
        }
        return session;
    }
    async endSession(sessionId) {
        const session = await this.sessionRepository.findById(sessionId);
        if (!session) {
            throw new Error('Sesión no encontrada');
        }
        session.endSession();
        await this.sessionRepository.update(sessionId, session);
        return true;
    }
    async updateSessionMetadata(sessionId, metadata) {
        const session = await this.sessionRepository.findById(sessionId);
        if (!session) {
            throw new Error('Sesión no encontrada');
        }
        session.updateMetadata(metadata);
        return await this.sessionRepository.update(sessionId, session);
    }
    async recordUserMessage(sessionId, responseTime) {
        const session = await this.sessionRepository.findById(sessionId);
        if (!session) {
            throw new Error('Sesión no encontrada');
        }
        session.incrementMessageCount();
        session.updateAverageResponseTime(responseTime);
        await this.sessionRepository.update(sessionId, session);
    }
    async setSessionSatisfaction(sessionId, score) {
        const session = await this.sessionRepository.findById(sessionId);
        if (!session) {
            throw new Error('Sesión no encontrada');
        }
        session.setSatisfactionScore(score);
        await this.sessionRepository.update(sessionId, session);
    }
    async validateSessionToken(token) {
        const session = await this.sessionRepository.findBySessionToken(token);
        if (!session || !session.isActive) {
            return null;
        }
        if (session.isExpired(this.MAX_SESSION_DURATION_MS)) {
            await this.endSession(session.id);
            return null;
        }
        return session;
    }
    async cleanupExpiredSessions() {
        const expiredSessions = await this.sessionRepository
            .findExpiredSessions(this.MAX_SESSION_DURATION_MS);
        let cleanedCount = 0;
        for (const session of expiredSessions) {
            await this.endSession(session.id);
            cleanedCount++;
        }
        return cleanedCount;
    }
    async getSessionAnalytics(userId) {
        const sessions = userId
            ? await this.sessionRepository.findByUserId(userId)
            : await this.sessionRepository.findActiveSessions();
        return this.calculateSessionAnalytics(sessions);
    }
    calculateSessionAnalytics(sessions) {
        if (sessions.length === 0) {
            return {
                totalSessions: 0,
                averageDuration: 0,
                averageMessages: 0,
                averageSatisfaction: 0
            };
        }
        const completedSessions = sessions.filter(s => !s.isActive);
        const durations = completedSessions
            .map(s => s.duration)
            .filter(d => d !== null);
        const messagesCounts = sessions
            .map(s => s.metadata.totalMessages || 0);
        const satisfactionScores = sessions
            .map(s => s.metadata.satisfactionScore)
            .filter(s => s !== undefined);
        return {
            totalSessions: sessions.length,
            averageDuration: durations.length > 0
                ? durations.reduce((a, b) => a + b, 0) / durations.length
                : 0,
            averageMessages: messagesCounts.reduce((a, b) => a + b, 0) / sessions.length,
            averageSatisfaction: satisfactionScores.length > 0
                ? satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length
                : 0
        };
    }
    generateSessionId() {
        return `chat_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    }
}
exports.ChatSessionDomainService = ChatSessionDomainService;
//# sourceMappingURL=chat-session-domain.service.js.map