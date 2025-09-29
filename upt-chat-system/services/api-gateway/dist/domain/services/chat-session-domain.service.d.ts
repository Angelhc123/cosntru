import { ChatSession, SessionMetadata } from '../entities/chat-session.entity';
import { IChatSessionRepository } from '../repositories/chat-session.repository.interface';
export declare class ChatSessionDomainService {
    private readonly sessionRepository;
    private readonly MAX_SESSION_DURATION_MS;
    private readonly MAX_CONCURRENT_SESSIONS;
    constructor(sessionRepository: IChatSessionRepository);
    startNewSession(userId: string, metadata?: SessionMetadata): Promise<ChatSession>;
    getActiveSession(userId: string): Promise<ChatSession | null>;
    endSession(sessionId: string): Promise<boolean>;
    updateSessionMetadata(sessionId: string, metadata: Partial<SessionMetadata>): Promise<ChatSession>;
    recordUserMessage(sessionId: string, responseTime: number): Promise<void>;
    setSessionSatisfaction(sessionId: string, score: number): Promise<void>;
    validateSessionToken(token: string): Promise<ChatSession | null>;
    cleanupExpiredSessions(): Promise<number>;
    getSessionAnalytics(userId?: string): Promise<SessionAnalytics>;
    private calculateSessionAnalytics;
    private generateSessionId;
}
export interface SessionAnalytics {
    totalSessions: number;
    averageDuration: number;
    averageMessages: number;
    averageSatisfaction: number;
}
