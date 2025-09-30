# 📧 Notification Service

## Descripción
Microservicio de notificaciones y comunicaciones del sistema UPT Chat para usuarios y administradores.

## Responsabilidades
- Envío de emails institucionales
- Notificaciones push (futuro)
- SMS para casos críticos
- Notificaciones en tiempo real (WebSocket)
- Templates de mensajes UPT
- Cola de notificaciones

## Stack Tecnológico Planificado
- **Framework**: NestJS + TypeScript
- **Email**: Nodemailer + SMTP UPT o SendGrid
- **Queue**: Bull Queue + Redis
- **Base de Datos**: MongoDB (logs y templates)
- **Templates**: Handlebars o EJS
- **Puerto**: 3005

## Estado
📋 **PENDIENTE DE IMPLEMENTACIÓN**

## Endpoints Planificados
- `POST /api/v1/notifications/email` - Enviar email
- `POST /api/v1/notifications/push` - Notificación push
- `GET /api/v1/notifications/templates` - Listar templates
- `POST /api/v1/notifications/bulk` - Envío masivo
- `GET /api/v1/notifications/status/:id` - Estado de envío

## Tipos de Notificaciones
- **Escalamiento**: Cuando chatbot no puede resolver
- **Administrativas**: Actualizaciones del sistema
- **Académicas**: Recordatorios importantes
- **Técnicas**: Alertas de sistema
- **Satisfacción**: Encuestas post-chat

## Templates UPT
- **Bienvenida**: Nuevo usuario registrado
- **Escalamiento**: Derivación a soporte humano
- **Resolución**: Consulta resuelta exitosamente
- **Feedback**: Solicitud de valoración
- **Mantenimiento**: Notificaciones de sistema

## Integración
- **Chat Service**: Notificaciones de chat
- **Analytics**: Alertas automáticas
- **API Gateway**: Notificaciones de autenticación