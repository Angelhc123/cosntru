<?php
/**
 * Script de prueba de conexión a la base de datos
 * Ejecutar: php test_connection.php
 */

require_once __DIR__ . '/config/database.php';

echo "==============================================\n";
echo "  PRUEBA DE CONEXIÓN A BASE DE DATOS MYSQL\n";
echo "==============================================\n\n";

// Crear instancia de Database
$database = new Database();

// Probar conexión
echo "📡 Intentando conectar a la base de datos...\n\n";
$result = $database->testConnection();

if ($result['success']) {
    echo "✅ " . $result['message'] . "\n";
    echo "🏠 Host: " . $result['host'] . "\n";
    echo "💾 Database: " . $result['database'] . "\n\n";
    
    // Probar una consulta simple
    try {
        $conn = $database->getConnection();
        $query = "SELECT VERSION() as version, DATABASE() as current_db";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $info = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "🔍 Información adicional:\n";
        echo "   • Versión MySQL: " . $info['version'] . "\n";
        echo "   • Base de datos actual: " . $info['current_db'] . "\n\n";
        
        // Verificar tablas existentes
        $query = "SHOW TABLES";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        echo "📋 Tablas encontradas (" . count($tables) . "):\n";
        if (count($tables) > 0) {
            foreach ($tables as $table) {
                echo "   • " . $table . "\n";
            }
        } else {
            echo "   ⚠️  No hay tablas creadas aún.\n";
            echo "   💡 Ejecuta: mysql < database_setup.sql\n";
        }
        
        echo "\n✨ ¡Conexión completamente funcional!\n";
        
    } catch (Exception $e) {
        echo "⚠️  Conexión establecida pero error al consultar: " . $e->getMessage() . "\n";
    }
    
} else {
    echo "❌ " . $result['message'] . "\n\n";
    echo "📝 Verifica tu archivo .env con las credenciales correctas.\n";
    exit(1);
}

echo "\n==============================================\n";
?>
