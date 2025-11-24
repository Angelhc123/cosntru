<?php
require_once __DIR__ . '/../../config/session.php';
require_once __DIR__ . '/../../config/routes.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class DashboardController {
    private $authMiddleware;

    public function __construct() {
        $this->authMiddleware = new AuthMiddleware();
    }

    public function index() {
        // Verificar autenticación
        $this->authMiddleware->requireAuth();
        
        // Cargar vista del dashboard
        include __DIR__ . '/../views/dashboard.php';
    }

    public function academico() {
        // Verificar autenticación
        $this->authMiddleware->requireAuth();
        
        // Cargar vista del módulo académico
        include __DIR__ . '/../views/academico.php';
    }
}
?>