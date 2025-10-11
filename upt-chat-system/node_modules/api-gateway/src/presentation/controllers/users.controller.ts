import { 
  Controller, 
  Get, 
  Param, 
  HttpStatus, 
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { 
  GetUserProfileUseCase,
  ValidateUserForChatUseCase,
} from '../../application/use-cases/user.use-cases';
import { UserResponseDto } from '../../application/dtos/user.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/auth/decorators/current-user.decorator';
import type { CurrentUserDto } from '../../infrastructure/auth/decorators/current-user.decorator';
import { AppLoggerService } from '../../infrastructure/logging/logger.service';

/**
 * Controller: Users
 * 
 * IMPORTANTE: Este sistema NO maneja autenticación ni creación de usuarios.
 * La autenticación es responsabilidad del sistema UPT (LDAP/SSO).
 * 
 * Este controlador solo proporciona:
 * - Consulta de información de usuarios (read-only desde BD UPT)
 * - Validación de permisos para usar el chat
 * 
 * NO hay endpoints de:
 * ❌ Login (lo hace UPT)
 * ❌ Registro (usuarios existen en BD UPT)
 * ❌ Actualización (la BD UPT es read-only para nosotros)
 * ❌ Eliminación (no tenemos permisos)
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly validateUserForChatUseCase: ValidateUserForChatUseCase,
    private readonly logger: AppLoggerService,
  ) {
    this.logger.setContext('UsersController');
  }

  /**
   * GET /api/v1/users/profile/:id
   * 
   * Consulta información de un usuario desde la BD UPT (read-only).
   * Este endpoint NO modifica datos, solo los consulta.
   * 
   * NOTA: El JWT viene del sistema de autenticación de UPT,
   * nosotros solo validamos que sea válido.
   */
  @Get('profile/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Consultar perfil de usuario',
    description: 'Obtiene información de usuario desde BD UPT (solo lectura). Requiere JWT válido del sistema UPT.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil consultado exitosamente',
    type: UserResponseDto
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - JWT inválido o expirado' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado en BD UPT' 
  })
  async getProfile(
    @Param('id') userId: string,
    @CurrentUser() currentUser: CurrentUserDto,
  ): Promise<UserResponseDto> {
    this.logger.debug(`Consultando perfil de usuario: ${userId}`);
    
    const user = await this.getUserProfileUseCase.execute(userId);
    
    if (!user) {
      throw new HttpException(
        'Usuario no encontrado en la base de datos UPT',
        HttpStatus.NOT_FOUND
      );
    }

    return user;
  }

  /**
   * GET /api/v1/users/validate-for-chat/:id
   * 
   * Valida si un usuario UPT tiene permisos activos para usar el chat.
   * Solo verifica estado del usuario en BD UPT, no crea ni modifica permisos.
   */
  @Get('validate-for-chat/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Validar permisos de chat',
    description: 'Verifica si un usuario UPT puede usar el chatbot (consulta estado en BD UPT)',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Validación completada',
    schema: {
      example: {
        canChat: true,
        reason: 'Usuario activo en sistema UPT',
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - JWT inválido' 
  })
  async validateForChat(
    @Param('id') userId: string,
    @CurrentUser() currentUser: CurrentUserDto,
  ): Promise<{ canChat: boolean; reason?: string }> {
    this.logger.debug(`Validando permisos de chat para usuario: ${userId}`);
    
    const canChat = await this.validateUserForChatUseCase.execute(userId);
    
    return { 
      canChat,
      reason: canChat ? 'Usuario activo en sistema UPT' : 'Usuario inactivo o sin permisos'
    };
  }
}