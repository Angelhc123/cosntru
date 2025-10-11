import { SessionMetadata } from '../../domain/entities/chat-session.entity';
export declare class StartChatSessionDto {
    userAgent?: string;
    ipAddress?: string;
    platform?: string;
    initialQuery?: string;
}
export declare class UpdateSessionMetadataDto {
    metadata?: Partial<SessionMetadata>;
}
export declare class SessionSatisfactionDto {
    score: number;
}
export declare class ChatSessionResponseDto {
    id: string;
    userId: string;
    sessionToken: string;
    isActive: boolean;
    startedAt: Date;
    endedAt?: Date;
    duration?: number;
    metadata: SessionMetadata;
    status: string;
    static fromDomain(session: any): ChatSessionResponseDto;
}
