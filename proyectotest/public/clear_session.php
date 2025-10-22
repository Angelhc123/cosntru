<!DOCTYPE html>
<html>
<head>
    <title>Limpiando sesión...</title>
</head>
<body>
    <script>
        // ✅ LIMPIAR TODO el localStorage del chatbox
        localStorage.removeItem('chat_session_id');
        localStorage.removeItem('chat_session_token');
        localStorage.removeItem('chat_user_id');
        console.log('✅ LocalStorage del chatbox completamente limpiado');
        
        // Redirigir después de limpiar
        setTimeout(function() {
            window.location.href = 'login.php';
        }, 100);
    </script>
    <p>Limpiando sesión...</p>
</body>
</html>
<?php
session_start();
session_destroy();
setcookie(session_name(), '', time() - 3600, '/');
exit();
?>