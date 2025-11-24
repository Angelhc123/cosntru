<?php
/**
 * Router centralizado de la aplicación
 * Maneja todas las rutas y dirige a los controladores apropiados
 */

class Router {
    private $routes = [];
    private $middlewares = [];

    public function __construct() {
        $this->registerRoutes();
    }

    private function registerRoutes() {
        // Rutas de autenticación
        $this->routes = [
            'GET' => [
                '/' => ['AuthController', 'showLogin'],
                '/login' => ['AuthController', 'showLogin'],
                '/dashboard' => ['DashboardController', 'index'],
                '/academico' => ['DashboardController', 'academico'],
                '/alumno' => ['DashboardController', 'alumno'],
                '/admin' => ['AdminController', 'dashboard'],
                '/admin/analytics' => ['AdminController', 'analytics'],
                '/admin/faqs' => ['AdminController', 'faqs'],
                '/admin/tickets' => ['AdminController', 'tickets'],
                '/logout' => ['AuthController', 'logout'],
            ],
            'POST' => [
                '/login' => ['AuthController', 'login'],
            ],
            'API' => [
                '/api/auth/update-password' => 'api/auth/update-password.php',
                '/api/auth/verify-email' => 'api/auth/verify-email.php',
                '/api/auth/get-user-email' => 'api/auth/get-user-email.php',
                '/api/v1/health' => 'public/api/v1/health.php',
            ]
        ];
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // Eliminar parámetros de query string
        $path = strtok($path, '?');

        // Debug temporal - comentar en producción
        // error_log("Router Debug - Method: $method, Path: $path");

        // PRIMERO: Verificar si es un archivo físico (CSS, JS, imágenes, etc.)
        // En Railway con php -S, necesitamos servir estos archivos directamente
        $publicFile = __DIR__ . '/../public' . $path;
        if (is_file($publicFile) && preg_match('/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|map)$/i', $path)) {
            // Servir el archivo estático con el tipo MIME correcto
            $this->serveStaticFile($publicFile, $path);
            return;
        }

        // Manejar rutas API
        if (strpos($path, '/api/') === 0) {
            $this->handleApiRoute($path);
            return;
        }

        // Manejar rutas especiales (captcha, etc.)
        if ($this->handleSpecialRoutes($path)) {
            return;
        }

        // Manejar rutas de la aplicación
        $this->handleAppRoute($method, $path);
    }

    private function serveStaticFile($filePath, $requestPath) {
        // Determinar tipo MIME
        $extension = strtolower(pathinfo($requestPath, PATHINFO_EXTENSION));
        $mimeTypes = [
            'css' => 'text/css',
            'js' => 'application/javascript',
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'woff' => 'font/woff',
            'woff2' => 'font/woff2',
            'ttf' => 'font/ttf',
            'eot' => 'application/vnd.ms-fontobject',
            'map' => 'application/json'
        ];

        $mimeType = $mimeTypes[$extension] ?? 'application/octet-stream';
        
        header('Content-Type: ' . $mimeType);
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    }

    private function handleApiRoute($path) {
        if (isset($this->routes['API'][$path])) {
            $file = __DIR__ . '/../' . $this->routes['API'][$path];
            if (file_exists($file)) {
                require_once $file;
                return;
            }
        }
        
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'API endpoint not found']);
    }

    private function handleSpecialRoutes($path) {
        // Rutas especiales para utilidades
        if ($path === '/captcha') {
            require_once __DIR__ . '/../app/utils/CaptchaUtil.php';
            CaptchaUtil::generate();
            exit;
        }

        if ($path === '/set_captcha') {
            require_once __DIR__ . '/../app/utils/CaptchaUtil.php';
            CaptchaUtil::generate();
            exit;
        }

        return false;
    }



    private function handleAppRoute($method, $path) {
        if (isset($this->routes[$method][$path])) {
            $route = $this->routes[$method][$path];
            $controllerName = $route[0];
            $methodName = $route[1];

            // Incluir el controlador
            $controllerFile = __DIR__ . "/../app/controllers/{$controllerName}.php";
            if (file_exists($controllerFile)) {
                // Incluir dependencias necesarias
                require_once __DIR__ . '/../config/database.php';
                require_once $controllerFile;
                
                $controller = new $controllerName();
                $controller->$methodName();
                return;
            } else {
                error_log("Controller file not found: " . $controllerFile);
            }
        } else {
            error_log("Route not found: " . $method . " " . $path);
        }

        // Ruta no encontrada
        $this->handle404();
    }

    private function handle404() {
        http_response_code(404);
        $path = $_SERVER['REQUEST_URI'] ?? 'unknown';
        $method = $_SERVER['REQUEST_METHOD'] ?? 'unknown';
        
        echo "<!DOCTYPE html>
<html lang='es'>
<head>
    <meta charset='UTF-8'>
    <title>404 - Página no encontrada</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        h1 { color: #d9534f; }
        .error-details { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; }
        code { background: #e7e7e7; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>404 - Página no encontrada</h1>
    <p>La ruta solicitada no existe en el sistema.</p>
    <div class='error-details'>
        <strong>Método:</strong> <code>{$method}</code><br>
        <strong>Ruta:</strong> <code>{$path}</code>
    </div>
    <p><a href='/login'>Volver al inicio de sesión</a></p>
</body>
</html>";
    }
}
?>