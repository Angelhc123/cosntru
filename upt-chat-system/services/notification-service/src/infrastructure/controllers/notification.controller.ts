/**
 * Notification Controller - Notification Microservice
 * RF004 - Endpoints REST para envío de emails
 */
import { Controller, Post, Body, Get, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { EmailService } from '../../application/services/email.service';
import {
  SendPasswordResetConfirmationDto,
  SendNewPasswordDto,
  SendGenericEmailDto,
  EmailResponseDto,
} from '../../application/dtos/notification.dto';

@Controller('api/notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * POST /api/notifications/email/password-reset-confirmation
   * Envía email de confirmación para recuperación de contraseña
   */
  @Post('email/password-reset-confirmation')
  async sendPasswordResetConfirmation(
    @Body() dto: SendPasswordResetConfirmationDto,
  ): Promise<EmailResponseDto> {
    this.logger.log(`Enviando email de confirmación a: ${dto.to}`);
    
    try {
      const result = await this.emailService.sendPasswordResetConfirmation(
        dto.to,
        dto.userName,
        dto.confirmationUrl,
      );

      if (!result.success) {
        throw new HttpException(
          result.error || 'Error enviando email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
      throw new HttpException(
        error.message || 'Error enviando email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/notifications/email/new-password
   * Envía email con nueva contraseña generada
   */
  @Post('email/new-password')
  async sendNewPassword(@Body() dto: SendNewPasswordDto): Promise<EmailResponseDto> {
    this.logger.log(`Enviando nueva contraseña a: ${dto.to}`);
    
    try {
      const result = await this.emailService.sendNewPassword(
        dto.to,
        dto.userName,
        dto.newPassword,
      );

      if (!result.success) {
        throw new HttpException(
          result.error || 'Error enviando email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
      throw new HttpException(
        error.message || 'Error enviando email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/notifications/email/send
   * Envía email genérico (para futuros casos de uso)
   */
  @Post('email/send')
  async sendGenericEmail(@Body() dto: SendGenericEmailDto): Promise<EmailResponseDto> {
    this.logger.log(`Enviando email genérico a: ${dto.to}`);
    
    try {
      const result = await this.emailService.sendEmail(
        dto.to,
        dto.subject,
        dto.htmlContent,
      );

      if (!result.success) {
        throw new HttpException(
          result.error || 'Error enviando email',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
      throw new HttpException(
        error.message || 'Error enviando email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/notifications/health
   * Health check del servicio
   */
  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      service: 'notification-service',
      port: process.env.PORT || 3005,
      timestamp: new Date().toISOString(),
    };
  }
}
