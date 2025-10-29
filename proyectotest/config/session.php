<?php
/**
 * Configuración segura de sesiones
 * 🔒 SEGURIDAD: La sesión expira al cerrar el navegador
 */

// Configurar parámetros de sesión ANTES de iniciarla
ini_set('session.cookie_lifetime', 0);  // Expira al cerrar navegador
ini_set('session.gc_maxlifetime', 1440);  // 24 minutos de inactividad
ini_set('session.cookie_httponly', 1);  // Protección XSS
ini_set('session.use_strict_mode', 1);  // Prevenir session fixation

// Iniciar sesión solo si no está iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
