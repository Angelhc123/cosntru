/**
 * Email Service - Notification Microservice
 * RF004 - Validación por Correo Personal
 * Responsable de enviar TODOS los emails del sistema
 */
import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  /**
   * Inicializa el transporter de nodemailer con Gmail SMTP
   */
  private initializeTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('GMAIL_USER'),
        pass: this.configService.get<string>('GMAIL_APP_PASSWORD'),
      },
    });

    // Verificar conexión
    this.transporter.verify((error, success) => {
      if (error) {
        this.logger.error('❌ Error configurando email:', error);
      } else {
        this.logger.log('✅ Email service configurado correctamente');
      }
    });
  }

  /**
   * Envía email de confirmación para recuperación de contraseña
   */
  async sendPasswordResetConfirmation(
    to: string,
    userName: string,
    confirmationUrl: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const mailOptions = {
        from: `"${this.configService.get<string>('FROM_NAME')}" <${this.configService.get<string>('FROM_EMAIL')}>`,
        to,
        subject: 'Confirmación de Recuperación de Contraseña - UPT',
        html: this.getPasswordResetConfirmationTemplate(userName, confirmationUrl),
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email de confirmación enviado a ${to}: ${info.messageId}`);
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error(`❌ Error enviando email de confirmación a ${to}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Envía email con la nueva contraseña generada
   */
  async sendNewPassword(
    to: string,
    userName: string,
    newPassword: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const mailOptions = {
        from: `"${this.configService.get<string>('FROM_NAME')}" <${this.configService.get<string>('FROM_EMAIL')}>`,
        to,
        subject: 'Tu Nueva Contraseña - UPT',
        html: this.getNewPasswordTemplate(userName, newPassword),
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email con nueva contraseña enviado a ${to}: ${info.messageId}`);
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error(`❌ Error enviando nueva contraseña a ${to}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Template HTML para confirmación de password reset
   */
  private getPasswordResetConfirmationTemplate(userName: string, confirmationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmación de Recuperación de Contraseña</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #003366; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Universidad Privada de Tacna</h1>
          <p style="color: white; margin: 5px 0;">Sistema de Chat UPT</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
          <h2 style="color: #003366;">Hola ${userName},</h2>
          
          <p>Has solicitado recuperar tu contraseña en el sistema UPT a través del chatbot.</p>
          
          <p><strong>Para confirmar esta solicitud y generar una nueva contraseña, haz clic en el siguiente botón:</strong></p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background-color: #003366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Confirmar Recuperación
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            O copia y pega este enlace en tu navegador:<br>
            <a href="${confirmationUrl}" style="color: #003366;">${confirmationUrl}</a>
          </p>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>⚠️ Importante:</strong> Este enlace expira en 1 hora. Si no solicitaste esta recuperación, ignora este mensaje.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>Universidad Privada de Tacna<br>
          Av. Bolognesi 1177, Tacna - Perú<br>
          <a href="https://www.upt.edu.pe" style="color: #003366;">www.upt.edu.pe</a></p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Template HTML para nueva contraseña
   */
  private getNewPasswordTemplate(userName: string, newPassword: string): string {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tu Nueva Contraseña</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #003366; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Universidad Privada de Tacna</h1>
          <p style="color: white; margin: 5px 0;">Sistema de Chat UPT</p>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd;">
          <h2 style="color: #003366;">¡Contraseña Actualizada! 🔐</h2>
          
          <p>Hola <strong>${userName}</strong>,</p>
          
          <p>Tu contraseña ha sido restablecida exitosamente. A continuación encontrarás tu nueva contraseña temporal:</p>
          
          <div style="background-color: #fff; border: 2px dashed #003366; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #666; font-size: 14px;">Tu nueva contraseña es:</p>
            <p style="margin: 10px 0; font-size: 24px; font-weight: bold; color: #003366; font-family: 'Courier New', monospace;">
              ${newPassword}
            </p>
          </div>
          
          <div style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #155724;">
              <strong>✅ Recomendaciones de seguridad:</strong>
            </p>
            <ul style="margin: 10px 0; color: #155724;">
              <li>Cambia esta contraseña temporal por una personalizada al iniciar sesión</li>
              <li>No compartas tu contraseña con nadie</li>
              <li>Usa una combinación de letras, números y símbolos</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://intranet.upt.edu.pe" 
               style="background-color: #003366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Ir a la Intranet UPT
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Si no solicitaste este cambio, contacta inmediatamente con soporte en 
            <a href="mailto:soporte@upt.edu.pe" style="color: #003366;">soporte@upt.edu.pe</a>
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>Universidad Privada de Tacna<br>
          Av. Bolognesi 1177, Tacna - Perú<br>
          <a href="https://www.upt.edu.pe" style="color: #003366;">www.upt.edu.pe</a></p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Envía email genérico (para futuros usos)
   */
  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const mailOptions = {
        from: `"${this.configService.get<string>('FROM_NAME')}" <${this.configService.get<string>('FROM_EMAIL')}>`,
        to,
        subject,
        html: htmlContent,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`✅ Email enviado a ${to}: ${info.messageId}`);
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      this.logger.error(`❌ Error enviando email a ${to}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
