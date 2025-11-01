<?php
// Cargar variables de entorno desde .env
if (file_exists(__DIR__ . '/../.env')) {
    $env = parse_ini_file(__DIR__ . '/../.env');
    foreach ($env as $key => $value) {
        putenv("$key=$value");
        $_ENV[$key] = $value; // También establecer en $_ENV
    }
}

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $port;
    public $conn;

    public function __construct() {
        // Cargar desde variables de entorno o usar valores por defecto
        $this->host = getenv('MYSQL_ADDON_HOST') ?: 'localhost';
        $this->db_name = getenv('MYSQL_ADDON_DB') ?: 'proyectotest';
        $this->username = getenv('MYSQL_ADDON_USER') ?: 'root';
        $this->password = getenv('MYSQL_ADDON_PASSWORD') ?: '';
        $this->port = getenv('MYSQL_ADDON_PORT') ?: 3306;
    }

    public function getConnection() {
        $this->conn = null;
        try {
            // Usar mysqli en lugar de PDO
            $this->conn = mysqli_connect($this->host, $this->username, $this->password, $this->db_name, $this->port);
            if (!$this->conn) {
                throw new Exception("Error de conexión MySQLi: " . mysqli_connect_error());
            }
            mysqli_set_charset($this->conn, 'utf8mb4');
        } catch(Exception $exception) {
            error_log("Error de conexión: " . $exception->getMessage());
            die("Error de conexión a la base de datos. Por favor, contacte al administrador.");
        }
        return $this->conn;
    }

    // Método para probar la conexión
    public function testConnection() {
        try {
            $this->getConnection();
            return [
                'success' => true,
                'message' => 'Conexión exitosa a la base de datos',
                'host' => $this->host,
                'database' => $this->db_name
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al conectar: ' . $e->getMessage()
            ];
        }
    }
}
?>
