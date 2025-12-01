/**
 * Email Service - Notification Microservice
 * RF004 - Validación por Correo Personal
 * Responsable de enviar TODOS los emails del sistema
 */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const SibApiV3Sdk = require('sib-api-v3-sdk');

@Injectable()
export class EmailService {
  private apiInstance: any;
  private readonly logger = new Logger(EmailService.name);
  private fromEmail: string;
  private fromName: string;

  constructor(private configService: ConfigService) {
    this.initializeBrevo();
  }

  /**
   * Inicializa el cliente de Brevo
   */
  private initializeBrevo() {
    const apiKey = this.configService.get<string>('BREVO_API_KEY');
    this.fromEmail = this.configService.get<string>('FROM_EMAIL') || 'xxdescixx@gmail.com';
    this.fromName = this.configService.get<string>('FROM_NAME') || 'UPT Chat System';

    if (!apiKey) {
      this.logger.error('❌ BREVO_API_KEY es requerida');
      throw new Error('BREVO_API_KEY es requerida');
    }

    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKeyAuth = defaultClient.authentications['api-key'];
    apiKeyAuth.apiKey = apiKey;
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    this.logger.log(`📧 Brevo configurado: ${this.fromEmail}`);
    this.logger.log(`✅ Email service listo con Brevo API`);
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
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = { email: this.fromEmail, name: this.fromName };
      sendSmtpEmail.to = [{ email: to, name: userName }];
      sendSmtpEmail.subject = 'Confirmación de Recuperación de Contraseña - UPT';
      sendSmtpEmail.htmlContent = this.getPasswordResetConfirmationTemplate(userName, confirmationUrl);

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      
      this.logger.log(`✅ Email de confirmación enviado a ${to}`);
      this.logger.log(`📧 Brevo Response - MessageID: ${result.messageId}`);
      
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      this.logger.error(`❌ Error enviando email de confirmación a ${to}:`, error);
      this.logger.error(`❌ Brevo Error Details:`, error.response?.body || error.message);
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
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = { email: this.fromEmail, name: this.fromName };
      sendSmtpEmail.to = [{ email: to, name: userName }];
      sendSmtpEmail.subject = 'Tu Nueva Contraseña - UPT';
      sendSmtpEmail.htmlContent = this.getNewPasswordTemplate(userName, newPassword);

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      
      this.logger.log(`✅ Nueva contraseña enviada a ${to}`);
      this.logger.log(`📧 Brevo Response - MessageID: ${result.messageId}`);
      
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      this.logger.error(`❌ Error enviando nueva contraseña a ${to}:`, error);
      this.logger.error(`❌ Brevo Error Details:`, error.response?.body || error.message);
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
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = { email: this.fromEmail, name: this.fromName };
      sendSmtpEmail.to = [{ email: to }];
      sendSmtpEmail.subject = subject;
      sendSmtpEmail.htmlContent = htmlContent;

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      this.logger.log(`✅ Email enviado a ${to}`);
      
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      this.logger.error(`❌ Error enviando email a ${to}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Envía transcripción de conversación del chatbot
   */
  async sendChatTranscription(
    to: string,
    userName: string,
    messages: Array<{ sender: string; text: string; timestamp: string }>,
    sessionEndTime: string,
    sessionId?: string,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
      sendSmtpEmail.sender = { email: this.fromEmail, name: this.fromName };
      sendSmtpEmail.to = [{ email: to, name: userName }];
      sendSmtpEmail.subject = 'Transcripción de tu Conversación con el Asistente Virtual UPT';
      sendSmtpEmail.htmlContent = this.getChatTranscriptionTemplate(userName, messages, sessionEndTime, sessionId);

      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);

      this.logger.log(`✅ Transcripción enviada a ${to}`);
      
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      this.logger.error(`❌ Error enviando transcripción a ${to}:`, error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Template HTML para transcripción de chat
   */
  private getChatTranscriptionTemplate(
    userName: string,
    messages: Array<{ sender: string; text: string; timestamp: string }>,
    sessionEndTime: string,
    sessionId?: string,
  ): string {
    const messagesHtml = messages.map(msg => {
      const isUser = msg.sender === 'user';
      const bgColor = isUser ? '#e3f2fd' : '#f1f8e9';
      const icon = isUser ? '👤' : '🤖';
      const senderLabel = isUser ? 'Tú' : 'Asistente Virtual';
      const date = new Date(msg.timestamp);
      const timeStr = date.toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      return `
        <div style="margin-bottom: 15px; padding: 12px; background-color: ${bgColor}; border-radius: 8px; border-left: 4px solid ${isUser ? '#2196F3' : '#8BC34A'};">
          <div style="font-weight: bold; color: #333; margin-bottom: 5px;">
            ${icon} ${senderLabel}
          </div>
          <div style="color: #555; line-height: 1.5;">
            ${msg.text}
          </div>
          <div style="font-size: 11px; color: #999; margin-top: 8px;">
            ${timeStr}
          </div>
        </div>
      `;
    }).join('');

    const endDate = new Date(sessionEndTime);
    const endTimeStr = endDate.toLocaleString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 20px auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">💬 Transcripción de Conversación</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Asistente Virtual UPT</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <p style="color: #555; font-size: 16px; margin: 0 0 20px 0;">
              Hola <strong>${userName}</strong>,
            </p>
            <p style="color: #666; line-height: 1.6; margin: 0 0 20px 0;">
              A continuación encontrarás la transcripción completa de tu conversación con nuestro asistente virtual.
            </p>

            ${sessionId ? `<p style="color: #999; font-size: 12px; margin: 0 0 20px 0;">ID de sesión: <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${sessionId}</code></p>` : ''}

            <!-- Messages -->
            <div style="margin: 20px 0;">
              ${messagesHtml}
            </div>

            <!-- End time -->
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>🏁 Conversación finalizada:</strong> ${endTimeStr}
              </p>
            </div>

            <div style="margin-top: 25px; padding-top: 25px; border-top: 1px solid #e0e0e0;">
              <p style="color: #999; font-size: 13px; margin: 0; line-height: 1.6;">
                Este correo se generó automáticamente al finalizar tu conversación con el asistente virtual.
                Si tienes alguna consulta adicional, no dudes en contactarnos.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; color: #999; font-size: 12px;">
            <p style="margin: 0;">Universidad Privada de Tacna</p>
            <p style="margin: 5px 0 0 0;">Sistema de Asistencia Virtual</p>
          </div>

        </div>
      </body>
      </html>
    `;
  }
}
