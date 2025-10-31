# 📖 MANUAL DE USUARIO - SISTEMA UPT CHAT COMPLETO

## 🎯 Descripción del Sistema

El **Sistema UPT Chat** es una arquitectura de microservicios que incluye:

- **Frontend PHP**: Interfaz de usuario y dashboard administrativo
- **API Gateway**: Punto de entrada principal para todas las APIs
- **Analytics Service**: Procesamiento de métricas y análisis
- **Notification Service**: Gestión de notificaciones y alertas
- **NLP Service**: Procesamiento de lenguaje natural para el chatbot

---

## 🚀 DESPLIEGUE EN RAILWAY - SERVICIOS SEPARADOS

### 📋 Prerrequisitos

1. **Cuenta Railway**: [railway.app](https://railway.app)
2. **Repositorio GitHub**: Tu código debe estar en GitHub
3. **Base de datos MySQL**: Clever Cloud o Railway MySQL
4. **MongoDB**: Railway MongoDB addon
5. **Credenciales Dialogflow**: Para el NLP service

---

## 🛠️ PASO A PASO - DESPLIEGUE DE SERVICIOS

### 🔥 PASO 1: Configuración Inicial Railway

1. **Inicia sesión en Railway**
   ```
   https://railway.app
   ```

2. **Crea nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio `cosntru`

---

### 📦 PASO 2: Crear Servicios Separados

Debes crear **5 servicios separados** en Railway:

#### 🌐 **Servicio 1: Frontend PHP**
```bash
Nombre del servicio: upt-frontend-php
```

**Variables de entorno requeridas:**
```env
# === CONFIGURACIÓN BÁSICA ===
PORT=8000
RAILWAY_ENVIRONMENT=production

# === BASE DE DATOS MYSQL (Clever Cloud) ===
MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma
MYSQL_ADDON_USER=u7imxhdxstbw6uuy
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc

# === MICROSERVICIOS URLs (Se configuran después) ===
API_GATEWAY_URL=https://upt-api-gateway.railway.app
ANALYTICS_SERVICE_URL=https://upt-analytics.railway.app
NOTIFICATION_SERVICE_URL=https://upt-notifications.railway.app
NLP_SERVICE_URL=https://upt-nlp.railway.app

# === SESIONES Y SEGURIDAD ===
SESSION_SECRET=PgrJsn7k05W5Ty82ba0R5Yu0smAVdDzO
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9

# === EMAIL CONFIGURACIÓN ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sistema.upt.chat@gmail.com
SMTP_PASSWORD=uptp4ss2024*
ADMIN_EMAIL=admin@upt.edu.pe
```

**Configuración Deploy:**
```json
{
  "build": {
    "buildCommand": "cd proyectotest && composer install --no-dev --optimize-autoloader || echo 'No composer.json'"
  },
  "deploy": {
    "startCommand": "cd proyectotest/public && php -S 0.0.0.0:$PORT -t . router.php",
    "healthcheckPath": "/api/v1/health"
  }
}
```

---

#### 🚪 **Servicio 2: API Gateway**
```bash
Nombre del servicio: upt-api-gateway
```

**Variables de entorno requeridas:**
```env
# === CONFIGURACIÓN BÁSICA ===
PORT=3000
NODE_ENV=production
RAILWAY_ENVIRONMENT=production

# === JWT Y SEGURIDAD ===
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# === MONGODB (Railway Addon) ===
MONGODB_URI=${{MONGO_URL}}
DATABASE_NAME=upt_chat_system

# === MICROSERVICIOS URLs ===
ANALYTICS_SERVICE_URL=https://upt-analytics.railway.app
NOTIFICATION_SERVICE_URL=https://upt-notifications.railway.app
NLP_SERVICE_URL=https://upt-nlp.railway.app
FRONTEND_URL=https://upt-frontend-php.railway.app

# === CORS CONFIGURATION ===
CORS_ORIGIN=https://upt-frontend-php.railway.app,http://localhost:8000

# === RATE LIMITING ===
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# === LOGGING ===
LOG_LEVEL=info
LOG_FORMAT=json

# === HEALTH CHECK ===
HEALTH_CHECK_TIMEOUT=5000
```

**Configuración Deploy:**
```json
{
  "build": {
    "buildCommand": "cd upt-chat-system/services/api-gateway && npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "cd upt-chat-system/services/api-gateway && npm run start:prod",
    "healthcheckPath": "/health"
  }
}
```

---

#### 📊 **Servicio 3: Analytics Service**
```bash
Nombre del servicio: upt-analytics
```

**Variables de entorno requeridas:**
```env
# === CONFIGURACIÓN BÁSICA ===
PORT=3001
NODE_ENV=production
RAILWAY_ENVIRONMENT=production

# === MONGODB (Railway Addon) ===
MONGODB_URI=${{MONGO_URL}}
DATABASE_NAME=upt_analytics

# === API GATEWAY ===
API_GATEWAY_URL=https://upt-api-gateway.railway.app
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9

# === CONFIGURACIÓN ANALYTICS ===
ANALYTICS_RETENTION_DAYS=365
BATCH_SIZE=100
PROCESSING_INTERVAL=60000

# === REDIS (Para cache - opcional) ===
REDIS_URL=${{REDIS_URL}}

# === LOGGING ===
LOG_LEVEL=info
ENABLE_METRICS=true

# === HEALTH CHECK ===
HEALTH_CHECK_TIMEOUT=5000
```

**Configuración Deploy:**
```json
{
  "build": {
    "buildCommand": "cd upt-chat-system/services/analytics-service && npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "cd upt-chat-system/services/analytics-service && npm run start:prod",
    "healthcheckPath": "/health"
  }
}
```

---

#### 📱 **Servicio 4: Notification Service**
```bash
Nombre del servicio: upt-notifications
```

**Variables de entorno requeridas:**
```env
# === CONFIGURACIÓN BÁSICA ===
PORT=3002
NODE_ENV=production
RAILWAY_ENVIRONMENT=production

# === MONGODB (Railway Addon) ===
MONGODB_URI=${{MONGO_URL}}
DATABASE_NAME=upt_notifications

# === JWT Y SEGURIDAD ===
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9

# === EMAIL CONFIGURACIÓN ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=sistema.upt.chat@gmail.com
SMTP_PASSWORD=uptp4ss2024*
EMAIL_FROM=Sistema UPT <noreply@upt.edu.pe>

# === SMS CONFIGURACIÓN (Opcional - Twilio) ===
TWILIO_ACCOUNT_SID=ACabcd1234567890abcd1234567890abcd12
TWILIO_AUTH_TOKEN=ef123456789abcdef123456789abcdef12
TWILIO_PHONE_NUMBER=+51987654321

# === PUSH NOTIFICATIONS (Opcional - Firebase) ===
FIREBASE_SERVER_KEY=AAAA1234567:APA91bFx...YourFirebaseServerKeyHere...
FIREBASE_PROJECT_ID=upt-chat-notifications

# === WEBHOOK CONFIGURACIÓN ===
WEBHOOK_SECRET=a0810fe9d8df334ae627004d7a3a875c

# === MICROSERVICIOS ===
API_GATEWAY_URL=https://upt-api-gateway.railway.app

# === CONFIGURACIÓN NOTIFICACIONES ===
MAX_RETRY_ATTEMPTS=3
RETRY_DELAY=5000
NOTIFICATION_QUEUE_SIZE=1000

# === LOGGING ===
LOG_LEVEL=info
ENABLE_NOTIFICATION_LOGS=true
```

**Configuración Deploy:**
```json
{
  "build": {
    "buildCommand": "cd upt-chat-system/services/notification-service && npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "cd upt-chat-system/services/notification-service && npm run start:prod",
    "healthcheckPath": "/health"
  }
}
```

---

#### 🤖 **Servicio 5: NLP Service (Python)**
```bash
Nombre del servicio: upt-nlp
```

**Variables de entorno requeridas:**
```env
# === CONFIGURACIÓN BÁSICA ===
PORT=8001
PYTHON_ENV=production
RAILWAY_ENVIRONMENT=production

# === DIALOGFLOW CONFIGURACIÓN ===
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"upt-chat-system-442016","private_key_id":"8a5d6c3e4f7b2a9c1d8e5f2a3b6c9d0e1f4a7b2c","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8xVz2H5K9L3mN\nP8Q6R7X4Y1Z5W2V8T9K6M3L0N4P7Q8R1S5U6X2Y9Z3A6B7C8D9E0F1G2H3I4J5K6\nL7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8\nR9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0\nX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2\nD3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4\nJ5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6\nP7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8\nV9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1\nC2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4\nJ5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8\nR9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2\nZ3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6\nH7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O0\nP1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4\nX5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8\nF9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2\nN3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6\nV7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8\n-----END PRIVATE KEY-----\n","client_email":"upt-chat-service@upt-chat-system-442016.iam.gserviceaccount.com","client_id":"112345678901234567890","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robots/v1/metadata/x509/upt-chat-service%40upt-chat-system-442016.iam.gserviceaccount.com"}

GOOGLE_PROJECT_ID=upt-chat-system-442016
GOOGLE_LOCATION=global
DIALOGFLOW_LANGUAGE_CODE=es
DIALOGFLOW_SESSION_ID=upt-chat-session

# === API GATEWAY ===
API_GATEWAY_URL=https://upt-api-gateway.railway.app
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9

# === MONGODB PARA NLP DATA ===
MONGODB_URI=${{MONGO_URL}}
DATABASE_NAME=upt_nlp

# === CONFIGURACIÓN NLP ===
NLP_MODEL_VERSION=latest
CONFIDENCE_THRESHOLD=0.7
MAX_TOKENS=2048
RESPONSE_TIMEOUT=30

# === CACHE REDIS (Opcional) ===
REDIS_URL=${{REDIS_URL}}
CACHE_TTL=3600

# === LOGGING ===
LOG_LEVEL=info
ENABLE_NLP_LOGS=true
ENABLE_DEBUG_MODE=false

# === HEALTH CHECK ===
HEALTH_CHECK_TIMEOUT=10000
```

**Configuración Deploy:**
```json
{
  "build": {
    "buildCommand": "cd upt-chat-system/services/nlp-service && pip install -r requirements.txt || echo 'No requirements.txt'"
  },
  "deploy": {
    "startCommand": "cd upt-chat-system/services/nlp-service && python main.py",
    "healthcheckPath": "/health"
  }
}
```

---

## 🔗 PASO 3: Configuración de Addons en Railway

### 📊 **MongoDB Addon**
1. En cada servicio que requiera MongoDB, agregar addon:
   - API Gateway ✅
   - Analytics Service ✅  
   - Notification Service ✅
   - NLP Service ✅

### 🔴 **Redis Addon (Opcional)**
Para cache y mejor rendimiento:
- Analytics Service
- NLP Service

---

## 🌐 PASO 4: Configuración de Dominios

Después del despliegue, Railway te dará URLs como:
- `upt-frontend-php.railway.app`
- `upt-api-gateway.railway.app`
- `upt-analytics.railway.app`
- `upt-notifications.railway.app`
- `upt-nlp.railway.app`

**⚠️ IMPORTANTE**: Debes actualizar las variables `*_URL` en cada servicio con las URLs reales.

---

## 🔧 PASO 5: Configuración de Variables Dinámicas

### 🔄 **Variables que debes actualizar después del despliegue:**

En **Frontend PHP**:
```env
API_GATEWAY_URL=https://tu-api-gateway-real.railway.app
ANALYTICS_SERVICE_URL=https://tu-analytics-real.railway.app
NOTIFICATION_SERVICE_URL=https://tu-notifications-real.railway.app
NLP_SERVICE_URL=https://tu-nlp-real.railway.app
```

En **API Gateway**:
```env
ANALYTICS_SERVICE_URL=https://tu-analytics-real.railway.app
NOTIFICATION_SERVICE_URL=https://tu-notifications-real.railway.app
NLP_SERVICE_URL=https://tu-nlp-real.railway.app
FRONTEND_URL=https://tu-frontend-real.railway.app
CORS_ORIGIN=https://tu-frontend-real.railway.app
```

En **Analytics Service**:
```env
API_GATEWAY_URL=https://tu-api-gateway-real.railway.app
```

En **Notification Service**:
```env
API_GATEWAY_URL=https://tu-api-gateway-real.railway.app
```

En **NLP Service**:
```env
API_GATEWAY_URL=https://tu-api-gateway-real.railway.app
```

---

## 🔐 PASO 6: Configuración de Seguridad

### 🔑 **Generación de Secretos Seguros**

Para generar secretos seguros:

```bash
# JWT Secret (64 caracteres)
openssl rand -hex 32

# Session Secret (32 caracteres)
openssl rand -base64 24

# Webhook Secret (16 caracteres)
openssl rand -hex 16
```

### 🛡️ **Configuración CORS**

En el API Gateway, asegúrate de que `CORS_ORIGIN` incluya:
- URL del Frontend PHP
- Dominio personalizado (si tienes)
- localhost para desarrollo

---

## 📋 PASO 7: Verificación Post-Despliegue

### ✅ **Health Checks**

Verifica que todos los servicios respondan:

1. **Frontend PHP**: `https://tu-frontend.railway.app/api/v1/health`
2. **API Gateway**: `https://tu-api-gateway.railway.app/health`
3. **Analytics**: `https://tu-analytics.railway.app/health`
4. **Notifications**: `https://tu-notifications.railway.app/health`
5. **NLP Service**: `https://tu-nlp.railway.app/health`

### 🔍 **Verificación de Conectividad**

1. **Frontend puede comunicarse con API Gateway**
2. **API Gateway puede acceder a todos los microservicios**
3. **Todos los servicios pueden acceder a MongoDB**
4. **Dialogflow está correctamente configurado**

---

## 🚨 SOLUCIÓN DE PROBLEMAS COMUNES

### ❌ **Error 503 - Service Unavailable**
- Verificar variables de entorno
- Comprobar health checks
- Revisar logs en Railway dashboard

### ❌ **Error de conexión MongoDB**
- Verificar que `MONGO_URL` esté disponible
- Comprobar que el addon MongoDB esté agregado
- Verificar sintaxis de `MONGODB_URI`

### ❌ **Error CORS**
- Verificar `CORS_ORIGIN` en API Gateway
- Asegurar que incluya la URL del frontend
- Verificar protocolo (http vs https)

### ❌ **Error Dialogflow**
- Verificar formato JSON en `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- Comprobar permisos del service account
- Verificar `GOOGLE_PROJECT_ID`

---

## 📊 MONITOREO Y MANTENIMIENTO

### 📈 **Métricas a Monitorear**
- Tiempo de respuesta de health checks
- Uso de memoria y CPU
- Errores en logs
- Conectividad entre servicios

### 🔄 **Actualizaciones**
1. Actualizar código en GitHub
2. Railway redesplegará automáticamente
3. Verificar health checks después del despliegue
4. Monitorear logs por errores

---

## 🎯 RESUMEN EJECUTIVO

**5 Servicios en Railway:**
1. **Frontend PHP** - Puerto 8000 - Interface usuario
2. **API Gateway** - Puerto 3000 - Punto entrada APIs  
3. **Analytics** - Puerto 3001 - Métricas y análisis
4. **Notifications** - Puerto 3002 - Gestión notificaciones
5. **NLP Service** - Puerto 8001 - Procesamiento lenguaje natural

**Variables críticas:**
- Todas las URLs entre servicios
- JWT_SECRET (mismo en todos)
- Credenciales MongoDB y MySQL
- Configuración Dialogflow para NLP

**Orden de despliegue recomendado:**
1. MongoDB Addon
2. API Gateway
3. Analytics Service  
4. Notification Service
5. NLP Service
6. Frontend PHP (último para tener todas las URLs)

¡Tu sistema estará funcionando con microservicios completamente separados y escalables! 🚀