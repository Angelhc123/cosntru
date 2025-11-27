<?php
/**
 * API Endpoint para actualizar contraseña
 * Ruta: /api/auth/update-password.php
 */

// Headers CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../app/models/User.php';

try {
    // Obtener datos del request
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['usuario']) || empty($input['usuario'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'El campo usuario es requerido'
        ]);
        exit();
    }
    
    if (!isset($input['new_password']) || empty($input['new_password'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'El campo new_password es requerido'
        ]);
        exit();
    }

    $usuario = trim($input['usuario']);
    $newPassword = $input['new_password'];

    // Conectar a BD
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);

    // Actualizar contraseña
    if ($user->updatePassword($usuario, $newPassword)) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Contraseña actualizada exitosamente'
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Usuario no encontrado'
        ]);
    }

} catch (Exception $e) {
    error_log("Error en update-password: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor',
        'error' => $e->getMessage()
    ]);
}
?>
