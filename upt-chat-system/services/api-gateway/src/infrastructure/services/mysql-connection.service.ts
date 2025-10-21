/**
 * MySQL Connection Service
 * Conexión a la base de datos proyectotest (simulación UPT)
 * Implementa RF004 y RF007
 */
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import axios from 'axios';

@Injectable()
export class MySQLConnectionService implements OnModuleInit, OnModuleDestroy {
  private connection: mysql.Connection;
  private readonly logger = new Logger(MySQLConnectionService.name);
  private readonly phpApiBaseUrl: string;

  constructor() {
    this.phpApiBaseUrl = process.env.PHP_API_BASE_URL || 'http://localhost:8000';
    this.logger.log(`✅ PHP API Base URL configured: ${this.phpApiBaseUrl}`);
  }

  async onModuleInit() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'upt_intranet',
      });
      this.logger.log('✅ Conectado a MySQL (proyectotest)');
    } catch (error) {
      this.logger.error('❌ Error conectando a MySQL:', error.message);
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.end();
      this.logger.log('🔌 Desconectado de MySQL');
    }
  }

  /**
   * Verifica si un email PERSONAL existe en la base de datos UPT
   * Llama al endpoint PHP del proyecto test
   */
  async verifyEmailPersonal(emailPersonal: string): Promise<{
    exists: boolean;
    usuario?: string;
    nombreCompleto?: string;
    email?: string;
    codigoUniversitario?: string;
  }> {
    try {
      this.logger.log(`🔍 Verificando email personal: ${emailPersonal}`);
      
      const response = await axios.post(
        `${this.phpApiBaseUrl}/api_verify_email.php`,
        { email_personal: emailPersonal },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      if (response.data.success) {
        this.logger.log(`✅ Email personal encontrado: ${response.data.data.usuario}`);
        return {
          exists: true,
          usuario: response.data.data.usuario,
          nombreCompleto: response.data.data.nombre_completo,
          email: response.data.data.email,
          codigoUniversitario: response.data.data.codigo_universitario || response.data.data.usuario,
        };
      }

      this.logger.log(`❌ Email personal no encontrado: ${emailPersonal}`);
      return { exists: false };
      
    } catch (error) {
      this.logger.error(`❌ Error verificando email personal: ${error.message}`);
      
      if (error.response) {
        this.logger.error(`Response status: ${error.response.status}`);
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      
      return { exists: false };
    }
  }

  /**
   * Actualiza la contraseña de un usuario usando el endpoint PHP
   */
  async updateUserPassword(usuario: string, newPassword: string): Promise<boolean> {
    try {
      this.logger.log(`🔄 Actualizando contraseña para usuario: ${usuario}`);
      
      const response = await axios.post(
        `${this.phpApiBaseUrl}/api_update_password.php`,
        {
          usuario: usuario,
          new_password: newPassword,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        }
      );

      if (response.data.success) {
        this.logger.log(`✅ Contraseña actualizada para: ${usuario}`);
        return true;
      }

      this.logger.error(`❌ Error actualizando contraseña: ${response.data.message}`);
      return false;
      
    } catch (error) {
      this.logger.error(`❌ Error actualizando contraseña: ${error.message}`);
      return false;
    }
  }

  /**
   * Obtiene información de un usuario por email
   */
  async getUserByEmail(email: string): Promise<any | null> {
    try {
      const [rows] = await this.connection.execute(
        'SELECT id, usuario, nombre_completo, email, created_at FROM usuarios WHERE email = ?',
        [email]
      );

      const users = rows as any[];
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  }

  /**
   * Registra un log de acceso
   */
  async logAccess(userId: number, action: string): Promise<void> {
    try {
      await this.connection.execute(
        'INSERT INTO access_logs (user_id, action, ip_address, created_at) VALUES (?, ?, ?, NOW())',
        [userId, action, '127.0.0.1']
      );
    } catch (error) {
      console.error('Error registrando log:', error);
    }
  }
}
