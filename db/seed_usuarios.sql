-- Script para insertar usuarios de prueba en la base de datos
-- Incluye el usuario alexanderpiero218@gmail.com

USE upt_intranet;

-- Insertar usuario de prueba
INSERT INTO usuarios (usuario, password, nombre_completo, email, email_personal, tipo_usuario, codigo_universitario, carrera, estado)
VALUES 
(
    '2018123456', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password123
    'Alexander Piero',
    '2018123456@upt.edu.pe',
    'alexanderpiero218@gmail.com',
    'estudiante',
    '2018123456',
    'Ingeniería de Sistemas',
    'activo'
)
ON DUPLICATE KEY UPDATE 
    email_personal = 'alexanderpiero218@gmail.com',
    nombre_completo = 'Alexander Piero',
    email = '2018123456@upt.edu.pe';

-- Insertar más usuarios de prueba si es necesario
INSERT INTO usuarios (usuario, password, nombre_completo, email, email_personal, tipo_usuario, codigo_universitario, carrera, estado)
VALUES 
(
    '2019001234',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password123
    'Juan Pérez García',
    '2019001234@upt.edu.pe',
    'juan.perez@gmail.com',
    'estudiante',
    '2019001234',
    'Ingeniería Civil',
    'activo'
),
(
    '2020005678',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password123
    'María González López',
    '2020005678@upt.edu.pe',
    'maria.gonzalez@gmail.com',
    'estudiante',
    '2020005678',
    'Ingeniería Industrial',
    'activo'
)
ON DUPLICATE KEY UPDATE 
    nombre_completo = VALUES(nombre_completo),
    email_personal = VALUES(email_personal);

-- Verificar que los usuarios fueron insertados
SELECT usuario, nombre_completo, email, email_personal FROM usuarios WHERE email_personal IN ('alexanderpiero218@gmail.com', 'juan.perez@gmail.com', 'maria.gonzalez@gmail.com');
