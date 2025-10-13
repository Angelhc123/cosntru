/**
 * DTOs para Notification Service
 */
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class SendPasswordResetConfirmationDto {
  @IsEmail()
  @IsNotEmpty()
  to: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsUrl()
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
