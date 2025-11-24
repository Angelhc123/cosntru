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
                    <a class="card__action" href="#" onclick="mostrarActualizacionDatos(event)">Ingresar &#10148;</a>
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
                    <a class="card__action" href="#" onclick="mostrarFutWeb(event)">Ingresar &#10148;</a>
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
                    <a class="card__action" href="/alumno">Ingresar &#10148;</a>
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
                    <a class="card__action" href="#" onclick="mostrarEncuestas(event)">Ingresar &#10148;</a>
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
                    <a class="card__action" href="#" onclick="mostrarPracticas(event)">Ingresar &#10148;</a>
                </article>
            </section>

            <footer class="footer">
                Universidad Privada de Tacna &nbsp; Copyright &copy; 2016-2025 &nbsp; Versión 2.5
            </footer>
        </main>
    </div>

    <!-- Modal para formularios -->
    <div id="modalAcademico" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; overflow:auto;">
        <div style="max-width:800px; margin:50px auto; background:white; border-radius:8px; box-shadow:0 4px 20px rgba(0,0,0,0.3);">
            <div style="background:linear-gradient(135deg, #0b2f66 0%, #0a2550 100%); color:white; padding:20px 30px; border-radius:8px 8px 0 0; display:flex; justify-content:space-between; align-items:center;">
                <h2 id="modalTitle" style="margin:0; font-size:20px;">Título del Modal</h2>
                <button onclick="cerrarModal()" style="background:none; border:none; color:white; font-size:28px; cursor:pointer; line-height:1;">&times;</button>
            </div>
            <div id="modalContent" style="padding:30px;">
                Contenido del modal
            </div>
        </div>
    </div>

    <script>
        function cerrarModal() {
            document.getElementById('modalAcademico').style.display = 'none';
        }

        function mostrarModal(titulo, contenido) {
            document.getElementById('modalTitle').textContent = titulo;
            document.getElementById('modalContent').innerHTML = contenido;
            document.getElementById('modalAcademico').style.display = 'block';
        }

        function mostrarActualizacionDatos(e) {
            e.preventDefault();
            const contenido = `
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <p style="color:#5c6b80; margin:0 0 10px;">Complete los siguientes datos personales:</p>
                    
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                        <div>
                            <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Nombres:</label>
                            <input type="text" value="Piero Alexander" style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Apellidos:</label>
                            <input type="text" value="Paja De La Cruz" style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                        <div>
                            <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">DNI:</label>
                            <input type="text" value="75843621" style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Fecha de Nacimiento:</label>
                            <input type="date" value="2002-05-15" style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                        </div>
                    </div>

                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Dirección:</label>
                        <input type="text" value="Av. Bolognesi 1234, Tacna" style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                    </div>

                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
                        <div>
                            <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Teléfono:</label>
                            <input type="tel" value="952847163" style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                        </div>
                        <div>
                            <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Email Personal:</label>
                            <input type="email" value="piero.paja@gmail.com" style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                        </div>
                    </div>

                    <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:10px;">
                        <button onclick="cerrarModal()" style="padding:10px 20px; background:#737987; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Cancelar</button>
                        <button onclick="guardarDatos()" style="padding:10px 20px; background:#0b2f66; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Guardar Cambios</button>
                    </div>
                </div>
            `;
            mostrarModal('Actualización de Datos Personales', contenido);
        }

        function mostrarFutWeb(e) {
            e.preventDefault();
            const contenido = `
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background:#fff3cd; border:1px solid #ffc107; padding:15px; border-radius:4px; color:#856404;">
                        <strong>⚠️ Importante:</strong> Complete este formulario para solicitar trámites de matrícula.
                    </div>

                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Tipo de Trámite:</label>
                        <select style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                            <option>Seleccione un tipo de trámite</option>
                            <option>Rectificación de matrícula</option>
                            <option>Reserva de matrícula</option>
                            <option>Retiro de curso</option>
                            <option>Licencia de estudios</option>
                            <option>Matrícula extemporánea</option>
                        </select>
                    </div>

                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Semestre Académico:</label>
                        <select style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                            <option>2025-II</option>
                            <option>2025-I</option>
                            <option>2024-II</option>
                        </select>
                    </div>

                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Motivo de la Solicitud:</label>
                        <textarea rows="4" style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px; font-family:Arial;" placeholder="Describa el motivo de su solicitud..."></textarea>
                    </div>

                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Adjuntar Documentos:</label>
                        <input type="file" multiple style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                        <small style="color:#5c6b80;">Formatos permitidos: PDF, JPG, PNG (Máx. 5MB)</small>
                    </div>

                    <div style="display:flex; gap:10px; justify-content:flex-end; margin-top:10px;">
                        <button onclick="cerrarModal()" style="padding:10px 20px; background:#737987; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Cancelar</button>
                        <button onclick="enviarFut()" style="padding:10px 20px; background:#aa134b; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Enviar Solicitud</button>
                    </div>
                </div>
            `;
            mostrarModal('Formulario Único de Trámite (FUT) Web', contenido);
        }

        function mostrarEncuestas(e) {
            e.preventDefault();
            const contenido = `
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <p style="color:#5c6b80; margin:0;">Lista de encuestas disponibles para el semestre actual:</p>
                    
                    <div style="border:1px solid #d3d7e0; border-radius:4px; overflow:hidden;">
                        <div style="background:#0b2f66; color:white; padding:12px 20px; font-weight:600;">
                            Encuestas Pendientes
                        </div>
                        <div style="padding:20px; display:flex; flex-direction:column; gap:15px;">
                            <div style="border-left:4px solid #28a745; padding:15px; background:#f8f9fa;">
                                <div style="display:flex; justify-content:space-between; align-items:start;">
                                    <div>
                                        <strong style="color:#0b2f66;">Encuesta de Evaluación Docente 2025-II</strong>
                                        <p style="margin:8px 0 0; color:#5c6b80; font-size:14px;">Evalúa el desempeño de tus docentes</p>
                                        <small style="color:#28a745;">📅 Disponible hasta: 30/11/2025</small>
                                    </div>
                                    <button onclick="responderEncuesta('docente')" style="padding:8px 16px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:600; white-space:nowrap;">Responder</button>
                                </div>
                            </div>

                            <div style="border-left:4px solid #ffc107; padding:15px; background:#f8f9fa;">
                                <div style="display:flex; justify-content:space-between; align-items:start;">
                                    <div>
                                        <strong style="color:#0b2f66;">Encuesta de Servicios Universitarios</strong>
                                        <p style="margin:8px 0 0; color:#5c6b80; font-size:14px;">Ayúdanos a mejorar nuestros servicios</p>
                                        <small style="color:#856404;">📅 Disponible hasta: 28/11/2025</small>
                                    </div>
                                    <button onclick="responderEncuesta('servicios')" style="padding:8px 16px; background:#ffc107; color:#000; border:none; border-radius:4px; cursor:pointer; font-weight:600; white-space:nowrap;">Responder</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="border:1px solid #d3d7e0; border-radius:4px; overflow:hidden;">
                        <div style="background:#737987; color:white; padding:12px 20px; font-weight:600;">
                            Encuestas Completadas
                        </div>
                        <div style="padding:20px;">
                            <div style="border-left:4px solid #6c757d; padding:15px; background:#f8f9fa;">
                                <strong style="color:#0b2f66;">Encuesta de Infraestructura 2025-I</strong>
                                <p style="margin:8px 0 0; color:#5c6b80; font-size:14px;">✓ Completada el 15/06/2025</p>
                            </div>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; margin-top:10px;">
                        <button onclick="cerrarModal()" style="padding:10px 20px; background:#0b2f66; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Cerrar</button>
                    </div>
                </div>
            `;
            mostrarModal('Gestión de Encuestas Académicas', contenido);
        }

        function mostrarPracticas(e) {
            e.preventDefault();
            const contenido = `
                <div style="display:flex; flex-direction:column; gap:20px;">
                    <div style="background:#e7f3ff; border:1px solid #0b2f66; padding:15px; border-radius:4px; color:#0b2f66;">
                        <strong>ℹ️ Información:</strong> Busca y postula a oportunidades de prácticas pre-profesionales.
                    </div>

                    <div>
                        <label style="display:block; margin-bottom:6px; font-weight:600; color:#0b2f66;">Buscar por Área:</label>
                        <select style="width:100%; padding:10px; border:1px solid #d3d7e0; border-radius:4px;">
                            <option>Todas las áreas</option>
                            <option>Desarrollo de Software</option>
                            <option>Redes y Sistemas</option>
                            <option>Inteligencia Artificial</option>
                            <option>Ciberseguridad</option>
                            <option>Base de Datos</option>
                        </select>
                    </div>

                    <div style="border:1px solid #d3d7e0; border-radius:4px; overflow:hidden;">
                        <div style="background:#0b2f66; color:white; padding:12px 20px; font-weight:600;">
                            Prácticas Disponibles
                        </div>
                        <div style="padding:20px; display:flex; flex-direction:column; gap:15px; max-height:300px; overflow-y:auto;">
                            <div style="border:1px solid #d3d7e0; padding:15px; border-radius:4px;">
                                <strong style="color:#0b2f66;">Practicante de Desarrollo Web</strong>
                                <p style="margin:8px 0; color:#5c6b80; font-size:14px;">Empresa: TechSolutions SAC</p>
                                <p style="margin:8px 0; color:#5c6b80; font-size:14px;">📍 Tacna | 💰 S/. 1,200 | ⏰ 6 horas/día</p>
                                <button onclick="postularPractica('web')" style="margin-top:10px; padding:6px 14px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer; font-size:13px;">Postular</button>
                            </div>

                            <div style="border:1px solid #d3d7e0; padding:15px; border-radius:4px;">
                                <strong style="color:#0b2f66;">Practicante de Redes y Sistemas</strong>
                                <p style="margin:8px 0; color:#5c6b80; font-size:14px;">Empresa: Sistemas Integrados EIRL</p>
                                <p style="margin:8px 0; color:#5c6b80; font-size:14px;">📍 Tacna | 💰 S/. 1,000 | ⏰ 4 horas/día</p>
                                <button onclick="postularPractica('redes')" style="margin-top:10px; padding:6px 14px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer; font-size:13px;">Postular</button>
                            </div>

                            <div style="border:1px solid #d3d7e0; padding:15px; border-radius:4px;">
                                <strong style="color:#0b2f66;">Practicante de Inteligencia Artificial</strong>
                                <p style="margin:8px 0; color:#5c6b80; font-size:14px;">Empresa: AI Labs Perú</p>
                                <p style="margin:8px 0; color:#5c6b80; font-size:14px;">📍 Remoto | 💰 S/. 1,500 | ⏰ 6 horas/día</p>
                                <button onclick="postularPractica('ia')" style="margin-top:10px; padding:6px 14px; background:#28a745; color:white; border:none; border-radius:4px; cursor:pointer; font-size:13px;">Postular</button>
                            </div>
                        </div>
                    </div>

                    <div style="display:flex; justify-content:flex-end; margin-top:10px;">
                        <button onclick="cerrarModal()" style="padding:10px 20px; background:#737987; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:600;">Cerrar</button>
                    </div>
                </div>
            `;
            mostrarModal('Búsqueda de Prácticas Pre-Profesionales', contenido);
        }

        function guardarDatos() {
            alert('✅ Datos actualizados correctamente');
            cerrarModal();
        }

        function enviarFut() {
            alert('✅ Solicitud FUT enviada correctamente. Recibirá una notificación en su correo institucional.');
            cerrarModal();
        }

        function responderEncuesta(tipo) {
            cerrarModal();
            setTimeout(() => {
                alert('📝 Redirigiendo a la encuesta de ' + (tipo === 'docente' ? 'Evaluación Docente' : 'Servicios Universitarios'));
            }, 300);
        }

        function postularPractica(area) {
            alert('✅ Tu postulación ha sido registrada. La empresa se pondrá en contacto contigo pronto.');
        }

        // Cerrar modal al hacer clic fuera
        document.getElementById('modalAcademico').addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal();
            }
        });
    </script>
</body>
</html>
