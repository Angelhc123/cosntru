<?php
require_once 'config/database_mysqlnd.php';

$db = new Database();
$result = $db->testConnection();

echo "Resultado de la conexión:\n";
print_r($result);

// Mostrar las variables de entorno que se están usando
echo "\nVariables de entorno:\n";
echo "MYSQL_ADDON_HOST: " . getenv('MYSQL_ADDON_HOST') . "\n";
echo "MYSQL_ADDON_DB: " . getenv('MYSQL_ADDON_DB') . "\n";
echo "MYSQL_ADDON_USER: " . getenv('MYSQL_ADDON_USER') . "\n";
echo "MYSQL_ADDON_PORT: " . getenv('MYSQL_ADDON_PORT') . "\n";
echo "MYSQL_ADDON_PASSWORD: " . (getenv('MYSQL_ADDON_PASSWORD') ? '***SET***' : 'NOT SET') . "\n";
?>
