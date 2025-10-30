# 📊 Analytics Service - Dashboard de Métricas en Tiempo Real

## 🎯 Descripción

Microservicio de análisis y métricas en tiempo real para el UPT Chat System. Implementa los requerimientos funcionales **RF006 (Dashboard de Métricas)** y **RF012 (Exportación de Datos)**.

## 🏗️ Arquitectura

### Clean Architecture + DDD

```
analytics-service/
├── src/
│   ├── domain/                    # Capa de Dominio
│   │   └── analytics/
│   │       ├── metric.entity.ts
│   │       └── dashboard-stats.entity.ts
│   │
│   ├── application/               # Capa de Aplicación (Casos de Uso)
│   │   └── analytics/
│   │       ├── analytics.service.ts
│   │       ├── report-export.service.ts
│   │       └── analytics.module.ts
│   │
│   ├── infrastructure/            # Capa de Infraestructura
│   │   └── database/
│   │       └── schemas/
│   │           ├── message.schema.ts
│   │           ├── chat-session.schema.ts
│   │           ├── faq.schema.ts
│   │           └── ticket.schema.ts
│   │
│   ├── presentation/              # Capa de Presentación
│   │   └── controllers/
│   │       └── analytics.controller.ts
│   │
│   ├── app.module.ts
│   └── main.ts
└── package.json
```

## 📡 Endpoints API

### Dashboard de Métricas

#### GET `/api/v1/analytics/dashboard`
Obtener estadísticas generales del dashboard

**Query Params:**
- `startDate` (opcional): Fecha inicio (ISO 8601)
- `endDate` (opcional): Fecha fin (ISO 8601)

**Response:**
```json
{
  "success": true,
  "data": {
    "totalQueries": 1250,
    "averageConfidence": 85.5,
    "positiveRate": 78.2,
    "escalationRate": 5.4,
    "topIntents": [
      { "intent": "matricula.requisitos", "count": 340 },
      { "intent": "horarios.consulta", "count": 280 }
    ],
    "topFaqs": [
      { "question": "¿Cuáles son los requisitos de matrícula?", "count": 180 }
    ],
    "period": {
      "start": "2025-10-01T00:00:00Z",
      "end": "2025-10-29T23:59:59Z"
    }
  }
}
```

#### GET `/api/v1/analytics/queries`
Obtener consultas agrupadas por período

**Query Params:**
- `startDate`, `endDate`
- `granularity`: `hour` | `day` | `week` (default: `day`)

#### GET `/api/v1/analytics/feedback`
Distribución de feedback positivo/negativo

#### GET `/api/v1/analytics/low-confidence`
Intents con confianza menor al umbral

**Query Params:**
- `threshold`: Umbral de confianza (default: 0.7)

#### GET `/api/v1/analytics/usage-patterns`
Patrones de uso por hora del día

#### GET `/api/v1/analytics/tickets/status`
Tickets agrupados por estado (pending, assigned, resolved)

#### GET `/api/v1/analytics/tickets/escalation-reasons`
Top razones de escalación

#### GET `/api/v1/analytics/tickets/resolution-time`
Tiempo promedio de resolución de tickets

**Response:**
```json
{
  "success": true,
  "data": {
    "avgTimeHours": 2,
    "avgTimeMinutes": 35
  }
}
```

#### GET `/api/v1/analytics/faqs/feedback`
FAQs con mejor y peor feedback

**Query Params:**
- `limit`: Cantidad de FAQs (default: 10)

#### GET `/api/v1/analytics/sessions/active`
Cantidad de sesiones activas

### Exportación de Reportes

#### GET `/api/v1/analytics/export/excel`
Descargar reporte en formato Excel (.xlsx)

**Query Params:**
- `startDate`, `endDate`

**Response:** Archivo Excel descargable

**Hojas incluidas:**
1. Resumen General
2. Top Intents
3. Top FAQs
4. Tickets
5. Feedback

#### GET `/api/v1/analytics/export/pdf`
Descargar reporte en formato PDF

**Query Params:**
- `startDate`, `endDate`

**Response:** Archivo PDF descargable

## 📊 Métricas Analizadas

### 1. Consultas del Chatbot
- Total de consultas por período
- Consultas agrupadas por día/semana/mes
- Horarios pico de uso

### 2. Feedback del Usuario
- Porcentaje de feedback positivo vs negativo
- Mensajes con mejor/peor valoración
- Evolución temporal del feedback

### 3. Preguntas Frecuentes (FAQs)
- FAQs más utilizadas
- FAQs con mejor tasa de éxito
- FAQs que necesitan actualización

### 4. Rendimiento del Modelo NLP
- Confianza promedio del modelo
- Intents con baja confianza (<70%)
- Tasa de escalación a tickets

### 5. Tickets de Soporte
- Tickets por estado
- Tiempo promedio de resolución
- Razones de escalación más comunes

## 🚀 Inicio Rápido

### Instalación

```bash
cd upt-chat-system/services/analytics-service
npm install
```

### Desarrollo

```bash
npm run start:dev
```

El servicio estará disponible en `http://localhost:3006`

### Producción

```bash
npm run build
npm run start:prod
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/upt_chat_system

# Puerto
PORT=3006

# Node Environment
NODE_ENV=development
```

### MongoDB

El servicio se conecta a las siguientes colecciones:
- `messages` - Mensajes del chat
- `chat_sessions` - Sesiones de usuario
- `faqs` - Preguntas frecuentes
- `tickets` - Tickets de soporte

## 📈 Frontend Dashboard

### Acceso

1. Iniciar sesión como administrador en `http://localhost:8000`
2. Ir a "Dashboard del Admin"
3. Click en "📊 Dashboard de Métricas"
4. O acceder directamente: `http://localhost:8000/admin_analytics.php`

### Características del Dashboard

#### Estadísticas Generales (Cards)
- 💬 Consultas Totales
- 🎯 Confianza Promedio
- 👍 Feedback Positivo
- 🎫 Tasa de Escalación

#### Gráficos Interactivos (Chart.js)
1. **📈 Consultas por Día** - Línea temporal
2. **👍👎 Feedback** - Gráfico de dona
3. **🎯 Top Intents** - Barras horizontales
4. **❓ Top FAQs** - Barras horizontales
5. **🎫 Tickets por Estado** - Gráfico de pastel
6. **⏰ Uso por Hora** - Barras verticales
7. **⚠️ Baja Confianza** - Barras horizontales (rojo)
8. **📊 Razones de Escalación** - Barras horizontales

#### Filtros Temporales
- Últimos 7 días
- Últimos 30 días (default)
- Últimos 90 días
- Período personalizado (selector de fechas)

#### Exportación
- 📊 **Excel**: Reporte completo con 5 hojas
- 📄 **PDF**: Reporte visual con gráficos

## 🧪 Testing

### Test Manual de Endpoints

```bash
# Dashboard general
curl http://localhost:3006/api/v1/analytics/dashboard

# Consultas por día (últimos 7 días)
curl "http://localhost:3006/api/v1/analytics/queries?granularity=day"

# Feedback
curl http://localhost:3006/api/v1/analytics/feedback

# Intents con baja confianza
curl "http://localhost:3006/api/v1/analytics/low-confidence?threshold=0.7"

# Health check
curl http://localhost:3006/api/v1/analytics/health
```

### Test de Exportación

```bash
# Descargar Excel
curl -O "http://localhost:3006/api/v1/analytics/export/excel"

# Descargar PDF
curl -O "http://localhost:3006/api/v1/analytics/export/pdf"
```

## 📚 Dependencias Principales

- **NestJS**: Framework backend
- **Mongoose**: ORM para MongoDB
- **ExcelJS**: Generación de archivos Excel
- **PDFKit**: Generación de archivos PDF
- **Chart.js**: Gráficos frontend (CDN)

## 🔄 Flujo de Datos

```
┌─────────────┐
│   MongoDB   │
│  (Datos)    │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────┐
│   Analytics Service (NestJS)    │
│                                  │
│  ┌──────────────────────────┐  │
│  │   Aggregation Pipelines   │  │
│  │   - Métricas              │  │
│  │   - Estadísticas          │  │
│  │   - Tendencias            │  │
│  └──────────────────────────┘  │
│                                  │
│  ┌──────────────────────────┐  │
│  │   Export Services         │  │
│  │   - Excel (ExcelJS)       │  │
│  │   - PDF (PDFKit)          │  │
│  └──────────────────────────┘  │
└────────┬────────────────────────┘
         │
         ↓ REST API
┌────────────────────────────────┐
│   Frontend Dashboard (PHP)     │
│   - Chart.js (gráficos)        │
│   - Filtros temporales         │
│   - Exportación 1-click        │
└────────────────────────────────┘
```

## 🎨 Caso de Uso: RF006

### CU006 - Dashboard de Métricas en Tiempo Real

**Precondiciones:**
✅ Sistema de analytics recopilando datos
✅ Base de datos actualizada
✅ Conectividad con API

**Flujo Principal:**
1. Admin accede al dashboard ✅
2. Sistema muestra opciones de período ✅
3. Admin selecciona período ✅
4. Sistema solicita métricas ✅
5. Admin visualiza gráficos ✅
6. Sistema retorna métricas en tiempo real ✅
7. Admin identifica patrones ✅
8. Sistema muestra detalles ✅
9. Admin exporta o configura alertas ✅
10. Sistema actualiza periódicamente ✅

**Flujo Alternativo A1 - Error de Conectividad:**
✅ Implementado con try/catch y mensajes de error claros

**Flujo Alternativo A2 - Datos Insuficientes:**
✅ Gráficos vacíos manejan arrays sin datos

## 📦 Caso de Uso: RF012

### CU012 - Exportación de Datos

**Precondiciones:**
✅ Admin con credenciales válidas
✅ Analytics recopilando datos
✅ Librerías de exportación instaladas
✅ Datos suficientes

**Flujo Principal:**
1. Admin navega a reportes ✅
2. Sistema presenta interfaz ✅
3. Admin selecciona período ✅
4. Sistema valida y muestra vista previa ✅
5. Admin elige formato (Excel/PDF) ✅
6. Sistema solicita confirmación ✅
7. Admin confirma ✅
8. Sistema genera archivo ✅
9. Admin espera ✅
10. Sistema compila y formatea ✅
11. Admin recibe notificación ✅
12. Sistema presenta descarga ✅
13. Admin descarga ✅
14. Sistema registra exportación ✅

**Flujos Alternativos:**
✅ A1 - Error en generación (try/catch)
✅ A2 - Datos insuficientes (validación)
✅ A3 - Cancelación (no aplicable en 1-click)

## 📞 Soporte

Para dudas o problemas:
1. Verificar que MongoDB esté corriendo
2. Verificar puerto 3006 disponible
3. Revisar logs: `analytics-service/analytics-service.log`
4. Consultar documentación de NestJS

---

**Desarrollado con ❤️ para UPT Chat System**
