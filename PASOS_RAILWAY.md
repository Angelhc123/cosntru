# 🚂 Pasos para Desplegar en Railway

## ✅ Ya completado:
1. ✅ Railway CLI instalado
2. ✅ Login en Railway (ah2021070017@virtual.upt.pe)
3. ✅ Proyecto creado: ConstruccionProject
4. ✅ Proyecto vinculado localmente

## 📋 Pasos siguientes:

### 1. Agregar MongoDB en Railway Dashboard
```
1. Abre: https://railway.com/project/64ba14a7-75a9-45d2-9db2-540638834aae
2. Click en "+ New"
3. Selecciona "Database"
4. Selecciona "Add MongoDB"
5. Espera que se despliegue (1-2 minutos)
```

### 2. Crear servicio desde GitHub
```
1. En Railway Dashboard, click "+ New"
2. Selecciona "GitHub Repo"
3. Conecta tu cuenta de GitHub si no está conectada
4. Selecciona el repo: Angelhc123/cosntru
5. Branch: main
6. Root Directory: / (dejar vacío para raíz)
```

### 3. Configurar variables de entorno

**Opción A: Desde el Dashboard (recomendado)**
```
1. Click en tu servicio en Railway
2. Ve a "Variables"
3. Click "+ New Variable"
4. Agrega MONGODB_URI = ${{MongoDB.MONGO_URL}}
5. Agrega el resto desde la lista abajo
```

**Opción B: Desde CLI (después de crear servicio)**
```bash
# Primero enlaza el servicio
railway service

# Luego ejecuta
./configure_railway_vars.sh
```

### 4. Variables requeridas:

#### MySQL (Clever Cloud)
```
MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma
MYSQL_ADDON_USER=u7imxhdxstbw6uuy
MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc
MYSQL_ADDON_PORT=3306
```

#### MongoDB
```
MONGODB_URI=${{MongoDB.MONGO_URL}}
```

#### Puertos
```
PORT=8000
API_GATEWAY_PORT=3000
NLP_SERVICE_PORT=8001
NOTIFICATION_SERVICE_PORT=3005
ANALYTICS_SERVICE_PORT=3006
```

#### Servicios
```
NLP_SERVICE_URL=http://localhost:8001
NOTIFICATION_SERVICE_URL=http://localhost:3005
ANALYTICS_SERVICE_URL=http://localhost:3006
API_GATEWAY_URL=http://localhost:3000
```

#### JWT
```
JWT_SECRET=upt-chat-system-jwt-secret-2024-super-secure-key
JWT_EXPIRES_IN=24h
```

#### Dialogflow
```
DIALOGFLOW_PROJECT_ID=upt-chat-fhps
DIALOGFLOW_LANGUAGE_CODE=es-ES
DIALOGFLOW_CREDENTIALS_PATH=./credentials/dialogflow-credentials.json
```

#### Otros
```
NODE_ENV=production
APP_ENV=production
APP_DEBUG=false
CORS_ORIGIN=*
MODEL_CONFIDENCE_THRESHOLD=0.7
MAX_TOKENS=512
ENVIRONMENT=production
DEBUG=False
ANALYTICS_RETENTION_DAYS=90
EMAIL_ENABLED=false
USE_GPU=false
MODEL_PATH=./models
CONFIDENCE_THRESHOLD=0.6
```

### 5. Subir credenciales de Dialogflow

Railway no puede leer archivos .gitignore, así que necesitas agregar las credenciales:

```bash
# Opción 1: Convertir a variable de entorno (recomendado)
cat upt-chat-system/services/nlp-service/credentials/dialogflow-credentials.json | jq -c . > /tmp/creds.txt

# En Railway Dashboard:
# Variables > + New Variable
# GOOGLE_APPLICATION_CREDENTIALS_JSON = (pegar contenido)
```

### 6. Desplegar

**Desde GitHub (automático):**
```bash
git push origin main
# Railway detectará el push y desplegará automáticamente
```

**Desde CLI:**
```bash
railway up
```

### 7. Verificar deployment

```bash
# Ver logs
railway logs

# Ver estado
railway status

# Abrir en navegador
railway open
```

## 🔗 Links útiles:

- **Dashboard**: https://railway.com/project/64ba14a7-75a9-45d2-9db2-540638834aae
- **Docs**: https://docs.railway.app/
- **CLI Docs**: https://docs.railway.app/develop/cli

## ⚠️ Notas importantes:

1. Railway usa **Nixpacks** para detectar automáticamente cómo construir tu proyecto
2. El archivo `nixpacks.toml` ya está configurado con Node.js 18, Python 3.10 y PHP 8.2
3. El `start_railway.sh` iniciará todos los servicios en paralelo
4. El healthcheck está en `/api/v1/health` (API Gateway)
5. Railway asignará un dominio automáticamente tipo: `construccionproject.up.railway.app`
