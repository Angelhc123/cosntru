<?php
/**
 * API Endpoint para actualizar contraseña
 * Utilizado por el API Gateway del sistema UPT Chat para RF004
 *
 * Endpoint: POST /api_update_password_railway.php
 * Body: { "usuario": "2020068376", "new_password": "nuevaContraseña123" }
 * Response: { "success": true, "message": "..." } o { "success": false, "message": "..." }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permitir CORS para API Gateway
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Manejar preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Use POST.'
    ]);
    exit();
}

// Cargar configuración de base de datos
require_once __DIR__ . '/../config/database_railway.php';
require_once __DIR__ . '/../app/models/User_railway.php';

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
    $new_password = $input['new_password'];

    // Validar longitud de contraseña
    if (strlen($new_password) < 6) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'La contraseña debe tener al menos 6 caracteres'
        ]);
        exit();
    }

    // Conectar a base de datos
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception('Error al conectar con la base de datos');
    }

    // Actualizar contraseña
    $user = new User($db);
    $result = $user->updatePassword($usuario, $new_password);

    if ($result) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Contraseña actualizada exitosamente',
            'data' => [
                'usuario' => $usuario,
                'updated_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'No se pudo actualizar la contraseña. Usuario no encontrado.'
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error del servidor: ' . $e->getMessage()
    ]);
}
?>
