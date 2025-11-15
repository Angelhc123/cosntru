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
            display:block;
            min-height:100vh;
        }

        .top-strip{
            background:var(--navy-dark);
            color:#fff;
            display:flex;
            align-items:center;
            padding:10px 28px;
            font-size:12px;
            flex-wrap:wrap;
            gap:18px;
            width:100%;
            box-shadow:0 2px 4px rgba(0,0,0,0.25);
        }

        .top-strip__left{
            display:flex;
            align-items:center;
            font-weight:700;
        }

        .top-strip__left .brand{
            font-size:18px;
        }

        .top-strip__center{
            display:flex;
            justify-content:center;
            align-items:center;
            flex:1;
            flex-wrap:wrap;
        }

        .top-strip__center .user{
            font-weight:700;
            text-transform:uppercase;
        }

        .top-strip__right{
            display:flex;
            align-items:center;
            gap:16px;
            font-weight:600;
            font-size:12px;
            flex-wrap:wrap;
            justify-content:flex-end;
        }

        .top-strip__right a{
            color:#fff;
            text-decoration:none;
            font-weight:600;
            display:inline-flex;
            align-items:center;
            gap:4px;
            font-size:12px;
        }

        .top-strip__right .icon{
            width:16px;
            height:16px;
            border:1px solid #fff;
            border-radius:50%;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            font-size:11px;
        }

        .top-strip__clock{
            display:flex;
            align-items:center;
            gap:6px;
        }

        .page{
            display:flex;
            min-height:100vh;
            background:#ffffff;
            width:100%;
        }

        /* Sidebar */
        .sidebar{
            width:215px;
            background:#ffffff;
            color:var(--navy-dark);
            border-right:1px solid #d0d4d9;
        }

        .sidebar ul{
            list-style:none;
            margin:0;
            padding:0;
        }

        .sidebar li{
            border-bottom:1px dotted #d4b45a;
        }

        .sidebar li:last-child{
            border-bottom:none;
        }

        .sidebar li.menu-separator{
            height:0;
            margin:6px 0;
            border-bottom:1px dotted #d4b45a;
        }

        .sidebar .menu-item{
            display:block;
            padding:7px 18px 7px 32px;
            color:var(--navy-dark);
            font-weight:600;
            text-decoration:none;
            position:relative;
            transition:color 0.2s ease;
        }

        .sidebar .menu-item::before{
            content:'>';
            position:absolute;
            left:14px;
            top:50%;
            transform:translateY(-50%);
            font-size:14px;
            color:#6f6f6f;
            font-weight:700;
        }

        .sidebar .menu-item[data-star]::after{
            content:'\2605';
            position:absolute;
            right:14px;
            top:50%;
            transform:translateY(-50%);
            color:#ffd966;
            font-size:12px;
        }

        .sidebar .menu-item:hover{
            color:#f6b541;
        }

        .sidebar .menu-item:hover::before{
            color:#f6b541;
        }

        .menu-item--highlight{
            background:var(--navy-dark);
            color:#ffffff;
        }

        .sidebar .menu-item.menu-item--highlight:visited{
            color:#ffffff;
        }

        .menu-item--highlight::before,
        .sidebar .menu-item.menu-item--highlight:visited::before{
            color:#ffffff;
        }

        .menu-item--highlight:hover,
        .sidebar .menu-item.menu-item--highlight:visited:hover{
            color:#f5d88b;
        }

        .menu-item--highlight:hover::before,
        .sidebar .menu-item.menu-item--highlight:visited:hover::before{
            color:#f5d88b;
        }

        .menu-item--uppercase{
            text-transform:uppercase;
            letter-spacing:0.25px;
        }

        .menu-item--label{
            cursor:default;
            display:block;
            padding:7px 18px;
        }

        .menu-item--label::before{
            display:none;
        }

        .menu-item--label:hover{
            color:#f5d88b;
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

        /* Modal Google Workspace */
        .modal-overlay{
            position:fixed;
            inset:0;
            background:rgba(10,20,60,0.7);
            display:none;
            align-items:center;
            justify-content:center;
            padding:20px;
            z-index:2000;
        }

        .modal-overlay.is-visible{
            display:flex;
        }

        .workspace-modal{
            width:100%;
            max-width:520px;
            background:#ffffff;
            border-radius:6px;
            box-shadow:0 10px 32px rgba(0,0,0,0.35);
            position:relative;
            overflow:hidden;
        }

        .workspace-modal__close{
            position:absolute;
            right:14px;
            top:12px;
            background:#0b2f66;
            color:#fff;
            border:none;
            width:26px;
            height:26px;
            border-radius:50%;
            cursor:pointer;
            font-weight:700;
        }

        .workspace-modal__header{
            padding:18px 24px 10px;
            text-align:center;
            font-weight:700;
            color:#0b2f66;
            text-transform:uppercase;
            letter-spacing:0.6px;
        }

        .workspace-modal__body{
            padding:0 28px 28px;
            display:flex;
            flex-direction:column;
            gap:18px;
        }

        .workspace-field{
            display:flex;
            flex-direction:column;
            gap:8px;
        }

        .workspace-field label{
            font-size:12px;
            font-weight:700;
            color:#12264d;
        }

        .workspace-field__input-group{
            display:flex;
            gap:10px;
        }

        .workspace-field input{
            flex:1;
            padding:10px 12px;
            border:1px solid #c6ccda;
            font-size:13px;
            background:#f4f5fa;
            color:#0b1f3b;
        }

        .workspace-copy{
            min-width:86px;
            background:#0b2f66;
            color:#fff;
            border:none;
            font-size:12px;
            font-weight:700;
            cursor:pointer;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            padding:0 14px;
        }

        .workspace-brand{
            text-align:center;
            margin-top:6px;
        }

        .workspace-brand img{
            max-width:320px;
            width:100%;
            height:auto;
        }

        .info-modal{
            width:100%;
            max-width:560px;
            background:#ffffff;
            border-radius:6px;
            box-shadow:0 10px 28px rgba(0,0,0,0.32);
            position:relative;
            padding:30px 32px 34px;
            overflow:hidden;
        }

        .info-modal::before{
            content:'Universidad Privada de Tacna     Universidad Privada de Tacna     Universidad Privada de Tacna\AUniversidad Privada de Tacna     Universidad Privada de Tacna     Universidad Privada de Tacna\AUniversidad Privada de Tacna     Universidad Privada de Tacna     Universidad Privada de Tacna';
            white-space:pre;
            position:absolute;
            inset:-120px -80px;
            font-size:20px;
            color:#b3bccf;
            opacity:0.18;
            transform:rotate(-28deg);
            pointer-events:none;
            line-height:42px;
        }

        .info-modal__title{
            text-align:center;
            text-transform:uppercase;
            font-weight:700;
            letter-spacing:0.6px;
            margin:0 0 18px;
            color:#0b2f66;
            position:relative;
        }

        .info-modal__body{
            position:relative;
            background:rgba(255,255,255,0.94);
            padding:0 4px 12px 0;
            max-height:320px;
            overflow-y:auto;
        }

        .info-modal__list{
            list-style:none;
            margin:0;
            padding:0 4px 0 12px;
        }

        .info-modal__list li{
            font-weight:700;
            color:#0d2350;
            margin-bottom:14px;
        }

        .info-modal__list li:last-child{
            margin-bottom:0;
        }

        .info-modal__list a{
            color:#c3122f;
            text-decoration:none;
            font-weight:700;
            margin-left:6px;
        }

        .info-modal__list a:hover{
            text-decoration:underline;
        }

        .info-modal__badge{
            display:inline-block;
            background:#c3122f;
            color:#fff;
            text-transform:uppercase;
            font-size:11px;
            padding:2px 6px;
            border-radius:3px;
            margin-left:8px;
        }

        @media(max-width:1100px){
            .top-strip{
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
    <header class="top-strip">
        <div class="top-strip__left">
            <span class="brand">Net.UPT.edu.pe</span>
        </div>
        <div class="top-strip__center">
            <span class="user">Usuario: <strong><?php echo $nombreCompleto; ?></strong></span>
        </div>
        <div class="top-strip__right">
            <a href="#"><span class="icon" aria-hidden="true">?</span>Ayuda</a>
            <a href="logout.php"><span class="icon" aria-hidden="true">⏻</span>Finalizar</a>
            <div class="top-strip__clock">
                <span class="icon" aria-hidden="true">🕒</span>
                <span>Hora del sistema:</span>
                <span id="sys-time">--:--:--</span>
            </div>
        </div>
    </header>

    <div class="page">
        <aside class="sidebar">
            <ul class="menu">
                <li><a class="menu-item menu-item--highlight" href="#">Inicio</a></li>
                <li><a class="menu-item menu-item--uppercase" href="academico.php" target="_blank" rel="noopener noreferrer">ACADÉMICO</a></li>
                <li><a class="menu-item menu-item--highlight" href="#" data-star="1" id="workspace-link" data-modal-target="workspace-modal">Google Workspace</a></li>
                <li><a class="menu-item" href="#">Office365@Edu</a></li>
                <li><a class="menu-item" href="https://azure.microsoft.com/es-es/get-started/azure-portal/" target="_blank" rel="noopener noreferrer">Convenio Microsoft</a></li>
                <li class="menu-separator"></li>
                <li><a class="menu-item menu-item--highlight menu-item--uppercase" href="#">ELECCIONES</a></li>
                <li><a class="menu-item menu-item--highlight menu-item--uppercase" href="#">PASARELA</a></li>
                <li><a class="menu-item" href="#">Alumno</a></li>
                <li><a class="menu-item" href="https://aulavirtual.upt.edu.pe/" target="_blank" rel="noopener noreferrer">Aula Virtual</a></li>
                <li><a class="menu-item menu-item--highlight menu-item--uppercase" href="academico.php" target="_blank" rel="noopener noreferrer">GPS ALUMNI</a></li>
                <li><a class="menu-item" href="#">Comprobantes Electrónicos</a></li>
                <li><a class="menu-item" href="#">Biblioteca</a></li>
                <li><a class="menu-item" href="#" data-modal-target="modal-seguro">Seguro Estudiantil</a></li>
                <li><a class="menu-item" href="#" data-modal-target="modal-buses">Recorrido de Buses</a></li>
                <li><a class="menu-item" href="#" data-modal-target="modal-reglamentos">Reglamento y Directivas</a></li>
                <li><a class="menu-item" href="https://net.upt.edu.pe/documentos/BecasySubvenciones.pdf" target="_blank" rel="noopener noreferrer">Becas y Subvenciones</a></li>
                <li><a class="menu-item" href="#" id="tickets-link">Mis Tickets de Soporte</a></li>
                <li class="menu-separator"></li>
                <li><span class="menu-item menu-item--highlight menu-item--label menu-item--uppercase">ANUNCIOS</span></li>
                <li><a class="menu-item" href="#">Guía Estudiante</a></li>
                <li><a class="menu-item" href="#">¿Office365@Edu?</a></li>
                <li><a class="menu-item" href="#">C. Institucional</a></li>
                <li><a class="menu-item" href="#">Veritrade</a></li>
                <li><a class="menu-item" href="#">Palestra</a></li>
                <li><a class="menu-item" href="https://net.upt.edu.pe/documentos/2025-II/COSTO_DEL_CREDITO_2025-I_Y_2025-II_PREGRADO.pdf" target="_blank" rel="noopener noreferrer">Valor del Crédito</a></li>
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

    <div class="modal-overlay" id="workspace-modal" role="dialog" aria-modal="true" aria-labelledby="workspace-modal-title" data-modal-focus="#workspace-email">
        <div class="workspace-modal">
            <button class="workspace-modal__close" type="button" aria-label="Cerrar" data-modal-close>&times;</button>
            <div class="workspace-modal__header" id="workspace-modal-title">Acceso plataforma Google Workspace</div>
            <div class="workspace-modal__body">
                <div class="workspace-field">
                    <label for="workspace-email">Correo electrónico</label>
                    <div class="workspace-field__input-group">
                        <input id="workspace-email" type="text" value="pp2020067576@virtual.upt.pe" readonly>
                        <button class="workspace-copy" type="button" data-copy-target="workspace-email">Copiar</button>
                    </div>
                </div>
                <div class="workspace-field">
                    <label for="workspace-password">Contraseña</label>
                    <div class="workspace-field__input-group">
                        <input id="workspace-password" type="text" value="ffe.Ad95" readonly>
                        <button class="workspace-copy" type="button" data-copy-target="workspace-password">Copiar</button>
                    </div>
                </div>
                <div class="workspace-brand">
                    <strong style="display:block;font-size:20px;color:#5f6368;">Google Workspace</strong>
                    <div style="margin-top:12px;font-size:28px;display:flex;justify-content:center;gap:18px;color:#0b2f66;">
                        <span aria-hidden="true">📧</span>
                        <span aria-hidden="true">📆</span>
                        <span aria-hidden="true">📁</span>
                        <span aria-hidden="true">📊</span>
                        <span aria-hidden="true">🎥</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="modal-seguro" role="dialog" aria-modal="true" aria-labelledby="modal-seguro-title">
        <div class="info-modal">
            <button class="workspace-modal__close" type="button" aria-label="Cerrar" data-modal-close>&times;</button>
            <h2 class="info-modal__title" id="modal-seguro-title">Información del Seguro</h2>
            <div class="info-modal__body">
                <ul class="info-modal__list">
                    <li>Información básica del Seguro de Accidentes Personales <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a></li>
                    <li>Programa de Protección de Accidentes Estudiantiles (Cobertura) <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a></li>
                    <li>Hoja de denuncia de Accidentes <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a></li>
                </ul>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="modal-buses" role="dialog" aria-modal="true" aria-labelledby="modal-buses-title">
        <div class="info-modal">
            <button class="workspace-modal__close" type="button" aria-label="Cerrar" data-modal-close>&times;</button>
            <h2 class="info-modal__title" id="modal-buses-title">Recorrido de Buses</h2>
            <div class="info-modal__body">
                <ul class="info-modal__list">
                    <li>Recorrido de la Ruta A <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a></li>
                    <li>Recorrido de la Ruta B <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a></li>
                </ul>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="modal-reglamentos" role="dialog" aria-modal="true" aria-labelledby="modal-reglamentos-title">
        <div class="info-modal">
            <button class="workspace-modal__close" type="button" aria-label="Cerrar" data-modal-close>&times;</button>
            <h2 class="info-modal__title" id="modal-reglamentos-title">Reglamentos</h2>
            <div class="info-modal__body">
                <ul class="info-modal__list">
                    <li>Directiva para la gestión de pagos por derecho de enseñanza en la Universidad Privada de Tacna <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a><span class="info-modal__badge">Nuevo</span></li>
                    <li>Reglamento General de la Universidad Privada de Tacna <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a></li>
                    <li>Estatuto de la Universidad Privada de Tacna - Edición 2014 <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a></li>
                    <li>Reglamento de Matrícula Estudios y Evaluación <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a><span class="info-modal__badge">Nuevo</span></li>
                    <li>Reglamento para optar Grados Académicos y Títulos Profesionales en la Universidad Privada de Tacna <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a></li>
                    <li>Reglamento de Diplomado de Post Grado de la Universidad Privada de Tacna <a href="#" target="_blank" rel="noopener noreferrer">(Descargar)</a></li>
                </ul>
            </div>
        </div>
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

        // Muestra la sección de tickets al pulsar el enlace del sidebar
        document.addEventListener('DOMContentLoaded', function(){
            const ticketsLink = document.getElementById('tickets-link');
            const ticketsSection = document.getElementById('tickets');
            if(ticketsLink && ticketsSection){
                ticketsLink.addEventListener('click', function(ev){
                    ev.preventDefault();
                    // Toggle: si está visible, ocultar sección (y cerrar chat si está abierto)
                    const isVisible = ticketsSection.style.display !== 'none' && ticketsSection.style.display !== '';
                    if(isVisible){
                        // Si el chat está abierto, cerrarlo
                        if(typeof closeTicketChat === 'function'){
                            try{ closeTicketChat(); }catch(e){
                                // fallback: hide chat and show nothing
                                const chat = document.getElementById('ticket-chat-container');
                                if(chat) chat.style.display = 'none';
                                const list = document.getElementById('tickets-container');
                                if(list) list.style.display = 'none';
                            }
                        } else {
                            const chat = document.getElementById('ticket-chat-container');
                            if(chat) chat.style.display = 'none';
                            const list = document.getElementById('tickets-container');
                            if(list) list.style.display = 'none';
                        }
                        ticketsSection.style.display = 'none';
                    } else {
                        // Mostrar sección y desplegar lista de tickets
                        ticketsSection.style.display = 'block';
                        const list = document.getElementById('tickets-container');
                        if(list) list.style.display = 'block';
                        ticketsSection.scrollIntoView({behavior:'smooth', block:'start'});
                        // loadUserTickets se encarga mediante observer, pero llamamos por si acaso
                        if(typeof loadUserTickets === 'function'){
                            try{ loadUserTickets(); }catch(e){ /* ignore */ }
                        }
                    }
                });
            }

            let activeModal = null;

            function openModal(modal){
                if(!modal) return;
                if(activeModal && activeModal !== modal){
                    closeModal(activeModal);
                }
                modal.classList.add('is-visible');
                activeModal = modal;

                const focusSelector = modal.getAttribute('data-modal-focus');
                if(focusSelector){
                    const focusElement = modal.querySelector(focusSelector);
                    if(focusElement){
                        setTimeout(function(){ focusElement.focus(); }, 100);
                    }
                }
            }

            function closeModal(modal){
                if(!modal) return;
                modal.classList.remove('is-visible');
                if(activeModal === modal){
                    activeModal = null;
                }
                modal.querySelectorAll('[data-copy-target]').forEach(function(btn){
                    btn.textContent = 'Copiar';
                });
            }

            document.querySelectorAll('[data-modal-target]').forEach(function(trigger){
                const modalId = trigger.getAttribute('data-modal-target');
                const modal = document.getElementById(modalId);
                if(!modal) return;

                trigger.addEventListener('click', function(ev){
                    ev.preventDefault();
                    openModal(modal);
                });

                modal.querySelectorAll('[data-modal-close]').forEach(function(btn){
                    btn.addEventListener('click', function(){
                        closeModal(modal);
                    });
                });

                modal.addEventListener('click', function(ev){
                    if(ev.target === modal){
                        closeModal(modal);
                    }
                });
            });

            document.addEventListener('keydown', function(ev){
                if(ev.key === 'Escape' && activeModal){
                    closeModal(activeModal);
                }
            });

            document.querySelectorAll('[data-copy-target]').forEach(function(btn){
                btn.addEventListener('click', function(){
                    const targetId = btn.getAttribute('data-copy-target');
                    const input = targetId ? document.getElementById(targetId) : null;
                    if(!input) return;
                    input.focus();
                    input.select();
                    input.setSelectionRange(0, input.value.length);
                    if(navigator.clipboard && navigator.clipboard.writeText){
                        navigator.clipboard.writeText(input.value);
                    } else {
                        document.execCommand('copy');
                    }
                    btn.textContent = 'Copiado';
                    setTimeout(function(){ btn.textContent = 'Copiar'; }, 1500);
                });
            });
        });
    </script>
</body>
</html>