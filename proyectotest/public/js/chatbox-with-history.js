/**
 * Widget de Chatbox con Historial de Conversaciones
 * Para usuarios logeados en el sistema UPT
 */

class ChatboxWidgetWithHistory {
    constructor(userId) {
        this.apiGatewayUrl = 'http://localhost:3000/api/v1';
        this.userId = userId; // ID del usuario logeado
        
        // Obtener valores del localStorage
        const storedToken = localStorage.getItem('chat_session_token');
        const storedId = localStorage.getItem('chat_session_id');
        const storedUserId = localStorage.getItem('chat_user_id');
        
        // ✅ VALIDACIÓN: Si el userId cambió, limpiar sesión anterior
        if (storedUserId && storedUserId !== String(userId)) {
            console.warn('⚠️  Usuario cambió. Limpiando sesión anterior.');
            localStorage.removeItem('chat_session_id');
            localStorage.removeItem('chat_session_token');
            localStorage.removeItem('chat_user_id');
            this.sessionToken = null;
            this.sessionId = null;
        } else {
            this.sessionToken = (storedToken && storedToken !== 'undefined' && storedToken !== 'null') ? storedToken : null;
            this.sessionId = (storedId && storedId !== 'undefined' && storedId !== 'null') ? storedId : null;
        }
        
        // Guardar userId actual
        localStorage.setItem('chat_user_id', String(userId));
        
        this.isOpen = false;
        this.historyOpen = false;
        
        console.log('🔧 Chatbox con historial inicializado:', {
            userId: this.userId,
            sessionToken: this.sessionToken,
            sessionId: this.sessionId
        });
        
        this.init();
    }

    init() {
        this.createChatboxHTML();
        this.attachEventListeners();
        this.loadFaqs(); // Cargar FAQs al inicializar
        
        // Si hay sesión activa, cargar mensajes
        if (this.sessionToken) {
            this.loadMessages();
        }
    }

    createChatboxHTML() {
        const chatboxHTML = `
            <div id="chatbox-widget" class="chatbox-widget">
                <div id="chatbox-button" class="chatbox-button">
                    💬 Chat
                    <span id="unread-badge" class="unread-badge" style="display: none;">0</span>
                </div>
                
                <div id="chatbox-container" class="chatbox-container" style="display: none;">
                    <!-- Panel de Historial (lateral izquierdo) -->
                    <div id="history-panel" class="history-panel" style="display: none;">
                        <div class="history-header">
                            <h4>📜 Conversaciones</h4>
                            <button id="close-history" class="close-history-btn">✖</button>
                        </div>
                        
                        <div class="history-list" id="history-list">
                            <div class="history-loading">Cargando historial...</div>
                        </div>
                        
                        <div class="history-footer">
                            <button id="new-conversation-from-history" class="new-conversation-btn">
                                ➕ Nueva Conversación
                            </button>
                        </div>
                    </div>
                    
                    <!-- Panel de Chat (principal) -->
                    <div class="chatbox-header">
                        <button id="menu-button" class="menu-button" title="Ver historial">
                            ☰
                        </button>
                        <h3>🤖 Asistente Virtual UPT</h3>
                        <button id="close-chatbox" class="close-btn">✖</button>
                    </div>
                    
                    <div id="chat-messages" class="chat-messages">
                        <!-- Mensaje inicial para crear conversación -->
                        <div id="start-conversation-prompt" class="start-conversation-prompt">
                            <div class="welcome-icon">💬</div>
                            <h3>¡Bienvenido al Asistente Virtual UPT!</h3>
                            <p>Para comenzar a chatear, inicia una nueva conversación</p>
                            <button id="start-new-conversation" class="start-conversation-btn">
                                ➕ Iniciar Nueva Conversación
                            </button>
                        </div>
                    </div>
                    
                    <div id="quick-faqs" class="quick-faqs-container" style="display: none;">
                        <!-- FAQs se cargarán aquí -->
                    </div>
                    
                    <div class="chat-input-container" id="chat-input-area" style="display: none;">
                        <input 
                            type="text" 
                            id="chat-input" 
                            placeholder="Escribe tu mensaje..."
                            autocomplete="off"
                        />
                        <button id="send-message" class="send-btn">Enviar</button>
                    </div>
                    
                    <div class="chatbox-footer" id="chat-footer" style="display: none;">
                        <button id="end-conversation" class="end-btn">Finalizar conversación</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatboxHTML);
    }

    attachEventListeners() {
        // Abrir/cerrar chatbox
        document.getElementById('chatbox-button').addEventListener('click', () => {
            this.toggleChatbox();
        });
        
        document.getElementById('close-chatbox').addEventListener('click', () => {
            this.toggleChatbox();
        });
        
        // Menú de historial
        document.getElementById('menu-button').addEventListener('click', () => {
            this.toggleHistory();
        });
        
        document.getElementById('close-history').addEventListener('click', () => {
            this.toggleHistory();
        });
        
        // Botón "Iniciar Nueva Conversación" (en el prompt inicial)
        document.getElementById('start-new-conversation').addEventListener('click', () => {
            this.startNewConversation();
        });
        
        // Botón "Nueva Conversación" del historial
        document.getElementById('new-conversation-from-history').addEventListener('click', () => {
            this.startNewConversation();
        });
        
        // Enviar mensaje
        document.getElementById('send-message').addEventListener('click', () => {
            this.sendMessage();
        });
        
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Finalizar conversación
        document.getElementById('end-conversation').addEventListener('click', () => {
            this.endConversation();
        });
    }

    toggleChatbox() {
        const container = document.getElementById('chatbox-container');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            container.style.display = 'flex';
            document.getElementById('chatbox-button').style.display = 'none';
            
            // Verificar si hay sesión activa
            if (this.sessionId && this.sessionToken) {
                // Ya hay sesión, cargar mensajes y mostrar input
                this.showChatInterface();
                this.loadMessages();
            } else {
                // No hay sesión, mostrar prompt para crear una
                this.showStartPrompt();
            }
        } else {
            container.style.display = 'none';
            document.getElementById('chatbox-button').style.display = 'flex';
            
            // Cerrar historial si estaba abierto
            if (this.historyOpen) {
                this.toggleHistory();
            }
        }
    }
    
    showStartPrompt() {
        // Mostrar el prompt inicial
        document.getElementById('start-conversation-prompt').style.display = 'flex';
        document.getElementById('chat-input-area').style.display = 'none';
        document.getElementById('chat-footer').style.display = 'none';
        document.getElementById('quick-faqs').style.display = 'none';
    }
    
    showChatInterface() {
        // Ocultar prompt y mostrar chat
        const prompt = document.getElementById('start-conversation-prompt');
        if (prompt) {
            prompt.style.display = 'none';
        }
        document.getElementById('chat-input-area').style.display = 'flex';
        document.getElementById('chat-footer').style.display = 'block';
        document.getElementById('quick-faqs').style.display = 'flex';
    }

    toggleHistory() {
        const historyPanel = document.getElementById('history-panel');
        this.historyOpen = !this.historyOpen;
        
        if (this.historyOpen) {
            historyPanel.style.display = 'flex';
            this.loadHistory();
        } else {
            historyPanel.style.display = 'none';
        }
    }

    async loadHistory() {
        const historyList = document.getElementById('history-list');
        
        try {
            const response = await fetch(`${this.apiGatewayUrl}/chat-sessions/history/${this.userId}`);
            const data = await response.json();
            
            if (data.status === 'success' && data.data.length > 0) {
                historyList.innerHTML = data.data.map(session => `
                    <div class="history-item ${session.sessionId === this.sessionId ? 'active' : ''}" 
                         data-session-id="${session.sessionId}">
                        <div class="history-item-title">${session.title}</div>
                        <div class="history-item-date">${session.date}</div>
                        ${session.isActive ? '<span class="active-badge">Activa</span>' : ''}
                    </div>
                `).join('');
                
                // Agregar event listeners a cada item
                document.querySelectorAll('.history-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const sessionId = item.dataset.sessionId;
                        this.loadConversation(sessionId);
                    });
                });
            } else {
                historyList.innerHTML = `
                    <div class="history-empty">
                        <p>📭 No tienes conversaciones anteriores</p>
                        <p>Inicia una nueva para comenzar</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error cargando historial:', error);
            historyList.innerHTML = `
                <div class="history-error">
                    ❌ Error al cargar historial
                </div>
            `;
        }
    }

    async loadConversation(sessionId) {
        try {
            console.log('🔄 Cargando conversación:', sessionId);
            
            // Simplemente actualizar el sessionId actual
            this.sessionId = sessionId;
            
            // Guardar en localStorage
            localStorage.setItem('chat_session_id', this.sessionId);
            
            // Mostrar interfaz de chat
            this.showChatInterface();
            
            // Limpiar chat actual
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.innerHTML = '<div class="welcome-message">⏳ Cargando mensajes...</div>';
            
            // Cargar mensajes de la conversación seleccionada
            await this.loadMessages();
            
            // Cerrar panel de historial
            this.toggleHistory();
            
            console.log(`✅ Conversación ${sessionId} cargada`);
        } catch (error) {
            console.error('❌ Error cargando conversación:', error);
            this.showError('Error al cargar la conversación');
        }
    }

    async startNewConversation() {
        try {
            console.log('🆕 Iniciando nueva conversación...');
            
            // Finalizar la conversación actual si existe
            if (this.sessionToken && this.sessionId) {
                await this.endConversation(false); // false = no mostrar mensaje
            }
            
            // Limpiar localStorage
            localStorage.removeItem('chat_session_id');
            localStorage.removeItem('chat_session_token');
            localStorage.removeItem('chat_user_id');  // ✅ Limpiar userId también
            
            this.sessionId = null;
            this.sessionToken = null;
            
            // Limpiar chat
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    ⏳ Creando nueva conversación...
                </div>
            `;
            
            // Cerrar historial si está abierto
            if (this.historyOpen) {
                this.toggleHistory();
            }
            
            // Iniciar nueva sesión
            await this.startNewSession();
            
            // Mostrar interfaz de chat
            this.showChatInterface();
            
            // Mostrar mensaje de bienvenida
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    👋 Nueva conversación iniciada. ¿En qué puedo ayudarte?
                </div>
            `;
            
            // Hacer focus en el input
            document.getElementById('chat-input').focus();
            
            console.log('✅ Nueva conversación lista');
        } catch (error) {
            console.error('❌ Error iniciando nueva conversación:', error);
            this.showError('Error al iniciar nueva conversación');
        }
    }

    async startNewSession() {
        try {
            console.log('🔄 Creando nueva sesión para userId:', this.userId);
            
            // ✅ PASO 1: Cerrar sesión anterior si existe
            if (this.sessionId && this.sessionId !== 'undefined' && this.sessionId !== 'null') {
                console.log('🔒 Cerrando sesión anterior:', this.sessionId);
                await this.endConversation(false); // false = no mostrar mensaje
            }
            
            // ✅ PASO 2: Crear nueva sesión
            const response = await fetch(`${this.apiGatewayUrl}/chat-sessions/start/${this.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})  // Body vacío pero válido
            });

            const data = await response.json();
            console.log('📦 Respuesta de creación de sesión:', data);
            
            if (data.status === 'success' && data.data) {
                // ✅ CORRECCIÓN: El backend retorna "id" no "sessionId"
                this.sessionId = data.data.id;  // ← ERA data.data.sessionId
                this.sessionToken = data.data.sessionToken;
                
                // Validar que los valores no sean undefined
                if (!this.sessionId || this.sessionId === 'undefined') {
                    console.error('❌ sessionId inválido recibido:', this.sessionId);
                    throw new Error('SessionId inválido');
                }
                
                if (!this.sessionToken || this.sessionToken === 'undefined') {
                    console.error('❌ sessionToken inválido recibido:', this.sessionToken);
                    throw new Error('SessionToken inválido');
                }
                
                localStorage.setItem('chat_session_id', this.sessionId);
                localStorage.setItem('chat_session_token', this.sessionToken);
                localStorage.setItem('chat_user_id', String(this.userId));  // ✅ Guardar userId también
                
                console.log('✅ Nueva sesión iniciada correctamente:', {
                    sessionId: this.sessionId,
                    sessionToken: this.sessionToken,
                    userId: this.userId
                });
                
                // ✅ PASO 3: Limpiar mensajes anteriores
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.innerHTML = `
                    <div class="welcome-message">
                        🎉 Nueva conversación iniciada
                    </div>
                `;
                
                return true;
            } else {
                console.error('❌ Error en respuesta de sesión:', data);
                throw new Error('No se pudo crear la sesión');
            }
        } catch (error) {
            console.error('❌ Error al iniciar sesión:', error);
            this.showError('Error al crear sesión de chat');
            return false;
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // VALIDAR que tengamos sessionId válido
        if (!this.sessionId || this.sessionId === 'undefined' || this.sessionId === 'null') {
            console.error('❌ No hay sessionId válido. Iniciando nueva sesión...');
            await this.startNewSession();
            
            if (!this.sessionId) {
                this.addMessage('Error: No se pudo crear sesión. Intenta de nuevo.', 'bot');
                return;
            }
        }
        
        console.log('📤 Enviando mensaje con sessionId:', this.sessionId);
        
        // Mostrar mensaje del usuario
        this.addMessage(message, 'user');
        input.value = '';
        
        // Mostrar indicador de "escribiendo..."
        this.showTypingIndicator();
        
        try {
            const response = await fetch(`${this.apiGatewayUrl}/nlp/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: message,
                    session_id: this.sessionId,  // ✅ Ahora garantizado que es válido
                    user_id: this.userId
                })
            });

            const data = await response.json();
            console.log('📥 Respuesta completa del bot:', JSON.stringify(data, null, 2));
            
            // Remover indicador de "escribiendo..."
            this.removeTypingIndicator();
            
            // ✅ ARREGLO: Probar diferentes estructuras de respuesta
            let botResponse = null;
            
            if (data.data?.data?.response) {
                botResponse = data.data.data.response;
                console.log('✅ Respuesta encontrada en data.data.data.response');
            } else if (data.data?.response) {
                botResponse = data.data.response;
                console.log('✅ Respuesta encontrada en data.data.response');
            } else if (data.response) {
                botResponse = data.response;
                console.log('✅ Respuesta encontrada en data.response');
            }
            
            if (botResponse) {
                this.addMessage(botResponse, 'bot');
            } else {
                console.error('❌ No se encontró respuesta del bot en la estructura de datos');
                this.addMessage('Lo siento, hubo un error al procesar tu mensaje.', 'bot');
            }
        } catch (error) {
            this.removeTypingIndicator();
            console.error('❌ Error completo al enviar mensaje:', error);
            console.error('❌ Error al enviar mensaje:', error);
            this.addMessage('Error de conexión. Por favor, intenta nuevamente.', 'bot');
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    async loadMessages() {
        try {
            // ✅ VALIDACIÓN CRÍTICA: Verificar que el sessionId sea válido y no "undefined"
            if (!this.sessionId || this.sessionId === 'undefined' || this.sessionId === 'null') {
                console.warn('⚠️  No hay sessionId válido. No se pueden cargar mensajes.');
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.innerHTML = `
                    <div class="welcome-message">
                        ⚠️ Crea una nueva conversación para comenzar
                    </div>
                `;
                return;
            }
            
            console.log('📥 Cargando mensajes para sessionId:', this.sessionId, 'userId:', this.userId);
            
            const response = await fetch(
                `${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/messages`
            );

            const data = await response.json();
            console.log('📨 Mensajes recibidos:', data);
            
            if (data.status === 'success' && data.data && data.data.length > 0) {
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.innerHTML = '';
                
                // ✅ El backend YA filtra por sessionId y userId, solo renderizamos
                data.data.forEach(msg => {
                    // Los mensajes tienen 'text' no 'content'
                    this.addMessage(msg.text, msg.sender);
                });
                
                console.log(`✅ ${data.data.length} mensajes cargados correctamente`);
            } else {
                console.log('ℹ️  No hay mensajes en esta conversación');
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.innerHTML = `
                    <div class="welcome-message">
                        📭 No hay mensajes en esta conversación
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Error cargando mensajes:', error);
            this.showError('Error al cargar mensajes de la conversación');
        }
    }

    async endConversation(showMessage = true) {
        if (!this.sessionId) return;
        
        try {
            await fetch(`${this.apiGatewayUrl}/chat-sessions/end/${this.sessionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            localStorage.removeItem('chat_session_id');
            localStorage.removeItem('chat_session_token');
            localStorage.removeItem('chat_user_id');  // ✅ Limpiar userId también
            
            this.sessionId = null;
            this.sessionToken = null;
            
            if (showMessage) {
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.innerHTML = `
                    <div class="welcome-message">
                        ✅ Conversación finalizada. ¿Deseas iniciar una nueva?
                    </div>
                `;
            }
            
            console.log('✅ Conversación finalizada');
        } catch (error) {
            console.error('Error al finalizar conversación:', error);
        }
    }

    showError(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chat-message error-message';
        errorDiv.textContent = `❌ ${message}`;
        
        messagesContainer.appendChild(errorDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async loadFaqs() {
        try {
            const response = await fetch(`${this.apiGatewayUrl}/faqs/active`);
            const data = await response.json();
            
            if (data.status === 'success' && data.data && data.data.length > 0) {
                this.renderFaqs(data.data);
            }
        } catch (error) {
            console.error('⚠️ Error al cargar FAQs:', error);
        }
    }

    renderFaqs(faqs) {
        const container = document.getElementById('quick-faqs');
        if (!container) return;

        container.innerHTML = faqs.map(faq => 
            `<button class="faq-button" data-text="${this.escapeHtml(faq.texto_chat)}">
                ${this.escapeHtml(faq.nombre)}
            </button>`
        ).join('');

        // Agregar event listeners a los botones de FAQ
        container.querySelectorAll('.faq-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFaqClick(e.target.dataset.text);
            });
        });
    }

    handleFaqClick(text) {
        // Llenar el input con el texto de la FAQ
        const input = document.getElementById('chat-input');
        input.value = text;
        
        // Enviar automáticamente el mensaje
        this.sendMessage();
        
        // Agregar animación al botón
        event.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            event.target.style.transform = 'scale(1)';
        }, 150);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Auto-inicializar si hay un userId en el DOM
document.addEventListener('DOMContentLoaded', () => {
    const userIdElement = document.getElementById('user-id-data');
    if (userIdElement) {
        const userId = userIdElement.dataset.userId;
        if (userId) {
            window.chatboxWidget = new ChatboxWidgetWithHistory(userId);
        }
    }
});
