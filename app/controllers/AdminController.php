<?php
require_once __DIR__ . '/../../config/session.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class AdminController {
    private $authMiddleware;

    public function __construct() {
        $this->authMiddleware = new AuthMiddleware();
    }

    public function dashboard() {
        // Verificar autenticación y permisos de admin
        $this->authMiddleware->requireAuth();
        $this->authMiddleware->requireAdmin();
        
        // Cargar vista del dashboard de admin
        include __DIR__ . '/../views/admin_dashboard.php';
    }

    public function analytics() {
        // Verificar autenticación y permisos de admin
        $this->authMiddleware->requireAuth();
        $this->authMiddleware->requireAdmin();
        
        // Cargar vista de analytics
        include __DIR__ . '/../views/admin_analytics.php';
    }

    public function faqs() {
        // Verificar autenticación y permisos de admin
        $this->authMiddleware->requireAuth();
        $this->authMiddleware->requireAdmin();
        
        // Cargar vista de FAQs
        include __DIR__ . '/../views/admin_faqs.php';
    }

    public function tickets() {
        // Verificar autenticación y permisos de admin
        $this->authMiddleware->requireAuth();
        $this->authMiddleware->requireAdmin();
        
        // Cargar vista de tickets
        include __DIR__ . '/../views/admin_tickets.php';
    }
}
?>