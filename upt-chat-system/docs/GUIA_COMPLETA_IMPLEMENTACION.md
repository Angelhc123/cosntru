# 📋 GUÍA COMPLETA - SISTEMA DE CHATBOT UPT

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

### ✅ CU002 - Sistema de Feedback
- **Descripción**: Usuarios califican respuestas del bot con 👍/👎
- **Implementación**:
  - Botones de feedback en cada mensaje del bot
  - Endpoint: `PUT /api/v1/chat-sessions/{sessionId}/message/{messageId}/feedback`
  - Schema: Campo `feedback` en Message (positive/negative/null)
- **Archivo**: `chatbox-with-history.js` líneas 735-758

### ✅ CU005 - Sistema de Escalamiento y Tickets

#### 1. Detección Automática (Confidence < 70%)
- **NLP Service** detecta baja confianza automáticamente
- Campo `requires_escalation: true` cuando confidence < 0.7
- **Archivo**: `nlp.service.ts` líneas 180-195

#### 2. Creación de Tickets
- **Schema**: `Ticket` con 12 campos (ticketId, status, priority, etc.)
- **Formato**: TICKET-YYYYMMDD-XXXXX (ejemplo: TICKET-20251029-70471)
- **Prioridad Auto**: high (conf < 0.4), medium (< 0.6), low (≥ 0.6)
- **Endpoint**: `POST /api/v1/support/tickets`
- **Archivos**: 
  - Schema: `ticket.schema.ts`
  - Servicio: `support.service.ts`
  - Controller: `support.controller.ts`

#### 3. Panel Admin de Tickets
- **Archivo**: `admin_tickets.php`
- **Funciones**:
  - Tabla filtrable (All/Pending/In-Progress/Resolved)
  - Modal con chat en vivo
  - Polling cada 5s para mensajes, 30s para lista
  - Auto-status: pending → in-progress al responder

#### 4. Notificaciones Email
- Email automático al usuario cuando se crea ticket
- Template HTML con número de ticket
- **Endpoint**: `POST http://localhost:3005/send-email`
- **Servicio**: notification-service (puerto 3005)

### ✅ CU006 - Dashboard de Métricas

#### 1. Backend Analytics
- **Schema**: `Analytics` con métricas agregadas
- **Servicio**: `analytics.service.ts` con 3 métodos:
  - `getDashboard(period)`: Métricas generales (queries, intents, confidence, escalation)
  - `getRealtime()`: Últimas 24h por hora
  - `getTimeSeriesData(period)`: Series temporales
- **Endpoints**:
  - `GET /api/v1/analytics/dashboard?period=day|week|month`
  - `GET /api/v1/analytics/realtime`
  - `GET /api/v1/analytics/timeseries?period=day|week|month`

#### 2. Panel Admin Analytics
- **Archivo**: `admin_analytics.php`
- **Gráficos Chart.js**:
  - Line Chart: Consultas por día
  - Bar Chart: Top 10 Intents
  - Doughnut Chart: Escalamiento vs auto-resolución
  - Pie Chart: Feedback positivo/negativo
- **Auto-refresh**: 30 segundos

#### 3. Dialogflow Analytics
- **Limitación**: API solo disponible en plan Enterprise
- **Solución**: Usamos métricas locales (MongoDB)
- **Archivo**: `dialogflow.service.ts` (preparado para futuro upgrade)

---

## 🏗️ ARQUITECTURA

```
┌─────────────────┐
│  PHP Frontend   │ (puerto 8000)
│  - chatbox.js   │
│  - admin_*.php  │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  API Gateway    │ (puerto 3000)
│  - NestJS       │
│  - Controllers  │
│  - Services     │
└────────┬────────┘
         │ MongoDB Atlas
         ▼
┌──────────────────┐       ┌──────────────────┐
│  MongoDB Atlas   │       │ Notification Svc │ (puerto 3005)
│  - 8 colecciones │◄──────│  - Gmail SMTP    │
└──────────────────┘       └──────────────────┘
```

### Colecciones MongoDB (8):
1. **User** - Usuarios del sistema UPT
2. **ChatSession** - Sesiones de chat activas
3. **Message** - Mensajes individuales (user/bot/system)
4. **Faq** - Preguntas frecuentes
5. **Ticket** - Tickets de soporte
6. **TicketMessage** - Mensajes de chat en tickets
7. **Analytics** - Métricas agregadas
8. **PasswordResetToken** - Tokens de recuperación

---

## 📡 API ENDPOINTS

### Chat & Sessions
```bash
# Iniciar sesión
POST /api/v1/chat-sessions/start
{
  "userId": "3",
  "userContext": {...}
}

# Enviar mensaje
POST /api/v1/nlp/query
{
  "sessionId": "abc123",
  "userId": "3",
  "query": "¿Cómo me matriculo?"
}

# Feedback
PUT /api/v1/chat-sessions/{sessionId}/message/{messageId}/feedback
{
  "feedbackType": "positive"
}

# Finalizar conversación
POST /api/v1/chat-sessions/{sessionId}/end
```

### Support Tickets
```bash
# Crear ticket
POST /api/v1/support/tickets
{
  "sessionId": "abc123",
  "userId": "3",
  "userName": "Juan Pérez",
  "userEmail": "juan@upt.pe",
  "originalQuery": "Necesito ayuda urgente",
  "botResponse": "Lo siento, no puedo ayudarte",
  "confidence": 0.45
}

# Listar tickets
GET /api/v1/support/tickets?status=pending

# Obtener ticket
GET /api/v1/support/tickets/:ticketId

# Actualizar estado
PUT /api/v1/support/tickets/:ticketId/status
{
  "status": "in-progress",
  "assignedTo": "Admin Name"
}

# Agregar mensaje
POST /api/v1/support/tickets/:ticketId/messages
{
  "sender": "admin",
  "senderName": "Admin Name",
  "message": "Hola, ¿en qué puedo ayudarte?"
}

# Obtener mensajes
GET /api/v1/support/tickets/:ticketId/messages

# Marcar como leído
PUT /api/v1/support/tickets/:ticketId/messages/read
```

### Analytics
```bash
# Dashboard general
GET /api/v1/analytics/dashboard?period=day

# Respuesta:
{
  "success": true,
  "data": {
    "period": "day",
    "totalQueries": 23,
    "intentBreakdown": {...},
    "avgConfidence": 0.75,
    "escalatedTickets": 3,
    "escalationRate": 2.38,
    "feedbackStats": {...}
  }
}

# Métricas en tiempo real
GET /api/v1/analytics/realtime

# Series temporales
GET /api/v1/analytics/timeseries?period=week
```

### FAQs
```bash
# Listar FAQs
GET /api/v1/faqs

# Crear FAQ
POST /api/v1/faqs
{
  "question": "¿Cómo me matriculo?",
  "answer": "Ingresa a...",
  "category": "matricula",
  "keywords": ["matricular", "inscribir"]
}

# Actualizar FAQ
PUT /api/v1/faqs/:id

# Eliminar FAQ
DELETE /api/v1/faqs/:id
```

---

## 🚀 INSTALACIÓN Y EJECUCIÓN

### Requisitos Previos
- Node.js >= 18
- PHP >= 8.0
- MongoDB Atlas (o local)
- Cuenta Gmail para SMTP

### 1. Configurar Variables de Entorno

**API Gateway (.env)**:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/upt_chat_system
JWT_SECRET=tu_secreto_super_seguro
DIALOGFLOW_PROJECT_ID=tu-proyecto-dialogflow
DIALOGFLOW_CREDENTIALS_PATH=./credentials.json
```

**Notification Service (.env)**:
```env
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=tu_app_password_16_chars
```

### 2. Instalar Dependencias
```bash
# API Gateway
cd upt-chat-system/services/api-gateway
npm install
npm run build

# Notification Service
cd ../notification-service
npm install
```

### 3. Arrancar Servicios

**Opción A - Script Automático**:
```bash
cd /home/desci/Documentos/constru
./start_all.sh
```

**Opción B - Manual**:
```bash
# Terminal 1: API Gateway
cd upt-chat-system/services/api-gateway
npm start

# Terminal 2: Notification Service
cd ../notification-service
npm start

# Terminal 3: PHP Frontend
cd proyectotest/public
php -S localhost:8000
```

### 4. Verificar
```bash
# Health check API Gateway
curl http://localhost:3000/api/v1/chat-sessions/health

# Analytics
curl "http://localhost:3000/api/v1/analytics/dashboard?period=day"

# Frontend
open http://localhost:8000
```

---

## 🧪 TESTING

### Test 1: Escalamiento Automático
```bash
# 1. Enviar consulta compleja (confidence < 70%)
curl -X POST http://localhost:3000/api/v1/nlp/query \
-H "Content-Type: application/json" \
-d '{
  "sessionId": "test123",
  "userId": "3",
  "query": "Necesito ayuda urgente con un problema que nadie puede resolver"
}'

# 2. Verificar que retorna requires_escalation: true
# 3. Verificar creación de ticket en MongoDB
# 4. Verificar email enviado al usuario
# 5. Verificar ticket aparece en admin_tickets.php
```

### Test 2: Chat Admin-Usuario
```bash
# 1. Abrir admin_tickets.php
# 2. Click en ticket pendiente
# 3. Escribir mensaje en modal
# 4. Verificar status cambia a "in-progress"
# 5. Verificar mensaje se guarda en MongoDB
```

### Test 3: Analytics Dashboard
```bash
# 1. Generar varias consultas con distintos intents
# 2. Crear algunos tickets
# 3. Dar feedback positivo/negativo
# 4. Abrir admin_analytics.php
# 5. Verificar gráficos muestran datos correctos
# 6. Cambiar período (Hoy/Semana/Mes)
# 7. Verificar auto-refresh cada 30s
```

---

## 📊 MÉTRICAS CALCULADAS

### Dashboard Analytics
- **totalQueries**: Total de mensajes de usuario
- **intentBreakdown**: Top 10 intents más consultados
- **avgConfidence**: Promedio de confianza de respuestas del bot
- **lowConfidenceCount**: Cantidad de respuestas con confidence < 70%
- **escalatedTickets**: Tickets creados automáticamente
- **escalationRate**: Porcentaje de escalamiento (tickets / queries * 100)
- **feedbackStats**: Positivo, negativo, ratio de satisfacción

### Realtime Metrics
- **queries**: Por hora (últimas 24h)
- **recentTickets**: Últimos 10 tickets
- **activeNow**: Consultas/respuestas/tickets en última hora

---

## 🔧 MANTENIMIENTO

### Logs
```bash
# API Gateway
tail -f /tmp/api-gateway.log

# Notification Service
tail -f /tmp/notification-service.log

# PHP
tail -f /tmp/php-server.log
```

### MongoDB Queries Útiles
```javascript
// Ver tickets pendientes
db.tickets.find({status: 'pending'}).sort({createdAt: -1})

// Métricas del día
db.messages.aggregate([
  {$match: {timestamp: {$gte: new Date('2025-10-29')}}},
  {$group: {_id: '$sender', count: {$sum: 1}}}
])

// Top intents
db.messages.aggregate([
  {$match: {sender: 'bot', 'nlpData.intent': {$exists: true}}},
  {$group: {_id: '$nlpData.intent', count: {$sum: 1}}},
  {$sort: {count: -1}},
  {$limit: 10}
])
```

### Limpiar Datos de Prueba
```javascript
// Eliminar sesiones de test
db.chatsessions.deleteMany({sessionId: /^test/})

// Eliminar tickets de test
db.tickets.deleteMany({userName: /test/i})
```

---

## 🐛 TROUBLESHOOTING

### Error: "Cannot GET /api/v1/..."
**Solución**: Verificar que API Gateway esté arriba
```bash
curl http://localhost:3000/health
```

### Error: "EADDRINUSE: address already in use"
**Solución**: Matar procesos en puerto ocupado
```bash
pkill -f "nest start"
pkill -f "php -S"
```

### Error: "Failed to send email"
**Solución**: Verificar credenciales Gmail
```bash
# Verificar .env en notification-service
cat upt-chat-system/services/notification-service/.env

# Probar envío manual
curl -X POST http://localhost:3005/send-email \
-H "Content-Type: application/json" \
-d '{"to":"test@test.com","subject":"Test","text":"Test"}'
```

### Tickets no aparecen en admin panel
**Solución**: Verificar CORS y MongoDB connection
```bash
# Verificar tickets en MongoDB
mongo "mongodb+srv://..." --eval "db.tickets.find().pretty()"

# Verificar CORS headers
curl -I http://localhost:3000/api/v1/support/tickets
```

---

## 📝 NOTAS TÉCNICAS

### Escalamiento Workflow
1. Usuario envía query → NLP Service analiza
2. Si confidence < 0.7 → `requires_escalation: true`
3. Frontend detecta flag → llama `createEscalationTicket()`
4. Ticket creado con ID único → MongoDB
5. Email enviado al usuario → Notification Service
6. Admin ve ticket en panel → MongoDB query
7. Admin responde → Status cambia a "in-progress"
8. Admin cierra → Status cambia a "resolved"

### Prioridad Auto-Asignada
```javascript
confidence < 0.4  → HIGH
confidence < 0.6  → MEDIUM
confidence >= 0.6 → LOW
```

### Polling Intervals
- **Mensajes de ticket**: 5 segundos (UX responsive)
- **Lista de tickets**: 30 segundos (reduce carga)
- **Analytics dashboard**: 30 segundos (métricas frescas)

### Índices MongoDB
```javascript
// Tickets
{ticketId: 1}        // Unique
{userId: 1}          // Queries por usuario
{status: 1}          // Filtros de estado
{createdAt: -1}      // Orden cronológico

// Messages
{sessionId: 1, timestamp: 1}  // Historial de chat
{sender: 1, timestamp: -1}    // Métricas por sender

// Analytics
{period: 1, date: -1}  // Time series
```

---

## ✅ CHECKLIST DEPLOYMENT

- [ ] Configurar MongoDB Atlas con IP whitelist
- [ ] Generar credenciales Dialogflow
- [ ] Configurar Gmail App Password
- [ ] Actualizar .env con valores producción
- [ ] Compilar API Gateway (`npm run build`)
- [ ] Ejecutar tests end-to-end
- [ ] Verificar CORS para dominio producción
- [ ] Configurar reverse proxy (Nginx/Apache)
- [ ] Habilitar HTTPS (Let's Encrypt)
- [ ] Configurar logs rotativos
- [ ] Monitoreo con PM2 o similar
- [ ] Backup automático MongoDB

---

## 📧 SOPORTE

**Desarrollador**: GitHub Copilot  
**Fecha Implementación**: 29 Octubre 2025  
**Versión**: 1.0.0  

**Repositorio**: Angelhc123/cosntru (branch: main)
