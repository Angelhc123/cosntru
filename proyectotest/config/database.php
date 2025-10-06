<?php
class Database {
    private $host = 'sql10.freesqldatabase.com';
    private $db_name = 'sql10801643';
    private $username = 'sql10801643';
    private $password = 'E78UeVmJ2g';
    private $port = 3306;
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Error de conexión: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>