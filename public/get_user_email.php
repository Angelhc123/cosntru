<?php
require_once __DIR__ . '/../config/session.php';
header('Content-Type: application/json');

// Verificar que el usuario esté autenticado
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'error' => 'No autenticado'
    ]);
    exit;
}

// LOG de depuración
error_log("GET_USER_EMAIL: SESSION user_id = " . $_SESSION['user_id']);
error_log("GET_USER_EMAIL: REQUESTED user_id = " . ($_GET['user_id'] ?? 'NO ENVIADO'));

// Verificar que se proporcionó el user_id
$requested_user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;

// Verificar que el user_id solicitado coincida con el de la sesión (seguridad)
if ($requested_user_id !== $_SESSION['user_id']) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'No autorizado'
    ]);
    exit;
}

// Conectar a la base de datos
require_once '../config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // ✅ Usar el campo "email" directamente (puede ser cualquier email válido)
    $query = "SELECT email, nombre_completo FROM usuarios WHERE id = :user_id LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $requested_user_id);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        // Verificar que tenga email válido
        error_log("GET_USER_EMAIL: Usuario encontrado - email=" . ($user['email'] ?? 'NULL') . ", nombre=" . ($user['nombre_completo'] ?? 'NULL'));
        
        if (empty($user['email'])) {
            error_log("GET_USER_EMAIL: ❌ EMAIL VACÍO O NULL");
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'El usuario no tiene email configurado'
            ]);
            exit;
        }
        
        error_log("GET_USER_EMAIL: ✅ Devolviendo email=" . $user['email'] . " para usuario=" . $user['nombre_completo']);
        
        echo json_encode([
            'success' => true,
            'email' => $user['email'],
            'nombre_completo' => $user['nombre_completo']
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'error' => 'Usuario no encontrado'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error de base de datos'
    ]);
}
?>
