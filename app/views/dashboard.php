<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Net.UPT.edu.pe - Dashboard</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body style="background: #f5f5f5;">
    <div class="dashboard-container">
        <div class="dashboard-header">
            <div>
                <h2>Net.UPT.edu.pe</h2>
                <small>versión 1.5 by Ot. Tecnologías de la Información</small>
            </div>
            <div class="user-info">
                <span>Usuario: <?php echo $_SESSION['nombre_completo']; ?></span>
                <span>Ayuda 🛈</span>
                <span>Finalizar 🔌</span>
                <span>⏰ Hora del sistema: <?php echo date('H:i:s'); ?></span>
                <a href="logout.php" class="logout-btn">Cerrar Sesión</a>
            </div>
        </div>

        <nav class="dashboard-nav">
            <ul class="nav-tabs">
                <li class="nav-tab active">
                    <a href="#" onclick="showSection('academico')">Académico</a>
                </li>
                <li class="nav-tab">
                    <a href="#" onclick="showSection('tickets')">Mis Tickets</a>
                </li>
            </ul>
        </nav>

        <div class="dashboard-content">
            <div class="info-banner">
                <div class="banner-text">
                    <strong>¡Importante!</strong> Directorio para Matrícula 2025 - II
                </div>
                <a href="#" class="banner-btn">Ver Directorio</a>
            </div>

            <!-- Sección Académica -->
            <div id="academico" class="dashboard-section" style="display: block;">
                <h2 style="color: #1e3c72; margin-bottom: 20px;">Bienvenido al Sistema Académico</h2>
                
                <div class="info-banner" style="background: #d4edda; border-color: #c3e6cb;">
                    <div class="banner-text" style="color: #155724;">
                        <strong>INFORMACIÓN</strong><br>
                        ¿Tienes problemas con la Intranet?, entonces escríbanos a intranet@upt.pe enviando tu código universitario y datos personales.<br>
                        ¿Tienes problemas con tu cuenta de Correo Institucional Live@Edu?, entonces escríbanos a soporte365@live.upt.pe enviando tu código universitario y datos personales.<br>
                        ¿Tienes problemas con tu cuenta de Google?, entonces escríbanos a soportesuite@virtual.upt.pe enviando tu código universitario y datos personales.
                    </div>
                </div>

                <div class="info-banner" style="background: #fff3cd; border-color: #ffeaa7;">
                    <div class="banner-text" style="color: #856404;">
                        <strong>ACTIVA TU CORREO INSTITUCIONAL UPT.PE hasta el 20/09/2025 Ingrese aquí (Solo para estudiantes ingresantes)</strong>
                    </div>
                    <a href="#" class="banner-btn" style="background: #ffc107; color: #212529;">🔒 Cambiar Email</a>
                </div>

                <div style="margin: 20px 0;">
                    <p><strong>Su cuenta de correo personal es:</strong> <?php echo $_SESSION['usuario']; ?>@gmail.com</p>
                    <button class="banner-btn" style="background: #007bff;">📧 Cambiar Contraseña</button>
                </div>

                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3 class="card-title">📚 ÚLTIMOS ACCESOS</h3>
                        <ul class="menu-list">
                            <li class="menu-item">Jueves 2 Octubre del 2025 4:56PM -</li>
                            <li class="menu-item">Jueves 2 Octubre del 2025 2:46PM -</li>
                            <li class="menu-item">Lunes 29 Septiembre del 2025 5:09PM -</li>
                            <li class="menu-item">Jueves 18 Septiembre del 2025 1:58PM -</li>
                        </ul>
                    </div>

                    <div class="dashboard-card">
                        <h3 class="card-title">📅 CALENDARIOS ACADÉMICOS</h3>
                        <div style="text-align: center;">
                            <div style="border: 1px solid #ddd; padding: 20px; margin: 10px 0; border-radius: 8px;">
                                <strong>📅 CALENDARIO ACADÉMICO</strong><br>
                                <strong>RECUPERACIÓN Y NIVELACIÓN ACADÉMICA 2025</strong><br>
                                <small>Fecha de fin de cursos: 7° ciclo - 01 al 20 de diciembre del 2025</small><br>
                                <small>Matrícula de cursos: 7° ciclo - 04 al 24 de diciembre del 2025</small><br>
                                <small>INICIO DE CLASES - 30 de diciembre del 2025</small><br>
                                <small>Pago de 7° ciclo - 01 al 27 de febrero del 2025</small><br>
                                <small>FINALIZACIÓN DE RECUPERACIÓN - 01 de febrero del 2025</small><br>
                                <small>Y NIVELACIÓN ACADÉMICA - 28 de febrero del 2025</small><br>
                                <small>1° Parcial Académica - 1° parcial de Aula Virtual - 29 de febrero del 2025</small>
                            </div>
                            
                            <button class="btn" style="margin: 10px 0;">2025 - REC</button>
                            <button class="btn" style="margin: 10px 0;">2025 - INT</button>
                            <button class="btn" style="margin: 10px 0;">2025 - I</button>
                            <button class="btn" style="margin: 10px 0;">2025 - II</button>
                        </div>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3 class="card-title">💰 INFORMACIÓN ECONÓMICA</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f8f9fa;">
                                    <th style="padding: 10px; border: 1px solid #ddd;">Nro</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Descripción</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Monto</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Vence</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Dependencia</th>
                                    <th style="padding: 10px; border: 1px solid #ddd;">Semestre</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;" colspan="6">No tiene deuda hasta la fecha</td>
                                </tr>
                            </tbody>
                        </table>
                        
                        <div style="margin-top: 15px;">
                            <strong>Deuda Libro:</strong><br>
                            No tiene deuda de libro hasta la fecha
                        </div>
                    </div>

                    <div class="dashboard-card">
                        <h3 class="card-title">🎯 BENEFICIOS</h3>
                        <p>Información sobre beneficios estudiantiles disponibles.</p>
                    </div>
                </div>
            </div>

            <!-- Sección Mis Tickets -->
            <div id="tickets" class="dashboard-section" style="display: none;">
                <h2 style="color: #1e3c72; margin-bottom: 20px;">🎫 Mis Tickets de Soporte</h2>
                
                <div id="tickets-container" style="min-height: 400px;">
                    <div class="loading-tickets" style="text-align: center; padding: 40px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">⏳</div>
                        <p>Cargando tus tickets...</p>
                    </div>
                </div>
                
                <!-- Chat de ticket (oculto inicialmente) -->
                <div id="ticket-chat-container" style="display: none;">
                    <div class="ticket-chat-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0; display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="margin: 0; font-size: 18px;" id="ticket-chat-title">Ticket #TKT-20251029-0001</h3>
                            <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;" id="ticket-chat-status">Estado: Asignado</p>
                        </div>
                        <button onclick="closeTicketChat()" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                            ← Volver a lista
                        </button>
                    </div>
                    
                    <div id="ticket-messages" style="background: #f5f5f5; height: 400px; overflow-y: auto; padding: 20px; border: 1px solid #ddd; border-top: none;">
                        <!-- Mensajes del ticket se cargarán aquí -->
                    </div>
                    
                    <div class="ticket-input-area" style="display: flex; gap: 10px; padding: 15px; background: white; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
                        <input type="text" id="ticket-message-input" placeholder="Escribe tu mensaje..." style="flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px;">
                        <button onclick="sendTicketMessage()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                            Enviar
                        </button>
                        <button onclick="confirmResolveTicket()" style="background: #28a745; color: white; border: none; padding: 12px 25px; border-radius: 5px; cursor: pointer; font-weight: 600;">
                            Finalizar Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="js/script.js"></script>
    <script src="js/config.js"></script>
    <script src="js/tickets-user.js"></script>
    
    <!-- CHATBOX CON HISTORIAL - Se conecta a MongoDB Atlas vía API Gateway -->
    <link rel="stylesheet" href="css/chatbox-with-history.css">
    
    <!-- User ID para el chatbox (OCULTO) -->
    <div id="user-id-data" data-user-id="<?php echo $_SESSION['user_id']; ?>" style="display:none;"></div>
    
    <script src="js/chatbox-with-history.js"></script>
</body>
</html>