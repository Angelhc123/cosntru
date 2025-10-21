/**
 * Password Reset Controller
 * RF004 - Validación por Correo Personal
 * Maneja el flujo de recuperación de contraseña iniciado por el chatbot
 */
import { Controller, Post, Body, Get, Param, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PasswordResetService } from '../../application/services/password-reset.service';

// DTOs
class VerifyEmailDto {
  emailPersonal: string;
}

class InitiateResetDto {
  emailPersonal: string;
  sessionId: string;
}

@ApiTags('Password Reset - RF004')
@Controller('api/v1/password-reset')
export class PasswordResetController {
  private readonly logger = new Logger(PasswordResetController.name);

  constructor(
    private readonly passwordResetService: PasswordResetService,
  ) {}

  /**
   * Endpoint para verificar si un email personal existe
   * Usado por NLP Service cuando el usuario proporciona su email
   */
  @Post('verify-email')
  @ApiOperation({ summary: 'Verificar email personal en base de datos UPT' })
  @ApiResponse({ status: 200, description: 'Email verificado correctamente' })
  @ApiResponse({ status: 404, description: 'Email no encontrado' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    this.logger.log(`📧 Verificando email personal: ${dto.emailPersonal}`);

    const result = await this.passwordResetService.verifyEmailPersonal(dto.emailPersonal);

    if (!result.exists) {
      throw new HttpException(
        {
          success: false,
          message: 'Email personal no encontrado en la base de datos UPT',
          exists: false,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      exists: true,
      message: 'Email personal encontrado',
      data: {
        usuario: result.usuario,
        nombreCompleto: result.nombreCompleto,
        email: result.email,
        codigoUniversitario: result.codigoUniversitario,
      },
    };
  }

  /**
   * Endpoint para iniciar el proceso completo de recuperación de contraseña
   * 1. Verifica email
   * 2. Genera nueva contraseña
   * 3. Actualiza en BD
   * 4. Envía notificación
   */
  @Post('initiate')
  @ApiOperation({ summary: 'Iniciar proceso de recuperación de contraseña' })
  @ApiResponse({ status: 201, description: 'Proceso iniciado correctamente' })
  @ApiResponse({ status: 404, description: 'Email no encontrado' })
  async initiateReset(@Body() dto: InitiateResetDto) {
    this.logger.log(`🚀 Iniciando reset de contraseña para: ${dto.emailPersonal}`);

    try {
      const result = await this.passwordResetService.initiatePasswordReset(
        dto.emailPersonal,
        dto.sessionId,
      );

      if (!result.success) {
        throw new HttpException(
          {
            success: false,
            message: result.message || 'Error al procesar la solicitud',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        success: true,
        message: 'Proceso de recuperación iniciado correctamente',
        data: {
          usuario: result.usuario,
          emailSent: result.emailSent,
          newPassword: result.newPassword, // Solo para desarrollo, eliminar en producción
        },
      };
    } catch (error) {
      this.logger.error(`❌ Error iniciando reset: ${error.message}`);
      throw new HttpException(
        {
          success: false,
          message: 'Error interno del servidor',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Endpoint para consultar el estado de un proceso de reset
   */
  @Get('status/:sessionId')
  @ApiOperation({ summary: 'Consultar estado de proceso de recuperación' })
  async getResetStatus(@Param('sessionId') sessionId: string) {
    this.logger.log(`📊 Consultando estado para sesión: ${sessionId}`);

    const status = await this.passwordResetService.getResetStatus(sessionId);

    return {
      success: true,
      sessionId,
      status,
    };
  }
}
