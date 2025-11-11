<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Net.UPT.edu.pe - Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/chatbox-with-history.css">
    <style>
        /* Estilos según diseño de referencia */
        :root{ --navy:#0b2f66; --navy-dark:#061f4d; --navy-light:#0f3875; --accent:#f2a900; --border-gold:#fef3db; --grey-border:#dadada; --muted:#6c6c6c; --text:#1f1f1f }
        html,body{height:100%;}
        body{font-family: Arial, Helvetica, sans-serif; margin:0; background:#ffffff; color:var(--text); font-size:13px}

        /* Barra superior fija */
        .topbar{background:var(--navy-dark); color:#fff; padding:6px 22px; display:flex; align-items:center; justify-content:space-between; position:fixed; top:0; left:0; right:0; height:48px; z-index:1000; box-shadow:0 2px 4px rgba(0,0,0,0.2)}
        .topbar .brand{font-size:20px; font-weight:700}
        .topbar .user{font-size:12px; display:flex; gap:16px; align-items:center}
        .topbar .user a{color:#fff; font-weight:700; text-decoration:none}

        /* Layout principal */
        .container{display:flex; min-height:100vh; padding-top:48px; background:#fff}

        /* Sidebar con bloques y separadores dorados */
        .sidebar{width:196px; background:var(--navy-light); color:#fff; border-right:4px solid var(--navy-dark); padding-bottom:20px}
        .sidebar .block-title{padding:9px 14px; font-weight:700; font-size:12px; text-transform:uppercase; background:var(--navy-dark); border-top:1px solid rgba(255,255,255,0.2); border-bottom:1px solid rgba(0,0,0,0.4)}
        .sidebar ul{list-style:none; margin:0; padding:0}
        .sidebar li{border-bottom:1px solid var(--border-gold)}
        .sidebar li:last-child{border-bottom:none}
        .sidebar a{display:block; padding:8px 12px 8px 26px; color:#fff; text-decoration:none; font-weight:600; position:relative}
        .sidebar a::before{content:'\203A'; position:absolute; left:10px}
        .sidebar a[data-star]::after{content:'\2605'; position:absolute; right:12px; color:#ffd54f; font-size:11px}
        .sidebar a:hover{background:rgba(255,255,255,0.08)}
        .sidebar .separator{height:1px; background:var(--border-gold); margin:8px 0}

        /* Contenido principal pegado al sidebar */
        .main{flex:1; padding:18px 30px 40px 18px}
        .main-inner{max-width:1000px; margin:0}

        /* Encabezado principal */
        .heading{display:flex; align-items:center; justify-content:space-between}
        .heading-title{margin:0; font-size:30px; font-weight:700}
        .heading-title .accent{color:var(--accent)}
        .heading-title .brand{color:var(--navy-dark)}
        .heading-sub{margin:0; color:#494949; font-size:12px}
        .divider{height:4px; background:var(--navy-dark); margin:8px 0 18px 0}

        /* Columnas principales */
        .layout{display:flex; gap:24px}
        .layout-left{flex:1}
        .layout-right{width:300px}

        /* Tarjetas */
        .info-card{border:1px solid var(--grey-border); background:#fff; padding:16px}
        .info-card h3{margin:0 0 12px 0; color:var(--navy-dark)}
        .info-alert{background:#fff5db; border:1px solid #f1d48c; padding:10px; width:240px; font-size:12px}
        .info-actions{display:flex; align-items:center; gap:12px}
        .btn-main{background:#d99616; color:#1a1a1a; font-weight:700; padding:10px 16px; border:none; cursor:pointer; text-transform:uppercase}
        .btn-blue{background:var(--navy-dark); color:#fff; border:none; padding:8px 16px; font-weight:700; cursor:pointer}
        .btn-blue.small{padding:6px 12px; font-size:12px}

        .card{border:1px solid var(--grey-border); padding:12px 16px; margin-top:18px; background:#fff}
        .card h4{margin:0 0 8px 0; color:var(--navy-dark)}
        .card p{margin:0}
        .list{margin:0; padding-left:18px}
        .list li{margin-bottom:4px}
        table{width:100%; border-collapse:collapse; font-size:13px; margin-top:8px}
        th,td{border:1px solid var(--grey-border); padding:6px 8px}

        /* Panel derecho */
        .calendar-card{border:1px solid #b5b5b5; background:#f2f2f2; padding:12px 14px}
        .calendar-card button{width:100%; text-align:left; padding:8px 10px; border:1px solid #c7c7c7; background:#ececec; font-weight:700; margin-bottom:6px}

        /* Beneficios */
        .benefits-section{margin-top:26px}
        .benefits-title{font-weight:700; text-transform:uppercase; color:#777; margin:0 0 8px 0}
        .benefits-divider{height:1px; background:#dddddd; margin-bottom:14px}
        .benefits{display:flex; gap:24px}
        .benefit-box{flex:1; border:1px solid var(--grey-border); padding:16px; display:flex; align-items:center; gap:14px; background:#fff}
        .benefit-icon{font-size:48px; color:var(--navy-dark)}
        .benefit-action{margin-left:auto}
        .btn-download{background:var(--navy-dark); color:#fff; border:none; padding:8px 18px; font-weight:700; cursor:pointer}
        .small-muted{color:var(--muted); font-size:12px}

        /* Responsivo básico */
        @media(max-width:1100px){
            .container{flex-direction:column}
            .sidebar{width:100%; border-right:none}
            .main{padding:16px}
            .main-inner{max-width:100%; margin:0}
            .layout{flex-direction:column}
            .layout-right{width:100%}
            .benefits{flex-direction:column}
        }
    </style>

    <div class="container">
        <aside class="sidebar">
            <div class="block-title">INICIO</div>
            <ul class="menu">
                <li><a href="#">Inicio</a></li>
            </ul>

            <div class="block-title">ACADÉMICO</div>
            <ul class="menu">
                <li><a href="#" data-star="1">Google Workspace</a></li>
                <li><a href="#">Office365@Edu</a></li>
                <li><a href="#">Convenio Microsoft</a></li>
            </ul>

            <div class="block-title">ELECCIONES</div>
            <ul class="menu">
                <li><a href="#">Comprobantes Electrónicos</a></li>
            </ul>

            <div class="block-title">PASARELA</div>
            <ul class="menu">
                <li><a href="#">Alumno</a></li>
                <li><a href="#">Aula Virtual</a></li>
                <li><a href="#">GPS Alumni</a></li>
            </ul>

            <div class="separator"></div>
            <ul class="menu">
                <li><a href="#">Biblioteca</a></li>
                <li><a href="#">Seguro Estudiantil</a></li>
            </ul>

            <div class="separator"></div>
            <ul class="menu">
                <li><a href="#">Recorrido de Buses</a></li>
            </ul>

            <div class="separator"></div>
            <ul class="menu">
                <li><a href="#">Reglamento y Directivas</a></li>
            </ul>

            <div class="separator"></div>
            <ul class="menu">
                <li><a href="#">Becas y Subvenciones</a></li>
            </ul>

            <div class="block-title">ANUNCIOS</div>
            <ul class="menu">
                <li><a href="#">Guía Estudiante</a></li>
                <li><a href="#">¿Office365@Edu?</a></li>
                <li><a href="#">C. Institucional</a></li>
                <li><a href="#">Veritrade</a></li>
                <li><a href="#">Palestra</a></li>
                <li><a href="#">Valor del Crédito</a></li>
            </ul>
        </aside>

        <main class="main">
            <div class="main-inner">
                <div class="heading">
                    <div>
                        <h1 class="heading-title"><span class="accent">Bienvenido a</span> <span class="brand">Net.UPT.edu.pe</span></h1>
                        <p class="heading-sub">Información importante</p>
                    </div>
                    <button class="btn-blue">Ver Directorio</button>
                </div>
                <div class="divider"></div>

                <div class="layout">
                    <div class="layout-left">
                        <div class="info-card">
                            <h3>Bienvenido al Sistema Académico</h3>
                            <p><strong>INFORMACIÓN</strong><br> ¿Tienes problemas con la Intranet? entonces escríbenos a intranet@upt.pe enviando tu código universitario y datos personales.</p>

                            <div class="info-alert" style="margin:14px 0">ACTIVA TU CORREO INSTITUCIONAL UPT.PE hasta el 20/09/2025 (Solo ingresantes)</div>

                            <div class="info-actions">
                                <button class="btn-main">Cambiar Email</button>
                                <span><strong>Su cuenta de correo personal es:</strong> <?php echo isset($_SESSION['usuario'])?htmlspecialchars($_SESSION['usuario']):''; ?>@gmail.com</span>
                            </div>

                            <div style="margin-top:12px">
                                <button class="btn-blue small" onclick="alert('Función de cambiar contraseña (demo)')">Cambiar Contraseña</button>
                            </div>
                        </div>

                        <div class="card">
                            <h4>ÚLTIMOS ACCESOS</h4>
                            <ul class="list">
                                <li>Jueves 2 Octubre del 2025 4:56PM -</li>
                                <li>Jueves 2 Octubre del 2025 2:46PM -</li>
                                <li>Lunes 29 Septiembre del 2025 5:09PM -</li>
                                <li>Jueves 18 Septiembre del 2025 1:58PM -</li>
                            </ul>
                        </div>

                        <div class="card">
                            <h4>INFORMACIÓN ECONÓMICA</h4>
                            <p>No tiene deuda hasta la fecha</p>
                            <p style="margin-top:8px"><strong>Deuda Libro:</strong> No tiene deuda de libro hasta la fecha</p>
                        </div>
                    </div>

                    <div class="layout-right">
                        <div class="calendar-card">
                            <strong>CALENDARIOS ACADÉMICOS</strong>
                            <div style="margin-top:10px">
                                <button>2025 - II</button>
                                <button>2025 - INT</button>
                                <button>2026 - REC</button>
                                <button>2026 - I</button>
                                <button>2026 - II</button>
                            </div>
                        </div>

                        <div class="calendar-card" style="margin-top:16px">
                            <strong>FICHA DE MATRÍCULA</strong>
                            <p style="margin:8px 0 12px 0">Esta opción estará habilitada hasta la rectificación de matrícula (demo)</p>
                            <button class="btn-blue" style="width:100%">Descargar</button>
                        </div>
                    </div>
                </div>

                <div class="benefits-section">
                    <div class="benefits-title">Beneficios</div>
                    <div class="benefits-divider"></div>
                    <div class="benefits">
                        <div class="benefit-box">
                            <div class="benefit-icon">📶</div>
                            <div>
                                <h4 style="margin:0 0 6px 0">Generar Clave WIFI:</h4>
                                <div class="small-muted">Procedimiento para acceder a UPT_WIFI</div>
                            </div>
                            <div class="benefit-action">
                                <button class="btn-download">Descargar</button>
                            </div>
                        </div>
                        <div class="benefit-box">
                            <div class="benefit-icon" style="color:#f2a900">🧾</div>
                            <div>
                                <h4 style="margin:0 0 6px 0">Ficha de Matrícula</h4>
                                <div class="small-muted">Esta opción estará habilitada hasta la rectificación de matrícula (demo)</div>
                            </div>
                            <div class="benefit-action">
                                <button class="btn-download">Descargar</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="tickets" class="card" style="display:none; margin-top:18px">
                    <h3>🎫 Mis Tickets de Soporte</h3>
                    <div id="tickets-container" style="min-height:200px">Cargando tus tickets...</div>
                </div>
            </div>

            <div id="user-id-data" data-user-id="<?php echo isset($_SESSION['user_id'])?htmlspecialchars($_SESSION['user_id']):''; ?>" style="display:none"></div>
        </main>
    </div>
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