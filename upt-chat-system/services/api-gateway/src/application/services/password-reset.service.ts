/**
 * Password Reset Service
 * Implementa RF004 - Validación por Correo Personal
 * Lógica de negocio para recuperación de contraseña
 */
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MySQLConnectionService } from '../../infrastructure/services/mysql-connection.service';
import * as crypto from 'crypto';
import axios from 'axios';

interface PasswordResetToken {
  token: string;
  email: string;
  session_id: string;
  created_at: Date;
  expires_at: Date;
  used: boolean;
}

interface ValidationNotification {
  session_id: string;
  status: 'pending' | 'confirmed' | 'expired' | 'error';
  message: string;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class PasswordResetService {
  private readonly logger = new Logger(PasswordResetService.name);
  private readonly notificationServiceUrl: string;

  constructor(
    @InjectModel('PasswordResetToken') private tokenModel: Model<PasswordResetToken>,
    @InjectModel('ValidationNotification') private notificationModel: Model<ValidationNotification>,
    private readonly mysqlService: MySQLConnectionService,
  ) {
    this.notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3005';
  }

  /**
   * Verifica si un email personal existe en la base de datos UPT
   * RF004 - Validación por Correo Personal
   */
  async verifyEmailPersonal(emailPersonal: string): Promise<{
    exists: boolean;
    usuario?: string;
    nombreCompleto?: string;
    email?: string;
    codigoUniversitario?: string;
  }> {
    return await this.mysqlService.verifyEmailPersonal(emailPersonal);
  }

  /**
   * Genera un token seguro aleatorio
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Genera una contraseña segura aleatoria
   */
  private generateSecurePassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    let password = '';
    
    // Asegurar al menos un carácter de cada tipo
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    password += '0123456789'[Math.floor(Math.random() * 10)];
    password += '!@#$%&*'[Math.floor(Math.random() * 7)];
    
    // Completar el resto
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Mezclar caracteres
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Inicia el proceso de recuperación de contraseña
   */
  async initiatePasswordReset(email: string, sessionId: string): Promise<any> {
    try {
      // 1. Verificar que el email personal existe
      const verification = await this.mysqlService.verifyEmailPersonal(email);
      
      if (!verification.exists) {
        return {
          success: false,
          message: 'Email personal no encontrado en el sistema',
        };
      }

      // 2. Generar token único
      const token = this.generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // Expira en 1 hora

      // 3. Guardar token en MongoDB
      await this.tokenModel.create({
        token,
        email,
        session_id: sessionId,
        created_at: new Date(),
        expires_at: expiresAt,
        used: false,
      });

      // 4. Crear notificación pendiente
      await this.notificationModel.create({
        session_id: sessionId,
        status: 'pending',
        message: 'Esperando confirmación por email',
        created_at: new Date(),
        updated_at: new Date(),
      });

      // 5. Enviar email de confirmación via Notification Service
      const confirmationUrl = `${process.env.API_GATEWAY_URL || 'http://localhost:3000'}/api/v1/password-reset/confirm/${token}`;
      
      try {
        await axios.post(`${this.notificationServiceUrl}/api/notifications/email/password-reset-confirmation`, {
          to: email,
          userName: verification.nombreCompleto,
          confirmationUrl,
        });
        this.logger.log(`✅ Email de confirmación enviado a ${email}`);
      } catch (error) {
        this.logger.error(`❌ Error enviando email: ${error.message}`);
        // No fallar el proceso si falla el email
      }

      return {
        success: true,
        token,
        message: 'Email de confirmación enviado',
      };
    } catch (error) {
      console.error('Error en initiatePasswordReset:', error);
      return {
        success: false,
        message: 'Error al procesar solicitud',
      };
    }
  }

  /**
   * Confirma el token y genera nueva contraseña
   */
  async confirmPasswordReset(token: string): Promise<any> {
    try {
      // 1. Buscar token
      const tokenDoc = await this.tokenModel.findOne({ token, used: false });

      if (!tokenDoc) {
        return {
          success: false,
          message: 'Token inválido o ya utilizado',
        };
      }

      // 2. Verificar expiración
      if (new Date() > tokenDoc.expires_at) {
        await this.notificationModel.updateOne(
          { session_id: tokenDoc.session_id },
          { status: 'expired', updated_at: new Date() }
        );
        
        return {
          success: false,
          message: 'El token ha expirado. Por favor solicita uno nuevo.',
        };
      }

      // 3. Generar nueva contraseña
      const newPassword = this.generateSecurePassword();

      // 4. Obtener información del usuario por email personal
      const userInfo = await this.mysqlService.verifyEmailPersonal(tokenDoc.email);
      
      if (!userInfo.exists || !userInfo.usuario) {
        return {
          success: false,
          message: 'Usuario no encontrado',
        };
      }

      // 5. Actualizar contraseña en MySQL usando el nombre de usuario
      const updated = await this.mysqlService.updateUserPassword(
        userInfo.usuario,
        newPassword
      );

      if (!updated) {
        return {
          success: false,
          message: 'Error al actualizar contraseña',
        };
      }

      // 6. Marcar token como usado
      await this.tokenModel.updateOne(
        { token },
        { used: true }
      );

      // 7. Actualizar notificación
      await this.notificationModel.updateOne(
        { session_id: tokenDoc.session_id },
        { 
          status: 'confirmed', 
          message: 'Contraseña actualizada exitosamente',
          updated_at: new Date() 
        }
      );

      // 8. Enviar email con nueva contraseña via Notification Service
      try {
        await axios.post(`${this.notificationServiceUrl}/api/notifications/email/new-password`, {
          to: tokenDoc.email,
          userName: userInfo.nombreCompleto,
          newPassword,
        });
        this.logger.log(`✅ Email con nueva contraseña enviado a ${tokenDoc.email}`);
      } catch (error) {
        this.logger.error(`❌ Error enviando email: ${error.message}`);
      }

      // 9. Registrar log de acceso (opcional)
      try {
        const user = await this.mysqlService.getUserByEmail(tokenDoc.email);
        if (user && user.id) {
          await this.mysqlService.logAccess(user.id, 'password_reset');
        }
      } catch (error) {
        this.logger.warn(`⚠️ No se pudo registrar log de acceso: ${error.message}`);
      }

      return {
        success: true,
        message: 'Contraseña actualizada y enviada por email',
      };
    } catch (error) {
      console.error('Error en confirmPasswordReset:', error);
      return {
        success: false,
        message: 'Error al confirmar token',
      };
    }
  }

  /**
   * Consulta el estado de una solicitud de reset
   */
  async getResetStatus(sessionId: string): Promise<any> {
    try {
      const notification = await this.notificationModel.findOne({
        session_id: sessionId,
      });

      if (!notification) {
        return { status: 'unknown' };
      }

      return {
        status: notification.status,
        message: notification.message,
        updated_at: notification.updated_at,
      };
    } catch (error) {
      console.error('Error en getResetStatus:', error);
      return { status: 'error', error: error.message };
    }
  }
}
