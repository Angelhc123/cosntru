<?php
// Simple healthcheck sin dependencias
header('Content-Type: application/json');
http_response_code(200);
echo json_encode([
    'status' => 'ok',
    'message' => 'Service is healthy',
    'timestamp' => date('Y-m-d H:i:s')
]);
