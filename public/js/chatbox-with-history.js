/**
 * Widget de Chatbox con Historial de Conversaciones
 * Para usuarios logeados en el sistema UPT
 */

class ChatboxWidgetWithHistory {
    constructor(userId) {
        this.apiGatewayUrl = API_CONFIG.API_GATEWAY;
        this.userId = userId; // ID del usuario logeado
        
        // Obtener valores del localStorage
        const storedToken = localStorage.getItem('chat_session_token');
        const storedId = localStorage.getItem('chat_session_id');
        const storedUserId = localStorage.getItem('chat_user_id');
        
        // ✅ VALIDACIÓN: Si el userId cambió, limpiar sesión anterior
        if (storedUserId && storedUserId !== String(userId)) {
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
            
        } catch (error) {
            console.error('❌ Error cargando conversación:', error);
            this.showError('Error al cargar la conversación');
        }
    }

    async startNewConversation() {
        try {
            
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
            
        } catch (error) {
            console.error('❌ Error iniciando nueva conversación:', error);
            this.showError('Error al iniciar nueva conversación');
        }
    }

    async startNewSession() {
        try {
            
            // ✅ PASO 1: Cerrar sesión anterior si existe
            if (this.sessionId && this.sessionId !== 'undefined' && this.sessionId !== 'null') {
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
            
            // Remover indicador de "escribiendo..."
            this.removeTypingIndicator();
            
            // ✅ ARREGLO: Extraer respuesta Y messageId del backend
            let botResponse = null;
            let botMessageId = null;
            
            if (data.data?.data?.response) {
                botResponse = data.data.data.response;
                botMessageId = data.data.data.messageId;
            } else if (data.data?.response) {
                botResponse = data.data.response;
                botMessageId = data.data.messageId;
            } else if (data.response) {
                botResponse = data.response;
                botMessageId = data.messageId;
            }
            
            if (botResponse) {
                // ✅ Mostrar respuesta CON botones de feedback usando el messageId del backend
                this.addMessage(botResponse, 'bot', botMessageId);
                
                // ✅ Verificar si requiere escalamiento a soporte humano (nueva lógica)
                const showEscalationPrompt = data.data?.show_escalation_prompt || data.show_escalation_prompt || false;
                const escalationReason = data.data?.escalation_reason || data.escalation_reason || 'Confianza baja en la respuesta';
                
                if (showEscalationPrompt) {
                    // Mostrar PROMPT DE CONFIRMACIÓN para escalar
                    this.showEscalationPrompt(message, botResponse, data, escalationReason);
                }
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

    addMessage(text, sender, messageId = null) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        if (sender === 'system') {
            // Mensaje del sistema (escalamiento, notificaciones, etc.)
            messageDiv.innerHTML = `<div class="system-notification">${text}</div>`;
        } else if (sender === 'bot') {
            // Detectar patrón de botón de redirección [REDIRECT_BUTTON|URL|TEXTO|MENSAJE]
            const redirectPattern = /\[REDIRECT_BUTTON\|([^\|]+)\|([^\|]+)\|([^\]]*)\]/;
            const redirectMatch = text.match(redirectPattern);
            
            if (redirectMatch) {
                const url = redirectMatch[1];
                const buttonText = redirectMatch[2];
                const messageText = redirectMatch[3].trim();
                
                // Solo agregar texto si existe
                let textContent = '';
                if (messageText && messageText.length > 0) {
                    textContent = `<div class="message-text">${messageText}</div>`;
                }
                
                messageDiv.innerHTML = `
                    ${textContent}
                    <div class="escalation-buttons" style="margin-top: ${messageText ? '10px' : '0'};">
                        <button class="escalation-btn yes-btn" onclick="window.open('${url}', '_blank')" style="
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 14px;
                            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
                            transition: all 0.3s ease;
                            width: 100%;
                        ">
                            ${buttonText}
                        </button>
                    </div>
                `;
            } else if (messageId) {
                // Mensaje normal con feedback
                messageDiv.innerHTML = `
                    <div class="message-text">${text}</div>
                    <div class="feedback-buttons" data-message-id="${messageId}">
                        <button class="feedback-btn positive" onclick="window.chatboxWidget.sendFeedback('${messageId}', 'positive')" title="Respuesta útil">
                            👍
                        </button>
                        <button class="feedback-btn negative" onclick="window.chatboxWidget.sendFeedback('${messageId}', 'negative')" title="Respuesta no útil">
                            👎
                        </button>
                    </div>
                `;
            } else {
                // Mensaje bot sin feedback
                messageDiv.innerHTML = `<div class="message-text">${text}</div>`;
            }
        } else {
            messageDiv.textContent = text;
        }
        
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
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.innerHTML = `
                    <div class="welcome-message">
                        ⚠️ Crea una nueva conversación para comenzar
                    </div>
                `;
                return;
            }
            
            
            const response = await fetch(
                `${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/messages`
            );

            const data = await response.json();
            
            if (data.status === 'success' && data.data && data.data.length > 0) {
                const messagesContainer = document.getElementById('chat-messages');
                messagesContainer.innerHTML = '';
                
                // ✅ El backend YA filtra por sessionId y userId, solo renderizamos
                data.data.forEach(msg => {
                    // Los mensajes tienen 'text' no 'content'
                    this.addMessage(msg.text, msg.sender);
                });
                
            } else {
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
        // Mostrar modal de feedback antes de finalizar (incluso si no hay sessionId)
        if (showMessage) {
            this.showFeedbackModal();
            return; // El modal llamará a finishEndConversation() después del feedback
        }
        
        // Solo finalizar si hay sesión activa
        if (!this.sessionId) {
            this.resetChat();
            return;
        }
        
        this.finishEndConversation();
    }

    showFeedbackModal() {
        // BLOQUEAR EL INPUT Y BOTONES DEL CHAT
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        const endButton = document.getElementById('end-conversation');
        const quickFaqs = document.getElementById('quick-faqs');
        
        if (chatInput) {
            chatInput.disabled = true;
            chatInput.placeholder = 'Por favor, completa el feedback para continuar...';
            chatInput.style.background = '#f5f5f5';
            chatInput.style.cursor = 'not-allowed';
        }
        if (sendButton) {
            sendButton.disabled = true;
            sendButton.style.opacity = '0.5';
            sendButton.style.cursor = 'not-allowed';
        }
        if (endButton) {
            endButton.disabled = true;
            endButton.style.opacity = '0.5';
            endButton.style.cursor = 'not-allowed';
        }
        
        // BLOQUEAR PREGUNTAS FRECUENTES
        if (quickFaqs) {
            const faqButtons = quickFaqs.querySelectorAll('.faq-button');
            faqButtons.forEach(button => {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';
                button.style.pointerEvents = 'none';
            });
        }
        
        // Agregar el modal DESPUÉS de los mensajes existentes
        const messagesContainer = document.getElementById('chat-messages');
        
        // Crear elemento del modal (más pequeño y discreto)
        const feedbackDiv = document.createElement('div');
        feedbackDiv.id = 'session-feedback-modal';
        feedbackDiv.style.cssText = 'display: flex; flex-direction: column; align-items: center; width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; margin-top: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
        
        feedbackDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 12px; color: white;">
                <h4 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600;">¿Cómo estuvo la atención?</h4>
                <p style="margin: 0; font-size: 11px; opacity: 0.85;">Tu opinión nos ayuda</p>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; width: 100%; margin-bottom: 10px;">
                <button onclick="window.chatboxWidget.submitSessionFeedback('excellent')" style="background: white; border: none; border-radius: 8px; padding: 12px 6px; cursor: pointer; font-size: 11px; font-weight: 600; color: #28a745; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size: 24px; margin-bottom: 2px;">😄</div>
                    <div style="font-size: 10px;">Excelente</div>
                </button>
                <button onclick="window.chatboxWidget.submitSessionFeedback('good')" style="background: white; border: none; border-radius: 8px; padding: 12px 6px; cursor: pointer; font-size: 11px; font-weight: 600; color: #17a2b8; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size: 24px; margin-bottom: 2px;">🙂</div>
                    <div style="font-size: 10px;">Buena</div>
                </button>
                <button onclick="window.chatboxWidget.submitSessionFeedback('regular')" style="background: white; border: none; border-radius: 8px; padding: 12px 6px; cursor: pointer; font-size: 11px; font-weight: 600; color: #ffc107; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size: 24px; margin-bottom: 2px;">😐</div>
                    <div style="font-size: 10px;">Regular</div>
                </button>
                <button onclick="window.chatboxWidget.submitSessionFeedback('bad')" style="background: white; border: none; border-radius: 8px; padding: 12px 6px; cursor: pointer; font-size: 11px; font-weight: 600; color: #dc3545; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    <div style="font-size: 24px; margin-bottom: 2px;">😞</div>
                    <div style="font-size: 10px;">Mala</div>
                </button>
            </div>
            <button onclick="window.chatboxWidget.finishEndConversation()" style="background: transparent; border: 1px solid rgba(255,255,255,0.5); color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 500; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">
                Omitir
            </button>
        `;
        
        // Agregar al contenedor
        messagesContainer.appendChild(feedbackDiv);
        
        // Scroll al final para mostrar el modal
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async submitSessionFeedback(rating) {
        try {
            // Mapear rating a score numérico
            const scoreMap = {
                'excellent': 5,
                'good': 4,
                'regular': 3,
                'bad': 2
            };

            // Enviar feedback de sesión al backend
            await fetch(`${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/satisfaction`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    score: scoreMap[rating] || 3
                })
            });

            // Remover el modal de feedback
            const feedbackModal = document.getElementById('session-feedback-modal');
            if (feedbackModal) {
                feedbackModal.remove();
            }

            // Agregar mensaje de agradecimiento
            const messagesContainer = document.getElementById('chat-messages');
            const thankYouDiv = document.createElement('div');
            thankYouDiv.style.cssText = 'display: flex; flex-direction: column; align-items: center; padding: 30px; text-align: center; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: 15px; margin-top: 10px; color: white; box-shadow: 0 5px 20px rgba(0,0,0,0.2);';
            thankYouDiv.innerHTML = `
                <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                <h3 style="margin: 0 0 10px 0; font-size: 20px;">¡Gracias por tu feedback!</h3>
                <p style="margin: 0; opacity: 0.9;">Tu opinión nos ayuda a mejorar el servicio</p>
            `;
            messagesContainer.appendChild(thankYouDiv);

            // Scroll al final
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Esperar 2 segundos y finalizar
            setTimeout(() => {
                this.finishEndConversation();
            }, 2000);

        } catch (error) {
            console.error('Error enviando feedback de sesión:', error);
            this.finishEndConversation();
        }
    }

    async finishEndConversation() {
        if (!this.sessionId) {
            this.resetChat();
            return;
        }
        
        try {
            // Obtener mensajes de la conversación para enviar por email
            const messagesResponse = await fetch(`${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/messages`);
            const messagesData = await messagesResponse.json();
            
            // Enviar transcripción por email (solo si el usuario está autenticado)
            if (this.userId && messagesData.data) {
                await this.sendTranscriptionEmail(messagesData.data);
            }
            
            // Finalizar sesión en el backend
            await fetch(`${this.apiGatewayUrl}/chat-sessions/end/${this.sessionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            // Limpiar estado local
            localStorage.removeItem('chat_session_id');
            localStorage.removeItem('chat_session_token');
            localStorage.removeItem('chat_user_id');
            
            this.sessionId = null;
            this.sessionToken = null;
            
            // Mostrar mensaje de finalización
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.innerHTML = `
                <div class="welcome-message" style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                    <h3 style="color: #4caf50; margin: 0 0 10px 0;">Conversación Finalizada</h3>
                    <p style="color: #666;">Se ha enviado una copia de la conversación a tu correo electrónico.</p>
                    <button onclick="window.chatboxWidget.startNewConversation()" style="margin-top: 20px; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 600;">
                        Iniciar Nueva Conversación
                    </button>
                </div>
            `;
            
            // Ocultar controles
            document.getElementById('chat-input-area').style.display = 'none';
            document.getElementById('chat-footer').style.display = 'none';
            document.getElementById('quick-faqs').style.display = 'none';
            
        } catch (error) {
            console.error('❌ Error al finalizar conversación:', error);
            alert('Hubo un error al finalizar la conversación. Por favor, intenta de nuevo.');
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

    async saveMessage(text, sender) {
        try {
            const response = await fetch(`${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    sender: sender,
                    session_token: this.sessionToken
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.data?.messageId || null;
            }
            return null;
        } catch (error) {
            console.error('⚠️ Error al guardar mensaje:', error);
            return null;
        }
    }

    async sendFeedback(messageId, feedbackType) {
        try {
            const response = await fetch(`${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/message/${messageId}/feedback`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    feedback: feedbackType
                })
            });

            if (response.ok) {
                // Actualizar UI para mostrar que se envió el feedback
                const feedbackContainer = document.querySelector(`[data-message-id="${messageId}"]`);
                if (feedbackContainer) {
                    feedbackContainer.innerHTML = `
                        <span class="feedback-sent ${feedbackType}">
                            ${feedbackType === 'positive' ? '👍 Útil' : '👎 No útil'}
                        </span>
                    `;
                }
                
            } else {
                console.error('❌ Error al enviar feedback');
            }
        } catch (error) {
            console.error('❌ Error al enviar feedback:', error);
        }
    }

    async sendTranscriptionEmail(messages) {
        try {
            
            // Obtener datos del usuario desde la BD de PHP
            const userResponse = await fetch(`/get_user_email.php?user_id=${this.userId}`);
            
            const userData = await userResponse.json();

            if (!userData.email) {
                console.error('❌ NO HAY EMAIL EN LA RESPUESTA');
                console.error('❌ userData completo:', JSON.stringify(userData));
                return;
            }


            // Formatear mensajes para el email
            const formattedMessages = messages.map(msg => ({
                sender: msg.sender,
                text: msg.text,
                timestamp: msg.timestamp || msg.createdAt || new Date().toISOString()
            }));
            

            const emailPayload = {
                to: userData.email,
                userName: userData.nombre_completo || 'Usuario',
                messages: formattedMessages,
                sessionEndTime: new Date().toISOString(),
                sessionId: this.sessionId
            };
            

            // Llamar al notification-service
            const response = await fetch(`${API_CONFIG.NOTIFICATION_SERVICE}/email/chat-transcription`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailPayload)
            });

            const responseData = await response.json();

            if (response.ok) {
            } else {
                console.error('❌ ERROR AL ENVIAR TRANSCRIPCIÓN');
                console.error('❌ Respuesta:', responseData);
            }
        } catch (error) {
            console.error('❌ ========== ERROR CRÍTICO AL ENVIAR EMAIL ==========');
            console.error('❌ Error completo:', error);
            console.error('❌ Stack:', error.stack);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Mostrar prompt de confirmación para escalar a soporte humano
     */
    showEscalationPrompt(userMessage, botResponse, nlpData, reason) {
        const messagesContainer = document.getElementById('chat-messages');
        const promptDiv = document.createElement('div');
        promptDiv.className = 'chat-message system-message escalation-prompt';
        promptDiv.innerHTML = `
            <div class="escalation-prompt-content">
                <div class="escalation-icon">🤔</div>
                <div class="escalation-text">
                    <strong>Parece que necesitas ayuda adicional</strong>
                    <p style="margin: 8px 0; font-size: 14px; color: #666;">${reason}</p>
                    <p style="margin: 8px 0;">¿Deseas hablar con un especialista de soporte humano?</p>
                </div>
                <div class="escalation-buttons" style="display: flex; gap: 10px; margin-top: 15px;">
                    <button class="escalation-btn escalation-yes" 
                            style="flex: 1; padding: 12px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                        ✅ Sí, crear ticket
                    </button>
                    <button class="escalation-btn escalation-no" 
                            style="flex: 1; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
                        ❌ No, continuar aquí
                    </button>
                </div>
            </div>
        `;

        messagesContainer.appendChild(promptDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Event listeners para los botones
        const yesBtn = promptDiv.querySelector('.escalation-yes');
        const noBtn = promptDiv.querySelector('.escalation-no');

        yesBtn.addEventListener('click', async () => {
            // Deshabilitar botones
            yesBtn.disabled = true;
            noBtn.disabled = true;
            yesBtn.textContent = '⏳ Creando ticket...';
            
            // Crear ticket
            await this.createEscalationTicket(userMessage, botResponse, nlpData);
            
            // Remover prompt
            promptDiv.remove();
        });

        noBtn.addEventListener('click', () => {
            // Mostrar mensaje de confirmación
            this.addMessage(
                'De acuerdo, puedes seguir conversando conmigo. Si cambias de opinión, puedes solicitar soporte humano en cualquier momento.',
                'system'
            );
            
            // Remover prompt
            promptDiv.remove();
        });
    }

    async createEscalationTicket(userMessage, botResponse, nlpData) {
        try {
            // Obtener información del usuario
            const userResponse = await fetch(`/get_user_email.php?user_id=${this.userId}`);
            const userData = await userResponse.json();
            
            if (!userData.email) {
                console.error('❌ No se pudo obtener email del usuario para crear ticket');
                this.addMessage(
                    '⚠️ Error al obtener información del usuario. No se pudo crear el ticket.',
                    'system'
                );
                return;
            }
            
            // Crear ticket usando la NUEVA API (Railway)
            const ticketResponse = await fetch(`${this.apiGatewayUrl}/tickets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sessionId: this.sessionId,
                    userId: this.userId,
                    userName: userData.nombre_completo || 'Usuario',
                    userEmail: userData.email,
                    subject: userMessage.substring(0, 100), // Primeros 100 caracteres como asunto
                    originalQuery: userMessage,
                    escalationReason: nlpData.escalation_reason || nlpData.data?.escalation_reason || 'Solicitud de usuario',
                    initialMessage: userMessage // Mensaje inicial del ticket
                })
            });
            
            if (ticketResponse.ok) {
                const ticketData = await ticketResponse.json();
                const ticketId = ticketData.data?.ticketId;
                
                this.addMessage(
                    `✅ <strong>Ticket creado exitosamente</strong><br><br>` +
                    `📋 Número de ticket: <strong>${ticketId}</strong><br>` +
                    `📧 Recibirás un correo de confirmación en: ${userData.email}<br><br>` +
                    `Un especialista te contactará pronto. Puedes ver tus tickets en la sección "Mis Tickets" del dashboard.`,
                    'system'
                );
                
                console.log('✅ Ticket creado:', ticketId);
            } else {
                const errorData = await ticketResponse.json();
                console.error('❌ Error creando ticket:', errorData);
                this.addMessage(
                    `⚠️ Hubo un problema al crear tu ticket de soporte: ${errorData.message || 'Error desconocido'}`,
                    'system'
                );
            }
        } catch (error) {
            console.error('❌ Error creando ticket de escalamiento:', error);
            this.addMessage(
                '⚠️ Error de conexión al crear el ticket. Por favor, intenta nuevamente.',
                'system'
            );
        }
    }
    
    async sendTicketNotificationEmail(ticketId, userData) {
        try {
            await fetch(`${API_CONFIG.NOTIFICATION_SERVICE}/email/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: userData.email,
                    subject: `Ticket de Soporte Creado: ${ticketId}`,
                    body: `
                        <h2>Ticket de Soporte Creado</h2>
                        <p>Hola ${userData.nombre_completo},</p>
                        <p>Tu consulta ha sido derivada a nuestro equipo de soporte especializado.</p>
                        <p><strong>Número de Ticket:</strong> ${ticketId}</p>
                        <p>Un especialista se pondrá en contacto contigo pronto.</p>
                        <p>Gracias por tu paciencia.</p>
                    `
                })
            });
        } catch (error) {
            console.error('❌ Error enviando email de notificación:', error);
        }
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
