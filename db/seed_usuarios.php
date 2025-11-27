<?php
/**
 * Script para insertar usuarios de prueba en la base de datos
 * Ejecutar este script para crear usuarios de prueba incluyendo alexanderpiero218@gmail.com
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../app/models/User.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);
    
    // Crear tabla si no existe
    $user->createTable();
    echo "✅ Tabla usuarios verificada/creada\n\n";
    
    // Usuario principal de prueba - Alexander Piero
    $user->usuario = '2018123456';
    $user->password = 'password123'; // Se hasheará automáticamente
    $user->nombre_completo = 'Alexander Piero';
    $user->email = '2018123456@upt.edu.pe';
    $user->email_personal = 'alexanderpiero218@gmail.com';
    $user->tipo_usuario = 'estudiante';
    $user->codigo_universitario = '2018123456';
    $user->carrera = 'Ingeniería de Sistemas';
    $user->estado = 'activo';
    
    if ($user->create()) {
        echo "✅ Usuario creado: Alexander Piero (alexanderpiero218@gmail.com)\n";
    } else {
        echo "⚠️  Usuario Alexander Piero ya existe o error al crear\n";
    }
    
    // Usuario 2 - Juan Pérez
    $user2 = new User($db);
    $user2->usuario = '2019001234';
    $user2->password = 'password123';
    $user2->nombre_completo = 'Juan Pérez García';
    $user2->email = '2019001234@upt.edu.pe';
    $user2->email_personal = 'juan.perez@gmail.com';
    $user2->tipo_usuario = 'estudiante';
    $user2->codigo_universitario = '2019001234';
    $user2->carrera = 'Ingeniería Civil';
    $user2->estado = 'activo';
    
    if ($user2->create()) {
        echo "✅ Usuario creado: Juan Pérez (juan.perez@gmail.com)\n";
    } else {
        echo "⚠️  Usuario Juan Pérez ya existe o error al crear\n";
    }
    
    // Usuario 3 - María González
    $user3 = new User($db);
    $user3->usuario = '2020005678';
    $user3->password = 'password123';
    $user3->nombre_completo = 'María González López';
    $user3->email = '2020005678@upt.edu.pe';
    $user3->email_personal = 'maria.gonzalez@gmail.com';
    $user3->tipo_usuario = 'estudiante';
    $user3->codigo_universitario = '2020005678';
    $user3->carrera = 'Ingeniería Industrial';
    $user3->estado = 'activo';
    
    if ($user3->create()) {
        echo "✅ Usuario creado: María González (maria.gonzalez@gmail.com)\n";
    } else {
        echo "⚠️  Usuario María González ya existe o error al crear\n";
    }
    
    echo "\n✅ Proceso completado\n";
    echo "Los usuarios pueden iniciar sesión con:\n";
    echo "  - Usuario: 2018123456 | Contraseña: password123 | Email: alexanderpiero218@gmail.com\n";
    echo "  - Usuario: 2019001234 | Contraseña: password123 | Email: juan.perez@gmail.com\n";
    echo "  - Usuario: 2020005678 | Contraseña: password123 | Email: maria.gonzalez@gmail.com\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
