<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Health check endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $response = [
        'status' => 'healthy',
        'service' => 'UPT Frontend PHP',
        'timestamp' => date('c'),
        'version' => '1.0.0',
        'environment' => getenv('RAILWAY_ENVIRONMENT') ?: 'development'
    ];

    http_response_code(200);
    echo json_encode($response);
    exit();
}

// Method not allowed
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
