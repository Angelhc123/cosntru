<?php
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../app/controllers/AuthController.php';

// Verificar autenticación y tipo de usuario
if (!isset($_SESSION['user_id']) || $_SESSION['tipo_usuario'] !== 'administrativo') {
    header('Location: login.php');
    exit();
}

$userName = $_SESSION['nombre_completo'] ?? 'Administrador';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Tickets - Sistema UPT</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .tickets-container {
            padding: 20px;
            max-width: 1400px;
            margin: 0 auto;
        }

        .tickets-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 10px;
        }

        .filter-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .filter-tab {
            padding: 10px 20px;
            border: none;
            background: #f0f0f0;
            cursor: pointer;
            border-radius: 5px;
            font-weight: 500;
            transition: all 0.3s;
        }

        .filter-tab.active {
            background: #667eea;
            color: white;
        }

        .tickets-table {
            width: 100%;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .tickets-table table {
            width: 100%;
            border-collapse: collapse;
        }

        .tickets-table th {
            background: #f8f9fa;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #495057;
            border-bottom: 2px solid #dee2e6;
        }

        .tickets-table td {
            padding: 15px;
            border-bottom: 1px solid #dee2e6;
        }

        .status-badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .status-pending {
            background: #fff3cd;
            color: #856404;
        }

        .status-in-progress {
            background: #cfe2ff;
            color: #084298;
        }

        .status-resolved {
            background: #d1e7dd;
            color: #0f5132;
        }

        .priority-badge {
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: 600;
        }

        .priority-high {
            background: #f8d7da;
            color: #842029;
        }

        .priority-medium {
            background: #fff3cd;
            color: #856404;
        }

        .priority-low {
            background: #d1e7dd;
            color: #0f5132;
        }

        .action-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
        }

        .btn-attend {
            background: #0d6efd;
            color: white;
        }

        .btn-attend:hover {
            background: #0b5ed7;
        }

        .btn-close {
            background: #198754;
            color: white;
        }

        .btn-close:hover {
            background: #157347;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000;
        }

        .modal-content {
            position: relative;
            background: white;
            width: 90%;
            max-width: 900px;
            margin: 50px auto;
            border-radius: 10px;
            overflow: hidden;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
        }

        .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-body {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }

        .ticket-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .chat-container {
            border: 1px solid #dee2e6;
            border-radius: 8px;
            height: 400px;
            display: flex;
            flex-direction: column;
        }

        .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 15px;
            background: #f8f9fa;
        }

        .chat-message {
            margin-bottom: 15px;
            padding: 10px;
            border-radius: 8px;
            max-width: 70%;
        }

        .chat-message.admin {
            background: #e7f3ff;
            margin-left: auto;
        }

        .chat-message.user {
            background: white;
        }

        .chat-input-area {
            display: flex;
            gap: 10px;
            padding: 15px;
            border-top: 1px solid #dee2e6;
        }

        .chat-input-area input {
            flex: 1;
            padding: 10px;
            border: 1px solid #ced4da;
            border-radius: 5px;
        }

        .chat-input-area button {
            padding: 10px 20px;
            background: #0d6efd;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }

        .close-modal {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
        }

        .no-tickets {
            text-align: center;
            padding: 40px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="sidebar">
            <div class="sidebar-header">
                <h2>🎓 Sistema UPT</h2>
            </div>
            <ul class="menu">
                <li><a href="admin_dashboard.php">📊 Dashboard</a></li>
                <li><a href="admin_faqs.php">❓ Gestión FAQs</a></li>
                <li><a href="admin_tickets.php" class="active">🎫 Tickets de Soporte</a></li>
                <li><a href="logout.php">🚪 Cerrar Sesión</a></li>
            </ul>
        </div>

        <div class="main-content">
            <div class="tickets-container">
                <div class="tickets-header">
                    <div>
                        <h1>🎫 Gestión de Tickets de Soporte</h1>
                        <p>Administrador: <?php echo htmlspecialchars($userName); ?></p>
                    </div>
                    <button onclick="refreshTickets()" class="action-btn btn-attend">🔄 Actualizar</button>
                </div>

                <div class="filter-tabs">
                    <button class="filter-tab active" onclick="filterTickets('all')">Todos</button>
                    <button class="filter-tab" onclick="filterTickets('pending')">Pendientes</button>
                    <button class="filter-tab" onclick="filterTickets('in-progress')">En Progreso</button>
                    <button class="filter-tab" onclick="filterTickets('resolved')">Resueltos</button>
                </div>

                <div class="tickets-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Ticket ID</th>
                                <th>Usuario</th>
                                <th>Consulta</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tickets-tbody">
                            <tr>
                                <td colspan="7" class="no-tickets">Cargando tickets...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para atender ticket -->
    <div id="ticketModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modal-ticket-id">Ticket #...</h2>
                <button class="close-modal" onclick="closeTicketModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="ticket-info" id="ticket-info">
                    <!-- Info del ticket -->
                </div>
                <div class="chat-container">
                    <div class="chat-messages" id="chat-messages">
                        <!-- Mensajes del chat -->
                    </div>
                    <div class="chat-input-area">
                        <input type="text" id="message-input" placeholder="Escribe tu respuesta...">
                        <button onclick="sendMessage()">Enviar</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const API_URL = 'http://localhost:3000';
        let currentFilter = 'all';
        let currentTicketId = null;
        let pollInterval = null;

        // Cargar tickets al iniciar
        document.addEventListener('DOMContentLoaded', () => {
            loadTickets();
            // Auto-refresh cada 30 segundos
            setInterval(loadTickets, 30000);
        });

        async function loadTickets() {
            try {
                const statusParam = currentFilter !== 'all' ? `?status=${currentFilter}` : '';
                const response = await fetch(`${API_URL}/support/tickets${statusParam}`);
                const data = await response.json();

                if (data.success) {
                    displayTickets(data.data);
                }
            } catch (error) {
                console.error('Error cargando tickets:', error);
            }
        }

        function displayTickets(tickets) {
            const tbody = document.getElementById('tickets-tbody');
            
            if (tickets.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="no-tickets">No hay tickets disponibles</td></tr>';
                return;
            }

            tbody.innerHTML = tickets.map(ticket => `
                <tr>
                    <td><strong>${ticket.ticketId}</strong></td>
                    <td>${ticket.userName}<br><small>${ticket.userEmail}</small></td>
                    <td>${ticket.originalQuery.substring(0, 50)}...</td>
                    <td><span class="priority-badge priority-${ticket.priority}">${ticket.priority}</span></td>
                    <td><span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></td>
                    <td>${new Date(ticket.createdAt).toLocaleString('es-PE')}</td>
                    <td>
                        <button class="action-btn btn-attend" onclick="openTicket('${ticket.ticketId}')">
                            ${ticket.status === 'resolved' ? 'Ver' : 'Atender'}
                        </button>
                    </td>
                </tr>
            `).join('');
        }

        function getStatusText(status) {
            const texts = {
                'pending': 'Pendiente',
                'in-progress': 'En Progreso',
                'resolved': 'Resuelto'
            };
            return texts[status] || status;
        }

        function filterTickets(filter) {
            currentFilter = filter;
            
            // Actualizar UI de tabs
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            loadTickets();
        }

        function refreshTickets() {
            loadTickets();
        }

        async function openTicket(ticketId) {
            currentTicketId = ticketId;
            
            try {
                // Cargar info del ticket
                const ticketResponse = await fetch(`${API_URL}/support/tickets/${ticketId}`);
                const ticketData = await ticketResponse.json();
                
                if (ticketData.success) {
                    const ticket = ticketData.data;
                    
                    document.getElementById('modal-ticket-id').textContent = `Ticket ${ticketId}`;
                    document.getElementById('ticket-info').innerHTML = `
                        <h3>Información del Ticket</h3>
                        <p><strong>Usuario:</strong> ${ticket.userName} (${ticket.userEmail})</p>
                        <p><strong>Consulta Original:</strong> ${ticket.originalQuery}</p>
                        <p><strong>Respuesta del Bot:</strong> ${ticket.botResponse}</p>
                        <p><strong>Nivel de Confianza:</strong> ${(ticket.confidence * 100).toFixed(1)}%</p>
                        <p><strong>Prioridad:</strong> <span class="priority-badge priority-${ticket.priority}">${ticket.priority}</span></p>
                        <p><strong>Estado:</strong> <span class="status-badge status-${ticket.status}">${getStatusText(ticket.status)}</span></p>
                    `;
                    
                    // Cargar mensajes del chat
                    await loadTicketMessages(ticketId);
                    
                    // Cambiar estado a "in-progress" si está pendiente
                    if (ticket.status === 'pending') {
                        await fetch(`${API_URL}/support/tickets/${ticketId}/status`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                status: 'in-progress',
                                assignedTo: '<?php echo $_SESSION['nombre_completo']; ?>'
                            })
                        });
                    }
                    
                    // Mostrar modal
                    document.getElementById('ticketModal').style.display = 'block';
                    
                    // Iniciar polling de mensajes
                    if (pollInterval) clearInterval(pollInterval);
                    pollInterval = setInterval(() => loadTicketMessages(ticketId), 5000);
                }
            } catch (error) {
                console.error('Error abriendo ticket:', error);
                alert('Error al cargar el ticket');
            }
        }

        async function loadTicketMessages(ticketId) {
            try {
                const response = await fetch(`${API_URL}/support/tickets/${ticketId}/messages`);
                const data = await response.json();
                
                if (data.success) {
                    const messagesDiv = document.getElementById('chat-messages');
                    messagesDiv.innerHTML = data.data.map(msg => `
                        <div class="chat-message ${msg.sender}">
                            <strong>${msg.senderName}</strong>
                            <p>${msg.message}</p>
                            <small>${new Date(msg.timestamp).toLocaleString('es-PE')}</small>
                        </div>
                    `).join('');
                    
                    // Scroll al final
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                    
                    // Marcar como leídos
                    if (data.data.length > 0) {
                        await fetch(`${API_URL}/support/tickets/${ticketId}/messages/read`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ sender: 'admin' })
                        });
                    }
                }
            } catch (error) {
                console.error('Error cargando mensajes:', error);
            }
        }

        async function sendMessage() {
            const input = document.getElementById('message-input');
            const message = input.value.trim();
            
            if (!message) return;
            
            try {
                const response = await fetch(`${API_URL}/support/tickets/${currentTicketId}/messages`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sender: 'admin',
                        senderName: '<?php echo $_SESSION['nombre_completo']; ?>',
                        message: message
                    })
                });
                
                if (response.ok) {
                    input.value = '';
                    await loadTicketMessages(currentTicketId);
                }
            } catch (error) {
                console.error('Error enviando mensaje:', error);
                alert('Error al enviar mensaje');
            }
        }

        // Permitir enviar con Enter
        document.addEventListener('DOMContentLoaded', () => {
            document.getElementById('message-input')?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        });

        function closeTicketModal() {
            document.getElementById('ticketModal').style.display = 'none';
            if (pollInterval) {
                clearInterval(pollInterval);
                pollInterval = null;
            }
            loadTickets(); // Refrescar lista
        }

        // Cerrar modal al hacer clic fuera
        window.onclick = function(event) {
            const modal = document.getElementById('ticketModal');
            if (event.target === modal) {
                closeTicketModal();
            }
        }
    </script>
</body>
</html>
