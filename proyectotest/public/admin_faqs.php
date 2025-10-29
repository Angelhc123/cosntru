<?php
require_once __DIR__ . '/../config/session.php';

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// Verificar que el usuario sea administrativo
if (!isset($_SESSION['tipo_usuario']) || $_SESSION['tipo_usuario'] !== 'administrativo') {
    header('Location: dashboard.php');
    exit;
}

// Incluir la vista de gestión de FAQs
include '../app/views/admin_faqs.php';
?>
