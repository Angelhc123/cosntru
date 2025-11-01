<?php
/**
 * API Endpoint para verificar email personal
 * Utilizado por el API Gateway del sistema UPT Chat para RF004
 *
 * Endpoint: POST /api_verify_email_railway.php
 * Body: { "email_personal": "usuario@gmail.com" }
 * Response: { "success": true, "data": {...} } o { "success": false, "message": "..." }
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

    if (!isset($input['email_personal']) || empty($input['email_personal'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'El campo email_personal es requerido'
        ]);
        exit();
    }

    $email_personal = trim($input['email_personal']);

    // Validar formato de email
    if (!filter_var($email_personal, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Formato de email inválido'
        ]);
        exit();
    }

    // Conectar a base de datos
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        throw new Exception('Error al conectar con la base de datos');
    }

    // Verificar email personal
    $user = new User($db);
    $result = $user->verifyEmailPersonal($email_personal);

    if ($result['exists']) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Email personal encontrado',
            'data' => [
                'id' => $result['id'],
                'usuario' => $result['usuario'],
                'nombre_completo' => $result['nombre_completo'],
                'email' => $result['email'],
                'email_personal' => $result['email_personal']
            ]
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'No se encontró ningún usuario con ese email personal'
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
