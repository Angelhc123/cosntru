<?php
/**
 * Script para agregar usuarios de prueba para RF004
 * Ejecutar: php add_test_users.php
 */

// Configuración de la base de datos
$host = 'localhost';
$dbname = 'db_sistema_asistencia';
$username = 'root';
$password = 'Hacker04@';

try {
    // Conectar a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Conectado a la base de datos\n\n";
    
    // Usuario 1: xxdescixx
    $usuario1 = [
        'usuario' => 'xxdescixx',
        'password' => password_hash('Password123', PASSWORD_DEFAULT), // Puedes cambiarlo después
        'nombre_completo' => 'Desci Test Usuario',
        'email_institucional' => 'xxdescixx@upt.pe',
        'email_personal' => 'xxdescixx@gmail.com',
        'rol' => 'estudiante'
    ];
    
    // Usuario 2: angelxhernandezxcruz
    $usuario2 = [
        'usuario' => 'angelxhcruz',
        'password' => password_hash('Password123', PASSWORD_DEFAULT),
        'nombre_completo' => 'Angel Hernandez Cruz',
        'email_institucional' => 'angel.hernandez@upt.pe',
        'email_personal' => 'angelxhernandezxcruz@gmail.com',
        'rol' => 'estudiante'
    ];
    
    $usuarios = [$usuario1, $usuario2];
    
    foreach ($usuarios as $user) {
        // Verificar si el usuario ya existe
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE usuario = ? OR email_personal = ?");
        $stmt->execute([$user['usuario'], $user['email_personal']]);
        
        if ($stmt->fetch()) {
            echo "⚠️  Usuario '{$user['usuario']}' ya existe. Actualizando...\n";
            
            // Actualizar el usuario existente
            $updateSql = "UPDATE usuarios 
                         SET nombre_completo = ?,
                             email_institucional = ?,
                             email_personal = ?,
                             rol = ?
                         WHERE usuario = ?";
            
            $stmt = $pdo->prepare($updateSql);
            $stmt->execute([
                $user['nombre_completo'],
                $user['email_institucional'],
                $user['email_personal'],
                $user['rol'],
                $user['usuario']
            ]);
            
            echo "   ✅ Usuario '{$user['usuario']}' actualizado\n";
            echo "   📧 Email personal: {$user['email_personal']}\n\n";
            
        } else {
            // Insertar nuevo usuario
            $insertSql = "INSERT INTO usuarios (usuario, password, nombre_completo, email_institucional, email_personal, rol) 
                         VALUES (?, ?, ?, ?, ?, ?)";
            
            $stmt = $pdo->prepare($insertSql);
            $stmt->execute([
                $user['usuario'],
                $user['password'],
                $user['nombre_completo'],
                $user['email_institucional'],
                $user['email_personal'],
                $user['rol']
            ]);
            
            echo "✅ Usuario '{$user['usuario']}' creado exitosamente\n";
            echo "   📧 Email personal: {$user['email_personal']}\n";
            echo "   🔑 Password temporal: Password123\n\n";
        }
    }
    
    echo "═══════════════════════════════════════════════════════════\n";
    echo "  ✨ USUARIOS DE PRUEBA LISTOS PARA RF004\n";
    echo "═══════════════════════════════════════════════════════════\n\n";
    
    // Mostrar resumen
    echo "📝 Usuarios registrados:\n\n";
    
    $stmt = $pdo->query("SELECT usuario, nombre_completo, email_personal FROM usuarios WHERE email_personal IN ('xxdescixx@gmail.com', 'angelxhernandezxcruz@gmail.com')");
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo "   Usuario: {$row['usuario']}\n";
        echo "   Nombre: {$row['nombre_completo']}\n";
        echo "   Email personal: {$row['email_personal']}\n";
        echo "   ─────────────────────────────────────────────\n";
    }
    
    echo "\n🧪 PRUEBA AHORA EN EL CHATBOX:\n";
    echo "   1. Escribe: 'olvidé mi contraseña'\n";
    echo "   2. Bot te pedirá el email\n";
    echo "   3. Escribe: 'xxdescixx@gmail.com'\n";
    echo "   4. Bot debería reconocer al usuario y procesar\n\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>
