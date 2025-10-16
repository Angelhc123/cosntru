/**
 * Widget de Chatbox que se conecta al API Gateway
 * Guarda TODO en MongoDB Atlas (no en la BD de la universidad)
 */

class ChatboxWidget {
    constructor() {
        this.apiGatewayUrl = 'http://localhost:3000/api/v1';
        
        // Obtener valores del localStorage y validar que no sean 'undefined' como string
        const storedToken = localStorage.getItem('chat_session_token');
        const storedId = localStorage.getItem('chat_session_id');
        
        this.sessionToken = (storedToken && storedToken !== 'undefined' && storedToken !== 'null') ? storedToken : null;
        this.sessionId = (storedId && storedId !== 'undefined' && storedId !== 'null') ? storedId : null;
        this.userId = localStorage.getItem('user_id'); // Del login de PHP
        this.isOpen = false;
        
        console.log('🔧 Chatbox inicializado:', {
            sessionToken: this.sessionToken,
            sessionId: this.sessionId,
            userId: this.userId
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
                    <div class="chatbox-header">
                        <h3>🤖 Asistente Virtual UPT</h3>
                        <button id="close-chatbox" class="close-btn">✖</button>
                    </div>
                    
                    <div id="chat-messages" class="chat-messages">
                        <div class="welcome-message">
                            👋 Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                        </div>
                    </div>
                    
                    <div class="chat-input-container">
                        <input 
                            type="text" 
                            id="chat-input" 
                            placeholder="Escribe tu mensaje..."
                            autocomplete="off"
                        />
                        <button id="send-message" class="send-btn">Enviar</button>
                    </div>
                    
                    <div class="chatbox-footer">
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

    async toggleChatbox() {
        this.isOpen = !this.isOpen;
        const container = document.getElementById('chatbox-container');
        
        if (this.isOpen) {
            container.style.display = 'flex';
            
            // Si no hay sesión activa, crear una nueva
            if (!this.sessionToken) {
                await this.startNewSession();
            }
        } else {
            container.style.display = 'none';
        }
    }

    async startNewSession() {
        try {
            console.log('🚀 Iniciando nueva sesión de chat...');
            
            // Payload con metadata opcional
            const payload = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                initialQuery: 'Inicio de conversación'
            };
            
            const response = await fetch(`${this.apiGatewayUrl}/chat-sessions/start/${this.userId || 'guest'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error('Error al iniciar sesión');
            }
            
            const data = await response.json();
            console.log('✅ Sesión iniciada - Respuesta completa:', data);
            
            // Guardar en localStorage - La API devuelve data.data
            this.sessionToken = data.data?.sessionToken || data.sessionToken;
            this.sessionId = data.data?.id || data.id;
            
            console.log('📝 Valores extraídos:', {
                sessionToken: this.sessionToken,
                sessionId: this.sessionId,
                dataObject: data.data
            });
            
            // Validar que los valores no sean undefined antes de guardar
            if (!this.sessionToken || !this.sessionId) {
                throw new Error('La respuesta del servidor no contiene sessionToken o sessionId válidos');
            }
            
            localStorage.setItem('chat_session_token', this.sessionToken);
            localStorage.setItem('chat_session_id', this.sessionId);
            
            this.addSystemMessage('Conversación iniciada. ¿En qué puedo ayudarte?');
            
            // Registrar mensaje de inicio en la BD (después de verificar que sessionId existe)
            if (this.sessionId && this.sessionToken) {
                await this.registerSystemMessage('Conversación iniciada', 'inicio');
            }
            
        } catch (error) {
            console.error('❌ Error al iniciar sesión:', error);
            this.addSystemMessage('Error al conectar con el servidor. Por favor, intenta de nuevo.');
        }
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        if (!this.sessionToken || !this.sessionId) {
            await this.startNewSession();
            // Esperar un poco para asegurar que la sesión se cree
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Validar que ahora sí tenemos sessionId
        if (!this.sessionId || this.sessionId === 'undefined') {
            this.addSystemMessage('Error: No se pudo iniciar la sesión. Recarga la página.');
            return;
        }
        
        // Agregar mensaje del usuario a la interfaz
        this.addUserMessage(message);
        input.value = '';
        
        try {
            console.log('📤 Enviando mensaje:', message, 'SessionID:', this.sessionId);
            
            const response = await fetch(`${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: message,
                    sender: 'user',
                    session_token: this.sessionToken
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al enviar mensaje');
            }
            
            const data = await response.json();
            console.log('✅ Mensaje enviado y guardado:', data);
            
            // Procesar mensaje con NLP y obtener respuesta del bot
            await this.processMessageWithNLP(message);
            
        } catch (error) {
            console.error('❌ Error al enviar mensaje:', error);
            this.addSystemMessage('Error al enviar mensaje. Por favor, intenta de nuevo.');
        }
    }

    async endConversation() {
        if (!this.sessionToken || !this.sessionId || this.sessionId === 'undefined') {
            this.addSystemMessage('No hay conversación activa para finalizar.');
            console.warn('⚠️ No se puede finalizar:', {
                sessionToken: this.sessionToken,
                sessionId: this.sessionId
            });
            return;
        }
        
        try {
            console.log('🛑 Finalizando conversación...', {
                sessionId: this.sessionId,
                sessionToken: this.sessionToken
            });
            
            // Registrar mensaje de cierre en la BD
            await this.registerSystemMessage('Conversación finalizada por el usuario', 'cierre');
            
            // Finalizar sesión en el backend
            const response = await fetch(`${this.apiGatewayUrl}/chat-sessions/end/${this.sessionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_token: this.sessionToken
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al finalizar conversación');
            }
            
            const data = await response.json();
            console.log('✅ Conversación finalizada:', data);
            
            // Mostrar mensaje de despedida
            this.addSystemMessage('✅ Conversación finalizada y guardada. ¡Hasta pronto! 👋');
            
            // Limpiar localStorage después de 2 segundos
            setTimeout(() => {
                localStorage.removeItem('chat_session_token');
                localStorage.removeItem('chat_session_id');
                
                this.sessionToken = null;
                this.sessionId = null;
                
                // Reiniciar interfaz
                document.getElementById('chat-messages').innerHTML = `
                    <div class="welcome-message">
                        👋 Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                    </div>
                `;
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error al finalizar conversación:', error);
            this.addSystemMessage('Error al finalizar conversación. Por favor, intenta de nuevo.');
        }
    }

    async registerSystemMessage(text, tipo = 'system') {
        if (!this.sessionToken || !this.sessionId || this.sessionId === 'undefined') {
            console.warn('⚠️ No hay sesión activa para registrar mensaje del sistema', {
                sessionToken: this.sessionToken,
                sessionId: this.sessionId
            });
            return;
        }
        
        try {
            console.log(`📝 Registrando mensaje del sistema (${tipo}):`, text);
            
            const response = await fetch(`${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    sender: 'system',
                    session_token: this.sessionToken,
                    metadata: { tipo: tipo }
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al registrar mensaje del sistema');
            }
            
            const data = await response.json();
            console.log('✅ Mensaje del sistema registrado:', data);
            
        } catch (error) {
            console.error('❌ Error al registrar mensaje del sistema:', error);
        }
    }

    async loadMessages() {
        if (!this.sessionToken) return;
        
        try {
            const response = await fetch(
                `${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/messages?session_token=${this.sessionToken}`
            );
            
            if (!response.ok) return;
            
            const data = await response.json();
            const messages = data.messages || data.data?.messages || [];
            
            messages.forEach(msg => {
                if (msg.sender_type === 'user') {
                    this.addUserMessage(msg.message_text, false);
                } else {
                    this.addBotMessage(msg.message_text, false);
                }
            });
            
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        }
    }

    addUserMessage(message, scroll = true) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">${this.escapeHtml(message)}</div>
            <div class="message-time">${new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        
        if (scroll) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    addBotMessage(message, scroll = true) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = `
            <div class="message-content">🤖 ${this.escapeHtml(message)}</div>
            <div class="message-time">${new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        
        if (scroll) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    addSystemMessage(message) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        messageDiv.innerHTML = `
            <div class="message-content">ℹ️ ${this.escapeHtml(message)}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async processMessageWithNLP(userMessage) {
        try {
            console.log('🤖 Procesando mensaje con NLP Service...');
            
            // Mostrar indicador de "escribiendo..."
            this.showTypingIndicator();
            
            // Llamar al NLP Service a través del API Gateway
            const response = await fetch(`${this.apiGatewayUrl}/nlp/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: userMessage,
                    session_id: this.sessionId,
                    language: 'es'
                })
            });
            
            if (!response.ok) {
                throw new Error('Error al procesar con NLP');
            }
            
            const nlpData = await response.json();
            console.log('✅ Respuesta NLP:', nlpData);
            
            // Remover indicador de escritura
            this.removeTypingIndicator();
            
            // Extraer la respuesta del bot
            let botResponse = '';
            let confidence = 0;
            
            if (nlpData.success && nlpData.data) {
                confidence = nlpData.data.confidence || 0;
                
                // Prioridad 1: Respuesta del FAQ
                if (nlpData.data.faq_answer) {
                    botResponse = nlpData.data.faq_answer;
                }
                // Prioridad 2: Respuesta de DialogFlow
                else if (nlpData.data.dialogflow_response) {
                    botResponse = nlpData.data.dialogflow_response;
                }
                // Prioridad 3: Respuesta genérica basada en intent
                else if (nlpData.data.intent && nlpData.data.intent !== 'unknown') {
                    botResponse = `Entiendo que preguntas sobre: ${nlpData.data.intent}. ¿Puedes ser más específico?`;
                }
                // Sin respuesta clara
                else {
                    botResponse = 'Lo siento, no entendí tu pregunta. ¿Podrías reformularla? 🤔';
                }
                
                // Agregar información de confianza si es baja
                if (confidence < 0.7 && confidence > 0) {
                    botResponse += `\n\n💡 Tip: Si necesitas ayuda específica, intenta preguntar de otra manera.`;
                }
            } else {
                botResponse = 'Disculpa, estoy teniendo problemas para procesar tu mensaje. Por favor, intenta de nuevo.';
            }
            
            // Mostrar respuesta del bot
            this.addBotMessage(botResponse);
            
            // Guardar respuesta del bot en la BD
            await this.saveResponseToDatabase(botResponse, nlpData.data);
            
        } catch (error) {
            console.error('❌ Error al procesar con NLP:', error);
            this.removeTypingIndicator();
            this.addBotMessage('Lo siento, estoy teniendo problemas técnicos. Por favor, intenta de nuevo en un momento. 🔧');
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-content">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async saveResponseToDatabase(botMessage, nlpData) {
        try {
            const response = await fetch(`${this.apiGatewayUrl}/chat-sessions/${this.sessionId}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: botMessage,
                    sender: 'bot',
                    session_token: this.sessionToken,
                    metadata: {
                        intent: nlpData?.intent || 'unknown',
                        confidence: nlpData?.confidence || 0,
                        source: nlpData?.source || 'nlp-service'
                    }
                })
            });
            
            if (response.ok) {
                console.log('✅ Respuesta del bot guardada en BD');
            }
        } catch (error) {
            console.error('⚠️ Error al guardar respuesta del bot:', error);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar chatbox cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.chatbox = new ChatboxWidget();
    console.log('✅ Chatbox widget inicializado');
});
