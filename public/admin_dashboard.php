<?php
require_once __DIR__ . '/../config/session.php';

// Verificar que esté logeado
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

// Verificar que sea administrativo
if (!isset($_SESSION['tipo_usuario']) || $_SESSION['tipo_usuario'] !== 'administrativo') {
    header("Location: dashboard.php");  // Redirigir a dashboard normal
    exit();
}

include '../app/views/admin_dashboard.php';
?>
