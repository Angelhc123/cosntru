import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatSessionDomainService, SessionAnalytics } from '../../domain/services/chat-session-domain.service';
import { 
  StartChatSessionDto, 
  ChatSessionResponseDto, 
  UpdateSessionMetadataDto,
  SessionSatisfactionDto 
} from '../dtos/chat-session.dto';
import { MessageDocument } from '../../infrastructure/database/schemas/message.schema';

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
  constructor(
    private readonly sessionDomainService: ChatSessionDomainService,
    @InjectModel('Message') private readonly messageModel: Model<MessageDocument>
  ) {}

  async execute(sessionId: string, text: string, sender: string = 'user', responseTime?: number, metadata?: any): Promise<any> {
    // Preparar metadata combinando responseTime y metadata adicional
    const messageMetadata = {
      ...(responseTime ? { responseTime } : {}),
      ...(metadata || {})
    };
    
    // Guardar el mensaje en la colección de mensajes
    const message = new this.messageModel({
      sessionId,
      sender,
      text,
      timestamp: new Date(),
      metadata: messageMetadata
    });
    
    const savedMessage = await message.save();
    
    // También actualizar la sesión si hay responseTime
    if (responseTime) {
      await this.sessionDomainService.recordUserMessage(sessionId, responseTime);
    }
    
    return {
      id: savedMessage._id,
      sessionId: savedMessage.sessionId,
      sender: savedMessage.sender,
      text: savedMessage.text,
      timestamp: savedMessage.timestamp,
      metadata: savedMessage.metadata
    };
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