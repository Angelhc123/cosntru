import { IsOptional, IsString, IsObject, IsNumber, Min, Max } from 'class-validator';
import { SessionMetadata } from '../../domain/entities/chat-session.entity';

export class StartChatSessionDto {
  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  initialQuery?: string;
}

export class UpdateSessionMetadataDto {
  @IsOptional()
  @IsObject()
  metadata?: Partial<SessionMetadata>;
}

export class SessionSatisfactionDto {
  @IsNumber({}, { message: 'La puntuación debe ser un número' })
  @Min(1, { message: 'La puntuación mínima es 1' })
  @Max(5, { message: 'La puntuación máxima es 5' })
  score: number;
}

export class ChatSessionResponseDto {
  id: string;
  userId: string;
  sessionToken: string;
  isActive: boolean;
  startedAt: Date;
  endedAt?: Date;
  duration?: number;
  metadata: SessionMetadata;
  status: string;

  static fromDomain(session: any): ChatSessionResponseDto {
    return {
      id: session.id,
      userId: session.userId,
      sessionToken: session.sessionToken,
      isActive: session.isActive,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      duration: session.duration,
      metadata: session.metadata,
      status: session.status
    };
  }
}