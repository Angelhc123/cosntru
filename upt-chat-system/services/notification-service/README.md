# 🚀 NOTIFICATION SERVICE - MICROSERVICIO INDEPENDIENTE# 📧 Notification Service



## ✅ ¿QUÉ ES?## Descripción

Microservicio **SEPARADO** del API Gateway que se encarga de TODAS las notificaciones:Microservicio de notificaciones y comunicaciones del sistema UPT Chat para usuarios y administradores.

- 📧 Emails (Gmail SMTP)

- 📱 SMS (futuro)## Responsabilidades

- 🔔 Push notifications (futuro)- Envío de emails institucionales

- Notificaciones push (futuro)

## 🏗️ ARQUITECTURA CORRECTA (Microservicios)- SMS para casos críticos

- Notificaciones en tiempo real (WebSocket)

```- Templates de mensajes UPT

┌─────────────┐- Cola de notificaciones

│ NLP Service │ Puerto 8001

└──────┬──────┘## Stack Tecnológico Planificado

       │- **Framework**: NestJS + TypeScript

       ↓- **Email**: Nodemailer + SMTP UPT o SendGrid

┌─────────────────┐- **Queue**: Bull Queue + Redis

│  API Gateway    │ Puerto 3000 (Orquestador)- **Base de Datos**: MongoDB (logs y templates)

└────┬───────┬────┘- **Templates**: Handlebars o EJS

     │       │- **Puerto**: 3005

     ↓       ↓

┌─────────┐ ┌──────────────────┐## Estado

│  MySQL  │ │ Notification     │ Puerto 3005📋 **PENDIENTE DE IMPLEMENTACIÓN**

│  (UPT)  │ │ Service          │ (Microservicio)

└─────────┘ └────────┬─────────┘## Endpoints Planificados

                     │- `POST /api/v1/notifications/email` - Enviar email

                     ↓- `POST /api/v1/notifications/push` - Notificación push

               ┌──────────┐- `GET /api/v1/notifications/templates` - Listar templates

               │  Gmail   │- `POST /api/v1/notifications/bulk` - Envío masivo

               │  SMTP    │- `GET /api/v1/notifications/status/:id` - Estado de envío

               └──────────┘

```## Tipos de Notificaciones

- **Escalamiento**: Cuando chatbot no puede resolver

## 🚀 INICIO RÁPIDO- **Administrativas**: Actualizaciones del sistema

- **Académicas**: Recordatorios importantes

### 1. Instalar dependencias- **Técnicas**: Alertas de sistema

```bash- **Satisfacción**: Encuestas post-chat

cd /home/desci/Documentos/constru/upt-chat-system/services/notification-service

npm install## Templates UPT

```- **Bienvenida**: Nuevo usuario registrado

- **Escalamiento**: Derivación a soporte humano

### 2. Configurar Gmail App Password- **Resolución**: Consulta resuelta exitosamente

```bash- **Feedback**: Solicitud de valoración

# Edita .env- **Mantenimiento**: Notificaciones de sistema

GMAIL_USER=angelxhernandezxcruz@gmail.com

GMAIL_APP_PASSWORD=tu_app_password_16_digitos## Integración

```- **Chat Service**: Notificaciones de chat

- **Analytics**: Alertas automáticas

### 3. Iniciar el servicio- **API Gateway**: Notificaciones de autenticación
```bash
npm run start:dev
```

**El servicio corre en:** `http://localhost:3005`

## 📡 ENDPOINTS REST

### 1. Enviar email de confirmación
```bash
POST http://localhost:3005/api/notifications/email/password-reset-confirmation

Body:
{
  "to": "usuario@email.com",
  "userName": "Juan Pérez",
  "confirmationUrl": "http://localhost:3000/api/password-reset/confirm/token123"
}
```

### 2. Enviar nueva contraseña
```bash
POST http://localhost:3005/api/notifications/email/new-password

Body:
{
  "to": "usuario@email.com",
  "userName": "Juan Pérez",
  "newPassword": "Abc123!@#"
}
```

### 3. Health check
```bash
GET http://localhost:3005/api/notifications/health
```

## 🔧 CÓMO SE INTEGRA

### Desde API Gateway (NestJS):
```typescript
import axios from 'axios';

await axios.post('http://localhost:3005/api/notifications/email/new-password', {
  to: email,
  userName: name,
  newPassword: password,
});
```

### Desde NLP Service (Python):
```python
import httpx

async with httpx.AsyncClient() as client:
    response = await client.post(
        'http://localhost:3005/api/notifications/email/new-password',
        json={'to': email, 'userName': name, 'newPassword': pwd}
    )
```

## 📁 ESTRUCTURA

```
notification-service/
├── src/
│   ├── application/
│   │   ├── services/
│   │   │   └── email.service.ts ← Lógica de envío
│   │   └── dtos/
│   │       └── notification.dto.ts ← DTOs
│   ├── infrastructure/
│   │   └── controllers/
│   │       └── notification.controller.ts ← Endpoints REST
│   ├── app.module.ts
│   └── main.ts ← Entry point (puerto 3005)
├── .env
├── package.json
└── tsconfig.json
```

## ✅ VENTAJAS DE SEPARARLO

1. **Single Responsibility**: Solo se encarga de notificaciones
2. **Escalabilidad**: Puedes escalar solo este servicio si hay muchos emails
3. **Reutilizable**: Cualquier servicio puede enviar emails
4. **Mantenibilidad**: Cambios en emails no afectan API Gateway
5. **Testing**: Más fácil de probar aisladamente

## 🔧 TROUBLESHOOTING

### Error: "Invalid login"
→ Verifica GMAIL_APP_PASSWORD (debe ser App Password, no tu contraseña)

### Puerto 3005 en uso
```bash
lsof -i :3005
kill -9 <PID>
```

### Emails no llegan
→ Revisa spam
→ Verifica logs: `npm run start:dev`

## 🎯 PRÓXIMOS PASOS

1. ✅ Notification Service funcionando en puerto 3005
2. ✅ API Gateway llama al Notification Service
3. ⏳ Probar flujo completo
4. ⏳ Agregar reintentos automáticos
5. ⏳ Implementar SMS con Twilio

---

**¡ARQUITECTURA DE MICROSERVICIOS CORRECTA!** 🎉
