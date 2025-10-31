# 🚀 GUÍA RÁPIDA - DESPLIEGUE MICROSERVICIOS RAILWAY

## ⚡ PASOS RÁPIDOS (15 minutos)

### 1️⃣ **PREPARACIÓN (2 min)**
```bash
# Generar secretos seguros
./generar_secretos.sh
# Guarda los valores generados
```

### 2️⃣ **RAILWAY - CREAR 5 SERVICIOS (8 min)**

Ve a [railway.app](https://railway.app) y crea estos servicios:

#### 🌐 **Servicio 1: Frontend PHP**
- **Nombre**: `upt-frontend-php`
- **Repo**: Conectar a tu repositorio GitHub
- **Variables**: Ver `MANUAL_USUARIO_RAILWAY_MICROSERVICIOS.md` - Sección Frontend PHP
- **Deploy Config**: Copiar desde `railway-services/frontend-php.railway.json`

#### 🚪 **Servicio 2: API Gateway** 
- **Nombre**: `upt-api-gateway`
- **Repo**: Mismo repositorio
- **Variables**: Ver manual - Sección API Gateway
- **Deploy Config**: Copiar desde `railway-services/api-gateway.railway.json`
- **Addon**: Agregar MongoDB

#### 📊 **Servicio 3: Analytics**
- **Nombre**: `upt-analytics`
- **Repo**: Mismo repositorio  
- **Variables**: Ver manual - Sección Analytics
- **Deploy Config**: Copiar desde `railway-services/analytics-service.railway.json`
- **Addon**: Agregar MongoDB

#### 📱 **Servicio 4: Notifications**
- **Nombre**: `upt-notifications`
- **Repo**: Mismo repositorio
- **Variables**: Ver manual - Sección Notifications  
- **Deploy Config**: Copiar desde `railway-services/notification-service.railway.json`
- **Addon**: Agregar MongoDB

#### 🤖 **Servicio 5: NLP Service**
- **Nombre**: `upt-nlp`
- **Repo**: Mismo repositorio
- **Variables**: Ver manual - Sección NLP Service
- **Deploy Config**: Copiar desde `railway-services/nlp-service.railway.json`
- **Addon**: Agregar MongoDB

### 3️⃣ **CONFIGURAR URLs (3 min)**

Después del despliegue, obtén las URLs reales:
```bash
# Usar el configurador automático
./configurar_urls.sh tu-proyecto-base

# O manualmente actualizar variables:
# API_GATEWAY_URL=https://tu-url-real.railway.app
# etc...
```

### 4️⃣ **VERIFICAR (2 min)**
```bash
# Validar todos los servicios
./validar_servicios.sh tu-proyecto-base
```

---

## 🔑 VARIABLES CRÍTICAS QUE DEBES TENER

### 📋 **Para todos los servicios:**
```env
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9
MONGODB_URI=${{MONGO_URL}}  # Railway lo proporciona automáticamente
```

### 🌐 **URLs entre servicios** (actualizar después del despliegue):
```env
API_GATEWAY_URL=https://tu-api-gateway.railway.app
FRONTEND_URL=https://tu-frontend.railway.app  
ANALYTICS_SERVICE_URL=https://tu-analytics.railway.app
NOTIFICATION_SERVICE_URL=https://tu-notifications.railway.app
NLP_SERVICE_URL=https://tu-nlp.railway.app
```

### 🗄️ **Base de datos MySQL** (tu configuración actual):
```env
MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma
MYSQL_ADDON_USER=u7imxhdxstbw6uuy
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc
```

### 🤖 **Dialogflow** (para NLP Service):
```env
GOOGLE_APPLICATION_CREDENTIALS_JSON={"tu":"json","credentials":"aqui"}
GOOGLE_PROJECT_ID=tu-proyecto-dialogflow
```

---

## ⚠️ ORDEN IMPORTANTE DE DESPLIEGUE

1. **API Gateway** (primero - otros servicios lo necesitan)
2. **Analytics Service**  
3. **Notification Service**
4. **NLP Service**
5. **Frontend PHP** (último - necesita URLs de todos)

---

## ✅ HEALTH CHECKS ESPERADOS

Todos deben responder en `/health` o `/api/v1/health`:
- ✅ Status 200 
- ✅ JSON response
- ✅ `"status": "healthy"`

---

## 🚨 SI ALGO FALLA

1. **Verificar logs en Railway Dashboard**
2. **Comprobar variables de entorno**
3. **Verificar que MongoDB addon esté agregado**
4. **Revisar URLs entre servicios**
5. **Validar formato JSON de credenciales Dialogflow**

---

## 🎯 RESULTADO FINAL

**5 servicios independientes** funcionando en Railway:
- Cada uno escalable por separado
- Health checks individuales  
- Comunicación segura entre servicios
- Logs separados para debugging
- Variables de entorno aisladas

¡Tu sistema de microservicios estará listo! 🚀

---

## 📞 COMANDOS ÚTILES

```bash
# Generar secretos
./generar_secretos.sh

# Configurar URLs automáticamente  
./configurar_urls.sh mi-proyecto

# Validar servicios desplegados
./validar_servicios.sh mi-proyecto

# Ver manual completo
cat MANUAL_USUARIO_RAILWAY_MICROSERVICIOS.md
```