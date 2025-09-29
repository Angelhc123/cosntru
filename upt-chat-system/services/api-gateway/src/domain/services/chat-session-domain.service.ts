import { ChatSession, SessionMetadata } from '../entities/chat-session.entity';
import { IChatSessionRepository } from '../repositories/chat-session.repository.interface';

/**
 * Domain Service: ChatSessionService
 * Contiene la lógica de negocio relacionada con sesiones de chat
 */
export class ChatSessionDomainService {
  private readonly MAX_SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas
  private readonly MAX_CONCURRENT_SESSIONS = 1; // Solo una sesión activa por usuario

  constructor(private readonly sessionRepository: IChatSessionRepository) {}

  async startNewSession(userId: string, metadata?: SessionMetadata): Promise<ChatSession> {
    // Verificar si el usuario ya tiene una sesión activa
    const activeSession = await this.sessionRepository.findActiveByUserId(userId);
    if (activeSession) {
      // Terminar la sesión anterior automáticamente
      await this.endSession(activeSession.id);
    }

    // Crear nueva sesión
    const sessionToken = ChatSession.generateSessionToken();
    const session = ChatSession.create({
      id: this.generateSessionId(),
      userId,
      sessionToken,
      metadata
    });

    return await this.sessionRepository.create(session);
  }

  async getActiveSession(userId: string): Promise<ChatSession | null> {
    const session = await this.sessionRepository.findActiveByUserId(userId);
    
    // Verificar si la sesión ha expirado
    if (session && session.isExpired(this.MAX_SESSION_DURATION_MS)) {
      await this.endSession(session.id);
      return null;
    }

    return session;
  }

  async endSession(sessionId: string): Promise<boolean> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    session.endSession();
    await this.sessionRepository.update(sessionId, session);
    return true;
  }

  async updateSessionMetadata(
    sessionId: string, 
    metadata: Partial<SessionMetadata>
  ): Promise<ChatSession> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    session.updateMetadata(metadata);
    return await this.sessionRepository.update(sessionId, session);
  }

  async recordUserMessage(sessionId: string, responseTime: number): Promise<void> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    session.incrementMessageCount();
    session.updateAverageResponseTime(responseTime);
    
    await this.sessionRepository.update(sessionId, session);
  }

  async setSessionSatisfaction(sessionId: string, score: number): Promise<void> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new Error('Sesión no encontrada');
    }

    session.setSatisfactionScore(score);
    await this.sessionRepository.update(sessionId, session);
  }

  async validateSessionToken(token: string): Promise<ChatSession | null> {
    const session = await this.sessionRepository.findBySessionToken(token);
    
    if (!session || !session.isActive) {
      return null;
    }

    // Verificar expiración
    if (session.isExpired(this.MAX_SESSION_DURATION_MS)) {
      await this.endSession(session.id);
      return null;
    }

    return session;
  }

  async cleanupExpiredSessions(): Promise<number> {
    const expiredSessions = await this.sessionRepository
      .findExpiredSessions(this.MAX_SESSION_DURATION_MS);
    
    let cleanedCount = 0;
    for (const session of expiredSessions) {
      await this.endSession(session.id);
      cleanedCount++;
    }

    return cleanedCount;
  }

  async getSessionAnalytics(userId?: string): Promise<SessionAnalytics> {
    const sessions = userId 
      ? await this.sessionRepository.findByUserId(userId)
      : await this.sessionRepository.findActiveSessions();

    return this.calculateSessionAnalytics(sessions);
  }

  private calculateSessionAnalytics(sessions: ChatSession[]): SessionAnalytics {
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
      .filter(d => d !== null) as number[];
    
    const messagesCounts = sessions
      .map(s => s.metadata.totalMessages || 0);
    
    const satisfactionScores = sessions
      .map(s => s.metadata.satisfactionScore)
      .filter(s => s !== undefined) as number[];

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

  private generateSessionId(): string {
    return `chat_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

export interface SessionAnalytics {
  totalSessions: number;
  averageDuration: number;
  averageMessages: number;
  averageSatisfaction: number;
}