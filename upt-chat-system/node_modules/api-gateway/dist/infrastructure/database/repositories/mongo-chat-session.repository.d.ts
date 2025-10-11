import { Model } from 'mongoose';
import { ChatSession } from '../../../domain/entities/chat-session.entity';
import { IChatSessionRepository } from '../../../domain/repositories/chat-session.repository.interface';
import { ChatSessionDocument } from '../schemas/chat-session.schema';
export declare class MongoChatSessionRepository implements IChatSessionRepository {
    private readonly sessionModel;
    constructor(sessionModel: Model<ChatSessionDocument>);
    findById(id: string): Promise<ChatSession | null>;
    findByUserId(userId: string): Promise<ChatSession[]>;
    findActiveByUserId(userId: string): Promise<ChatSession | null>;
    findBySessionToken(token: string): Promise<ChatSession | null>;
    create(session: ChatSession): Promise<ChatSession>;
    update(id: string, sessionData: Partial<ChatSession>): Promise<ChatSession>;
    endSession(id: string): Promise<boolean>;
    findActiveSessions(): Promise<ChatSession[]>;
    findExpiredSessions(maxDurationMs: number): Promise<ChatSession[]>;
    deleteSession(id: string): Promise<boolean>;
    findSessionsByDateRange(from: Date, to: Date): Promise<ChatSession[]>;
    countActiveSessionsForUser(userId: string): Promise<number>;
    private buildQuery;
    private toDomain;
}
