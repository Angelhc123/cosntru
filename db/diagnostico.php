<?php
/**
 * Script de diagnóstico para verificar la conexión y datos de la BD
 * Acceder a: /db/diagnostico.php
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../app/models/User.php';

try {
    echo "<h1>🔍 Diagnóstico de Base de Datos</h1>";
    
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);
    
    echo "<h2>✅ Conexión Exitosa</h2>";
    
    // Mostrar configuración (SIN contraseña)
    echo "<h3>📋 Configuración:</h3>";
    echo "<ul>";
    echo "<li>Host: " . (getenv('MYSQL_ADDON_HOST') ?: 'localhost') . "</li>";
    echo "<li>Base de datos: " . (getenv('MYSQL_ADDON_DB') ?: 'proyectotest') . "</li>";
    echo "<li>Usuario: " . (getenv('MYSQL_ADDON_USER') ?: 'root') . "</li>";
    echo "<li>Puerto: " . (getenv('MYSQL_ADDON_PORT') ?: '3306') . "</li>";
    echo "</ul>";
    
    // Verificar si la tabla existe
    echo "<h3>📊 Verificación de Tabla:</h3>";
    $stmt = $db->query("SHOW TABLES LIKE 'usuarios'");
    $tableExists = $stmt->rowCount() > 0;
    
    if ($tableExists) {
        echo "✅ Tabla 'usuarios' existe<br>";
        
        // Contar usuarios
        $stmt = $db->query("SELECT COUNT(*) as total FROM usuarios");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "👥 Total de usuarios: " . $count['total'] . "<br><br>";
        
        // Buscar el email específico
        echo "<h3>🔍 Búsqueda de Email: angelhernandez3@gmail.com</h3>";
        $email = 'angelhernandez3@gmail.com';
        
        // Buscar en columna email_personal
        $query = "SELECT id, usuario, nombre_completo, email, email_personal FROM usuarios WHERE email_personal = ? LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->execute([$email]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            echo "✅ <strong>EMAIL ENCONTRADO en email_personal</strong><br>";
            echo "<pre>" . print_r($result, true) . "</pre>";
        } else {
            echo "❌ No encontrado en email_personal<br><br>";
            
            // Buscar en columna email
            $query2 = "SELECT id, usuario, nombre_completo, email, email_personal FROM usuarios WHERE email = ? LIMIT 1";
            $stmt2 = $db->prepare($query2);
            $stmt2->execute([$email]);
            $result2 = $stmt2->fetch(PDO::FETCH_ASSOC);
            
            if ($result2) {
                echo "✅ <strong>EMAIL ENCONTRADO en email</strong><br>";
                echo "<pre>" . print_r($result2, true) . "</pre>";
            } else {
                echo "❌ No encontrado en ninguna columna<br><br>";
            }
        }
        
        // Mostrar todos los emails que existen
        echo "<h3>📧 Todos los emails en la BD:</h3>";
        $stmt = $db->query("SELECT id, usuario, nombre_completo, email, email_personal FROM usuarios LIMIT 10");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
        echo "<tr><th>ID</th><th>Usuario</th><th>Nombre</th><th>Email</th><th>Email Personal</th></tr>";
        foreach ($users as $u) {
            echo "<tr>";
            echo "<td>{$u['id']}</td>";
            echo "<td>{$u['usuario']}</td>";
            echo "<td>{$u['nombre_completo']}</td>";
            echo "<td>{$u['email']}</td>";
            echo "<td>{$u['email_personal']}</td>";
            echo "</tr>";
        }
        echo "</table>";
        
    } else {
        echo "❌ Tabla 'usuarios' NO existe<br>";
        echo "💡 Necesitas crear la tabla primero<br>";
    }
    
} catch (Exception $e) {
    echo "<h2>❌ Error:</h2>";
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
    error_log("Error en diagnóstico: " . $e->getMessage());
}
?>
