/**
 * DTOs para Notification Service
 */
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  sender: string; // 'user' o 'bot'

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsString()
  @IsNotEmpty()
  timestamp: string; // ISO format
}

export class SendChatTranscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];

  @IsString()
  @IsNotEmpty()
  sessionEndTime: string; // ISO format

  @IsString()
  @IsOptional()
  sessionId?: string;
}

export class SendPasswordResetConfirmationDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsUrl({ require_tld: false }) // Permitir localhost y URLs sin TLD para desarrollo
  @IsNotEmpty()
  confirmationUrl: string;
}

export class SendNewPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class SendGenericEmailDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  htmlContent: string;
}

export class EmailResponseDto {
  success: boolean;
  messageId?: string;
  error?: string;
}
