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
            padding:26px 32px 40px;
        }

        .hero{
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
            gap:20px;
        }

        .hero-title{
            margin:0;
            font-size:30px;
            font-weight:700;
            letter-spacing:-0.4px;
        }

        .hero-title .accent{
            color:var(--accent);
        }

        .hero-title .brand{
            color:var(--navy-dark);
        }

        .hero-sub{
            margin:2px 0 0;
            color:#4a4a4a;
            font-style:italic;
            font-size:12px;
        }

        .hero-action{
            color:var(--navy-dark);
            font-weight:700;
            text-decoration:underline;
            cursor:pointer;
            display:inline-block;
            margin-top:4px;
        }

        .divider{
            height:4px;
            background:var(--navy-dark);
            margin:12px 0 24px;
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
            padding:18px 20px 20px;
        }

        .welcome-card .note{
            margin:0;
            line-height:1.6;
        }

        .welcome-card .highlight{
            margin:18px 0 0;
            background:#fff3d1;
            border:1px solid #e7cf83;
            padding:12px;
            font-weight:600;
            color:#6a4d00;
            max-width:240px;
        }

        .info-row{
            display:flex;
            gap:16px;
            flex-wrap:wrap;
            align-items:stretch;
            margin-top:18px;
        }

        .highlight{
            flex:0 0 220px;
        }

        .btn-email{
            background:var(--accent);
            color:#1d1d1d;
            font-weight:700;
            border:none;
            padding:10px 18px;
            cursor:pointer;
            min-width:140px;
        }

        .email-block{
            display:flex;
            flex-direction:column;
            gap:8px;
            justify-content:center;
            min-width:220px;
        }

        .mail-meta{
            font-weight:600;
            color:#2c2c2c;
            font-size:12px;
            line-height:1.4;
        }

        .btn-password{
            background:var(--navy-dark);
            color:#fff;
            border:none;
            font-weight:700;
            padding:12px 24px;
            cursor:pointer;
            flex:1;
            display:flex;
            align-items:center;
            justify-content:center;
        }

        .btn-password span{
            display:inline-flex;
            align-items:center;
            gap:8px;
        }

        .list{
            margin:0;
            padding-left:18px;
            color:#333;
        }

        .calendar-card{
            background:#f1f2f4;
        }

        .calendar-card strong{
            display:block;
            margin-bottom:10px;
            color:#152b4a;
        }

        .calendar-buttons{
            display:flex;
            flex-direction:column;
            gap:8px;
        }

        .calendar-buttons button{
            border:1px solid #c5c8cc;
            background:#e9eaec;
            font-weight:700;
            padding:8px 12px;
            text-align:left;
            cursor:pointer;
        }

        .record-card .small-muted{
            margin:0 0 12px;
        }

        .benefits-area{
            margin-top:32px;
        }

        .benefits-area h4{
            margin:0;
            text-transform:uppercase;
            color:#666666;
        }

        .benefits-divider{
            height:1px;
            background:#d6d6d6;
            margin:10px 0 18px;
        }

        .benefits-list{
            display:flex;
            gap:22px;
        }

        .benefit-card{
            flex:1;
            border:1px solid var(--border-grey);
            padding:18px;
            display:flex;
            align-items:center;
            gap:16px;
            background:#ffffff;
        }

        .benefit-card .icon{
            font-size:40px;
            color:var(--navy-dark);
        }

        .benefit-card .info h5{
            margin:0 0 6px 0;
            color:var(--navy-dark);
            font-size:14px;
        }

        .btn-download{
            margin-left:auto;
            background:var(--navy-dark);
            color:#fff;
            border:none;
            font-weight:700;
            padding:8px 18px;
            cursor:pointer;
        }

        .record-card .btn-download{
            margin-left:0;
            width:100%;
            display:block;
            text-align:center;
        }

        .tickets-card{
            margin-top:24px;
        }

        .small-muted{
            color:var(--muted);
            font-size:12px;
        }

        @media(max-width:1100px){
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
            }

            .info-row .highlight{
                flex:1 1 100%;
            }

            .email-block{
                min-width:unset;
            }

            .btn-password{
                flex:1 1 100%;
            }
        }
    </style>
</head>
<body>
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
            <header class="hero">
                <div>
                    <h1 class="hero-title"><span class="accent">Bienvenido a</span> <span class="brand">Net.UPT.edu.pe</span></h1>
                    <p class="hero-sub">Información importante</p>
                </div>
                <a class="hero-action" href="#">Ver Directorio</a>
            </header>

            <div class="divider"></div>

            <div class="content-grid">
                <section class="column-left">
                    <div class="card welcome-card">
                        <h2>Bienvenido al Sistema Académico</h2>
                        <p class="note"><strong>INFORMACIÓN</strong><br>¿Tienes problemas con la Intranet? entonces escríbenos a intranet@upt.pe enviando tu código universitario y datos personales.</p>

                        <div class="info-row">
                            <div class="highlight">ACTIVA TU CORREO INSTITUCIONAL UPT.PE hasta el 20/09/2025 (Solo ingresantes)</div>

                            <div class="email-block">
                                <button class="btn-email">🔒 Cambiar Email</button>
                                <div class="mail-meta"><strong>Su cuenta de correo personal es:</strong><br><?php echo isset($_SESSION['usuario'])?htmlspecialchars($_SESSION['usuario']):''; ?>@gmail.com</div>
                            </div>

                            <button class="btn-password" onclick="alert('Función de cambiar contraseña (demo)')"><span>📧 Cambiar Contraseña</span></button>
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
                        <p>No tiene deuda hasta la fecha</p>
                        <p style="margin-top:6px;"><strong>Deuda Libro:</strong> No tiene deuda de libro hasta la fecha</p>
                    </div>
                </section>

                <aside class="column-right">
                    <div class="card calendar-card">
                        <strong>CALENDARIOS ACADÉMICOS</strong>
                        <div class="calendar-buttons">
                            <button>2025 - REC</button>
                            <button>2025 - INT</button>
                            <button>2025 - I</button>
                            <button>2025 - II</button>
                        </div>
                    </div>

                    <div class="card calendar-card record-card">
                        <strong>FICHA DE MATRÍCULA</strong>
                        <p class="small-muted">Esta opción estará habilitada hasta la rectificación de matrícula (demo)</p>
                        <button class="btn-download">Descargar</button>
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
                            <h5>Generar Clave WIFI:</h5>
                            <div class="small-muted">Procedimiento para acceder a UPT_WIFI</div>
                        </div>
                        <button class="btn-download">Descargar</button>
                    </article>

                    <article class="benefit-card">
                        <div class="icon" style="color:var(--accent);">🧾</div>
                        <div class="info">
                            <h5>Ficha de Matrícula</h5>
                            <div class="small-muted">Esta opción estará habilitada hasta la rectificación de matrícula (demo)</div>
                        </div>
                        <button class="btn-download">Descargar</button>
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