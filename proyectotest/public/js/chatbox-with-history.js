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
        
        this.sessionToken = (storedToken && storedToken !== 'undefined' && storedToken !== 'null') ? storedToken : null;
        this.sessionId = (storedId && storedId !== 'undefined' && storedId !== 'null') ? storedId : null;
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
    }
    
    showChatInterface() {
        // Ocultar prompt y mostrar chat
        const prompt = document.getElementById('start-conversation-prompt');
        if (prompt) {
            prompt.style.display = 'none';
        }
        document.getElementById('chat-input-area').style.display = 'flex';
        document.getElementById('chat-footer').style.display = 'block';
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
            const response = await fetch(`${this.apiGatewayUrl}/chat-sessions/start/${this.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                this.sessionId = data.data.sessionId;
                this.sessionToken = data.data.sessionToken;
                
                localStorage.setItem('chat_session_id', this.sessionId);
                localStorage.setItem('chat_session_token', this.sessionToken);
                
                console.log('✅ Nueva sesión iniciada:', this.sessionId);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
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
                    session_id: this.sessionId,
                    user_id: this.userId
                })
            });

            const data = await response.json();
            
            // Remover indicador de "escribiendo..."
            this.removeTypingIndicator();
            
            if (data.success && data.data) {
                this.addMessage(data.data.response, 'bot');
            } else {
                this.addMessage('Lo siento, hubo un error al procesar tu mensaje.', 'bot');
            }
        } catch (error) {
            this.removeTypingIndicator();
            console.error('Error al enviar mensaje:', error);
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
            console.log('📥 Cargando mensajes para sessionId:', this.sessionId);
            
            const response = await fetch(
                `${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/messages`
            );

            const data = await response.json();
            console.log('📨 Mensajes recibidos:', data);
            
            if (data.status === 'success' && data.data && data.data.length > 0) {
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.innerHTML = '';
                
                // Los mensajes vienen en data.data (array directo)
                data.data.forEach(msg => {
                    // Los mensajes tienen 'text' no 'content'
                    this.addMessage(msg.text, msg.sender);
                });
                
                console.log(`✅ ${data.data.length} mensajes cargados`);
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
