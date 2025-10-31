-- Script SQL para crear las tablas necesarias del sistema
-- Base de datos: upt_intranet (simula el sistema de la UPT)

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL COMMENT 'Email institucional UPT',
    email_personal VARCHAR(100) DEFAULT NULL COMMENT 'Email personal para recuperación de contraseña',
    tipo_usuario ENUM('estudiante', 'docente', 'administrativo') DEFAULT 'estudiante',
    codigo_universitario VARCHAR(20) DEFAULT NULL COMMENT 'Código único del estudiante/docente',
    carrera VARCHAR(100) DEFAULT NULL,
    estado ENUM('activo', 'inactivo', 'egresado') DEFAULT 'activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar usuarios de prueba (contraseña por defecto: "password" para todos)
-- Hash generado con: password_hash('password', PASSWORD_DEFAULT)

-- Usuario demo original
INSERT INTO usuarios (usuario, password, nombre_completo, email, email_personal, tipo_usuario, codigo_universitario, carrera, estado) 
VALUES ('demo', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Usuario Demo', 'demo@example.com', 'demo.personal@gmail.com', 'estudiante', NULL, NULL, 'activo')
ON DUPLICATE KEY UPDATE usuario = usuario;

-- ESTUDIANTES UPT
INSERT INTO usuarios (usuario, password, nombre_completo, email, email_personal, tipo_usuario, codigo_universitario, carrera, estado) VALUES
('2020068376', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan Carlos Pérez Mamani', '2020068376@upt.edu.pe', 'juanperez@gmail.com', 'estudiante', '2020068376', 'Ingeniería de Sistemas', 'activo'),
('2021054832', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María Elena Flores Quispe', '2021054832@upt.edu.pe', 'mariaflores@outlook.com', 'estudiante', '2021054832', 'Ingeniería Civil', 'activo'),
('2019073245', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos Alberto Fernández Ramos', '2019073245@upt.edu.pe', 'carlosfernandez@hotmail.com', 'estudiante', '2019073245', 'Arquitectura', 'activo'),
('2022081567', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana Lucía Torres Vargas', '2022081567@upt.edu.pe', 'anatorres@yahoo.com', 'estudiante', '2022081567', 'Derecho', 'activo'),
('2020045123', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Roberto Martínez Condori', '2020045123@upt.edu.pe', 'robertomartinez@gmail.com', 'estudiante', '2020045123', 'Ingeniería Industrial', 'activo'),
('2021067891', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sofía Andrea Huamán Puma', '2021067891@upt.edu.pe', 'sofiahuaman@gmail.com', 'estudiante', '2021067891', 'Contabilidad', 'activo'),
('2018092345', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Diego Alonso Ccama Apaza', '2018092345@upt.edu.pe', 'diegoccama@outlook.com', 'estudiante', '2018092345', 'Ingeniería de Sistemas', 'egresado'),
('2022034567', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Valentina Ramos Ticona', '2022034567@upt.edu.pe', 'valentinaramos@gmail.com', 'estudiante', '2022034567', 'Administración', 'activo'),
('2020058734', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Luis Fernando Quispe Mamani', '2020058734@upt.edu.pe', 'luisquispe@hotmail.com', 'estudiante', '2020058734', 'Ingeniería Mecánica', 'activo'),
('2021076543', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Camila Andrea Sánchez Cruz', '2021076543@upt.edu.pe', 'camilasanchez@gmail.com', 'estudiante', '2021076543', 'Psicología', 'activo')
ON DUPLICATE KEY UPDATE usuario = usuario;

-- DOCENTES UPT
INSERT INTO usuarios (usuario, password, nombre_completo, email, email_personal, tipo_usuario, codigo_universitario, carrera, estado) VALUES
('prof001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dr. José Antonio Mendoza Silva', 'jmendoza@upt.pe', 'josemendoza@gmail.com', 'docente', 'DOC-2015-001', 'Ingeniería de Sistemas', 'activo'),
('prof002', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mg. Patricia Elena Huamán Torres', 'phuaman@upt.pe', 'patriciahuaman@outlook.com', 'docente', 'DOC-2017-002', 'Derecho', 'activo'),
('prof003', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ing. Carlos Eduardo Pari Mamani', 'cpari@upt.pe', 'carlospari@gmail.com', 'docente', 'DOC-2018-003', 'Ingeniería Civil', 'activo'),
('prof004', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Dra. Rosa María Vargas Quispe', 'rvargas@upt.pe', 'rosavargas@yahoo.com', 'docente', 'DOC-2016-004', 'Contabilidad', 'activo'),
('prof005', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mg. Fernando Alonso Ccama Cruz', 'fccama@upt.pe', 'fernandoccama@gmail.com', 'docente', 'DOC-2019-005', 'Arquitectura', 'activo')
ON DUPLICATE KEY UPDATE usuario = usuario;

-- PERSONAL ADMINISTRATIVO
INSERT INTO usuarios (usuario, password, nombre_completo, email, email_personal, tipo_usuario, codigo_universitario, carrera, estado) VALUES
('admin001', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lic. Carmen Rosa López Ticona', 'clopez@upt.pe', 'carmenlopez@gmail.com', 'administrativo', 'ADM-2014-001', 'Secretaría Académica', 'activo'),
('admin002', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sr. Miguel Angel Torres Ramos', 'mtorres@upt.pe', 'migueltorres@outlook.com', 'administrativo', 'ADM-2016-002', 'Soporte Técnico', 'activo'),
('admin003', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Lic. Gabriela Fernández Puma', 'gfernandez@upt.pe', 'gabrielafernandez@gmail.com', 'administrativo', 'ADM-2015-003', 'Biblioteca', 'activo')
ON DUPLICATE KEY UPDATE usuario = usuario;

-- Crear tabla de sesiones (opcional para manejo avanzado de sesiones)
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Crear tabla de logs de acceso (para auditoría)
CREATE TABLE IF NOT EXISTS access_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Índices para mejor rendimiento
CREATE INDEX idx_usuarios_usuario ON usuarios(usuario);
CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_logs_user_id ON access_logs(user_id);
CREATE INDEX idx_logs_created_at ON access_logs(created_at);