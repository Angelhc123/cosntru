<?php
require_once 'config/database.php';

$db = new Database();
$result = $db->testConnection();

echo "Resultado de la conexión:\n";
print_r($result);
?>
