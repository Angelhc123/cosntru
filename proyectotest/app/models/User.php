<?php
require_once __DIR__ . '/../../config/database.php';

class User {
    private $conn;
    private $table_name = "usuarios";

    public $id;
    public $usuario;
    public $password;
    public $nombre_completo;
    public $email;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($usuario, $password) {
        $query = "SELECT id, usuario, password, nombre_completo, email FROM " . $this->table_name . " WHERE usuario = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $usuario);
        $stmt->execute();
        
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if(password_verify($password, $row['password'])) {
                $this->id = $row['id'];
                $this->usuario = $row['usuario'];
                $this->nombre_completo = $row['nombre_completo'];
                $this->email = $row['email'];
                return true;
            }
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET usuario=:usuario, password=:password, nombre_completo=:nombre_completo, email=:email";
        
        $stmt = $this->conn->prepare($query);
        
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);
        
        $stmt->bindParam(':usuario', $this->usuario);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':nombre_completo', $this->nombre_completo);
        $stmt->bindParam(':email', $this->email);
        
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function createTable() {
        $query = "CREATE TABLE IF NOT EXISTS " . $this->table_name . " (
            id INT AUTO_INCREMENT PRIMARY KEY,
            usuario VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            nombre_completo VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        
        $stmt = $this->conn->prepare($query);
        return $stmt->execute();
    }
}
?>