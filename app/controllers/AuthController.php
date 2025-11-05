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
            // Validar Google reCAPTCHA v2 (checkbox)
            require_once __DIR__ . '/../../config/recaptcha.php';
            $recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

            // Logs temporales para depuración (no exponen la secret):
            // - Indica si recaptcha está configurado en el servidor
            // - Indica si el cliente envió un token
            error_log('[reCAPTCHA][DEBUG] configured=' . (recaptcha_is_configured() ? 'YES' : 'NO') . ' site_key=' . $recaptcha_site_key);
            error_log('[reCAPTCHA][DEBUG] client_token_present=' . (!empty($recaptchaResponse) ? 'YES' : 'NO') . ' token_length=' . strlen($recaptchaResponse));

            if (!recaptcha_is_configured()) {
                // Si no está configurado, denegar por seguridad
                $_SESSION['error'] = "Captcha no configurado. Contacte al administrador.";
                header("Location: login.php");
                exit();
            }

            if (empty($recaptchaResponse)) {
                $_SESSION['error'] = "Por favor complete el captcha de Google.";
                header("Location: login.php");
                exit();
            }

            // Verificar con la API de Google
            $secret = $recaptcha_secret_key;
            $remoteIp = $_SERVER['REMOTE_ADDR'] ?? '';

            // Usar cURL si está disponible, si no usar file_get_contents
            $verifyResponse = null;
            $params = http_build_query([
                'secret' => $secret,
                'response' => $recaptchaResponse,
                'remoteip' => $remoteIp
            ]);

            if (function_exists('curl_version')) {
                $ch = curl_init('https://www.google.com/recaptcha/api/siteverify');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
                $verifyResponse = curl_exec($ch);
                curl_close($ch);
            } else {
                $verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?' . $params);
            }
            // Log the raw response from Google's siteverify for debugging (json). This helps to see error-codes.
            error_log('[reCAPTCHA][DEBUG] siteverify_raw=' . substr($verifyResponse, 0, 1000));

            $responseData = json_decode($verifyResponse, true);
            if (!isset($responseData['success']) || $responseData['success'] !== true) {
                $_SESSION['error'] = "Captcha inválido. Intente nuevamente.";
                header("Location: login.php");
                exit();
            }

            if ($this->user->login($usuario, $password)) {
                // 🔒 SEGURIDAD: Regenerar ID de sesión para prevenir session fixation
                session_regenerate_id(true);

                // 🔒 SEGURIDAD: Configurar cookie de sesión para que expire al cerrar navegador
                // ini_set('session.cookie_lifetime', 0);
                // ini_set('session.gc_maxlifetime', 1440); // 24 minutos de inactividad

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