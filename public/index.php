<?php
/**
 * Punto de entrada principal de la aplicación
 * Utiliza el router centralizado para manejar todas las rutas
 * 
 * NOTA: Si el archivo solicitado existe (como archivos PHP en /api/), 
 * se sirve directamente sin pasar por el router
 */

// Si el archivo solicitado existe y no es este index.php, servirlo directamente
$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'] ?? '/';

// Si es un archivo PHP que existe (excepto index.php), ejecutarlo directamente
if ($path !== '/' && $path !== '/index.php') {
    $filePath = __DIR__ . $path;
    if (file_exists($filePath) && is_file($filePath) && pathinfo($filePath, PATHINFO_EXTENSION) === 'php') {
        // Ejecutar el archivo PHP directamente
        require $filePath;
        exit;
    }
}

// Si no es un archivo directo, usar el router
require_once __DIR__ . '/../routes/Router.php';

// Inicializar y ejecutar router
$router = new Router();
$router->handleRequest();
?>