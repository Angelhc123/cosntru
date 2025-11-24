<?php
/**
 * Archivo de configuración de rutas
 * Define todas las rutas de la aplicación de forma centralizada
 */

class AppConfig {
    // URLs base
    const BASE_URL = '';
    
    // Rutas de autenticación
    const LOGIN_URL = '/login';
    const LOGOUT_URL = '/logout';
    const DASHBOARD_URL = '/dashboard';
    const ADMIN_URL = '/admin';
    
    // Rutas de vistas
    const ACADEMICO_URL = '/academico';
    const ALUMNO_URL = '/alumno';
    const ADMIN_ANALYTICS_URL = '/admin/analytics';
    const ADMIN_FAQS_URL = '/admin/faqs';
    const ADMIN_TICKETS_URL = '/admin/tickets';
    
    // URLs de API
    const API_UPDATE_PASSWORD = '/api/auth/update-password';
    const API_VERIFY_EMAIL = '/api/auth/verify-email';
    const API_GET_USER_EMAIL = '/api/auth/get-user-email';
    
    // Utilidades
    const CAPTCHA_URL = '/captcha';
    const HEALTH_CHECK_URL = '/health';
    
    /**
     * Obtener URL completa
     */
    public static function url($path) {
        return self::BASE_URL . $path;
    }
    
    /**
     * Redirigir a una ruta
     */
    public static function redirect($path, $permanent = false) {
        $code = $permanent ? 301 : 302;
        header("Location: " . self::url($path), true, $code);
        exit();
    }
}
?>