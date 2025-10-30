<?php
// Router básico para el servidor PHP integrado
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);

// Eliminar parámetros de query string
$path = strtok($path, '?');

// Handle API routes
if ($path === '/api/v1/health') {
    require_once __DIR__ . '/api/v1/health.php';
    return;
}

// Handle health check directo
if ($path === '/health.php' || $path === '/health') {
    require_once __DIR__ . '/health.php';
    return;
}

// Check if it's a real file
$filePath = __DIR__ . $path;
if (is_file($filePath)) {
    return false; // Let PHP serve the file
}

// Default behavior for non-API requests
if ($path === '/' || $path === '/index.php') {
    header("Location: login.php");
    exit();
}

// 404 for everything else
http_response_code(404);
echo "404 - Page not found";
?>