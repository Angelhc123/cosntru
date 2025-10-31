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
    try {
        // Verificar conexión a base de datos si está configurada
        $dbStatus = 'not_configured';
        $dbError = null;
        
        if (file_exists('../../config/database.php')) {
            try {
                require_once '../../config/database.php';
                if (isset($pdo) && $pdo instanceof PDO) {
                    $stmt = $pdo->query('SELECT 1');
                    $dbStatus = 'connected';
                } else {
                    $dbStatus = 'disconnected';
                }
            } catch (Exception $e) {
                $dbStatus = 'error';
                $dbError = $e->getMessage();
            }
        }

        // Verificar que los directorios necesarios existen
        $directories = [
            'logs' => is_dir('../../logs'),
            'config' => is_dir('../../config'),
            'app' => is_dir('../../app'),
            'upt_chat_system' => is_dir('../../upt-chat-system')
        ];

        // Verificar microservicios
        $microservices = [
            'api_gateway' => is_dir('../../upt-chat-system/services/api-gateway/dist'),
            'analytics' => is_dir('../../upt-chat-system/services/analytics-service'),
            'notifications' => is_dir('../../upt-chat-system/services/notification-service'),
            'nlp' => is_dir('../../upt-chat-system/services/nlp-service')
        ];

        // Verificar si API Gateway está respondiendo
        $apiGatewayStatus = 'unknown';
        $apiGatewayPort = getenv('API_GATEWAY_PORT') ?: '3000';
        $apiGatewayUrl = "http://localhost:$apiGatewayPort/health";
        
        $context = stream_context_create([
            'http' => [
                'timeout' => 2,
                'ignore_errors' => true
            ]
        ]);
        
        $apiGatewayResponse = @file_get_contents($apiGatewayUrl, false, $context);
        if ($apiGatewayResponse !== false) {
            $apiGatewayStatus = 'responding';
        } else {
            $apiGatewayStatus = 'not_responding';
        }

        $response = [
            'status' => 'healthy',
            'service' => 'UPT Chat System',
            'timestamp' => date('c'),
            'version' => '1.0.0',
            'environment' => getenv('RAILWAY_ENVIRONMENT') ?: 'development',
            'ports' => [
                'frontend' => getenv('PORT') ?: '8000',
                'api_gateway' => $apiGatewayPort
            ],
            'php_version' => PHP_VERSION,
            'database' => $dbStatus,
            'directories' => $directories,
            'microservices' => $microservices,
            'components' => [
                'frontend' => 'active',
                'api' => 'active',
                'health_check' => 'active',
                'api_gateway' => $apiGatewayStatus
            ]
        ];

        // Si hay error de DB, incluirlo en el response pero mantener healthy
        if ($dbError && $dbStatus === 'error') {
            $response['database_error'] = $dbError;
        }

        http_response_code(200);
        echo json_encode($response, JSON_PRETTY_PRINT);
        exit();
        
    } catch (Exception $e) {
        $response = [
            'status' => 'unhealthy',
            'service' => 'UPT Chat System',
            'timestamp' => date('c'),
            'error' => $e->getMessage()
        ];
        
        http_response_code(503);
        echo json_encode($response, JSON_PRETTY_PRINT);
        exit();
    }
}

// Method not allowed
http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
?>
