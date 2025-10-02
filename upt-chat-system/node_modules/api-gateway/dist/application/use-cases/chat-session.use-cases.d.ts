import { ChatSessionDomainService, SessionAnalytics } from '../../domain/services/chat-session-domain.service';
import { StartChatSessionDto, ChatSessionResponseDto, UpdateSessionMetadataDto, SessionSatisfactionDto } from '../dtos/chat-session.dto';
export declare class StartChatSessionUseCase {
    private readonly sessionDomainService;
    constructor(sessionDomainService: ChatSessionDomainService);
    execute(userId: string, startSessionDto: StartChatSessionDto): Promise<ChatSessionResponseDto>;
}
export declare class GetActiveChatSessionUseCase {
    private readonly sessionDomainService;
    constructor(sessionDomainService: ChatSessionDomainService);
    execute(userId: string): Promise<ChatSessionResponseDto | null>;
}
export declare class EndChatSessionUseCase {
    private readonly sessionDomainService;
    constructor(sessionDomainService: ChatSessionDomainService);
    execute(sessionId: string): Promise<boolean>;
}
export declare class ValidateSessionTokenUseCase {
    private readonly sessionDomainService;
    constructor(sessionDomainService: ChatSessionDomainService);
    execute(token: string): Promise<ChatSessionResponseDto | null>;
}
export declare class RecordUserMessageUseCase {
    private readonly sessionDomainService;
    constructor(sessionDomainService: ChatSessionDomainService);
    execute(sessionId: string, responseTime: number): Promise<void>;
}
export declare class SetSessionSatisfactionUseCase {
    private readonly sessionDomainService;
    constructor(sessionDomainService: ChatSessionDomainService);
    execute(sessionId: string, satisfactionDto: SessionSatisfactionDto): Promise<void>;
}
export declare class UpdateSessionMetadataUseCase {
    private readonly sessionDomainService;
    constructor(sessionDomainService: ChatSessionDomainService);
    execute(sessionId: string, updateDto: UpdateSessionMetadataDto): Promise<ChatSessionResponseDto>;
}
export declare class GetSessionAnalyticsUseCase {
    private readonly sessionDomainService;
    constructor(sessionDomainService: ChatSessionDomainService);
    execute(userId?: string): Promise<SessionAnalytics>;
}
export declare class CleanupExpiredSessionsUseCase {
    private readonly sessionDomainService;
    constructor(sessionDomainService: ChatSessionDomainService);
    execute(): Promise<{
        cleanedSessions: number;
    }>;
}
