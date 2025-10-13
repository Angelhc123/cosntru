/**
 * MongoDB Schemas para RF004 - Validación por Correo Personal
 * 
 * Colecciones:
 * 1. password_reset_tokens: Tokens de recuperación con TTL
 * 2. validation_notifications: Notificaciones de estado de validación
 */
import { Schema, model } from 'mongoose';

/**
 * Schema para tokens de recuperación de contraseña
 * TTL: 1 hora (expires_at)
 */
const passwordResetTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  session_id: {
    type: String,
    required: true,
    index: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  expires_at: {
    type: Date,
    required: true,
    index: true, // Para índice TTL
  },
  used: {
    type: Boolean,
    default: false,
  },
});

// Crear índice TTL para eliminar automáticamente tokens expirados
passwordResetTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

/**
 * Schema para notificaciones de validación
 * Permite al chatbot consultar el estado de la validación
 */
const validationNotificationSchema = new Schema({
  session_id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'expired', 'error'],
    default: 'pending',
  },
  message: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Crear índice TTL para limpiar notificaciones antiguas (después de 24 horas)
validationNotificationSchema.index({ created_at: 1 }, { expireAfterSeconds: 86400 });

// Exportar modelos
export const PasswordResetToken = model('PasswordResetToken', passwordResetTokenSchema);
export const ValidationNotification = model('ValidationNotification', validationNotificationSchema);

/**
 * Función helper para crear las colecciones e índices
 * Ejecutar al iniciar la aplicación
 */
export async function initializePasswordResetCollections() {
  try {
    // Los índices se crean automáticamente al definir los schemas
    console.log('✅ Colecciones de password reset inicializadas');
  } catch (error) {
    console.error('❌ Error inicializando colecciones:', error);
  }
}
