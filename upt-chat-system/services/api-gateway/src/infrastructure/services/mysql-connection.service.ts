/**
 * MySQL Connection Service
 * Conexión a la base de datos proyectotest (simulación UPT)
 * Implementa RF004 y RF007
 */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class MySQLConnectionService implements OnModuleInit, OnModuleDestroy {
  private connection: mysql.Connection;

  async onModuleInit() {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'upt_intranet',
      });
      console.log('✅ Conectado a MySQL (proyectotest)');
    } catch (error) {
      console.error('❌ Error conectando a MySQL:', error.message);
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.end();
      console.log('🔌 Desconectado de MySQL');
    }
  }

  /**
   * Verifica si un email existe en la base de datos
   */
  async verifyEmail(email: string): Promise<{ exists: boolean; user?: any }> {
    try {
      const [rows] = await this.connection.execute(
        'SELECT id, usuario, nombre_completo, email FROM usuarios WHERE email = ?',
        [email]
      );

      const users = rows as any[];
      
      if (users.length > 0) {
        return {
          exists: true,
          user: {
            id: users[0].id,
            username: users[0].usuario,
            name: users[0].nombre_completo,
            email: users[0].email,
          },
        };
      }

      return { exists: false };
    } catch (error) {
      console.error('Error verificando email:', error);
      throw error;
    }
  }

  /**
   * Actualiza la contraseña de un usuario
   */
  async updatePassword(email: string, newPassword: string): Promise<boolean> {
    try {
      // En producción, deberías hashear la contraseña
      // Para pruebas, guardamos en texto plano
      const [result] = await this.connection.execute(
        'UPDATE usuarios SET password = ?, updated_at = NOW() WHERE email = ?',
        [newPassword, email]
      );

      const updateResult = result as mysql.ResultSetHeader;
      return updateResult.affectedRows > 0;
    } catch (error) {
      console.error('Error actualizando contraseña:', error);
      throw error;
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
