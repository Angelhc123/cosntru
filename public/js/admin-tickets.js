/**
 * Sistema de Gestión de Tickets - Panel de Administración
 * Conecta con API Gateway en Railway
 */

// Importar configuración centralizada
// const API_BASE_URL se define en config.js
let currentFilter = 'all';
let selectedTicketId = null;
let currentAdminTicket = null; // Ticket actualmente asignado al admin
let pollingInterval = null;
let lastMessageCount = 0;

// Obtener datos del admin
function getAdminData() {
    const adminElement = document.getElementById('admin-data');
    return {
        id: adminElement?.dataset.adminId || '1',
        name: adminElement?.dataset.adminName || 'Administrador',
        email: adminElement?.dataset.adminEmail || 'admin@upt.pe'
    };
}

/**
 * Cargar todos los tickets según filtro
 */
async function loadAllTickets() {
    const container = document.getElementById('tickets-container');
    container.innerHTML = '<div class="loading">⏳ Cargando tickets...</div>';

    try {
        const response = await fetch(`${API_BASE_URL}/tickets`);
        
        if (!response.ok) {
            throw new Error('Error al cargar tickets');
        }

        const data = await response.json();
        let tickets = data.data || [];

        // Aplicar filtro
        tickets = applyFilter(tickets);

        if (tickets.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div style="font-size: 64px; margin-bottom: 20px;">📭</div>
                    <h3>No hay tickets ${currentFilter === 'all' ? '' : 'que coincidan con el filtro'}</h3>
                    <p>Los tickets aparecerán aquí cuando los usuarios los generen.</p>
                </div>
            `;
            return;
        }

        renderTicketsList(tickets);

    } catch (error) {
        console.error('Error cargando tickets:', error);
        container.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 48px; margin-bottom: 20px; color: #d9534f;">⚠️</div>
                <h3>Error al cargar tickets</h3>
                <p>${error.message}</p>
                <button class="filter-btn" onclick="loadAllTickets()" style="margin-top: 20px;">Reintentar</button>
            </div>
        `;
    }
}

/**
 * Aplicar filtro a tickets
 */
function applyFilter(tickets) {
    const admin = getAdminData();
    
    switch (currentFilter) {
        case 'pending':
            return tickets.filter(t => t.status === 'pending');
        case 'assigned':
            return tickets.filter(t => t.status === 'assigned');
        case 'resolved':
            return tickets.filter(t => t.status === 'resolved');
        case 'mine':
            return tickets.filter(t => t.adminId === admin.id && t.status !== 'resolved');
        default:
            return tickets;
    }
}

/**
 * Renderizar lista de tickets
 */
function renderTicketsList(tickets) {
    const container = document.getElementById('tickets-container');
    const admin = getAdminData();
    
    let html = '';
    
    tickets.forEach(ticket => {
        const isActive = selectedTicketId === ticket.ticketId;
        const canAssign = ticket.status === 'pending' && !currentAdminTicket;
        const isMine = ticket.adminId === admin.id;
        
        const fecha = new Date(ticket.createdAt).toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });

        html += `
            <div class="ticket-item ${isActive ? 'active' : ''}" onclick="openTicketChat('${ticket.ticketId}')">
                <div class="ticket-header-info">
                    <div class="ticket-id">🎫 ${ticket.ticketId}</div>
                    ${getStatusBadge(ticket.status)}
                </div>
                
                <div class="ticket-subject">${ticket.subject || 'Sin asunto'}</div>
                
                <div class="ticket-meta">
                    <div>👤 ${ticket.userName}</div>
                    <div>📅 ${fecha}</div>
                    ${ticket.adminName ? `<div>🛠️ ${ticket.adminName}</div>` : '<div style="color: #ffc107;">⏳ Sin asignar</div>'}
                    <div>💬 ${ticket.messages.length} mensajes</div>
                </div>
                
                ${ticket.status === 'pending' ? `
                    <button class="assign-btn" 
                            ${canAssign ? '' : 'disabled'} 
                            onclick="event.stopPropagation(); assignTicketToMe('${ticket.ticketId}')"
                            title="${currentAdminTicket ? 'Solo puedes atender 1 ticket a la vez' : 'Asignar este ticket a mí'}">
                        ${canAssign ? '✋ Asignar a mí' : '🔒 No disponible'}
                    </button>
                ` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * Badge de estado
 */
function getStatusBadge(status) {
    const badges = {
        pending: '<span class="status-badge status-pending">⏳ Pendiente</span>',
        assigned: '<span class="status-badge status-assigned">👤 Asignado</span>',
        resolved: '<span class="status-badge status-resolved">✅ Resuelto</span>'
    };
    return badges[status] || badges.pending;
}

/**
 * Asignar ticket al admin actual
 */
async function assignTicketToMe(ticketId) {
    const admin = getAdminData();
    
    // Verificar si ya tiene ticket asignado
    if (currentAdminTicket) {
        alert('⚠️ Solo puedes atender 1 ticket a la vez.\nFinaliza tu ticket actual antes de asignar otro.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/assign`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                adminId: admin.id,
                adminName: admin.name,
                adminEmail: admin.email
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al asignar ticket');
        }

        currentAdminTicket = ticketId;
        alert(`✅ Ticket ${ticketId} asignado correctamente`);
        
        // Recargar lista y abrir chat
        await loadAllTickets();
        await openTicketChat(ticketId);

    } catch (error) {
        console.error('Error asignando ticket:', error);
        alert('Error: ' + error.message);
    }
}

/**
 * Abrir chat del ticket
 */
async function openTicketChat(ticketId) {
    selectedTicketId = ticketId;

    try {
        const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar ticket');
        }

        const data = await response.json();
        const ticket = data.data;

        // Actualizar ticket activo del admin
        const admin = getAdminData();
        if (ticket.adminId === admin.id && ticket.status === 'assigned') {
            currentAdminTicket = ticketId;
        }

        // Actualizar header
        document.getElementById('chat-ticket-id').textContent = `Ticket #${ticket.ticketId}`;
        document.getElementById('chat-ticket-info').textContent = 
            `Usuario: ${ticket.userName} | Email: ${ticket.userEmail} | Estado: ${getStatusText(ticket.status)}`;

        // Renderizar mensajes
        renderChatMessages(ticket.messages);
        lastMessageCount = ticket.messages.length;

        // Deshabilitar input si no es del admin o está resuelto
        const canRespond = ticket.adminId === admin.id && ticket.status !== 'resolved';
        document.getElementById('chat-input').disabled = !canRespond;
        document.querySelector('.send-btn').disabled = !canRespond;
        document.querySelector('.resolve-btn').disabled = !canRespond;

        if (!canRespond) {
            if (ticket.status === 'resolved') {
                document.getElementById('chat-input').placeholder = 'Este ticket está resuelto';
            } else if (ticket.adminId !== admin.id) {
                document.getElementById('chat-input').placeholder = 'Este ticket está asignado a otro admin';
            }
        } else {
            document.getElementById('chat-input').placeholder = 'Escribe tu respuesta...';
        }

        // Mostrar panel de chat
        document.getElementById('ticket-chat-panel').classList.add('active');

        // Iniciar polling
        startPolling();

        // Actualizar lista visual
        renderTicketsList(await getAllTicketsFromAPI());

    } catch (error) {
        console.error('Error abriendo chat:', error);
        alert('Error al abrir ticket: ' + error.message);
    }
}

/**
 * Obtener texto del estado
 */
function getStatusText(status) {
    const texts = {
        pending: 'Pendiente',
        assigned: 'Asignado',
        resolved: 'Resuelto'
    };
    return texts[status] || status;
}

/**
 * Renderizar mensajes del chat
 */
function renderChatMessages(messages) {
    const messagesDiv = document.getElementById('chat-messages');
    
    let html = '';
    messages.forEach(msg => {
        const isUser = msg.sender === 'user';
        const isAdmin = msg.sender === 'admin';
        const isSystem = msg.sender === 'system';
        
        const timestamp = new Date(msg.timestamp).toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit'
        });

        if (isSystem) {
            html += `
                <div class="message system">
                    <div class="message-content">
                        ℹ️ ${msg.text}
                    </div>
                </div>
            `;
        } else {
            const messageClass = isUser ? 'user' : 'admin';
            html += `
                <div class="message ${messageClass}">
                    <div class="message-content">
                        <div class="message-sender">${msg.senderName}</div>
                        <div>${msg.text}</div>
                        <div class="message-time">${timestamp}</div>
                    </div>
                </div>
            `;
        }
    });

    messagesDiv.innerHTML = html;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

/**
 * Enviar mensaje como admin
 */
async function sendAdminMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();

    if (!text || !selectedTicketId) return;

    const admin = getAdminData();

    try {
        const response = await fetch(`${API_BASE_URL}/tickets/${selectedTicketId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: 'admin',
                senderName: admin.name,
                text: text
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al enviar mensaje');
        }

        input.value = '';

        // Recargar mensajes
        const ticketResponse = await fetch(`${API_BASE_URL}/tickets/${selectedTicketId}`);
        const ticketData = await ticketResponse.json();
        renderChatMessages(ticketData.data.messages);
        lastMessageCount = ticketData.data.messages.length;

    } catch (error) {
        console.error('Error enviando mensaje:', error);
        alert('Error: ' + error.message);
    }
}

/**
 * Confirmar finalización del ticket
 */
function confirmResolveTicket() {
    if (!selectedTicketId) return;

    if (confirm('¿Finalizar este ticket?\n\nSe enviará un resumen por correo al usuario y al admin.\nEsta acción no se puede deshacer.')) {
        resolveAdminTicket();
    }
}

/**
 * Finalizar ticket
 */
async function resolveAdminTicket() {
    if (!selectedTicketId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/tickets/${selectedTicketId}/resolve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al finalizar ticket');
        }

        alert('✅ Ticket finalizado exitosamente.\nSe ha enviado el resumen por correo.');
        
        // Liberar ticket del admin
        currentAdminTicket = null;
        
        closeChatPanel();

    } catch (error) {
        console.error('Error finalizando ticket:', error);
        alert('Error: ' + error.message);
    }
}

/**
 * Cerrar panel de chat
 */
function closeChatPanel() {
    stopPolling();
    selectedTicketId = null;
    lastMessageCount = 0;
    
    document.getElementById('ticket-chat-panel').classList.remove('active');
    
    // Recargar lista
    loadAllTickets();
}

/**
 * Filtrar tickets
 */
function filterTickets(filter) {
    currentFilter = filter;
    
    // Actualizar botones de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadAllTickets();
}

/**
 * Iniciar polling (cada 3 segundos)
 */
function startPolling() {
    if (pollingInterval) clearInterval(pollingInterval);

    pollingInterval = setInterval(async () => {
        if (!selectedTicketId) {
            stopPolling();
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/tickets/${selectedTicketId}`);
            if (!response.ok) return;

            const data = await response.json();
            const ticket = data.data;

            // Actualizar si hay nuevos mensajes
            if (ticket.messages.length > lastMessageCount) {
                renderChatMessages(ticket.messages);
                lastMessageCount = ticket.messages.length;
                showNewMessageIndicator();
            }

            // Si fue resuelto, deshabilitar
            if (ticket.status === 'resolved') {
                document.getElementById('chat-input').disabled = true;
                document.querySelector('.send-btn').disabled = true;
                document.querySelector('.resolve-btn').disabled = true;
                currentAdminTicket = null;
            }

        } catch (error) {
            console.error('Error en polling:', error);
        }
    }, 3000);
}

/**
 * Detener polling
 */
function stopPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
}

/**
 * Mostrar indicador de nuevo mensaje
 */
function showNewMessageIndicator() {
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader) {
        chatHeader.style.animation = 'pulse 0.5s ease-in-out';
        setTimeout(() => {
            chatHeader.style.animation = '';
        }, 500);
    }
}

/**
 * Obtener todos los tickets (helper)
 */
async function getAllTicketsFromAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/tickets`);
        const data = await response.json();
        return data.data || [];
    } catch {
        return [];
    }
}

/**
 * Verificar ticket activo del admin al cargar
 */
async function checkAdminActiveTicket() {
    const admin = getAdminData();
    
    try {
        const response = await fetch(`${API_BASE_URL}/tickets/admin/${admin.id}`);
        const data = await response.json();
        
        const activeTickets = (data.data || []).filter(t => t.status === 'assigned');
        if (activeTickets.length > 0) {
            currentAdminTicket = activeTickets[0].ticketId;
        }
    } catch (error) {
        console.error('Error verificando tickets activos:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Enter para enviar
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAdminMessage();
            }
        });
    }

    // Cargar datos iniciales
    checkAdminActiveTicket().then(() => {
        loadAllTickets();
    });

    // Auto-refresh cada 30 segundos
    setInterval(() => {
        if (!selectedTicketId) {
            loadAllTickets();
        }
    }, 30000);
});
