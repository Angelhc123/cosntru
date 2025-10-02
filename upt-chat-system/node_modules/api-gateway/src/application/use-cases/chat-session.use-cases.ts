import { Injectable } from '@nestjs/common';
import { ChatSessionDomainService, SessionAnalytics } from '../../domain/services/chat-session-domain.service';
import { 
  StartChatSessionDto, 
  ChatSessionResponseDto, 
  UpdateSessionMetadataDto,
  SessionSatisfactionDto 
} from '../dtos/chat-session.dto';

/**
 * Use Cases: Gestión de Sesiones de Chat
 * Implementa los casos de uso relacionados con sesiones de chat del sistema UPT
 */

@Injectable()
export class StartChatSessionUseCase {
  constructor(private readonly sessionDomainService: ChatSessionDomainService) {}

  async execute(userId: string, startSessionDto: StartChatSessionDto): Promise<ChatSessionResponseDto> {
    const metadata = {
      userAgent: startSessionDto.userAgent,
      ipAddress: startSessionDto.ipAddress,
      platform: startSessionDto.platform,
      initialQuery: startSessionDto.initialQuery,
      totalMessages: 0,
      avgResponseTime: 0
    };

    const session = await this.sessionDomainService.startNewSession(userId, metadata);
    
    return ChatSessionResponseDto.fromDomain(session);
  }
}

@Injectable()
export class GetActiveChatSessionUseCase {
  constructor(private readonly sessionDomainService: ChatSessionDomainService) {}

  async execute(userId: string): Promise<ChatSessionResponseDto | null> {
    const session = await this.sessionDomainService.getActiveSession(userId);
    
    if (!session) {
      return null;
    }

    return ChatSessionResponseDto.fromDomain(session);
  }
}

@Injectable()
export class EndChatSessionUseCase {
  constructor(private readonly sessionDomainService: ChatSessionDomainService) {}

  async execute(sessionId: string): Promise<boolean> {
    return await this.sessionDomainService.endSession(sessionId);
  }
}

@Injectable()
export class ValidateSessionTokenUseCase {
  constructor(private readonly sessionDomainService: ChatSessionDomainService) {}

  async execute(token: string): Promise<ChatSessionResponseDto | null> {
    const session = await this.sessionDomainService.validateSessionToken(token);
    
    if (!session) {
      return null;
    }

    return ChatSessionResponseDto.fromDomain(session);
  }
}

@Injectable()
export class RecordUserMessageUseCase {
  constructor(private readonly sessionDomainService: ChatSessionDomainService) {}

  async execute(sessionId: string, responseTime: number): Promise<void> {
    await this.sessionDomainService.recordUserMessage(sessionId, responseTime);
  }
}

@Injectable()
export class SetSessionSatisfactionUseCase {
  constructor(private readonly sessionDomainService: ChatSessionDomainService) {}

  async execute(sessionId: string, satisfactionDto: SessionSatisfactionDto): Promise<void> {
    await this.sessionDomainService.setSessionSatisfaction(sessionId, satisfactionDto.score);
  }
}

@Injectable()
export class UpdateSessionMetadataUseCase {
  constructor(private readonly sessionDomainService: ChatSessionDomainService) {}

  async execute(sessionId: string, updateDto: UpdateSessionMetadataDto): Promise<ChatSessionResponseDto> {
    const session = await this.sessionDomainService.updateSessionMetadata(
      sessionId, 
      updateDto.metadata || {}
    );
    
    return ChatSessionResponseDto.fromDomain(session);
  }
}

@Injectable()
export class GetSessionAnalyticsUseCase {
  constructor(private readonly sessionDomainService: ChatSessionDomainService) {}

  async execute(userId?: string): Promise<SessionAnalytics> {
    return await this.sessionDomainService.getSessionAnalytics(userId);
  }
}

@Injectable()
export class CleanupExpiredSessionsUseCase {
  constructor(private readonly sessionDomainService: ChatSessionDomainService) {}

  async execute(): Promise<{ cleanedSessions: number }> {
    const cleanedCount = await this.sessionDomainService.cleanupExpiredSessions();
    
    return { cleanedSessions: cleanedCount };
  }
}