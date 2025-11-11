<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Net.UPT.edu.pe - Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/chatbox-with-history.css">
    <style>
        :root{
            --navy:#0b2f66;
            --navy-dark:#061f4d;
            --navy-light:#123a7c;
            --accent:#f2a900;
            --border-gold:#f5d88b;
            --border-grey:#cfd3d6;
            --muted:#5f5f5f;
            --text:#1f1f1f;
        }

        body{
            margin:0;
            font-family:Arial, Helvetica, sans-serif;
            font-size:13px;
            background:#ffffff;
            color:var(--text);
        }

        .system-bar{
            background:var(--navy-dark);
            color:#fff;
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:6px 28px;
            font-size:12px;
            flex-wrap:wrap;
            gap:12px;
        }

        .system-bar__left{
            font-size:20px;
            font-weight:700;
            letter-spacing:-0.3px;
        }

        .system-bar__right{
            display:flex;
            align-items:center;
            gap:16px;
            flex-wrap:wrap;
        }

        .system-bar__right a{
            color:#fff;
            text-decoration:underline;
            font-weight:600;
        }

        .system-bar__user strong{
            font-weight:700;
        }

        .system-bar__time{
            font-weight:600;
        }

        .page{
            display:flex;
            min-height:100vh;
            background:#ffffff;
        }

        /* Sidebar */
        .sidebar{
            width:215px;
            background:var(--navy-light);
            color:#fff;
            border-right:4px solid var(--navy-dark);
        }

        .sidebar .block-title{
            padding:10px 16px;
            font-weight:700;
            font-size:12px;
            text-transform:uppercase;
            background:var(--navy-dark);
            border-top:1px solid rgba(255,255,255,0.25);
            border-bottom:1px solid rgba(0,0,0,0.45);
            letter-spacing:0.4px;
        }

        .sidebar ul{
            list-style:none;
            margin:0;
            padding:0;
        }

        .sidebar li{
            border-bottom:1px solid rgba(255,255,255,0.08);
        }

        .sidebar li:last-child{
            border-bottom:none;
        }

        .sidebar a{
            display:block;
            padding:8px 18px 8px 32px;
            color:#fff;
            font-weight:600;
            text-decoration:none;
            position:relative;
        }

        .sidebar a::before{
            content:'\203A';
            position:absolute;
            left:16px;
            top:50%;
            transform:translateY(-50%);
            font-size:16px;
        }

        .sidebar a[data-star]::after{
            content:'\2605';
            position:absolute;
            right:14px;
            top:50%;
            transform:translateY(-50%);
            color:#ffd966;
            font-size:12px;
        }

        .sidebar a:hover{
            background:rgba(255,255,255,0.12);
        }

        .sidebar .separator{
            height:1px;
            background:rgba(255,255,255,0.18);
            margin:8px 0;
        }

        /* Contenido principal */
        .content{
            flex:1;
            padding:28px 34px 44px;
        }

        .main-header{
            display:flex;
            justify-content:space-between;
            align-items:flex-end;
            gap:20px;
        }

        .welcome-title{
            margin:0;
            font-size:30px;
            font-weight:700;
            letter-spacing:-0.4px;
        }

        .welcome-title .accent{
            color:var(--accent);
        }

        .welcome-title .brand{
            color:var(--navy-dark);
        }

        .version-info{
            display:flex;
            align-items:center;
            gap:8px;
            font-size:11px;
            color:var(--navy-dark);
            font-weight:700;
            margin-top:4px;
        }

        .version-info .badge{
            width:16px;
            height:16px;
            background:var(--navy-dark);
            border:2px solid #fff;
            box-shadow:0 0 0 1px var(--navy-dark);
            display:inline-block;
        }

        .info-subtitle{
            margin:4px 0 0;
            color:#4a4a4a;
            font-style:italic;
            font-size:12px;
        }

        .directory-link{
            color:var(--navy-dark);
            font-weight:700;
            text-decoration:underline;
            font-size:13px;
        }

        .divider{
            height:2px;
            background:var(--navy-dark);
            margin:16px 0 24px;
        }

        .content-grid{
            display:flex;
            gap:28px;
        }

        .column-left{
            flex:1;
            min-width:0;
        }

        .column-right{
            width:260px;
        }

        .card{
            border:1px solid var(--border-grey);
            background:#ffffff;
            padding:16px 18px;
        }

        .card + .card{
            margin-top:16px;
        }

        .card h2,
        .card h3,
        .card h4{
            margin:0 0 10px 0;
            color:var(--navy-dark);
        }

        .welcome-card{
            padding:20px 22px 24px;
        }

        .section-heading{
            font-size:14px;
            font-weight:700;
            color:#6f6f6f;
            text-transform:uppercase;
            border-bottom:1px solid #dcdcdc;
            padding-bottom:6px;
            margin:0 0 14px 0;
        }

        .info-text{
            margin:0 0 12px 0;
            line-height:1.6;
        }

        .info-text strong{
            color:#1d1d1d;
        }

        .banner{
            margin:18px 0 20px;
            background:var(--navy-dark);
            color:#fff;
            padding:12px 18px;
            font-weight:700;
            text-transform:uppercase;
            font-size:13px;
            display:flex;
            flex-wrap:wrap;
            gap:6px;
        }

        .banner a{
            color:#fff;
            text-decoration:underline;
            font-weight:700;
        }

        .email-row{
            display:flex;
            align-items:center;
            gap:12px;
            flex-wrap:wrap;
        }

        .email-row label{
            font-weight:700;
            color:#1f1f1f;
            font-size:13px;
        }

        .email-row input{
            padding:8px 10px;
            border:1px solid #9ca3af;
            min-width:220px;
            font-size:13px;
            background:#f7f7f7;
            color:#1f1f1f;
        }

        .btn-primary{
            background:var(--navy-dark);
            color:#fff;
            font-weight:700;
            border:none;
            padding:9px 18px;
            cursor:pointer;
            display:inline-flex;
            align-items:center;
            gap:6px;
        }

        .password-row{
            margin-top:16px;
            display:flex;
            align-items:center;
            flex-wrap:wrap;
            gap:12px;
        }

        .password-row .note{
            font-weight:600;
            color:#1f1f1f;
            font-size:13px;
        }

        .list{
            margin:0;
            padding-left:18px;
            color:#333;
        }

        table{
            width:100%;
            border-collapse:collapse;
            margin-top:12px;
            font-size:12px;
        }

        th,
        td{
            border:1px solid #d0d4d9;
            padding:6px 8px;
        }

        th{
            background:#f4f4f5;
            color:#4a4a4a;
            text-transform:uppercase;
            font-weight:700;
            letter-spacing:0.3px;
        }

        .calendar-card{
            background:#f7f7f7;
            border:1px solid #bfc3c8;
        }

        .calendar-card strong{
            display:block;
            margin-bottom:12px;
            color:#6b6b6b;
            font-weight:700;
        }

        .calendar-buttons{
            display:flex;
            flex-direction:column;
        }

        .calendar-button{
            border-bottom:1px solid #cfd2d6;
            padding:10px 12px;
            background:#e4e5e7;
            font-weight:700;
            display:flex;
            justify-content:space-between;
            align-items:center;
            color:#1f1f1f;
        }

        .calendar-button:last-child{
            border-bottom:none;
        }

        .record-card .small-muted{
            margin:0 0 12px;
        }

        .record-card .btn-primary{
            width:100%;
            justify-content:center;
        }

        .benefits-area{
            margin-top:36px;
        }

        .benefits-area h4{
            margin:0;
            text-transform:uppercase;
            color:#6b6b6b;
            letter-spacing:0.5px;
        }

        .benefits-divider{
            height:1px;
            background:#d6d6d6;
            margin:10px 0 22px;
        }

        .benefits-list{
            display:flex;
            gap:40px;
            align-items:stretch;
        }

        .benefit-card{
            flex:1;
            display:flex;
            align-items:center;
            gap:18px;
        }

        .benefit-card .icon{
            width:90px;
            text-align:center;
            font-size:56px;
            color:var(--navy-dark);
        }

        .benefit-card .info h5{
            margin:0 0 4px 0;
            color:var(--navy-dark);
            font-size:15px;
            text-transform:uppercase;
        }

        .benefit-card .info .small-muted{
            font-size:12px;
            color:#444;
        }

        .benefit-card .download{
            margin-left:auto;
        }

        .download .btn-primary{
            padding:10px 20px;
        }

        .tickets-card{
            margin-top:24px;
        }

        .small-muted{
            color:var(--muted);
            font-size:12px;
        }

        @media(max-width:1100px){
            .system-bar{
                justify-content:center;
            }

            .page{
                flex-direction:column;
            }

            .sidebar{
                width:100%;
                border-right:none;
            }

            .content{
                padding:20px 16px 32px;
            }

            .content-grid{
                flex-direction:column;
            }

            .column-right{
                width:100%;
            }

            .benefits-list{
                flex-direction:column;
                gap:20px;
            }

            .email-row{
                flex-direction:column;
                align-items:flex-start;
            }

            .email-row input{
                width:100%;
            }

            .password-row{
                flex-direction:column;
                align-items:flex-start;
            }

            .main-header{
                flex-direction:column;
                align-items:flex-start;
                gap:12px;
            }
        }
    </style>
</head>
<body>
    <?php
        $usuario = isset($_SESSION['usuario']) ? htmlspecialchars($_SESSION['usuario']) : 'Invitado';
        $nombreCompleto = isset($_SESSION['nombre_completo']) && $_SESSION['nombre_completo'] !== '' ? htmlspecialchars($_SESSION['nombre_completo']) : $usuario;
        $emailPersonal = isset($_SESSION['email_personal']) && $_SESSION['email_personal'] !== '' ? htmlspecialchars($_SESSION['email_personal']) : '';
    ?>
    <header class="system-bar">
        <div class="system-bar__left">Net.UPT.edu.pe</div>
        <div class="system-bar__right">
            <span class="system-bar__user">Usuario: <strong><?php echo $nombreCompleto; ?></strong></span>
            <a href="#">Ayuda</a>
            <a href="logout.php">Finalizar</a>
            <span class="system-bar__time">Hora del sistema: <span id="sys-time">--:--:--</span></span>
        </div>
    </header>

    <div class="page">
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

        <main class="content">
            <div class="main-header">
                <div>
                    <h1 class="welcome-title"><span class="accent">Bienvenido a</span> <span class="brand">Net.UPT.edu.pe</span></h1>
                    <div class="version-info">
                        <span>versión 1.5 by Of. Tecnologías de la Información</span>
                        <span class="badge"></span>
                    </div>
                    <div class="info-subtitle">Información importante</div>
                </div>
                <a class="directory-link" href="#">Ver Directorio</a>
            </div>

            <div class="divider"></div>

            <div class="content-grid">
                <section class="column-left">
                    <div class="card welcome-card">
                        <div class="section-heading">INFORMACIÓN</div>
                        <p class="info-text"><strong>¿Tienes problemas con la Intranet?</strong> entonces escríbenos a intranet@upt.pe enviando tu código universitario y datos personales.</p>
                        <p class="info-text"><strong>¿Tienes problemas con tu cuenta de Correo Institucional Live@Edu?</strong> entonces escríbenos a soporte365@upt.pe enviando tu código universitario y datos personales.</p>
                        <p class="info-text"><strong>¿Tienes problemas con tu cuenta de Google?</strong> entonces escríbenos a soportegsuite@virtual.upt.pe enviando tu código universitario y datos personales.</p>

                        <div class="banner">
                            <span>ACTIVA TU CORREO INSTITUCIONAL UPT.PE hasta el 20/09/2025</span>
                            <a href="#">Ingrese aquí (Solo para estudiantes ingresantes)</a>
                        </div>

                        <div class="email-row">
                            <label for="personal-email">Su cuenta de correo personal es:</label>
                            <input id="personal-email" type="text" value="<?php echo $emailPersonal !== '' ? $emailPersonal : $usuario . '@gmail.com'; ?>" readonly>
                            <button class="btn-primary" type="button">&#128274; Cambiar Email</button>
                        </div>

                        <div class="password-row">
                            <div class="note">Seleccione el botón si desea cambiar su contraseña de la Intranet:</div>
                            <button class="btn-primary" type="button" onclick="alert('Función de cambiar contraseña (demo)')">&#128274; Cambiar Contraseña</button>
                        </div>
                    </div>

                    <div class="card access-card">
                        <h3>ÚLTIMOS ACCESOS</h3>
                        <ul class="list">
                            <li>Jueves 2 Octubre del 2025 4:56PM -</li>
                            <li>Jueves 2 Octubre del 2025 2:46PM -</li>
                            <li>Lunes 29 Septiembre del 2025 5:09PM -</li>
                            <li>Jueves 18 Septiembre del 2025 1:58PM -</li>
                        </ul>
                    </div>

                    <div class="card economics-card">
                        <h3>INFORMACIÓN ECONÓMICA</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nro</th>
                                    <th>Descripción</th>
                                    <th>Monto</th>
                                    <th>Vence</th>
                                    <th>Dependencia</th>
                                    <th>Semestre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td colspan="6">No tiene deuda hasta la fecha</td>
                                </tr>
                            </tbody>
                        </table>
                        <p style="margin-top:12px;"><strong>Deuda Libro:</strong> No tiene deuda de libro hasta la fecha</p>
                    </div>
                </section>

                <aside class="column-right">
                    <div class="card calendar-card">
                        <strong>CALENDARIOS ACADÉMICOS</strong>
                        <div class="calendar-buttons">
                            <div class="calendar-button">2025 - II <span>&lsaquo;</span></div>
                            <div class="calendar-button">2025 - INT <span>&lsaquo;</span></div>
                            <div class="calendar-button">2026 - REC <span>&lsaquo;</span></div>
                            <div class="calendar-button">2026 - I <span>&lsaquo;</span></div>
                            <div class="calendar-button">2026 - II <span>&lsaquo;</span></div>
                        </div>
                    </div>

                    <div class="card calendar-card record-card">
                        <strong>FICHA DE MATRÍCULA</strong>
                        <p class="small-muted">Esta opción estará habilitada hasta la rectificación de matrícula (demo)</p>
                        <button class="btn-primary" type="button">Descargar</button>
                    </div>
                </aside>
            </div>

            <section class="benefits-area">
                <h4>Beneficios</h4>
                <div class="benefits-divider"></div>
                <div class="benefits-list">
                    <article class="benefit-card">
                        <div class="icon">📶</div>
                        <div class="info">
                            <h5>GENERAR CLAVE WIFI:</h5>
                            <div class="small-muted">Procedimiento para acceder a UPT_WIFI</div>
                        </div>
                        <div class="download"><button class="btn-primary" type="button">⬇ Descargar</button></div>
                    </article>

                    <article class="benefit-card">
                        <div class="icon" style="color:var(--accent);">🧾</div>
                        <div class="info">
                            <h5>FICHA DE MATRÍCULA</h5>
                            <div class="small-muted"><strong>NOTA:</strong> Esta opción estará habilitada hasta la rectificación de matrícula (demo)</div>
                        </div>
                        <div class="download"><button class="btn-primary" type="button">⬇ Descargar</button></div>
                    </article>
                </div>
            </section>

            <section id="tickets" class="card tickets-card" style="display:none;">
                <h3>🎫 Mis Tickets de Soporte</h3>
                <div id="tickets-container" style="min-height:200px;">Cargando tus tickets...</div>
            </section>

            <div id="user-id-data" data-user-id="<?php echo isset($_SESSION['user_id'])?htmlspecialchars($_SESSION['user_id']):''; ?>" style="display:none;"></div>
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
            function pad(n){return n < 10 ? '0' + n : n;}
            function update(){
                const d = new Date();
                const s = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
                el.textContent = s;
            }
            update();
            setInterval(update, 1000);
        })();
    </script>
</body>
</html>