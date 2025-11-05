<?php
// Configuración de reCAPTCHA: leer desde variables de entorno
// Define RECAPTCHA_SITE_KEY y RECAPTCHA_SECRET_KEY en el entorno del servidor.
$recaptcha_site_key = getenv('RECAPTCHA_SITE_KEY') ?: '';
$recaptcha_secret_key = getenv('RECAPTCHA_SECRET_KEY') ?: '';

// Si el desarrollador proporcionó claves directamente, se usan como fallback.
// ADVERTENCIA: No es buena práctica guardar secretos en el repositorio.
// Si prefieres, configura las variables de entorno en tu servidor en vez de dejar
// las claves aquí.
if (empty($recaptcha_site_key)) {
    // Site key proporcionada por el usuario (fallback)
    $recaptcha_site_key = '6LdruwMsAAAAAMzjSpEQi_np03qkrYTWCkIHUbNv';
}
if (empty($recaptcha_secret_key)) {
    // Secret key proporcionada por el usuario (fallback)
    $recaptcha_secret_key = '6LdruwMsAAAAAIBYzfpQhHmu5IiSffrRSU3hTfqI';
}

// Helper para verificar si está configurado (útil en vistas)
function recaptcha_is_configured() {
    global $recaptcha_site_key, $recaptcha_secret_key;
    return !empty($recaptcha_site_key) && !empty($recaptcha_secret_key);
}

?>