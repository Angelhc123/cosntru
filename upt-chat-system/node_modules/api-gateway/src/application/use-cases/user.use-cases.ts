import { Injectable } from '@nestjs/common';
import { UserDomainService } from '../../domain/services/user-domain.service';
import { CreateUserDto, UserResponseDto, LoginUserDto } from '../dtos/user.dto';
import { UserType } from '../../domain/entities/user.entity';

/**
 * Use Case: Gestión de Usuarios
 * Implementa los casos de uso relacionados con usuarios del sistema UPT
 */

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userDomainService: UserDomainService) {}

  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const userId = this.generateUserId();
    
    const user = await this.userDomainService.createNewUser({
      id: userId,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      userType: createUserDto.userType
    });

    return UserResponseDto.fromDomain(user);
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

@Injectable()
export class AuthenticateUserUseCase {
  constructor(private readonly userDomainService: UserDomainService) {}

  async execute(loginDto: LoginUserDto): Promise<{user: UserResponseDto, token: string} | null> {
    const user = await this.userDomainService.authenticateUser(
      loginDto.email, 
      loginDto.password
    );

    if (!user) {
      return null;
    }

    // Aquí generarías el JWT token
    const token = this.generateJwtToken(user);

    return {
      user: UserResponseDto.fromDomain(user),
      token
    };
  }

  private generateJwtToken(user: any): string {
    // Implementación simplificada - en producción usar @nestjs/jwt
    return `jwt_${user.id}_${Date.now()}`;
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