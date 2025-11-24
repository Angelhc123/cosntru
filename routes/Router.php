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

        // PRIMERO: Verificar si es un archivo físico (CSS, JS, etc.)
        $publicFile = __DIR__ . '/../public' . $path;
        if (is_file($publicFile)) {
            return false; // Dejar que PHP sirva el archivo directamente
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
            return true;
        }

        if ($path === '/set_captcha') {
            require_once __DIR__ . '/../app/utils/CaptchaUtil.php';
            return true;
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
                require_once $controllerFile;
                
                $controller = new $controllerName();
                $controller->$methodName();
                return;
            }
        }

        // Ruta no encontrada
        $this->handle404();
    }

    private function handle404() {
        http_response_code(404);
        echo "404 - Página no encontrada";
    }
}
?>