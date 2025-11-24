<?php
/**
 * Middleware de autenticación
 * Maneja la verificación de login y permisos
 */

require_once __DIR__ . '/../../config/session.php';

class AuthMiddleware {
    
    public function requireAuth($redirectTo = '/login') {
        if (!isset($_SESSION['user_id'])) {
            header("Location: $redirectTo");
            exit();
        }
    }

    public function requireAdmin($redirectTo = '/dashboard') {
        $this->requireAuth();
        
        if (!isset($_SESSION['tipo_usuario']) || $_SESSION['tipo_usuario'] !== 'administrativo') {
            header("Location: $redirectTo");
            exit();
        }
    }

    public function requireGuest($redirectTo = '/dashboard') {
        if (isset($_SESSION['user_id'])) {
            // Redirigir según tipo de usuario
            if (isset($_SESSION['tipo_usuario']) && $_SESSION['tipo_usuario'] === 'administrativo') {
                header("Location: /admin");
            } else {
                header("Location: $redirectTo");
            }
            exit();
        }
    }

    public function getCurrentUser() {
        if (!isset($_SESSION['user_id'])) {
            return null;
        }

        return [
            'id' => $_SESSION['user_id'],
            'usuario' => $_SESSION['usuario'] ?? '',
            'nombre_completo' => $_SESSION['nombre_completo'] ?? '',
            'tipo_usuario' => $_SESSION['tipo_usuario'] ?? 'usuario'
        ];
    }

    public function isAdmin() {
        return isset($_SESSION['tipo_usuario']) && $_SESSION['tipo_usuario'] === 'administrativo';
    }

    public function isAuthenticated() {
        return isset($_SESSION['user_id']);
    }
}
?>