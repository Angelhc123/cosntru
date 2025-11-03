<?php
/**
 * Healthcheck endpoint super simple para Railway
 * Ruta: /health
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Siempre responder OK - Railway solo necesita un 200
http_response_code(200);

echo json_encode([
    'status' => 'ok',
    'service' => 'frontend-php',
    'timestamp' => date('c'),
    'php' => PHP_VERSION
], JSON_PRETTY_PRINT);
exit();
?>
    ];

    http_response_code(200);
    echo json_encode($response);
    exit();
}

// Method not allowed
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
