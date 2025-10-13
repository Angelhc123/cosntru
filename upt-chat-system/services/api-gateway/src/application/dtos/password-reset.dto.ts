/**
 * DTOs para Password Reset
 * Implementa RF004 - Validación por Correo Personal
 */
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class InitiateResetDto {
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El session_id es requerido' })
  session_id: string;
}

export class ConfirmResetDto {
  @IsString()
  @IsNotEmpty({ message: 'El token es requerido' })
  token: string;
}

export class VerifyEmailDto {
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  email: string;
}

export interface PasswordResetToken {
  token: string;
  email: string;
  session_id: string;
  created_at: Date;
  expires_at: Date;
  used: boolean;
}

export interface ValidationNotification {
  session_id: string;
  status: 'pending' | 'confirmed' | 'expired' | 'error';
  message: string;
  created_at: Date;
  updated_at: Date;
}
