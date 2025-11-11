<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Net.UPT.edu.pe - Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/chatbox-with-history.css">
    <style>
        /* Estilos refinados para asemejarse a la imagen: compact, lineal y con contraste */
        :root{ --blue:#103a78; --navy:#0a2a66; --accent:#efb02f; --muted:#6c757d }
        html,body{height:100%;}
        body{font-family: Arial, Helvetica, sans-serif; margin:0; background:#fff; color:#222; font-size:13px}

        /* Topbar (más compacta) */
        .topbar{background:var(--navy); color:#fff; padding:6px 18px; display:flex; align-items:center; justify-content:space-between; position:fixed; top:0; left:0; right:0; height:44px; z-index:1000}
        .topbar .brand{font-size:16px; font-weight:700}
        .topbar .user{font-size:12px; display:flex; gap:14px; align-items:center}

        /* Contenedor principal: dejar espacio para header */
        .container{display:block; padding-top:44px; min-height:calc(100vh - 44px); background:#fff}

    /* Sidebar compacto (narrow) con estética de la imagen */
    .sidebar{position:fixed; left:0; top:44px; bottom:0; width:200px; background:#0d3b74; color:#fff; padding:6px 0; box-shadow:2px 0 6px rgba(0,0,0,0.06); overflow:auto}
    .sidebar .section-title{padding:8px 12px; font-weight:700; font-size:12px; text-transform:uppercase; background:#0b2f66; border-top:1px solid #264c86; border-bottom:1px solid #264c86}
    .sidebar a{display:block; position:relative; color:#fff; padding:8px 14px 8px 22px; text-decoration:none; font-size:13px; font-weight:600; border-bottom:1px solid #fef3db}
    .sidebar a::before{content:'\203A'; /* › */ position:absolute; left:10px; color:#cfd9ea}
    .sidebar a[data-star]:after{content:'\2605'; /* ★ */ position:absolute; right:10px; color:#f7c948; font-size:10px}
    .sidebar a:hover{background:rgba(255,255,255,0.06)}
    .sidebar .sep{height:0; border-bottom:1px solid #fef3db; margin:8px 0}

    /* Main: más cercano al sidebar, alineado a la izquierda */
    .main{margin-left:190px; padding:12px 16px; min-height:calc(100vh - 44px)}
    .main .content-inner{max-width:none; margin:0}

        /* Welcome header estilo similar a la imagen */
    .banner{background:transparent; padding:6px 0; margin-bottom:0; display:flex; align-items:center; justify-content:space-between; gap:12px}
    .banner .welcome{margin:0; font-size:28px; font-weight:700}
    .banner .welcome .accent{color:var(--accent)}
    .banner .welcome .brand-name{color:var(--blue)}
        .page-sub{display:block; margin-top:6px; color:#222; font-size:12px}
    .thin-divider{height:4px; background:var(--navy); margin:8px 0 14px 0}

        /* Tarjetas compactas */
        .card{background:#fff; border-radius:2px; padding:12px; box-shadow:none; border-top:1px solid #e6e6e6; margin-bottom:14px}
        .card h3, .card h4{margin-top:0}

        /* Botones pequeños (estilo intranet clásico) */
        .btn{background:var(--blue); color:#fff; padding:6px 10px; border-radius:2px; text-decoration:none; display:inline-block; font-size:12px}
        .btn.secondary{background:#e9ecef; color:#212529; border:1px solid #cfcfcf}
    .logout-btn{background:#e74c3c;color:#fff;padding:6px 10px;border-radius:2px;text-decoration:none}
    /* Topbar link style (used for Cerrar Sesión) */
    .top-link{color:#fff; text-decoration:none; font-weight:600}

        .small-muted{color:var(--muted); font-size:12px}

    /* Grid principal: contenido + bloque derecho (calendarios) */
    .grid-2{display:grid; grid-template-columns:minmax(0,1fr) 320px; gap:20px}
        .calendar-box{border:2px solid #bdbdbd; padding:8px; border-radius:2px; background:#f7f7f7}
        .calendar-box .btn{display:block; margin-bottom:8px; text-align:left}

    /* Encabezado secciones grises (BENEFICIOS, etc.) */
    .section-legend{font-weight:700; color:#6b6b6b; margin:16px 0 8px; text-transform:uppercase}
    .muted-divider{height:1px; background:#e6e6e6; margin:6px 0 14px}

    /* Beneficios en dos columnas */
    .benefits{display:flex; align-items:flex-start; gap:48px; margin:10px 0 24px}
    .benefit{display:flex; align-items:center; gap:18px; flex:1}
    .benefit .icon{font-size:58px; line-height:1}
    .benefit.wifi .icon{color:var(--blue)}
    .benefit.ficha .icon{color:#efb02f}
    .btn-download{background:#0a2a66; color:#fff; padding:10px 22px; border-radius:2px; font-weight:700; text-decoration:none}

        /* Estética de tabla y listas para que se vea compacto */
        ul{margin:0; padding-left:18px}
        table{width:100%; border-collapse:collapse; font-size:13px}
        table td, table th{padding:6px; border:1px solid #eee}

        /* Responsive: colapsar sidebar y recolocar contenido */
        @media(max-width:1000px){
            .sidebar{position:static; width:100%; height:auto}
            .main{margin-left:0; padding:12px}
            .main .content-inner{max-width:100%}
            .grid-2{grid-template-columns:1fr}
        }
    </style>
</head>
<body>
    <div class="topbar">
    <div class="brand">Net.UPT.edu.pe</div>
        <div class="user">
            <div>Usuario: <?php echo htmlspecialchars(
                isset($_SESSION['nombre_completo'])?$_SESSION['nombre_completo']:''
            ); ?></div>
            <div class="small-muted">Ayuda</div>
            <!-- Reemplazamos "Finalizar" por un enlace de Cerrar Sesión para evitar duplicados -->
            <div class="small-muted"><a href="logout.php" class="top-link">Cerrar Sesión</a></div>
            <div class="small-muted">⏰ Hora del sistema: <span id="sys-time"><?php echo date('H:i:s'); ?></span></div>
        </div>
    </div>

    <div class="container">
        <aside class="sidebar">
            <div class="section-title">INICIO</div>
            <a href="#">Inicio</a>
            <div class="section-title">ACADÉMICO</div>
            <a href="#" data-star="1">Google Workspace</a>
            <a href="#">Office365@Edu</a>
            <a href="#">Convenio Microsoft</a>
            <div class="section-title">ELECCIONES</div>
            <a href="#">Comprobantes Electrónicos</a>
            <div class="section-title">PASARELA</div>
            <a href="#">Alumno</a>
            <a href="#">Aula Virtual</a>
            <a href="#">GPS Alumni</a>
            <div class="sep"></div>
            <a href="#">Biblioteca</a>
            <a href="#">Seguro Estudiantil</a>
            <div class="sep"></div>
            <a href="#">Recorrido de Buses</a>
            <div class="sep"></div>
            <a href="#">Reglamento y Directivas</a>
            <div class="sep"></div>
            <a href="#">Becas y Subvenciones</a>
            <div class="section-title">ANUNCIOS</div>
            <a href="#">Guía Estudiante</a>
            <a href="#">¿Office365@Edu?</a>
            <a href="#">C. Institucional</a>
            <a href="#">Veritrade</a>
            <a href="#">Palestra</a>
            <a href="#">Valor del Crédito</a>
            <!-- botones sin redirección, solo UI -->
            <!-- Generar Clave WIFI movido a la sección de beneficios en el main -->
        </aside>

        <main class="main">
            <div class="banner">
                <h1 class="welcome"><span class="accent">Bienvenido a</span> <span class="brand-name">Net.UPT.edu.pe</span> <small class="small-muted">— Información importante</small></h1>
                <a class="btn" href="#">Ver Directorio</a>
            </div>
            <div class="thin-divider"></div>

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

            <!-- Encabezado y bloque de beneficios en dos columnas -->
            <div class="content-inner">
                <div class="section-legend">Beneficios</div>
                <div class="muted-divider"></div>
                <div class="benefits">
                    <div class="benefit wifi">
                        <div class="icon">📶</div>
                        <div class="info" style="flex:1">
                            <h4 style="margin:0 0 6px 0">GENERAR CLAVE WIFI:</h4>
                            <div class="small-muted">Procedimiento para acceder a UPT_WIFI</div>
                        </div>
                        <div style="flex:0 0 150px; text-align:right">
                            <a class="btn-download" href="#">Descargar</a>
                        </div>
                    </div>
                    <div class="benefit ficha">
                        <div class="icon">🧾</div>
                        <div class="info" style="flex:1">
                            <h4 style="margin:0 0 6px 0">FICHA DE MATRÍCULA</h4>
                            <div class="small-muted">Esta opción estará habilitada hasta la rectificación de matrícula (demo)</div>
                        </div>
                        <div style="flex:0 0 150px; text-align:right">
                            <a class="btn-download" href="#">Descargar</a>
                        </div>
                    </div>
                </div>
            </div>
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
    <script>
        // Actualiza la hora del sistema en tiempo real cada segundo
        (function(){
            const el = document.getElementById('sys-time');
            if(!el) return;
            function pad(n){return n<10? '0'+n : n}
            function update(){
                const d = new Date();
                // Formato HH:MM:SS
                const s = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
                el.textContent = s;
            }
            update();
            setInterval(update,1000);
        })();
    </script>
</body>
</html>