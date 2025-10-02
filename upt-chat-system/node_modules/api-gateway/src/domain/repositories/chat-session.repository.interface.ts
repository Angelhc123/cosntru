import { ChatSession } from '../entities/chat-session.entity';

/**
 * Repository Interface: IChatSessionRepository
 * Define las operaciones de persistencia para la entidad ChatSession
 */
export interface IChatSessionRepository {
  findById(id: string): Promise<ChatSession | null>;
  findByUserId(userId: string): Promise<ChatSession[]>;
  findActiveByUserId(userId: string): Promise<ChatSession | null>;
  findBySessionToken(token: string): Promise<ChatSession | null>;
  create(session: ChatSession): Promise<ChatSession>;
  update(id: string, session: Partial<ChatSession>): Promise<ChatSession>;
  endSession(id: string): Promise<boolean>;
  findActiveSessions(): Promise<ChatSession[]>;
  findExpiredSessions(maxDurationMs: number): Promise<ChatSession[]>;
  deleteSession(id: string): Promise<boolean>;
  findSessionsByDateRange(from: Date, to: Date): Promise<ChatSession[]>;
  countActiveSessionsForUser(userId: string): Promise<number>;
}

export interface SessionFilters {
  userId?: string;
  isActive?: boolean;
  startedAfter?: Date;
  startedBefore?: Date;
  minDuration?: number;
  maxDuration?: number;
}