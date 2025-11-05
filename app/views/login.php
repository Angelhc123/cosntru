<?php
require_once __DIR__ . '/../../config/session.php';
require_once __DIR__ . '/../../config/recaptcha.php';
// Debug temporal: muestra en el código fuente qué valores está leyendo PHP
echo '<!-- RECAPTCHA DEBUG site: ' . htmlspecialchars($recaptcha_site_key) . ' secret: ' . (empty($recaptcha_secret_key) ? 'EMPTY' : 'SET') . ' -->';
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>INTRANET - Login</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="login-container">
        <div style="width: 100%;">
            <div class="login-header">
                <h1>INTRANET</h1>
            </div>
            
            <div class="login-content">
                <div class="login-left">
                    <div class="support-info">
                        <h3>📞 Para cualquier duda o consulta llamar o enviar un mensaje a:</h3>
                        
                        <div class="support-item">
                            <div class="icon">🏠</div>
                            <div>
                                <strong>Problemas Intranet</strong><br>
                                Celular 📱 080804693 - 952341082 - 980803138<br>
                                <strong>intranet@upt.pe</strong>
                            </div>
                        </div>
                        
                        <div class="support-item">
                            <div class="icon">💻</div>
                            <div>
                                <strong>Problemas Office 365</strong><br>
                                Celular 📱 952341081
                            </div>
                        </div>
                        
                        <div class="support-item">
                            <div class="icon">G</div>
                            <div>
                                <strong>Problemas Google Meet</strong><br>
                                Celular 📱 080803233<br>
                                <strong>soportesuite@virtual.upt.pe</strong>
                            </div>
                        </div>
                        
                        <div class="schedule">
                            En Horario de 08:00 a 13:00 hrs. y de 14:00 a 17:00 hrs. de lunes a viernes
                        </div>
                    </div>

                    <div class="keypad">
                        <button class="key" onclick="addToCode('1')">1</button>
                        <button class="key" onclick="addToCode('7')">7</button>
                        <button class="key" onclick="addToCode('0')">0</button>
                        <button class="key" onclick="addToCode('6')">6</button>
                        <button class="key" onclick="addToCode('8')">8</button>
                        <button class="key" onclick="addToCode('4')">4</button>
                        <button class="key" onclick="addToCode('3')">3</button>
                        <button class="key" onclick="addToCode('9')">9</button>
                        <button class="key" onclick="addToCode('5')">5</button>
                        <button class="key" onclick="addToCode('2')">2</button>
                        <button class="key clear" onclick="clearCode()">BORRAR</button>
                    </div>

                    <div class="alert alert-info">
                        <strong>ℹ️ Si usted ha ingresado entre los años 2008 - 2013</strong> y no puede ingresar a la Intranet, aquí le brindamos una alternativa. Pulse <strong>AQUÍ</strong> brindenos sus datos para poder ayudarlo.
                    </div>
                </div>

                <div class="login-right">
                    <?php if (isset($_SESSION['error'])): ?>
                        <div class="alert alert-danger">
                            <?php 
                            echo $_SESSION['error']; 
                            unset($_SESSION['error']);
                            ?>
                        </div>
                    <?php endif; ?>

                    <form class="login-form" method="POST" action="login_process.php">
                        <div class="form-group">
                            <label for="codigo">CÓDIGO:</label>
                            <input type="text" class="form-control" id="codigo" name="usuario" placeholder="Código" required>
                        </div>

                        <div class="form-group">
                            <label for="password">CONTRASEÑA:</label>
                            <input type="password" class="form-control" id="password" name="password" placeholder="Contraseña" required>
                        </div>

                        <div class="form-group">
                            <label>Captcha:</label>
                            <?php // Usamos un captcha simple (imagen) en lugar de Google reCAPTCHA ?>
                            <div style="display:flex; align-items:center; gap:10px;">
                                <img id="captchaImg" src="/captcha_image.php?ts=<?= time() ?>" alt="CAPTCHA" style="border:1px solid #ccc;">
                                <button type="button" onclick="document.getElementById('captchaImg').src='/captcha_image.php?ts=' + Date.now();" class="btn">Recargar</button>
                            </div>
                            <div style="margin-top:8px;">
                                <input type="text" name="simple_captcha" placeholder="Ingresa las letras" class="form-control" required>
                            </div>
                            <div style="margin-top:6px; font-size:12px; color:#666;">Si no ves la imagen, pulsa "Recargar".</div>
                        </div>

                        <button type="submit" class="btn">Enviar</button>
                    </form>

                    <div style="margin-top: 20px; font-size: 12px; color: #666;">
                        <strong>Usuario demo:</strong> demo<br>
                        <strong>Contraseña:</strong> demo123<br>
                        <strong>Captcha:</strong> Google reCAPTCHA (si está configurado)
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/script.js"></script>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
    
    <!-- CHATBOX WIDGET - Se conecta a MongoDB Atlas vía API Gateway -->
    <link rel="stylesheet" href="css/chatbox.css">
    <script src="js/config.js"></script>
    <script src="js/chatbox.js"></script>
</body>
</html>