<?php
require_once __DIR__ . '/../../config/session.php';

// Captcha fijo y simple
$_SESSION['captcha_num1'] = 5;
$_SESSION['captcha_num2'] = 3;
$_SESSION['captcha_operator'] = '+';
$_SESSION['captcha_result'] = 8;
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
                            <label for="captcha">IMAGEN:</label>
                            <div class="captcha-container">
                                <div class="captcha-image">
                                    5 + 3 = ?
                                </div>
                            </div>
                            <input type="number" class="form-control" id="captcha" name="captcha" placeholder="Resultado (respuesta: 8)" required>
                            <small>Ingrese el número 8 para completar el acceso.</small>
                        </div>

                        <button type="submit" class="btn">Enviar</button>
                    </form>

                    <div style="margin-top: 20px; font-size: 12px; color: #666;">
                        <strong>Usuario demo:</strong> demo<br>
                        <strong>Contraseña:</strong> demo123<br>
                        <strong>Captcha:</strong> 8
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/script.js"></script>
    
    <!-- CHATBOX WIDGET - Se conecta a MongoDB Atlas vía API Gateway -->
    <link rel="stylesheet" href="css/chatbox.css">
    <script src="js/config.js"></script>
    <script src="js/chatbox.js"></script>
</body>
</html>