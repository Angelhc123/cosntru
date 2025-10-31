<?php
// Simple router for API endpoints
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Handle API routes
if (preg_match('/^\/api\/v1\/health\/?$/', $path)) {
    require_once 'api/v1/health.php';
    exit();
}

// Handle other API routes if needed
if (preg_match('/^\/api\//', $path)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API endpoint not found']);
    exit();
}

// Default redirect to login for non-API requests
header("Location: login.php");
exit();
?>