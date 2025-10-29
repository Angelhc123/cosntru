/**
 * Sistema de Tickets de Soporte para Usuarios
 * Conecta con API Gateway en puerto 3000
 */

const API_BASE_URL = 'http://localhost:3000/api/v1';
let currentTicketId = null;
let pollingInterval = null;
let lastMessageCount = 0;

// Obtener user_id del elemento oculto
function getUserId() {
    const userIdElement = document.getElementById('user-id-data');
    return userIdElement ? userIdElement.dataset.userId : null;
}

/**
 * Cargar todos los tickets del usuario
 */
async function loadUserTickets() {
    const userId = getUserId();
    if (!userId) {
        console.error('No se pudo obtener el user_id');
        return;
    }

    const container = document.getElementById('tickets-container');
    container.innerHTML = `
        <div class="loading-tickets" style="text-align: center; padding: 40px;">
            <div style="font-size: 48px; margin-bottom: 20px;">⏳</div>
            <p>Cargando tus tickets...</p>
        </div>
    `;

    try {
        console.log(`🔍 Cargando tickets del usuario ${userId} desde ${API_BASE_URL}/tickets/user/${userId}`);
        
        const response = await fetch(`${API_BASE_URL}/tickets/user/${userId}`);
        
        console.log('📡 Respuesta HTTP:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error en respuesta:', errorText);
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Datos recibidos:', data);
        
        const tickets = data.data || [];

        if (tickets.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 60px; color: #666;">
                    <div style="font-size: 64px; margin-bottom: 20px;">📭</div>
                    <h3 style="margin-bottom: 10px;">No tienes tickets abiertos</h3>
                    <p>Los tickets que generes desde el chatbot aparecerán aquí.</p>
                </div>
            `;
            return;
        }

        // Renderizar lista de tickets
        let html = '<div class="tickets-list" style="display: grid; gap: 15px;">';
        
        tickets.forEach(ticket => {
            const statusBadge = getStatusBadge(ticket.status);
            const fecha = new Date(ticket.createdAt).toLocaleDateString('es-PE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            html += `
                <div class="ticket-card" style="background: white; border: 1px solid #ddd; border-radius: 10px; padding: 20px; cursor: pointer; transition: all 0.3s;" onclick="openTicketChat('${ticket.ticketId}')">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                        <div>
                            <h3 style="margin: 0; font-size: 18px; color: #333;">🎫 ${ticket.ticketId}</h3>
                            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${ticket.subject || 'Sin asunto'}</p>
                        </div>
                        ${statusBadge}
                    </div>
                    
                    <div style="font-size: 13px; color: #999;">
                        <p style="margin: 5px 0;">📅 Creado: ${fecha}</p>
                        ${ticket.adminName ? `<p style="margin: 5px 0;">👤 Asignado a: ${ticket.adminName}</p>` : '<p style="margin: 5px 0;">⏳ Esperando asignación</p>'}
                        <p style="margin: 5px 0;">💬 ${ticket.messages.length} mensaje(s)</p>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;

    } catch (error) {
        console.error('❌ Error completo al cargar tickets:', error);
        console.error('Stack trace:', error.stack);
        
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #d9534f;">
                <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                <h3>Error al cargar tickets</h3>
                <p style="margin: 15px 0; font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 5px; color: #333;">
                    ${error.message}
                </p>
                <details style="margin: 20px 0; text-align: left; max-width: 600px; margin-left: auto; margin-right: auto;">
                    <summary style="cursor: pointer; color: #666; font-size: 14px;">Detalles técnicos</summary>
                    <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; font-size: 12px; margin-top: 10px;">URL: ${API_BASE_URL}/tickets/user/${userId}
User ID: ${userId}
Error: ${error.message}

Posibles causas:
1. API Gateway no está corriendo (puerto 3000)
2. Error de CORS (revisar headers)
3. Usuario no existe en la base de datos
4. Problema de conexión con MongoDB

Solución:
- Verificar que ./start_all.sh esté corriendo
- Revisar logs: tail -f upt-chat-system/services/api-gateway/logs/combined.log</pre>
                </details>
                <button onclick="loadUserTickets()" style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🔄 Reintentar
                </button>
            </div>
        `;
    }
}

/**
 * Obtener badge HTML según el estado del ticket
 */
function getStatusBadge(status) {
    const badges = {
        pending: '<span style="background: #ffc107; color: #000; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">⏳ Pendiente</span>',
        assigned: '<span style="background: #17a2b8; color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">👤 Asignado</span>',
        resolved: '<span style="background: #28a745; color: white; padding: 5px 12px; border-radius: 15px; font-size: 12px; font-weight: 600;">✅ Resuelto</span>'
    };
    return badges[status] || badges.pending;
}

/**
 * Abrir chat de un ticket específico
 */
async function openTicketChat(ticketId) {
    currentTicketId = ticketId;
    
    // Ocultar lista, mostrar chat
    document.getElementById('tickets-container').style.display = 'none';
    document.getElementById('ticket-chat-container').style.display = 'block';

    try {
        const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar ticket');
        }

        const data = await response.json();
        const ticket = data.data;

        // Actualizar header del chat
        document.getElementById('ticket-chat-title').textContent = `Ticket #${ticket.ticketId}`;
        document.getElementById('ticket-chat-status').textContent = `Estado: ${getStatusText(ticket.status)} | Asunto: ${ticket.subject || 'Sin asunto'}`;

        // Renderizar mensajes
        renderTicketMessages(ticket.messages);
        
        // Guardar contador de mensajes
        lastMessageCount = ticket.messages.length;

        // Deshabilitar input si está resuelto
        const isResolved = ticket.status === 'resolved';
        document.getElementById('ticket-message-input').disabled = isResolved;
        document.querySelector('button[onclick="sendTicketMessage()"]').disabled = isResolved;
        
        if (isResolved) {
            document.getElementById('ticket-message-input').placeholder = 'Este ticket está resuelto y no acepta más mensajes';
        }

        // Iniciar polling para nuevos mensajes
        startPolling();

    } catch (error) {
        console.error('Error al abrir ticket:', error);
        alert('Error al cargar el ticket: ' + error.message);
        closeTicketChat();
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
 * Renderizar mensajes del ticket
 */
function renderTicketMessages(messages) {
    const messagesDiv = document.getElementById('ticket-messages');
    
    let html = '';
    messages.forEach(msg => {
        // FILTRAR: NO mostrar mensajes exclusivos para admin
        if (msg.visibleTo === 'admin') {
            console.log('🚫 Mensaje oculto para usuario (solo admin):', msg.text);
            return; // Saltar este mensaje
        }

        const isUser = msg.sender === 'user';
        const isSystem = msg.sender === 'system';
        
        const timestamp = new Date(msg.timestamp).toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit'
        });

        if (isSystem) {
            // Mensaje del sistema (asignación, resolución)
            html += `
                <div style="text-align: center; margin: 20px 0;">
                    <span style="background: #f0f0f0; padding: 8px 15px; border-radius: 15px; font-size: 13px; color: #666;">
                        ℹ️ ${msg.text}
                    </span>
                </div>
            `;
        } else {
            // Mensaje de usuario o admin
            const alignment = isUser ? 'flex-end' : 'flex-start';
            const bgColor = isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e9ecef';
            const textColor = isUser ? 'white' : '#333';
            
            html += `
                <div style="display: flex; justify-content: ${alignment}; margin-bottom: 15px;">
                    <div style="max-width: 70%;">
                        <div style="background: ${bgColor}; color: ${textColor}; padding: 12px 16px; border-radius: ${isUser ? '15px 15px 0 15px' : '15px 15px 15px 0'}; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <div style="font-weight: 600; font-size: 13px; margin-bottom: 5px; opacity: 0.9;">
                                ${msg.senderName}
                            </div>
                            <div style="font-size: 14px; line-height: 1.4;">
                                ${msg.text}
                            </div>
                        </div>
                        <div style="font-size: 11px; color: #999; margin-top: 5px; text-align: ${isUser ? 'right' : 'left'};">
                            ${timestamp}
                        </div>
                    </div>
                </div>
            `;
        }
    });

    messagesDiv.innerHTML = html;
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll al final
}

/**
 * Enviar mensaje en el ticket
 */
async function sendTicketMessage() {
    const input = document.getElementById('ticket-message-input');
    const text = input.value.trim();

    if (!text || !currentTicketId) return;

    const userId = getUserId();
    const userName = document.querySelector('.user-info h2')?.textContent || 'Usuario';

    try {
        const response = await fetch(`${API_BASE_URL}/tickets/${currentTicketId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sender: 'user',
                senderName: userName,
                text: text
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al enviar mensaje');
        }

        // Limpiar input
        input.value = '';

        // Recargar mensajes
        const ticketResponse = await fetch(`${API_BASE_URL}/tickets/${currentTicketId}`);
        const ticketData = await ticketResponse.json();
        renderTicketMessages(ticketData.data.messages);
        lastMessageCount = ticketData.data.messages.length;

    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        alert('Error al enviar mensaje: ' + error.message);
    }
}

/**
 * Cerrar chat del ticket y volver a la lista
 */
function closeTicketChat() {
    stopPolling();
    currentTicketId = null;
    lastMessageCount = 0;
    
    document.getElementById('ticket-chat-container').style.display = 'none';
    document.getElementById('tickets-container').style.display = 'block';
    
    // Recargar lista de tickets
    loadUserTickets();
}

/**
 * Confirmar resolución del ticket
 */
function confirmResolveTicket() {
    if (!currentTicketId) return;

    if (confirm('¿Estás seguro de que deseas finalizar este ticket? Esta acción no se puede deshacer y se enviará un resumen por correo.')) {
        resolveTicket();
    }
}

/**
 * Resolver (finalizar) ticket
 */
async function resolveTicket() {
    if (!currentTicketId) return;

    try {
        const response = await fetch(`${API_BASE_URL}/tickets/${currentTicketId}/resolve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al finalizar ticket');
        }

        alert('✅ Ticket finalizado exitosamente. Se ha enviado un resumen a tu correo.');
        closeTicketChat();

    } catch (error) {
        console.error('Error al finalizar ticket:', error);
        alert('Error al finalizar ticket: ' + error.message);
    }
}

/**
 * Iniciar polling para nuevos mensajes (cada 3 segundos)
 */
function startPolling() {
    if (pollingInterval) {
        clearInterval(pollingInterval);
    }

    pollingInterval = setInterval(async () => {
        if (!currentTicketId) {
            stopPolling();
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/tickets/${currentTicketId}`);
            if (!response.ok) return;

            const data = await response.json();
            const ticket = data.data;

            // Si hay nuevos mensajes, actualizar
            if (ticket.messages.length > lastMessageCount) {
                renderTicketMessages(ticket.messages);
                lastMessageCount = ticket.messages.length;
                
                // Mostrar notificación visual
                showNewMessageNotification();
            }

            // Si el ticket fue resuelto, deshabilitar input
            if (ticket.status === 'resolved') {
                document.getElementById('ticket-message-input').disabled = true;
                document.querySelector('button[onclick="sendTicketMessage()"]').disabled = true;
                document.getElementById('ticket-message-input').placeholder = 'Este ticket está resuelto';
            }

        } catch (error) {
            console.error('Error en polling:', error);
        }
    }, 3000); // Polling cada 3 segundos
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
 * Mostrar notificación de nuevo mensaje
 */
function showNewMessageNotification() {
    const chatHeader = document.querySelector('.ticket-chat-header');
    if (!chatHeader) return;

    // Flash efecto
    chatHeader.style.animation = 'pulse 0.5s ease-in-out';
    setTimeout(() => {
        chatHeader.style.animation = '';
    }, 500);
}

/**
 * Permitir enviar mensaje con Enter
 */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('ticket-message-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendTicketMessage();
            }
        });
    }
});

// Cargar tickets cuando se muestre la sección
document.addEventListener('DOMContentLoaded', () => {
    // Observar cuando se activa la sección de tickets
    const ticketsSection = document.getElementById('tickets');
    if (ticketsSection) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (ticketsSection.style.display !== 'none') {
                        loadUserTickets();
                    }
                }
            });
        });

        observer.observe(ticketsSection, { attributes: true });
    }
});
