<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Net.UPT.edu.pe - Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/chatbox-with-history.css">
    <style>
        /* Estilos básicos para imitar el look de intranet-upt */
        :root{ --blue:#103a78; --navy:#052a57; --accent:#ffc107; }
        body{font-family: Arial, Helvetica, sans-serif; margin:0; background:#f2f4f7; color:#222}
        .topbar{background:var(--navy); color:#fff; padding:10px 20px; display:flex; align-items:center; justify-content:space-between}
        .topbar .brand{font-size:20px; font-weight:700}
        .topbar .user{font-size:13px; display:flex; gap:16px; align-items:center}
        .container{display:flex; min-height:calc(100vh - 52px)}
        .sidebar{width:240px; background:#0d3b74; color:#fff; padding:10px 0; box-shadow:2px 0 6px rgba(0,0,0,0.05)}
        .sidebar a{display:block; color:#fff; padding:10px 18px; text-decoration:none; border-bottom:1px solid rgba(255,255,255,0.03)}
        .sidebar a:hover{background:rgba(255,255,255,0.03)}
        .sidebar .section-title{padding:12px 18px; font-weight:700; font-size:12px; opacity:0.9}
        .main{flex:1; padding:20px}
        .card{background:#fff; border-radius:4px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.06); margin-bottom:18px}
        .banner{display:flex; justify-content:space-between; align-items:center; gap:12px}
        .banner .text{font-weight:700; color:#1e3c72}
        .btn{background:var(--blue); color:#fff; padding:8px 12px; border-radius:4px; text-decoration:none}
        .small-muted{color:#6c757d; font-size:13px}
        .grid-2{display:grid; grid-template-columns:1fr 360px; gap:18px}
        .calendar-box{border:1px solid #ddd; padding:12px; border-radius:4px; background:#fafafa}
        /* preserve existing controls look */
        .logout-btn{background:#e74c3c;color:#fff;padding:6px 10px;border-radius:4px;text-decoration:none}
        @media(max-width:900px){.grid-2{grid-template-columns:1fr}}
    </style>
</head>
<body>
    <div class="topbar">
        <div class="brand">Net.UPT.edu.pe <small style="font-weight:400; font-size:12px; margin-left:8px;">versión 1.5</small></div>
        <div class="user">
            <div>Usuario: <?php echo htmlspecialchars(
                isset($_SESSION['nombre_completo'])?$_SESSION['nombre_completo']:''
            ); ?></div>
            <div class="small-muted">Ayuda</div>
            <div class="small-muted">Finalizar</div>
            <div class="small-muted">⏰ Hora del sistema: <?php echo date('H:i:s'); ?></div>
            <a href="logout.php" class="logout-btn">Cerrar Sesión</a>
        </div>
    </div>

    <div class="container">
        <aside class="sidebar">
            <div class="section-title">Inicio</div>
            <a href="#">Inicio</a>
            <div class="section-title">Académico</div>
            <a href="#">Académico</a>
            <a href="#">Calendario</a>
            <a href="#">Matrícula</a>
            <div class="section-title">Servicios</div>
            <a href="#">Google Workspace</a>
            <a href="#">Office365@Edu</a>
            <a href="#">Convenio Microsoft</a>
            <div class="section-title">Pasarela</div>
            <a href="#">Alumno</a>
            <a href="#">Aula Virtual</a>
            <a href="#">GPS Alumni</a>
            <div class="section-title">Anuncios</div>
            <a href="#">Guía Estudiante</a>
            <a href="#">Ofertas</a>
            <!-- botones sin redirección, solo UI -->
            <div style="padding:12px 18px;">
                <a class="btn" href="#">Generar Clave WIFI</a>
            </div>
        </aside>

        <main class="main">
            <div class="card banner">
                <div class="text">¡Bienvenido a Net.UPT.edu.pe — Información importante</div>
                <a class="btn" href="#">Ver Directorio</a>
            </div>

            <div class="grid-2">
                <div>
                    <div class="card">
                        <h3 style="color:var(--blue); margin-top:0">Bienvenido al Sistema Académico</h3>
                        <div style="margin-bottom:12px;">
                            <strong>INFORMACIÓN</strong><br>
                            <div class="small-muted">¿Tienes problemas con la Intranet? entonces escríbanos a intranet@upt.pe enviando tu código universitario y datos personales.</div>
                        </div>

                        <div style="display:flex; gap:12px; align-items:center; margin-bottom:12px;">
                            <div style="flex:1; background:#fff8e1; padding:10px; border-radius:4px; border:1px solid #ffe8a1; color:#856404">ACTIVA TU CORREO INSTITUCIONAL UPT.PE hasta el 20/09/2025 (Solo ingresantes)</div>
                            <a class="btn" href="#" style="background:var(--accent); color:#212529">🔒 Cambiar Email</a>
                        </div>

                        <p><strong>Su cuenta de correo personal es:</strong> <?php echo isset($_SESSION['usuario'])?htmlspecialchars($_SESSION['usuario']):''; ?>@gmail.com</p>
                        <button class="btn" onclick="alert('Función de cambiar contraseña (demo)')">📧 Cambiar Contraseña</button>

                        <div style="margin-top:18px; display:flex; gap:12px;">
                            <div style="flex:1">
                                <div class="card" style="padding:12px; margin:0">
                                    <h4 style="margin:0 0 8px 0">📚 ÚLTIMOS ACCESOS</h4>
                                    <ul style="margin:0; padding-left:18px; color:#444">
                                        <li>Jueves 2 Octubre del 2025 4:56PM -</li>
                                        <li>Jueves 2 Octubre del 2025 2:46PM -</li>
                                        <li>Lunes 29 Septiembre del 2025 5:09PM -</li>
                                        <li>Jueves 18 Septiembre del 2025 1:58PM -</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top:16px">
                            <div class="card">
                                <h4 style="margin:0 0 8px 0">💰 INFORMACIÓN ECONÓMICA</h4>
                                <div style="color:#6c757d">No tiene deuda hasta la fecha</div>
                                <div style="margin-top:8px"><strong>Deuda Libro:</strong> No tiene deuda de libro hasta la fecha</div>
                            </div>
                        </div>
                    </div>
                </div>

                <aside>
                    <div class="card calendar-box">
                        <strong>📅 CALENDARIOS ACADÉMICOS</strong>
                        <div style="margin-top:10px; display:flex; flex-direction:column; gap:8px">
                            <button class="btn" style="background:#e9ecef; color:#212529">2025 - REC</button>
                            <button class="btn" style="background:#e9ecef; color:#212529">2025 - INT</button>
                            <button class="btn" style="background:#e9ecef; color:#212529">2025 - I</button>
                            <button class="btn" style="background:#e9ecef; color:#212529">2025 - II</button>
                        </div>
                    </div>

                    <div class="card calendar-box" style="margin-top:12px">
                        <strong>FICHA DE MATRÍCULA</strong>
                        <div class="small-muted" style="margin-top:6px">Esta opción estará habilitada hasta la rectificación de matrícula (demo)</div>
                        <a class="btn" href="#" style="display:inline-block; margin-top:10px">Descargar</a>
                    </div>
                </aside>
            </div>

            <!-- Tickets section (kept but hidden by default and preserved JS hooks) -->
            <div id="tickets" style="display:none; margin-top:18px" class="card">
                <h3>🎫 Mis Tickets de Soporte</h3>
                <div id="tickets-container" style="min-height:200px">Cargando tus tickets...</div>
            </div>

            <!-- Chatbox user id (oculto) -->
            <div id="user-id-data" data-user-id="<?php echo isset($_SESSION['user_id'])?htmlspecialchars($_SESSION['user_id']):''; ?>" style="display:none"></div>
        </main>
    </div>

    <script src="js/script.js"></script>
    <script src="js/config.js"></script>
    <script src="js/tickets-user.js"></script>
    <script src="js/chatbox-with-history.js"></script>
</body>
</html>