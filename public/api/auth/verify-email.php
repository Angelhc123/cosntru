<?php
/**
 * API Endpoint para verificar email personal
 * Ruta: /api/auth/verify-email.php
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
    
    if (!isset($input['email_personal']) || empty($input['email_personal'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'El campo email_personal es requerido'
        ]);
        exit();
    }

    $emailPersonal = trim($input['email_personal']);

    // Validar formato del email
    if (!filter_var($emailPersonal, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Formato de email inválido'
        ]);
        exit();
    }

    // Conectar a BD y verificar
    $database = new Database();
    $db = $database->getConnection();
    $user = new User($db);

    // Verificar si el email existe
    $result = $user->verifyEmailPersonal($emailPersonal);
    
    if ($result['exists']) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'data' => [
                'usuario' => $result['usuario'],
                'nombre_completo' => $result['nombre_completo'],
                'email' => $result['email'],
                'codigo_universitario' => $result['usuario']
            ]
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Email no encontrado en el sistema'
        ]);
    }

} catch (Exception $e) {
    error_log("Error en verify-email: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor',
        'error' => $e->getMessage()
    ]);
}
?>
