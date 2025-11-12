<?php
    $usuario = isset($_SESSION['usuario']) ? htmlspecialchars($_SESSION['usuario']) : '0000000000';
    $nombreCompleto = isset($_SESSION['nombre_completo']) && $_SESSION['nombre_completo'] !== '' ? htmlspecialchars($_SESSION['nombre_completo']) : 'Estudiante';
    $tipoUsuario = isset($_SESSION['tipo_usuario']) ? htmlspecialchars($_SESSION['tipo_usuario']) : 'ESTUDIANTE';
    $inicial = strtoupper(substr($nombreCompleto, 0, 1));
    if ($inicial === '') {
        $inicial = 'E';
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Integrado AcadWEB - Módulo Académico</title>
    <style>
        :root{
            --navy:#0b2f66;
            --navy-dark:#08254c;
            --navy-deep:#0c1f3a;
            --accent:#c00f4f;
            --grey:#eef2f7;
            --text:#1f2a3d;
            --muted:#5c6b80;
            --card-grey:#7f7f92;
        }

        *{
            box-sizing:border-box;
        }

        body{
            margin:0;
            font-family:Arial, Helvetica, sans-serif;
            background:var(--grey);
            color:var(--text);
        }

        .top-bar{
            background:var(--navy-dark);
            color:#fff;
            display:flex;
            align-items:center;
            justify-content:space-between;
            padding:12px 28px;
            border-bottom:3px solid #05162f;
        }

        .top-bar__brand{
            font-size:18px;
            font-weight:700;
            letter-spacing:0.6px;
        }

        .top-bar__brand span{
            color:#f7c845;
        }

        .top-bar__actions{
            display:flex;
            align-items:center;
            gap:18px;
            font-size:13px;
        }

        .top-bar__actions a{
            color:#fff;
            text-decoration:none;
            display:inline-flex;
            align-items:center;
            gap:6px;
        }

        .layout{
            display:flex;
            min-height:calc(100vh - 60px);
        }

        .sidebar{
            width:240px;
            background:var(--navy-deep);
            color:#d5deef;
            display:flex;
            flex-direction:column;
            gap:28px;
            padding:28px 20px 40px;
        }

        .profile{
            display:flex;
            flex-direction:column;
            align-items:flex-start;
            gap:10px;
        }

        .profile__avatar{
            width:64px;
            height:64px;
            border-radius:50%;
            background:#14345c;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:26px;
            font-weight:700;
            color:#fff;
        }

        .profile__name{
            font-weight:700;
            color:#fff;
        }

        .profile__code{
            font-size:12px;
            color:#aeb6c8;
        }

        .profile__role{
            font-size:12px;
            font-weight:700;
            color:#f7c845;
        }

        .sidebar__menu-title{
            margin:0;
            font-size:12px;
            letter-spacing:0.5px;
            text-transform:uppercase;
            color:#8895ad;
        }

        .sidebar__menu-button{
            margin-top:12px;
            display:inline-flex;
            align-items:center;
            gap:8px;
            padding:10px 14px;
            background:rgba(255,255,255,0.08);
            color:#fff;
            text-decoration:none;
            text-transform:uppercase;
            font-weight:700;
            font-size:12px;
            border:1px solid rgba(255,255,255,0.15);
        }

        .sidebar__menu-button:hover{
            background:rgba(255,255,255,0.18);
        }

        .content{
            flex:1;
            padding:32px 35px 48px;
            display:flex;
            flex-direction:column;
            gap:28px;
        }

        .breadcrumbs{
            background:#ffffff;
            border:1px solid #d8dde6;
            padding:12px 18px;
            font-size:12px;
            color:var(--muted);
        }

        .breadcrumbs strong{
            color:var(--navy-dark);
        }

        .content-header h1{
            margin:0 0 6px;
            font-size:24px;
            color:var(--navy-dark);
        }

        .content-header span{
            font-size:13px;
            color:var(--muted);
        }

        .cards{
            display:grid;
            gap:20px;
            grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));
        }

        .card{
            background:#ffffff;
            border-radius:6px;
            border:1px solid #d3d7e0;
            box-shadow:0 2px 6px rgba(0,0,0,0.08);
            display:flex;
            flex-direction:column;
            min-height:168px;
        }

        .card__body{
            padding:20px 22px 14px;
            display:flex;
            flex-direction:column;
            gap:12px;
        }

        .card__title{
            margin:0;
            font-size:18px;
            font-weight:700;
            color:#fff;
        }

        .card__subtitle{
            margin:0;
            font-size:13px;
            color:rgba(255,255,255,0.9);
        }

        .card__icon{
            font-size:28px;
        }

        .card__header{
            display:flex;
            justify-content:space-between;
            align-items:flex-start;
        }

        .card__action{
            margin-top:auto;
            background:rgba(0,0,0,0.15);
            color:#fff;
            text-decoration:none;
            text-transform:uppercase;
            font-weight:700;
            font-size:12px;
            padding:12px 18px;
            display:flex;
            align-items:center;
            justify-content:center;
            gap:8px;
            border-top:1px solid rgba(255,255,255,0.25);
        }

        .card__action:hover{
            background:rgba(0,0,0,0.28);
        }

        .card--magenta{
            background:linear-gradient(180deg,#aa134b 0%,#8b0f3c 100%);
        }

        .card--grey{
            background:linear-gradient(180deg,#737987 0%,#5d626e 100%);
        }

        .card--navy{
            background:linear-gradient(180deg,#0b2f66 0%,#0a2550 100%);
        }

        .card--dark{
            background:linear-gradient(180deg,#0b2f66 0%,#071a38 100%);
        }

        .footer{
            margin-top:auto;
            font-size:12px;
            color:#61738f;
            text-align:center;
            padding:18px 0 6px;
        }

        @media(max-width:900px){
            .layout{
                flex-direction:column;
            }

            .sidebar{
                width:100%;
                flex-direction:row;
                align-items:center;
                justify-content:space-between;
                gap:16px;
            }

            .sidebar__menu-button{
                margin-top:0;
            }
        }
    </style>
</head>
<body>
    <header class="top-bar">
        <div class="top-bar__brand">Integrado<span>Acad</span>WEB</div>
        <div class="top-bar__actions">
            <a href="#">&#9993;</a>
            <a href="#">&#128276;</a>
            <span><?php echo $nombreCompleto; ?></span>
        </div>
    </header>

    <div class="layout">
        <aside class="sidebar">
            <div class="profile">
                <div class="profile__avatar"><?php echo $inicial; ?></div>
                <div class="profile__name"><?php echo $nombreCompleto; ?></div>
                <div class="profile__code"><?php echo $usuario; ?></div>
                <div class="profile__role"><?php echo strtoupper($tipoUsuario); ?></div>
            </div>
            <div>
                <p class="sidebar__menu-title">Menú de navegación</p>
                <a class="sidebar__menu-button" href="#">&#9776; Abrir menú</a>
            </div>
        </aside>

        <main class="content">
            <div class="breadcrumbs">
                <strong>Principal</strong> &gt; Intranet &gt; Integrado Académico UPT
            </div>
            <div class="content-header">
                <h1>Sistema Integrado Académico</h1>
                <span>Módulo del Integrado Académico UPT</span>
            </div>

            <section class="cards">
                <article class="card card--magenta">
                    <div class="card__body">
                        <div class="card__header">
                            <div>
                                <h3 class="card__title">Actualización de Datos</h3>
                                <p class="card__subtitle">Gestión de información del Estudiante</p>
                            </div>
                            <span class="card__icon">&#9998;</span>
                        </div>
                    </div>
                    <a class="card__action" href="#">Ingresar &#10148;</a>
                </article>

                <article class="card card--grey">
                    <div class="card__body">
                        <div class="card__header">
                            <div>
                                <h3 class="card__title">Fut Web</h3>
                                <p class="card__subtitle">Gestión de Fut para Matrícula</p>
                            </div>
                            <span class="card__icon">&#128196;</span>
                        </div>
                    </div>
                    <a class="card__action" href="#">Ingresar &#10148;</a>
                </article>

                <article class="card card--navy">
                    <div class="card__body">
                        <div class="card__header">
                            <div>
                                <h3 class="card__title">Horario de Cursos</h3>
                                <p class="card__subtitle">Gestión de Horario de los Cursos</p>
                            </div>
                            <span class="card__icon">&#128197;</span>
                        </div>
                    </div>
                    <a class="card__action" href="#">Ingresar &#10148;</a>
                </article>

                <article class="card card--navy">
                    <div class="card__body">
                        <div class="card__header">
                            <div>
                                <h3 class="card__title">Encuestas</h3>
                                <p class="card__subtitle">Verificación de Encuestas</p>
                            </div>
                            <span class="card__icon">&#128203;</span>
                        </div>
                    </div>
                    <a class="card__action" href="#">Ingresar &#10148;</a>
                </article>

                <article class="card card--dark">
                    <div class="card__body">
                        <div class="card__header">
                            <div>
                                <h3 class="card__title">Seguimiento de Prácticas</h3>
                                <p class="card__subtitle">Búsqueda de Prácticas</p>
                            </div>
                            <span class="card__icon">&#128187;</span>
                        </div>
                    </div>
                    <a class="card__action" href="#">Ingresar &#10148;</a>
                </article>
            </section>

            <footer class="footer">
                Universidad Privada de Tacna &nbsp; Copyright &copy; 2016-2025 &nbsp; Versión 2.5
            </footer>
        </main>
    </div>
</body>
</html>
