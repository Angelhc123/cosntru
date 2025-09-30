# 💬 Chat Service

## Descripción
Microservicio encargado de la gestión de conversaciones y mensajes en tiempo real del sistema UPT Chat.

## Responsabilidades
- Gestión de mensajes en tiempo real (WebSockets)
- Manejo de conversaciones activas
- Integración con NLP Service para procesamiento
- Histórico de conversaciones
- Manejo de archivos adjuntos

## Stack Tecnológico Planificado
- **Framework**: NestJS + TypeScript
- **WebSockets**: Socket.IO
- **Base de Datos**: MongoDB
- **Comunicación**: Redis para pub/sub
- **Puerto**: 3001

## Estado
📋 **PENDIENTE DE IMPLEMENTACIÓN**

## Endpoints Planificados
- `POST /api/v1/chat/send` - Enviar mensaje
- `GET /api/v1/chat/history/:sessionId` - Obtener historial
- `WS /chat` - WebSocket para tiempo real

## Integración
- **API Gateway**: Autenticación y routing
- **NLP Service**: Procesamiento de mensajes
- **Knowledge Base**: Respuestas automáticas