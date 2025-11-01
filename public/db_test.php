<?php
require_once '../config/database_railway.php';

echo "<h1>Diagnóstico de Base de Datos - Railway</h1>";

echo "<h2>Variables de Entorno:</h2>";
echo "<pre>";
echo "MYSQL_ADDON_HOST: " . getenv('MYSQL_ADDON_HOST') . "\n";
echo "MYSQL_ADDON_DB: " . getenv('MYSQL_ADDON_DB') . "\n";
echo "MYSQL_ADDON_USER: " . getenv('MYSQL_ADDON_USER') . "\n";
echo "MYSQL_ADDON_PORT: " . getenv('MYSQL_ADDON_PORT') . "\n";
echo "MYSQL_ADDON_PASSWORD: " . (getenv('MYSQL_ADDON_PASSWORD') ? "***SET***" : "NOT SET") . "\n";
echo "APP_ENV: " . getenv('APP_ENV') . "\n";
echo "APP_DEBUG: " . getenv('APP_DEBUG') . "\n";
echo "</pre>";

echo "<h2>Prueba de Conexión:</h2>";
$db = new Database();
$result = $db->testConnection();

echo "<pre>";
print_r($result);
echo "</pre>";

if ($result['success']) {
    echo "<p style='color: green;'>✅ Conexión exitosa</p>";
} else {
    echo "<p style='color: red;'>❌ Error de conexión</p>";
}
?>
