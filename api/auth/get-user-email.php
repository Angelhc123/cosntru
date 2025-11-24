<?php
/**
 * API para obtener email del usuario
 * Endpoint: GET /api/auth/get-user-email.php
 */

require_once __DIR__ . '/../../app/controllers/ApiController.php';

$api = new ApiController();
$api->getUserEmail();
?>