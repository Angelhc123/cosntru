<?php
require_once __DIR__ . '/../../config/session.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../models/User.php';

class ApiController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
        
        // Configurar headers para API
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }

    public function updatePassword() {
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

            $usuario = $input['usuario'];
            $newPassword = $input['new_password'];

            // Validar formato del usuario (asumiendo que es código de estudiante)
            if (!preg_match('/^\d{10}$/', $usuario)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Formato de usuario inválido. Debe ser un código de 10 dígitos.'
                ]);
                exit();
            }

            // Actualizar contraseña
            if ($this->user->updatePassword($usuario, $newPassword)) {
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
            error_log("Error en updatePassword: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor'
            ]);
        }
    }

    public function verifyEmail() {
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

            $emailPersonal = $input['email_personal'];

            // Validar formato del email
            if (!filter_var($emailPersonal, FILTER_VALIDATE_EMAIL)) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'message' => 'Formato de email inválido'
                ]);
                exit();
            }

            // Verificar si el email existe
            $result = $this->user->verifyEmailPersonal($emailPersonal);
            
            if ($result['exists']) {
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
            error_log("Error en verifyEmail: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error interno del servidor'
            ]);
        }
    }

    public function getUserEmail() {
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'No autorizado'
            ]);
            exit();
        }

        echo json_encode([
            'success' => true,
            'email' => $_SESSION['user_email'] ?? 'No disponible'
        ]);
    }
}
?>