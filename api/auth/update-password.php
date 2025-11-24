<?php
/**
 * API Endpoint para actualizar contraseña
 * Endpoint: POST /api/auth/update-password.php
 */

require_once __DIR__ . '/../../app/controllers/ApiController.php';

$api = new ApiController();
$api->updatePassword();
?>