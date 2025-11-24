<?php
/**
 * API Endpoint para verificar email
 * Endpoint: POST /api/auth/verify-email.php
 */

require_once __DIR__ . '/../../app/controllers/ApiController.php';

$api = new ApiController();
$api->verifyEmail();
?>