# 🤖 Integración del Chatbox con API Gateway

## 📌 Arquitectura de la Solución

```
┌─────────────────────┐
│  Proyecto PHP       │
│  (Base de Datos U)  │  ← BD MySQL de la Universidad
│                     │
│  ┌───────────────┐  │
│  │ Login/Dashboard│  │
│  └───────┬────── ┘  │
│          │          │
│   ┌──────▼──────┐   │
│   │   Chatbox   │   │ ← Widget JavaScript
│   │   Widget    │   │
│   └──────┬──────┘   │
└──────────┼──────────┘
           │ HTTP Request
           ▼
┌──────────────────────┐
│   API Gateway        │
│   (localhost:3000)   │  ← NestJS + TypeScript
│                      │
│  Endpoints:          │
│  - POST /chat-sessions/start/:userId
│  - POST /chat-sessions/:id/message
│  - PUT  /chat-sessions/end/:id
│  - GET  /chat-sessions/:id/messages
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   MongoDB Atlas      │  ← NUESTRA Base de Datos
│   (Cloud Database)   │
│                      │
│  Colecciones:        │
│  - chatSessions      │
│  - users (ref)       │
└──────────────────────┘
```

## 🎯 Flujo de Funcionamiento

### 1️⃣ **Usuario Invitado (Sin Login)**
```javascript
// Abre la página de login
// Click en el botón del chatbox
// → Crea sesión GUEST en MongoDB Atlas
// → Envía mensajes que se guardan en MongoDB
// → Puede cerrar la conversación
```

### 2️⃣ **Usuario Registrado (Con Login)**
```javascript
// Login exitoso en PHP (BD de la U)
// Dashboard carga con user_id en localStorage
// Click en el botón del chatbox
// → Crea sesión REGISTERED en MongoDB Atlas
// → Asocia los mensajes con su user_id
// → Puede cerrar la conversación
```

## 📡 Endpoints del API Gateway

### **Iniciar Sesión de Chat**
```bash
POST http://localhost:3000/api/v1/chat-sessions/start/:userId

# Usuario registrado
Body: {
  "user_id": 123
}

# Usuario invitado
Body: {
  "guest_identifier": "guest_1696615200000"
}

Response: {
  "sessionToken": "abc123...",
  "sessionId": 456,
  "user_type": "registered" | "guest"
}
```

### **Enviar Mensaje**
```bash
POST http://localhost:3000/api/v1/chat-sessions/:sessionId/message

Body: {
  "message": "¿Cuáles son los horarios de atención?",
  "session_token": "abc123..."
}

Response: {
  "message_id": 789,
  "sender_type": "user",
  "timestamp": "2025-10-06T18:30:00Z"
}
```

### **Finalizar Conversación**
```bash
PUT http://localhost:3000/api/v1/chat-sessions/end/:sessionId

Body: {
  "session_token": "abc123..."
}

Response: {
  "status": "closed",
  "closed_at": "2025-10-06T18:35:00Z"
}
```

### **Obtener Mensajes**
```bash
GET http://localhost:3000/api/v1/chat-sessions/:sessionId/messages?session_token=abc123

Response: {
  "messages": [
    {
      "id": 1,
      "sender_type": "user",
      "message_text": "Hola",
      "sent_at": "2025-10-06T18:30:00Z"
    },
    {
      "id": 2,
      "sender_type": "bot",
      "message_text": "¡Hola! ¿En qué puedo ayudarte?",
      "sent_at": "2025-10-06T18:30:05Z"
    }
  ]
}
```

## 💾 Estructura de Datos en MongoDB Atlas

### **Colección: chatSessions**
```javascript
{
  "_id": ObjectId("..."),
  "sessionToken": "abc123def456...",
  "userId": 123,                    // Referencia a usuario de la U (opcional)
  "userType": "registered",         // "registered" o "guest"
  "guestIdentifier": null,          // Solo para invitados
  "status": "active",               // "active" o "closed"
  "startedAt": ISODate("2025-10-06T18:30:00Z"),
  "closedAt": null,
  "metadata": {
    "userAgent": "Mozilla/5.0...",
    "ipAddress": "192.168.1.100"
  }
}
```

### **Colección: chatMessages**
```javascript
{
  "_id": ObjectId("..."),
  "sessionId": ObjectId("..."),     // Referencia a chatSessions
  "senderType": "user",             // "user" o "bot"
  "messageText": "¿Horarios de atención?",
  "sentAt": ISODate("2025-10-06T18:30:10Z"),
  "metadata": {
    "intent": "horarios",
    "confidence": 0.95
  }
}
```

## 🚀 Cómo Probar

### 1. **Iniciar API Gateway**
```bash
cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway
npm run start:dev
```

Debe ver:
```
✅ API Gateway ejecutándose en: http://localhost:3000
✅ MongoDB Atlas conectado
```

### 2. **Iniciar Servidor PHP**
```bash
cd /home/desci/Documentos/constru/proyectotest/public
php -S localhost:8000
```

### 3. **Probar sin Login (Usuario Invitado)**
1. Abrir: http://localhost:8000/login.php
2. Click en el botón flotante "💬 Chat" (abajo derecha)
3. Escribir mensaje: "Hola, necesito información"
4. Enviar → Se guarda en MongoDB Atlas como sesión GUEST
5. Click en "Finalizar conversación"

### 4. **Probar con Login (Usuario Registrado)**
1. Login con: `usuario: demo` / `password: demo123` / `captcha: 8`
2. En el dashboard, click en "💬 Chat"
3. Escribir mensaje: "¿Cuáles son los horarios?"
4. Enviar → Se guarda en MongoDB Atlas asociado al user_id
5. Click en "Finalizar conversación"

## 🔍 Verificar en MongoDB Atlas

1. Ir a: https://cloud.mongodb.com
2. Login con las credenciales
3. Browse Collections → `upt_chat_system`
4. Ver colecciones:
   - `chatsessions` → Ver las sesiones creadas
   - `messages` → Ver los mensajes enviados

## ⚠️ Importante

- ✅ **BD de la Universidad (MySQL):** Solo para login y datos de usuarios
- ✅ **MongoDB Atlas:** TODO lo relacionado con el chatbox
- ✅ **API Gateway:** Intermediario entre el widget y MongoDB
- ✅ **Widget JavaScript:** Se comunica SOLO con el API Gateway

## 📝 Archivos Creados

```
proyectotest/
├── public/
│   ├── css/
│   │   └── chatbox.css          ← Estilos del widget
│   └── js/
│       └── chatbox.js            ← Lógica del widget
├── app/views/
│   ├── login.php                 ← Incluye chatbox (invitados)
│   └── dashboard.php             ← Incluye chatbox (registrados)
└── CHATBOX_INTEGRATION.md        ← Este archivo
```

## 🎨 Características del Widget

- ✅ Botón flotante en esquina inferior derecha
- ✅ Ventana de chat con diseño moderno
- ✅ Diferencia mensajes de usuario y bot
- ✅ Guarda sesión en localStorage
- ✅ Funciona con usuarios registrados e invitados
- ✅ Botón para finalizar conversación
- ✅ Animaciones suaves
- ✅ Responsive (se adapta a móviles)

## 🔧 Configuración

El widget se configura en `chatbox.js`:

```javascript
this.apiGatewayUrl = 'http://localhost:3000/api/v1';  // URL del API Gateway
```

Para producción, cambiar a la URL real del API Gateway desplegado.

## 📊 Logs y Debugging

El widget muestra logs en la consola del navegador:
- 🚀 Al iniciar sesión
- 📤 Al enviar mensajes
- 🛑 Al cerrar conversación
- ❌ En caso de errores

Abrir DevTools (F12) → Consola para ver los logs.

## ✅ Checklist de Pruebas

- [ ] API Gateway corriendo en localhost:3000
- [ ] MongoDB Atlas conectado
- [ ] Servidor PHP corriendo en localhost:8000
- [ ] Chatbox visible en login.php (sin login)
- [ ] Chatbox visible en dashboard.php (con login)
- [ ] Mensaje de invitado se guarda en MongoDB
- [ ] Mensaje de registrado se guarda en MongoDB con user_id
- [ ] Conversación se puede finalizar
- [ ] Sesión persiste en localStorage
- [ ] Al recargar página se mantiene la sesión

## 🎉 ¡Listo para Probar!

El chatbox está completamente integrado y listo para usar. Todos los datos se guardan en **NUESTRA MongoDB Atlas**, NO en la base de datos de la universidad.
