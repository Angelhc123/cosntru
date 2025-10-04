import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  HttpStatus, 
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity } from '@nestjs/swagger';
import { 
  AuthenticateUserUseCase, 
  GetUserProfileUseCase,
  ValidateUserForChatUseCase,
  GetUsersByTypeUseCase
} from '../../application/use-cases/user.use-cases';
import { LoginUserDto, UserResponseDto } from '../../application/dtos/user.dto';
import { UserType } from '../../domain/entities/user.entity';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/auth/decorators/current-user.decorator';
import type { CurrentUserDto } from '../../infrastructure/auth/decorators/current-user.decorator';
import { AppLoggerService } from '../../infrastructure/logging/logger.service';

/**
 * Controller: Users
 * Maneja las operaciones HTTP relacionadas con usuarios del sistema UPT
 * NOTA: Este controlador NO crea usuarios, solo consulta la BD existente de UPT
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly authenticateUserUseCase: AuthenticateUserUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly validateUserForChatUseCase: ValidateUserForChatUseCase,
    private readonly getUsersByTypeUseCase: GetUsersByTypeUseCase,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext('UsersController');
  }

  /**
   * POST /api/v1/users/login
   * 
   * Autentica un usuario contra el sistema UPT y genera un JWT token.
   * 
   * Este endpoint:
   * 1. Valida credenciales contra BD/LDAP de UPT
   * 2. Genera JWT token válido por 7 días
   * 3. Retorna token + información del usuario
   * 
   * El token debe ser enviado en endpoints protegidos:
   * Authorization: Bearer <access_token>
   */
  @Post('login')
  @ApiOperation({ 
    summary: 'Autenticar usuario UPT',
    description: 'Valida credenciales contra sistema UPT y genera JWT token válido por 7 días',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario autenticado exitosamente',
    schema: {
      example: {
        user: {
          id: '507f1f77bcf86cd799439011',
          email: 'estudiante@upt.edu.pe',
          firstName: 'Juan',
          lastName: 'Pérez',
          userType: 'student',
          isActive: true,
        },
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        token_type: 'Bearer',
        expires_in: '7d',
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas' 
  })
  async login(@Body() loginDto: LoginUserDto) {
    this.logger.debug(`Intento de login para: ${loginDto.email}`);
    
    const result = await this.authenticateUserUseCase.execute(loginDto);
    
    if (!result) {
      this.logger.warn(`Login fallido para: ${loginDto.email}`);
      throw new HttpException(
        'Credenciales inválidas. Verifica tu email y contraseña.',
        HttpStatus.UNAUTHORIZED
      );
    }

    this.logger.log(`Login exitoso para: ${loginDto.email}`);
    return result;
  }

  /**
   * GET /api/v1/users/profile/:id
   * 
   * Obtiene el perfil de un usuario por ID.
   * Requiere autenticación JWT.
   */
  @Get('profile/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener perfil de usuario',
    description: 'Obtiene información detallada del perfil de un usuario. Requiere autenticación.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil obtenido exitosamente',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token inválido o expirado' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  async getProfile(
    @Param('id') userId: string,
    @CurrentUser() currentUser: CurrentUserDto,
  ): Promise<UserResponseDto> {
    this.logger.debug(`Usuario ${currentUser.email} solicitando perfil de: ${userId}`);
    
    const user = await this.getUserProfileUseCase.execute(userId);
    
    if (!user) {
      throw new HttpException(
        'Usuario no encontrado',
        HttpStatus.NOT_FOUND
      );
    }

    return user;
  }

  /**
   * GET /api/v1/users/validate-for-chat/:id
   * 
   * Valida si un usuario tiene permisos para usar el chat.
   * Requiere autenticación JWT.
   */
  @Get('validate-for-chat/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Validar permisos de chat',
    description: 'Verifica si un usuario puede iniciar sesiones de chat',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Validación completada',
    schema: {
      example: {
        canChat: true,
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  async validateForChat(
    @Param('id') userId: string,
    @CurrentUser() currentUser: CurrentUserDto,
  ): Promise<{ canChat: boolean }> {
    this.logger.debug(`Validando permisos de chat para usuario: ${userId}`);
    
    const canChat = await this.validateUserForChatUseCase.execute(userId);
    
    return { canChat };
  }

  /**
   * GET /api/v1/users/by-type/:type
   * 
   * Obtiene lista de usuarios por tipo (student, teacher, admin, staff).
   * Requiere autenticación JWT.
   */
  @Get('by-type/:type')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener usuarios por tipo',
    description: 'Lista usuarios filtrados por tipo: student, teacher, admin, staff',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuarios obtenidos exitosamente',
    schema: {
      example: {
        users: [
          {
            id: '507f1f77bcf86cd799439011',
            email: 'estudiante@upt.edu.pe',
            firstName: 'Juan',
            lastName: 'Pérez',
            userType: 'student',
            isActive: true,
          },
        ],
        count: 1,
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado' 
  })
  async getUsersByType(
    @Param('type') userType: UserType,
    @CurrentUser() currentUser: CurrentUserDto,
  ): Promise<{ users: UserResponseDto[]; count: number }> {
    this.logger.debug(`Usuario ${currentUser.email} solicitando usuarios tipo: ${userType}`);
    
    const users = await this.getUsersByTypeUseCase.execute(userType);
    
    return {
      users,
      count: users.length,
    };
  }
}