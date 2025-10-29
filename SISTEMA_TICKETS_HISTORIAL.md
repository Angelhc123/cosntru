# 📋 Sistema de Tickets con Historial de Conversación

## 🎯 Funcionalidad Implementada

Cuando un usuario escala su consulta al crear un ticket de soporte, el sistema ahora:

### ✅ Para el ADMINISTRADOR:
1. **Ve TODO el historial** de la conversación del chatbot
2. Recibe contexto completo de lo que el usuario preguntó
3. Los mensajes del historial se marcan como `visibleTo: 'admin'`
4. Puede ver el flujo completo de la conversación antes de la escalación

### ✅ Para el USUARIO:
1. **NO ve** el historial de conversación previo
2. Solo ve su mensaje inicial de escalación
3. No se repite la conversación que ya tuvo con el bot
4. Interfaz más limpia sin mensajes duplicados

---

## 🔧 Archivos Modificados

### Backend (API Gateway)

#### 1. `/upt-chat-system/services/api-gateway/src/application/tickets/tickets.controller.ts`
```typescript
// NUEVO PARÁMETRO: conversationHistory
conversationHistory?: Array<{
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}>;
```

#### 2. `/upt-chat-system/services/api-gateway/src/application/tickets/tickets.service.ts`
```typescript
// Agregar historial como mensajes del sistema solo para admin
if (data.conversationHistory && data.conversationHistory.length > 0) {
  messages.push({
    sender: 'system',
    senderName: 'Sistema',
    text: '📜 Historial de conversación previo:',
    timestamp: new Date(),
    visibleTo: 'admin' // ← CLAVE: Solo visible para admin
  });

  data.conversationHistory.forEach((msg) => {
    messages.push({
      sender: 'system',
      senderName: msg.sender === 'user' ? data.userName : 'Chatbot',
      text: msg.text,
      timestamp: msg.timestamp || new Date(),
      visibleTo: 'admin' // ← Solo admin lo ve
    });
  });
}
```

### Frontend (JavaScript)

#### 3. `/proyectotest/public/js/chatbox.js`
**Nuevas funciones agregadas:**

- `getConversationHistory()` - Obtiene todos los mensajes de la sesión
- `createSupportTicket(subject, reason)` - Crea ticket con historial completo
- `showEscalationPrompt(subject, reason)` - Muestra prompt con botones SÍ/NO
- `handleEscalationResponse(response, subject, reason)` - Maneja la respuesta del usuario

**Ejemplo de uso:**
```javascript
// Cuando el NLP detecta baja confianza:
window.chatboxWidget.showEscalationPrompt(
  'Consulta sobre traslado externo',
  'Confianza baja (45%)'
);

// Usuario hace clic en "SÍ, necesito ayuda"
// → Se crea ticket con TODO el historial de conversación
```

#### 4. `/proyectotest/public/js/tickets-user.js`
```javascript
function renderTicketMessages(messages) {
  messages.forEach(msg => {
    // FILTRAR: NO mostrar mensajes exclusivos para admin
    if (msg.visibleTo === 'admin') {
      console.log('🚫 Mensaje oculto para usuario');
      return; // Saltar este mensaje
    }
    // ... renderizar solo mensajes sin visibleTo
  });
}
```

#### 5. `/proyectotest/public/js/admin-tickets.js`
```javascript
// El admin renderiza TODOS los mensajes sin filtrar
function renderChatMessages(messages) {
  messages.forEach(msg => {
    // Admin ve TODO, incluyendo visibleTo: 'admin'
    if (isSystem) {
      html += `<div class="message system">ℹ️ ${msg.text}</div>`;
    }
    // ...
  });
}
```

### Estilos (CSS)

#### 6. `/proyectotest/public/css/chatbox.css`
```css
/* Estilos para botones de escalación */
.escalation-prompt .message-content {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
}

.escalation-btn.yes-btn {
  background: #28a745;
  color: white;
}

.escalation-btn.no-btn {
  background: #6c757d;
  color: white;
}
```

---

## 🧪 Cómo Probar

### Opción 1: Página de Test
1. Abrir `http://localhost:8000/test_ticket_escalation.html`
2. Hacer clic en "🚀 Crear Ticket con Historial"
3. Ver como Admin (verá 5 mensajes de historial + mensaje inicial)
4. Ver como Usuario (solo verá mensaje inicial)

### Opción 2: Flujo Real
1. Abrir el chatbox en la página principal
2. Hacer varias preguntas al bot
3. Llamar manualmente a la función de escalación:
```javascript
window.chatboxWidget.showEscalationPrompt(
  'Necesito ayuda personalizada',
  'Usuario solicitó asistencia'
);
```
4. Hacer clic en "✅ Sí, necesito ayuda"
5. Ir a `admin_tickets.php` y ver el ticket (incluye historial completo)
6. Ir a "Mis Tickets" como usuario (solo mensaje inicial)

---

## 📊 Estructura de Mensajes en MongoDB

### Mensaje Normal (visible para todos)
```javascript
{
  sender: 'user',
  senderName: 'Juan Pérez',
  text: 'Necesito ayuda',
  timestamp: ISODate("2025-10-29T20:00:00Z")
  // NO tiene visibleTo → Todos lo ven
}
```

### Mensaje Solo para Admin (historial)
```javascript
{
  sender: 'system',
  senderName: 'Chatbot',
  text: '¿Cuáles son los requisitos de matrícula?',
  timestamp: ISODate("2025-10-29T19:55:00Z"),
  visibleTo: 'admin' // ← Solo admin lo ve
}
```

---

## 🔄 Flujo Completo

```
1. Usuario chatea con bot (5 mensajes)
   ├─ "¿Requisitos de matrícula?"
   ├─ "¿Y si soy de traslado?"
   ├─ "No entiendo, ayuda"
   └─ ...

2. Usuario escala a soporte
   └─ showEscalationPrompt()
       ├─ SÍ → createSupportTicket()
       │       ├─ getConversationHistory() → Obtiene 5 mensajes
       │       ├─ POST /api/v1/tickets con conversationHistory
       │       └─ Backend guarda historial con visibleTo: 'admin'
       └─ NO → Continuar chat

3. Admin abre admin_tickets.php
   └─ Ve ticket con:
       ├─ "📜 Historial de conversación previo:" [SISTEMA]
       ├─ "¿Requisitos de matrícula?" [USUARIO]
       ├─ "Los requisitos incluyen..." [CHATBOT]
       ├─ "¿Y si soy de traslado?" [USUARIO]
       ├─ "Para traslado necesitas..." [CHATBOT]
       ├─ "--- Fin del historial ---" [SISTEMA]
       └─ "Necesito ayuda personalizada" [USUARIO] ← Mensaje inicial

4. Usuario abre "Mis Tickets"
   └─ Ve ticket con:
       └─ "Necesito ayuda personalizada" [USUARIO] ← Solo este
```

---

## 🎨 UI/UX

### Prompt de Escalación (Chatbox)
```
┌─────────────────────────────────────────────┐
│ 🎫 ¿Necesitas ayuda personalizada?         │
│                                             │
│ Parece que necesitas asistencia específica.│
│ Puedo crear un ticket de soporte y un      │
│ agente te ayudará personalmente.           │
│                                             │
│  ┌─────────────────────┐ ┌───────────────┐ │
│  │ ✅ Sí, necesito ayuda│ │ ❌ No, gracias│ │
│  └─────────────────────┘ └───────────────┘ │
└─────────────────────────────────────────────┘
```

### Panel Admin (con historial)
```
╔═══════════════════════════════════════════╗
║  Ticket #TKT-20251029-0002                ║
║  Usuario: Juan Pérez                      ║
╠═══════════════════════════════════════════╣
║                                           ║
║  ℹ️ 📜 Historial de conversación previo:  ║
║                                           ║
║  👤 Juan Pérez:                           ║
║  ¿Cuáles son los requisitos de matrícula? ║
║                                           ║
║  🤖 Chatbot:                              ║
║  Los requisitos incluyen DNI, constancia..║
║                                           ║
║  👤 Juan Pérez:                           ║
║  ¿Y si soy de traslado externo?           ║
║                                           ║
║  🤖 Chatbot:                              ║
║  Para traslado externo necesitas...       ║
║                                           ║
║  ℹ️ --- Fin del historial ---             ║
║                                           ║
║  👤 Juan Pérez:                           ║
║  Necesito ayuda personalizada             ║
║                                           ║
╚═══════════════════════════════════════════╝
```

### Panel Usuario (sin historial)
```
╔═══════════════════════════════════════════╗
║  Ticket #TKT-20251029-0002                ║
║  Estado: 📋 Asignado                      ║
╠═══════════════════════════════════════════╣
║                                           ║
║  👤 Tú:                                   ║
║  Necesito ayuda personalizada             ║
║                                           ║
║  ℹ️ Tu ticket ha sido asignado a          ║
║     Lic. Carmen Rosa López Ticona.        ║
║     Pronto recibirás ayuda.               ║
║                                           ║
╚═══════════════════════════════════════════╝
```

---

## ✅ Beneficios

1. **Para Admin:**
   - Contexto completo de la situación
   - No necesita preguntar "¿qué pasó antes?"
   - Puede resolver más rápido

2. **Para Usuario:**
   - No ve mensajes duplicados
   - Interfaz limpia y simple
   - Solo ve la nueva conversación con el agente

3. **Para el Sistema:**
   - Trazabilidad completa
   - Datos históricos preservados
   - Análisis de escalaciones más precisos

---

## 📝 Notas Técnicas

- El campo `visibleTo: 'admin'` se usa exclusivamente para filtrar en el frontend
- El backend NO filtra mensajes, siempre devuelve todos
- Cada frontend es responsable de filtrar según el rol
- Los mensajes del historial se guardan con `sender: 'system'` para identificarlos visualmente

---

## 🚀 Próximos Pasos

1. Integrar con NLP Service para detectar automáticamente cuando escalar
2. Agregar métricas de escalación (cuántos tickets se crean, en qué momento)
3. Implementar resumen inteligente del historial (ML)
4. Agregar notificación al admin cuando se crea ticket con historial extenso
