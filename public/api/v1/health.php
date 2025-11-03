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

// Health check endpoint - SIMPLIFICADO para Railway
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Verificar conexión a base de datos si está configurada
        $dbStatus = 'not_configured';
        $dbError = null;
        
        $configPath = __DIR__ . '/../../../config/database.php';
        if (file_exists($configPath)) {
            try {
                require_once $configPath;
                $database = new Database();
                $conn = $database->getConnection();
                if ($conn instanceof PDO) {
                    $stmt = $conn->query('SELECT 1');
                    $dbStatus = 'connected';
                }
            } catch (Exception $e) {
                $dbStatus = 'error';
                $dbError = $e->getMessage();
            }
        }

        // Verificar que los directorios necesarios existen
        $basePath = __DIR__ . '/../../..';
        $directories = [
            'config' => is_dir($basePath . '/config'),
            'app' => is_dir($basePath . '/app'),
            'public' => is_dir($basePath . '/public')
        ];

        // Microservicios no son necesarios para el frontend
        $microservices = [
            'status' => 'not_required_for_frontend'
        ];

        // Microservicios no son necesarios para el frontend
        $microservices = [
            'status' => 'not_required_for_frontend'
        ];

        $response = [
            'status' => 'healthy',
            'service' => 'UPT Frontend PHP',
            'timestamp' => date('c'),
            'version' => '1.0.0',
            'environment' => getenv('RAILWAY_ENVIRONMENT') ?: 'production',
            'port' => getenv('PORT') ?: $_SERVER['SERVER_PORT'] ?? '8000',
            'php_version' => PHP_VERSION,
            'database' => $dbStatus,
            'directories' => $directories,
            'components' => [
                'frontend' => 'active',
                'api' => 'active',
                'health_check' => 'active'
            ]
        ];

        // Si hay error de DB, incluirlo en el response pero mantener healthy
        if ($dbError && $dbStatus === 'error') {
            $response['database_error'] = substr($dbError, 0, 200); // Limitar tamaño
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
