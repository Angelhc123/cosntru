import { Model } from 'mongoose';
import { MessageDocument } from '../../infrastructure/database/schemas/message.schema';
import { ChatSessionDocument } from '../../infrastructure/database/schemas/chat-session.schema';
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
    private readonly messageModel;
    private readonly chatSessionModel;
    constructor(startChatSessionUseCase: StartChatSessionUseCase, getActiveChatSessionUseCase: GetActiveChatSessionUseCase, endChatSessionUseCase: EndChatSessionUseCase, validateSessionTokenUseCase: ValidateSessionTokenUseCase, recordUserMessageUseCase: RecordUserMessageUseCase, setSessionSatisfactionUseCase: SetSessionSatisfactionUseCase, updateSessionMetadataUseCase: UpdateSessionMetadataUseCase, getSessionAnalyticsUseCase: GetSessionAnalyticsUseCase, cleanupExpiredSessionsUseCase: CleanupExpiredSessionsUseCase, messageModel: Model<MessageDocument>, chatSessionModel: Model<ChatSessionDocument>);
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
    getUserHistory(userId: string): Promise<{
        status: string;
        message: string;
        data: any[];
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
        text: string;
        sender: string;
        responseTime?: number;
        metadata?: any;
    }): Promise<{
        status: string;
        message: string;
        data: any;
    }>;
    getSessionMessages(sessionId: string): Promise<{
        status: string;
        message: string;
        data: any[];
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
