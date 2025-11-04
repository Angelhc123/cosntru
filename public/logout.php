<?php
require_once __DIR__ . '/../app/controllers/AuthController.php';

$auth = new AuthController();
$auth->logout();
?>
<!DOCTYPE html>
<html>
<head>
    <title>Cerrando sesión...</title>
</head>
<body>
    <script>
        // ✅ LIMPIAR localStorage del chatbox al cerrar sesión
        localStorage.removeItem('chat_session_id');
        localStorage.removeItem('chat_session_token');
        localStorage.removeItem('chat_user_id');
        console.log('✅ Sesión de chatbox limpiada completamente');
    </script>
</body>
</html>