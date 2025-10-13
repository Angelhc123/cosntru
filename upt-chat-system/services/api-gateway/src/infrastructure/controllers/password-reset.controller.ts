/**
 * Password Reset Controller
 * Implementa RF004 - Validación por Correo Personal
 * Maneja endpoints para recuperación de contraseña
 */
import { Controller, Post, Body, Get, Param, HttpStatus, HttpException } from '@nestjs/common';
import { PasswordResetService } from '../../application/services/password-reset.service';
import { InitiateResetDto, ConfirmResetDto } from '../../application/dtos/password-reset.dto';

@Controller('api/password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  /**
   * POST /api/password-reset/initiate
   * Inicia el proceso de recuperación de contraseña
   */
  @Post('initiate')
  async initiateReset(@Body() dto: InitiateResetDto) {
    try {
      const result = await this.passwordResetService.initiatePasswordReset(
        dto.email,
        dto.session_id
      );

      if (!result.success) {
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        message: 'Correo de confirmación enviado exitosamente',
        token: result.token,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al procesar solicitud',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /api/password-reset/confirm/:token
   * Confirma el token y genera nueva contraseña
   */
  @Get('confirm/:token')
  async confirmReset(@Param('token') token: string) {
    try {
      const result = await this.passwordResetService.confirmPasswordReset(token);

      if (!result.success) {
        // Redirigir a página de error
        return `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Error - UPT Chat</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .error { color: #d32f2f; }
            </style>
          </head>
          <body>
            <h1 class="error">Error</h1>
            <p>${result.message}</p>
            <p><a href="https://www.upt.edu.pe">Volver a UPT</a></p>
          </body>
          </html>
        `;
      }

      // Redirigir a página de éxito
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Contraseña Restablecida - UPT Chat</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px;
              background-color: #f5f5f5;
            }
            .success { 
              color: #388e3c; 
              background: white;
              padding: 30px;
              border-radius: 10px;
              max-width: 500px;
              margin: 0 auto;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .icon { font-size: 60px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="success">
            <div class="icon">✅</div>
            <h1>¡Contraseña Restablecida!</h1>
            <p>Tu nueva contraseña ha sido generada y enviada a tu correo electrónico.</p>
            <p>Por favor revisa tu bandeja de entrada.</p>
            <p><strong>Puedes cerrar esta ventana y regresar al chat.</strong></p>
            <p style="margin-top: 30px;">
              <a href="https://www.upt.edu.pe" style="color: #1976d2;">Ir a UPT</a>
            </p>
          </div>
        </body>
        </html>
      `;
    } catch (error) {
      throw new HttpException(
        'Error al confirmar token',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * GET /api/password-reset/status/:sessionId
   * Consulta el estado de una solicitud de reset
   */
  @Get('status/:sessionId')
  async getStatus(@Param('sessionId') sessionId: string) {
    try {
      const status = await this.passwordResetService.getResetStatus(sessionId);
      return status;
    } catch (error) {
      return { status: 'unknown', error: error.message };
    }
  }
}
