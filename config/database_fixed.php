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
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8mb4");
        } catch(PDOException $exception) {
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
