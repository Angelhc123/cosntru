<?php
// Health check super simple para Railway
header('Content-Type: application/json');
http_response_code(200);

echo json_encode([
    'status' => 'healthy',
    'service' => 'frontend-php',
    'timestamp' => date('Y-m-d H:i:s'),
    'port' => $_SERVER['SERVER_PORT'] ?? 'unknown',
    'host' => $_SERVER['HTTP_HOST'] ?? 'unknown'
]);
?>