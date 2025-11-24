<?php
/**
 * Punto de entrada principal de la aplicación
 * Utiliza el router centralizado para manejar todas las rutas
 */

require_once __DIR__ . '/../routes/Router.php';

// Inicializar y ejecutar router
$router = new Router();
$router->handleRequest();
?>