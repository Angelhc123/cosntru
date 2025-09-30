# 📊 Analytics Service

## Descripción
Microservicio de análisis y métricas del sistema UPT Chat para monitoreo, reportes y mejora continua.

## Responsabilidades
- Métricas en tiempo real del sistema
- Análisis de satisfacción de usuarios
- Reportes de efectividad del chatbot
- Dashboards para administradores
- Alertas automáticas
- Análisis de tendencias de consultas

## Stack Tecnológico Planificado
- **Framework**: NestJS + TypeScript
- **Base de Datos**: MongoDB + InfluxDB (time series)
- **Visualización**: Grafana o D3.js
- **Cache**: Redis para métricas en tiempo real
- **Puerto**: 3004

## Estado
📋 **PENDIENTE DE IMPLEMENTACIÓN**

## Endpoints Planificados
- `GET /api/v1/analytics/dashboard` - Dashboard principal
- `GET /api/v1/analytics/usage` - Estadísticas de uso
- `GET /api/v1/analytics/satisfaction` - Métricas de satisfacción
- `GET /api/v1/analytics/performance` - Rendimiento del sistema
- `GET /api/v1/analytics/trends` - Tendencias de consultas
- `POST /api/v1/analytics/events` - Registrar eventos

## Métricas Clave
- **Operacionales**: Tiempo de respuesta, disponibilidad
- **Negocio**: Consultas resueltas, escalamientos
- **Usuario**: Satisfacción, tiempo de sesión
- **Técnicas**: Precisión NLP, errores de sistema

## Reportes
- **Diarios**: Resumen de actividad
- **Semanales**: Tendencias y análisis
- **Mensuales**: KPIs y mejoras

## Integración
- **Todos los servicios**: Recolección de métricas
- **API Gateway**: Logs de acceso
- **Notification Service**: Alertas automáticas