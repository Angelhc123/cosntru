-- Script de migración para agregar nuevos campos a tabla usuarios existente
-- Base de datos: upt_intranet (simula el sistema de la UPT)

-- Verificar y agregar columnas nuevas si no existen
SET @dbname = DATABASE();
SET @tablename = 'usuarios';

-- Agregar email_personal
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = 'email_personal') > 0,
  'SELECT 1',
  'ALTER TABLE usuarios ADD COLUMN email_personal VARCHAR(100) DEFAULT NULL COMMENT "Email personal para recuperación de contraseña"'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Agregar tipo_usuario
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = 'tipo_usuario') > 0,
  'SELECT 1',
  'ALTER TABLE usuarios ADD COLUMN tipo_usuario ENUM("estudiante", "docente", "administrativo") DEFAULT "estudiante"'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Agregar codigo_universitario
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = 'codigo_universitario') > 0,
  'SELECT 1',
  'ALTER TABLE usuarios ADD COLUMN codigo_universitario VARCHAR(20) DEFAULT NULL COMMENT "Código único del estudiante/docente"'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Agregar carrera
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = 'carrera') > 0,
  'SELECT 1',
  'ALTER TABLE usuarios ADD COLUMN carrera VARCHAR(100) DEFAULT NULL'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Agregar estado
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = 'estado') > 0,
  'SELECT 1',
  'ALTER TABLE usuarios ADD COLUMN estado ENUM("activo", "inactivo", "egresado") DEFAULT "activo"'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Agregar updated_at
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = @dbname
    AND TABLE_NAME = @tablename
    AND COLUMN_NAME = 'updated_at') > 0,
  'SELECT 1',
  'ALTER TABLE usuarios ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
));
PREPARE alterStatement FROM @preparedStatement;
EXECUTE alterStatement;
DEALLOCATE PREPARE alterStatement;

-- Mostrar estructura final
DESCRIBE usuarios;
