<?php
// Mostrar las variables de entorno que se están usando
echo "Variables de entorno:\n";
echo "MYSQL_ADDON_HOST: " . getenv('MYSQL_ADDON_HOST') . "\n";
echo "MYSQL_ADDON_DB: " . getenv('MYSQL_ADDON_DB') . "\n";
echo "MYSQL_ADDON_USER: " . getenv('MYSQL_ADDON_USER') . "\n";
echo "MYSQL_ADDON_PORT: " . getenv('MYSQL_ADDON_PORT') . "\n";
echo "MYSQL_ADDON_PASSWORD: " . (getenv('MYSQL_ADDON_PASSWORD') ? '***SET***' : 'NOT SET') . "\n";

// Verificar si el archivo .env existe
echo "\nArchivo .env existe: " . (file_exists('.env') ? 'SI' : 'NO') . "\n";

// Mostrar contenido del .env si existe
if (file_exists('.env')) {
    echo "Contenido del .env:\n";
    echo file_get_contents('.env') . "\n";
}
?>
