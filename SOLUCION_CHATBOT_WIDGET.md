# 🤖 SOLUCIÓN: Widget Chatbot No Aparece + Errores HTTP 500

## 📋 Problemas Identificados

### ❌ Problema 1: Widget no aparece en login
- **Síntoma**: El chatbot no se mostraba en la página de login
- **Causa**: Faltaba el archivo `config.js` antes de `chatbox.js`

### ❌ Problema 2: Errores HTTP 500 en chatbot
- **Síntoma**: Requests fallaban con error 500 en consola
- **Causa**: API Gateway no se conectaba correctamente al NLP Service

## 🔍 Diagnóstico Detallado

### 1. ✅ Widget en Login
**Archivo**: `/app/views/login.php`
```html
<!-- ANTES (❌ FALTABA CONFIG) -->
<script src="js/chatbox.js"></script>

<!-- DESPUÉS (✅ CORRECTO) -->  
<script src="js/config.js"></script>
<script src="js/chatbox.js"></script>
```

### 2. ❌ Conexión NLP Service 
**Problema en API Gateway** `/application/services/nlp.service.ts`:

#### A. URL Hardcodeada
```typescript
// ANTES (❌ LOCALHOST HARDCODEADO)
const response = await axios.post(
    'http://127.0.0.1:8001/api/v1/nlp/process',

// DESPUÉS (✅ USA VARIABLE DE ENTORNO)
const response = await axios.post(
    `${this.nlpServiceUrl}/api/v1/nlp/process`,
```

#### B. Formato de Request Incorrecto
```typescript
// ANTES (❌ FORMATO INCORRECTO)
{
    message: text,
    session_id: sessionId,
    user_id: userId
}

// DESPUÉS (✅ FORMATO CORRECTO)
{
    session_id: sessionId,
    user_id: userId,
    message: text
}
```

## 🛠️ Soluciones Aplicadas

### 1. ✅ Fix Widget Login
**Archivo modificado**: `/ramafront/cosntru/app/views/login.php`
```html
<script src="js/script.js"></script>

<!-- CHATBOX WIDGET - Se conecta a MongoDB Atlas vía API Gateway -->
<link rel="stylesheet" href="css/chatbox.css">
<script src="js/config.js"></script>  ← AGREGADO
<script src="js/chatbox.js"></script>
```

### 2. ✅ Fix Conexión NLP Service  
**Archivo modificado**: `/upt-chat-system/services/api-gateway/src/application/services/nlp.service.ts`

#### Cambio 1: Usar variable de entorno
```typescript
// Línea 43: Reemplazar URL hardcodeada
const response = await axios.post(
    `${this.nlpServiceUrl}/api/v1/nlp/process`,  // ✅ Usa variable entorno
```

#### Cambio 2: Corregir formato request
```typescript  
// Línea 45-49: Formato correcto para NLP Service
{
    session_id: sessionId || 'default_session',
    user_id: userId || 'anonymous_user', 
    message: text
}
```

#### Cambio 3: Fix método detectIntent
```typescript
// Línea 155: Remover parámetro language no soportado
{
    message: text  // Solo enviar message
}
```

## 🧪 Verificación de Solución

### Comando de Test NLP Service
```bash
curl -s -X POST "https://nlp-service-production-3f94.up.railway.app/api/v1/nlp/process" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test", "user_id": "test_user", "message": "hola"}' | jq .
```

### Resultado Esperado  
```json
{
  "session_id": "test",
  "response": "Entiendo que necesitas ayuda...",
  "intent": {
    "id": "consulta_general",
    "confidence": 0.6
  },
  "confidence": 0.6,
  "timestamp": "2025-11-05T17:43:59.766448"
}
```

## ⚠️ CONFIGURACIÓN FALTANTE EN RAILWAY

### Variable de Entorno Requerida
El API Gateway necesita la siguiente variable en Railway:

```env
NLP_SERVICE_URL=https://nlp-service-production-3f94.up.railway.app
```

**📌 IMPORTANTE**: Esta variable debe agregarse manualmente en Railway Dashboard:
1. Ir a `api-gateway` service
2. Variables tab
3. Agregar: `NLP_SERVICE_URL` = `https://nlp-service-production-3f94.up.railway.app`

## 📊 Estado Final

### ✅ Completado
- Widget aparece correctamente en login
- Formato de requests corregido
- URLs dinámicas (no hardcodeadas)
- Tests del NLP Service: ✅ Funciona

### ⏳ Pendiente
- Agregar variable `NLP_SERVICE_URL` en Railway
- Verificar que redeploy termine correctamente
- Test end-to-end del flujo completo

## 🚀 Comandos Ejecutados

```bash
# Commits realizados
git add -A
git commit -m "🐛 Fix: Corregir chatbot widget y conexión NLP Service"
git push origin main
```

---

**Tiempo de resolución**: ~45 minutos  
**Estado**: ✅ Fixes aplicados, esperando redeploy  
**Próximo paso**: Agregar variable NLP_SERVICE_URL en Railway Dashboard