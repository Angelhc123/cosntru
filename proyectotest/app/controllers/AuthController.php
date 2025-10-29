<?php
// 🔒 SEGURIDAD: Configurar sesión para expirar al cerrar navegador
require_once __DIR__ . '/../../config/session.php';
require_once __DIR__ . '/../models/User.php';

class AuthController {
    private $db;
    private $user;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->user = new User($this->db);
        
        // Crear tabla si no existe
        $this->user->createTable();
        
        // Crear usuario demo si no existe
        $this->createDemoUser();
    }

    public function showLogin() {
        if (isset($_SESSION['user_id'])) {
            header("Location: dashboard.php");
            exit();
        }
        include '../app/views/login.php';
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $usuario = $_POST['usuario'] ?? '';
            $password = $_POST['password'] ?? '';
            $captcha = $_POST['captcha'] ?? '';

            // Validar captcha fijo (siempre debe ser 8)
            if ($captcha != '8') {
                $_SESSION['error'] = "Captcha incorrecto. La respuesta es 8 (5 + 3 = 8)";
                header("Location: login.php");
                exit();
            }

            if ($this->user->login($usuario, $password)) {
                // 🔒 SEGURIDAD: Regenerar ID de sesión para prevenir session fixation
                session_regenerate_id(true);
                
                // 🔒 SEGURIDAD: Configurar cookie de sesión para que expire al cerrar navegador
                ini_set('session.cookie_lifetime', 0);
                ini_set('session.gc_maxlifetime', 1440); // 24 minutos de inactividad
                
                $_SESSION['user_id'] = $this->user->id;
                $_SESSION['usuario'] = $this->user->usuario;
                $_SESSION['nombre_completo'] = $this->user->nombre_completo;
                $_SESSION['tipo_usuario'] = $this->user->tipo_usuario;
                
                // ✅ Redirigir según tipo de usuario
                if ($this->user->tipo_usuario === 'administrativo') {
                    header("Location: admin_dashboard.php");
                } else {
                    header("Location: dashboard.php");
                }
                exit();
            } else {
                $_SESSION['error'] = "Usuario o contraseña incorrectos";
                header("Location: login.php");
                exit();
            }
        }
    }

    public function logout() {
        session_destroy();
        header("Location: login.php");
        exit();
    }

    public function dashboard() {
        if (!isset($_SESSION['user_id'])) {
            header("Location: login.php");
            exit();
        }
        include '../app/views/dashboard.php';
    }

    private function createDemoUser() {
        // Verificar si ya existe un usuario demo
        $query = "SELECT COUNT(*) as count FROM usuarios WHERE usuario = 'demo'";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result['count'] == 0) {
            $this->user->usuario = 'demo';
            $this->user->password = 'demo123';
            $this->user->nombre_completo = 'Usuario Demo';
            $this->user->email = 'demo@example.com';
            $this->user->create();
        }
    }
}
?>