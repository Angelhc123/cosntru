import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { UserResponseDto, LoginUserDto } from '../dtos/user.dto';
import { UserType } from '../../domain/entities/user.entity';
import { User } from '../../domain/entities/user.entity';
import { AppLoggerService } from '../../infrastructure/logging/logger.service';

/**
 * Use Case: Gestión de Usuarios
 * Implementa los casos de uso relacionados con usuarios del sistema UPT
 * NOTA: Este sistema NO crea usuarios, solo consulta la BD existente de UPT
 */

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly userDomainService: UserDomainService,
    private readonly jwtService: JwtService,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext('AuthenticateUserUseCase');
  }

  /**
   * Autentica un usuario contra la base de datos existente de UPT
   * Este método consulta usuarios ya existentes, NO los crea
   * 
   * Flujo:
   * 1. Verifica credenciales contra sistema UPT
   * 2. Genera JWT token válido por 7 días
   * 3. Sincroniza/actualiza cache local
   * 4. Retorna usuario + token
   */
  async execute(loginDto: LoginUserDto): Promise<{
    user: UserResponseDto;
    access_token: string;
    token_type: string;
    expires_in: string;
  } | null> {
    this.logger.debug(`Intento de autenticación para: ${loginDto.email}`);

    // Consultar usuario en la BD de UPT (solo lectura)
    const user = await this.userDomainService.authenticateUserFromUptDatabase(
      loginDto.email, 
      loginDto.password
    );

    if (!user) {
      this.logger.warn(`Autenticación fallida para: ${loginDto.email}`);
      return null;
    }

    // Generar JWT token
    const token = this.generateJwtToken(user);

    this.logger.logAuth('login', loginDto.email, true);
    this.logger.log(`Usuario autenticado exitosamente: ${user.email} (${user.userType})`);

    return {
      user: UserResponseDto.fromDomain(user),
      access_token: token,
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRES_IN || '7d',
    };
  }

  /**
   * Genera un JWT token con la información del usuario
   */
  private generateJwtToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      userType: user.userType,
    };

    return this.jwtService.sign(payload);
  }
}

@Injectable()
export class GetUserProfileUseCase {
  constructor(private readonly userDomainService: UserDomainService) {}

  async execute(userId: string): Promise<UserResponseDto | null> {
    const user = await this.userDomainService.getUserProfile(userId);
    
    if (!user) {
      return null;
    }

    return UserResponseDto.fromDomain(user);
  }
}

@Injectable()
export class ValidateUserForChatUseCase {
  constructor(private readonly userDomainService: UserDomainService) {}

  async execute(userId: string): Promise<boolean> {
    return await this.userDomainService.validateUserForChat(userId);
  }
}

@Injectable()
export class GetUsersByTypeUseCase {
  constructor(private readonly userDomainService: UserDomainService) {}

  async execute(userType: UserType): Promise<UserResponseDto[]> {
    const users = await this.userDomainService.getUsersByType(userType);
    
    return users.map(user => UserResponseDto.fromDomain(user));
  }
}