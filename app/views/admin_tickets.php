<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Tickets - Administrador</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .admin-container {
            max-width: 1600px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }

        .admin-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .admin-header h1 {
            font-size: 28px;
            font-weight: 600;
        }

        .admin-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .admin-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        .logout-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }

        .logout-btn:hover {
            background: rgba(255,255,255,0.3);
        }

        .back-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
            margin-right: 10px;
        }

        .back-btn:hover {
            background: rgba(255,255,255,0.3);
        }

        .content-wrapper {
            display: flex;
            height: calc(100vh - 180px);
        }

        .tickets-list-panel {
            flex: 1;
            border-right: 2px solid #e9ecef;
            overflow-y: auto;
            padding: 20px;
        }

        .ticket-chat-panel {
            flex: 1.2;
            display: none;
            flex-direction: column;
        }

        .ticket-chat-panel.active {
            display: flex;
        }

        .filter-bar {
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 8px 16px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
        }

        .filter-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: transparent;
        }

        .ticket-item {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .ticket-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .ticket-item.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: transparent;
        }

        .ticket-header-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }

        .ticket-id {
            font-weight: 600;
            font-size: 16px;
        }

        .status-badge {
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-pending {
            background: #ffc107;
            color: #000;
        }

        .status-assigned {
            background: #17a2b8;
            color: white;
        }

        .status-resolved {
            background: #28a745;
            color: white;
        }

        .ticket-subject {
            font-size: 14px;
            margin-bottom: 8px;
            font-weight: 500;
        }

        .ticket-meta {
            font-size: 12px;
            opacity: 0.8;
        }

        .assign-btn {
            margin-top: 10px;
            padding: 8px 15px;
            background: #28a745;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            width: 100%;
            transition: all 0.3s;
        }

        .assign-btn:hover {
            background: #218838;
        }

        .assign-btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }

        .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #f5f5f5;
        }

        .message {
            margin-bottom: 15px;
            display: flex;
        }

        .message.user {
            justify-content: flex-end;
        }

        .message.admin {
            justify-content: flex-start;
        }

        .message.system {
            justify-content: center;
        }

        .message-content {
            max-width: 70%;
            padding: 12px 16px;
            border-radius: 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .message.user .message-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px 15px 0 15px;
        }

        .message.admin .message-content {
            background: #e9ecef;
            color: #333;
            border-radius: 15px 15px 15px 0;
        }

        .message.system .message-content {
            background: #f0f0f0;
            color: #666;
            font-size: 13px;
            padding: 8px 15px;
            border-radius: 15px;
        }

        .message-sender {
            font-weight: 600;
            font-size: 13px;
            margin-bottom: 5px;
            opacity: 0.9;
        }

        .message-time {
            font-size: 11px;
            color: #999;
            margin-top: 5px;
        }

        .chat-input-area {
            display: flex;
            gap: 10px;
            padding: 15px;
            background: white;
            border-top: 1px solid #ddd;
        }

        .chat-input {
            flex: 1;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            resize: none;
            font-family: inherit;
        }

        .send-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
        }

        .send-btn:hover {
            opacity: 0.9;
        }

        .resolve-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
        }

        .resolve-btn:hover {
            background: #218838;
        }

        .close-chat-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }

        .loading {
            text-align: center;
            padding: 40px;
            font-size: 18px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <div>
                <h1>🎫 Panel de Tickets de Soporte</h1>
                <p style="margin-top: 5px; opacity: 0.9;">Gestión de tickets de usuarios</p>
            </div>
            <div class="admin-info">
                <a href="/admin" class="back-btn">← Volver al Panel</a>
                <div class="admin-avatar">👨‍💼</div>
                <div>
                    <div style="font-weight: 600;"><?php echo isset($_SESSION['nombre_completo']) ? htmlspecialchars($_SESSION['nombre_completo']) : 'Administrador'; ?></div>
                    <div style="font-size: 13px; opacity: 0.8;">Soporte Técnico</div>
                </div>
                <a href="/logout" class="logout-btn">Cerrar Sesión</a>
            </div>
        </div>

        <div class="content-wrapper">
            <!-- Panel izquierdo: Lista de tickets -->
            <div class="tickets-list-panel">
                <div class="filter-bar">
                    <button class="filter-btn active" onclick="filterTickets('all')">Todos</button>
                    <button class="filter-btn" onclick="filterTickets('pending')">⏳ Pendientes</button>
                    <button class="filter-btn" onclick="filterTickets('assigned')">👤 Asignados</button>
                    <button class="filter-btn" onclick="filterTickets('resolved')">✅ Resueltos</button>
                    <button class="filter-btn" onclick="filterTickets('mine')">📋 Mis Tickets</button>
                </div>

                <div id="tickets-container">
                    <div class="loading">
                        ⏳ Cargando tickets...
                    </div>
                </div>
            </div>

            <!-- Panel derecho: Chat del ticket -->
            <div class="ticket-chat-panel" id="ticket-chat-panel">
                <div class="chat-header">
                    <div>
                        <h3 style="margin: 0; font-size: 18px;" id="chat-ticket-id">Ticket #TKT-20251029-0001</h3>
                        <p style="margin: 5px 0 0 0; font-size: 13px; opacity: 0.9;" id="chat-ticket-info">Usuario: Juan Pérez | Estado: Asignado</p>
                    </div>
                    <button class="close-chat-btn" onclick="closeChatPanel()">← Cerrar</button>
                </div>

                <div class="chat-messages" id="chat-messages">
                    <!-- Mensajes se cargarán aquí -->
                </div>

                <div class="chat-input-area">
                    <textarea class="chat-input" id="chat-input" rows="1" placeholder="Escribe tu respuesta..."></textarea>
                    <button class="send-btn" onclick="sendAdminMessage()">Enviar</button>
                    <button class="resolve-btn" onclick="confirmResolveTicket()">Finalizar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Admin ID (desde sesión PHP) -->
    <div id="admin-data" style="display: none;" 
         data-admin-id="<?php echo isset($_SESSION['user_id']) ? htmlspecialchars($_SESSION['user_id']) : '1'; ?>" 
         data-admin-name="<?php echo isset($_SESSION['nombre_completo']) ? htmlspecialchars($_SESSION['nombre_completo']) : 'Administrador'; ?>" 
         data-admin-email="<?php echo isset($_SESSION['usuario']) ? htmlspecialchars($_SESSION['usuario']) : 'admin@upt.pe'; ?>"></div>

    <script src="/js/config.js"></script>
    <script src="/js/admin-tickets.js"></script>
</body>
</html>