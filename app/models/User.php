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
    public $email_personal;
    public $tipo_usuario;
    public $codigo_universitario;
    public $carrera;
    public $estado;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($usuario, $password) {
        $query = "SELECT id, usuario, password, nombre_completo, email, email_personal, tipo_usuario, codigo_universitario, carrera, estado FROM " . $this->table_name . " WHERE usuario = ? LIMIT 0,1";
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
                $this->email_personal = $row['email_personal'];
                $this->tipo_usuario = $row['tipo_usuario'];
                $this->codigo_universitario = $row['codigo_universitario'];
                $this->carrera = $row['carrera'];
                $this->estado = $row['estado'];
                return true;
            }
        }
        return false;
    }
    
    // Método para verificar email personal (usado para RF004)
    public function verifyEmailPersonal($email_personal) {
        $query = "SELECT id, usuario, nombre_completo, email, email_personal FROM " . $this->table_name . " WHERE email_personal = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $email_personal);
        $stmt->execute();
        
        $num = $stmt->rowCount();
        
        if($num > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return [
                'exists' => true,
                'id' => $row['id'],
                'usuario' => $row['usuario'],
                'nombre_completo' => $row['nombre_completo'],
                'email' => $row['email'],
                'email_personal' => $row['email_personal']
            ];
        }
        return ['exists' => false];
    }
    
    // Método para actualizar contraseña (usado para RF004)
    public function updatePassword($usuario, $new_password) {
        $query = "UPDATE " . $this->table_name . " SET password = :password, updated_at = CURRENT_TIMESTAMP WHERE usuario = :usuario";
        $stmt = $this->conn->prepare($query);
        
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        
        $stmt->bindParam(':password', $hashed_password);
        $stmt->bindParam(':usuario', $usuario);
        
        return $stmt->execute();
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . " 
                SET usuario=:usuario, password=:password, nombre_completo=:nombre_completo, email=:email, email_personal=:email_personal, tipo_usuario=:tipo_usuario, codigo_universitario=:codigo_universitario, carrera=:carrera, estado=:estado";
        
        $stmt = $this->conn->prepare($query);
        
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);
        
        $stmt->bindParam(':usuario', $this->usuario);
        $stmt->bindParam(':password', $this->password);
        $stmt->bindParam(':nombre_completo', $this->nombre_completo);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':email_personal', $this->email_personal);
        $stmt->bindParam(':tipo_usuario', $this->tipo_usuario);
        $stmt->bindParam(':codigo_universitario', $this->codigo_universitario);
        $stmt->bindParam(':carrera', $this->carrera);
        $stmt->bindParam(':estado', $this->estado);
        
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
            email_personal VARCHAR(100) DEFAULT NULL,
            tipo_usuario ENUM('estudiante', 'docente', 'administrativo') DEFAULT 'estudiante',
            codigo_universitario VARCHAR(20) DEFAULT NULL,
            carrera VARCHAR(100) DEFAULT NULL,
            estado ENUM('activo', 'inactivo', 'egresado') DEFAULT 'activo',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        
        $stmt = $this->conn->prepare($query);
        return $stmt->execute();
    }
}
?>