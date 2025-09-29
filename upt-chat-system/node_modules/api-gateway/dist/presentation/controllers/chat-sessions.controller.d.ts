import { StartChatSessionUseCase, GetActiveChatSessionUseCase, EndChatSessionUseCase, ValidateSessionTokenUseCase, RecordUserMessageUseCase, SetSessionSatisfactionUseCase, UpdateSessionMetadataUseCase, GetSessionAnalyticsUseCase, CleanupExpiredSessionsUseCase } from '../../application/use-cases/chat-session.use-cases';
import { StartChatSessionDto, ChatSessionResponseDto, UpdateSessionMetadataDto, SessionSatisfactionDto } from '../../application/dtos/chat-session.dto';
export declare class ChatSessionsController {
    private readonly startChatSessionUseCase;
    private readonly getActiveChatSessionUseCase;
    private readonly endChatSessionUseCase;
    private readonly validateSessionTokenUseCase;
    private readonly recordUserMessageUseCase;
    private readonly setSessionSatisfactionUseCase;
    private readonly updateSessionMetadataUseCase;
    private readonly getSessionAnalyticsUseCase;
    private readonly cleanupExpiredSessionsUseCase;
    constructor(startChatSessionUseCase: StartChatSessionUseCase, getActiveChatSessionUseCase: GetActiveChatSessionUseCase, endChatSessionUseCase: EndChatSessionUseCase, validateSessionTokenUseCase: ValidateSessionTokenUseCase, recordUserMessageUseCase: RecordUserMessageUseCase, setSessionSatisfactionUseCase: SetSessionSatisfactionUseCase, updateSessionMetadataUseCase: UpdateSessionMetadataUseCase, getSessionAnalyticsUseCase: GetSessionAnalyticsUseCase, cleanupExpiredSessionsUseCase: CleanupExpiredSessionsUseCase);
    startSession(userId: string, startSessionDto: StartChatSessionDto): Promise<{
        status: string;
        message: string;
        data: ChatSessionResponseDto;
    }>;
    getActiveSession(userId: string): Promise<{
        status: string;
        message: string;
        data?: ChatSessionResponseDto;
    }>;
    endSession(sessionId: string): Promise<{
        status: string;
        message: string;
        data: {
            ended: boolean;
        };
    }>;
    validateToken(token: string): Promise<{
        status: string;
        message: string;
        data?: {
            session: ChatSessionResponseDto;
            valid: boolean;
        };
    }>;
    recordMessage(sessionId: string, messageData: {
        responseTime: number;
    }): Promise<{
        status: string;
        message: string;
    }>;
    setSatisfaction(sessionId: string, satisfactionDto: SessionSatisfactionDto): Promise<{
        status: string;
        message: string;
    }>;
    updateMetadata(sessionId: string, updateDto: UpdateSessionMetadataDto): Promise<{
        status: string;
        message: string;
        data: ChatSessionResponseDto;
    }>;
    getAnalytics(userId?: string): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    cleanupSessions(): Promise<{
        status: string;
        message: string;
        data: {
            cleanedSessions: number;
        };
    }>;
}
