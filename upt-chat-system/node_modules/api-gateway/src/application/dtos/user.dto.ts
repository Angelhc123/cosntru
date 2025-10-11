import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserType } from '../../domain/entities/user.entity';

/**
 * NOTA: CreateUserDto fue eliminado
 * Este sistema NO crea usuarios, solo consulta la BD existente de UPT
 */

export class LoginUserDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password: string;
}

export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userType: UserType;
  isActive: boolean;
  createdAt: Date;

  static fromDomain(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      userType: user.userType,
      isActive: user.isActive,
      createdAt: user.createdAt
    };
  }
}