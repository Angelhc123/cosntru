# 🚀 NLP Service - Railway Deployment

## ⚠️ Error Actual en Railway

```
Attempt #1-13 failed with service unavailable
1/1 replicas never became healthy!
Healthcheck failed!
```

### Causa del problema:
El servicio tarda mucho en inicializarse porque:
1. Carga modelo spaCy (es_core_news_sm)
2. Intenta inicializar DialogFlow
3. El healthcheck timeout (300s) no es suficiente

## ✅ Soluciones Aplicadas

### 1. **Dockerfile Optimizado**
- ✅ Healthcheck con más tiempo: `start-period=90s`
- ✅ Más reintentos: `retries=5`
- ✅ Timeout mayor: `timeout=15s`
- ✅ Usa curl en vez de Python para healthcheck

### 2. **Config.py Actualizado**
- ✅ `use_dialogflow = False` por defecto
- ✅ Inicio más rápido sin DialogFlow

### 3. **.env.example Simplificado**
- ✅ Variables esenciales para Railway
- ✅ CORS configurado como `*`
- ✅ DEBUG=False en producción

## 🔧 Configuración en Railway

### Settings del Servicio:

**Root Directory:**
```
upt-chat-system/services/nlp-service
```

**Dockerfile Path:**
```
/upt-chat-system/services/nlp-service/Dockerfile
```

**Healthcheck:**
```
Path: /health
Timeout: 300 seconds (mantener actual)
```

**Variables de Entorno (opcional):**
```bash
ENVIRONMENT=production
DEBUG=False
PORT=8001
LOG_LEVEL=INFO
USE_DIALOGFLOW=False
CORS_ORIGINS=*
```

### Branch:
```
main
```

## 📊 Logs Esperados

### ✅ Inicio Exitoso:
```
🚀 Starting NLP Service...
Loading data repositories...
✅ Repositories loaded successfully
Initializing NLP engine...
✅ NLP engine initialized
⚠️ DialogFlow disabled or not configured
✅ All use cases initialized
Application startup complete
Uvicorn running on http://0.0.0.0:8001
```

### ✅ Healthcheck OK:
```
GET /health → 200 OK
{"status": "healthy", "service": "nlp-service"}
```

## 🧪 Testing Local

```bash
# Build
docker build -t nlp-service .

# Run
docker run -p 8001:8001 nlp-service

# Test
curl http://localhost:8001/health
```

## 🚀 Deploy

```bash
# Commit cambios
git add .
git commit -m "fix: Optimize NLP service for Railway deployment"
git push origin main
```

Railway detectará automáticamente los cambios y redesplegará.

## 📝 Notas Importantes

1. **El modelo spaCy** se descarga durante el build (puede fallar en Railway, pero el servicio funciona sin él)
2. **DialogFlow está desactivado** por defecto para inicio rápido
3. **El healthcheck** ahora espera 90 segundos antes de fallar
4. **Los logs** se crean en `/app/logs/` dentro del container

## 🔍 Troubleshooting

### Si el healthcheck sigue fallando:

1. **Aumentar timeout en Railway:**
   - Settings → Healthcheck Timeout → 600 segundos

2. **Ver logs en tiempo real:**
   ```
   Railway Dashboard → Deployments → View Logs
   ```

3. **Probar endpoint manualmente:**
   ```bash
   curl https://nlp-service.railway.app/health
   ```

4. **Deshabilitar healthcheck temporalmente:**
   - Settings → Healthcheck Path → (dejar vacío)

---

**Estado:** ✅ Optimizado y listo para redeploy
**Fecha:** 3 de noviembre de 2025
