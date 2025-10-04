import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

/**
 * Configuración de Winston Logger
 * 
 * Niveles de log:
 * - error: Errores críticos que necesitan atención inmediata
 * - warn: Advertencias, situaciones inesperadas pero no críticas
 * - info: Información general del flujo de la aplicación
 * - debug: Información detallada para debugging
 * - verbose: Información muy detallada
 */

const logLevel = process.env.LOG_LEVEL || 'info';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Formato para desarrollo (legible, con colores)
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.ms(),
  nestWinstonModuleUtilities.format.nestLike('UPT-Chat-API', {
    colors: true,
    prettyPrint: true,
  }),
);

// Formato para producción (JSON estructurado)
const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

// Transports para desarrollo
const developmentTransports = [
  new winston.transports.Console({
    format: developmentFormat,
  }),
];

// Transports para producción
const productionTransports = [
  // Console (para Railway/Render logs)
  new winston.transports.Console({
    format: productionFormat,
  }),
  // Archivo para errores
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: productionFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  // Archivo para todos los logs
  new winston.transports.File({
    filename: 'logs/combined.log',
    format: productionFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

export const winstonConfig = {
  level: logLevel,
  format: isDevelopment ? developmentFormat : productionFormat,
  transports: isDevelopment ? developmentTransports : productionTransports,
  exitOnError: false,
};
