#!/bin/bash

# 🚀 Script Automatizado de Configuración para Railway
# Genera TODOS los archivos de configuración necesarios

clear
echo "=============================================="
echo "  🚀 CONFIGURACIÓN AUTOMÁTICA RAILWAY"
echo "=============================================="
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_DIR="/home/desci/Documentos/constru"
cd "$BASE_DIR"

echo -e "${BLUE}📦 Creando archivos de configuración Railway...${NC}"
echo ""

# ============================================
# 1. RAILWAY.JSON - Configuración Principal
# ============================================
echo "1️⃣  Creando railway.json..."
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks",
    "buildCommand": "chmod +x setup_railway.sh && ./setup_railway.sh"
  },
  "deploy": {
    "startCommand": "chmod +x start_railway.sh && ./start_railway.sh",
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "on_failure",
    "numReplicas": 1
  }
}
EOF
echo -e "${GREEN}✅ railway.json creado${NC}"

# ============================================
# 2. SETUP_RAILWAY.SH - Instalación
# ============================================
echo "2️⃣  Creando setup_railway.sh..."
cat > setup_railway.sh << 'EOF'
#!/bin/bash
set -e

echo "📦 Instalando dependencias..."

# API Gateway
echo "📦 API Gateway..."
cd upt-chat-system/services/api-gateway
npm ci --only=production
npm run build
cd ../../..

# Analytics Service
echo "📊 Analytics Service..."
cd upt-chat-system/services/analytics-service
npm ci --only=production
npm run build
cd ../../..

# Notification Service
echo "📧 Notification Service..."
cd upt-chat-system/services/notification-service
npm ci --only=production
npm run build
cd ../../..

# NLP Service
echo "🤖 NLP Service..."
cd upt-chat-system/services/nlp-service
pip install --no-cache-dir -r requirements.txt
cd ../../..

echo "✅ Todas las dependencias instaladas"
EOF
chmod +x setup_railway.sh
echo -e "${GREEN}✅ setup_railway.sh creado${NC}"

# ============================================
# 3. START_RAILWAY.SH - Inicio de Servicios
# ============================================
echo "3️⃣  Creando start_railway.sh..."
cat > start_railway.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Iniciando UPT Chat System en Railway..."

# Crear directorio de logs
mkdir -p logs

# Variables de entorno por defecto
export PORT=${PORT:-8000}
export API_GATEWAY_PORT=${API_GATEWAY_PORT:-3000}
export NLP_SERVICE_PORT=${NLP_SERVICE_PORT:-8001}
export NOTIFICATION_SERVICE_PORT=${NOTIFICATION_SERVICE_PORT:-3005}
export ANALYTICS_SERVICE_PORT=${ANALYTICS_SERVICE_PORT:-3006}

echo "🔧 Puertos configurados:"
echo "  Frontend: $PORT"
echo "  API Gateway: $API_GATEWAY_PORT"
echo "  NLP Service: $NLP_SERVICE_PORT"
echo "  Notification: $NOTIFICATION_SERVICE_PORT"
echo "  Analytics: $ANALYTICS_SERVICE_PORT"

# Iniciar NLP Service
echo "🤖 Iniciando NLP Service..."
cd upt-chat-system/services/nlp-service
python3 -m uvicorn presentation.main:app --host 0.0.0.0 --port $NLP_SERVICE_PORT > ../../../logs/nlp-service.log 2>&1 &
NLP_PID=$!
echo "  PID: $NLP_PID"
cd ../../..
sleep 3

# Iniciar Notification Service
echo "📧 Iniciando Notification Service..."
cd upt-chat-system/services/notification-service
PORT=$NOTIFICATION_SERVICE_PORT npm run start:prod > ../../../logs/notification-service.log 2>&1 &
NOTIFICATION_PID=$!
echo "  PID: $NOTIFICATION_PID"
cd ../../..
sleep 3

# Iniciar Analytics Service
echo "📊 Iniciando Analytics Service..."
cd upt-chat-system/services/analytics-service
PORT=$ANALYTICS_SERVICE_PORT npm run start:prod > ../../../logs/analytics-service.log 2>&1 &
ANALYTICS_PID=$!
echo "  PID: $ANALYTICS_PID"
cd ../../..
sleep 3

# Iniciar API Gateway (servicio principal)
echo "🚪 Iniciando API Gateway..."
cd upt-chat-system/services/api-gateway
PORT=$API_GATEWAY_PORT npm run start:prod > ../../../logs/api-gateway.log 2>&1 &
API_GATEWAY_PID=$!
echo "  PID: $API_GATEWAY_PID"
cd ../../..
sleep 5

# Iniciar Frontend PHP
echo "🌐 Iniciando Frontend PHP..."
cd proyectotest/public
php -S 0.0.0.0:$PORT -t . > ../../logs/frontend.log 2>&1 &
PHP_PID=$!
echo "  PID: $PHP_PID"
cd ../..

echo ""
echo "✅ Todos los servicios iniciados"
echo ""
echo "🌐 URLs disponibles:"
echo "  Frontend:     http://0.0.0.0:$PORT"
echo "  API Gateway:  http://0.0.0.0:$API_GATEWAY_PORT"
echo "  NLP Service:  http://0.0.0.0:$NLP_SERVICE_PORT"
echo "  Notification: http://0.0.0.0:$NOTIFICATION_SERVICE_PORT"
echo "  Analytics:    http://0.0.0.0:$ANALYTICS_SERVICE_PORT"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo "🛑 Deteniendo servicios..."
    kill $PHP_PID $API_GATEWAY_PID $ANALYTICS_PID $NOTIFICATION_PID $NLP_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

# Mantener el script corriendo y mostrar logs
echo "📋 Mostrando logs (Ctrl+C para detener)..."
tail -f logs/*.log &
wait $API_GATEWAY_PID
EOF
chmod +x start_railway.sh
echo -e "${GREEN}✅ start_railway.sh creado${NC}"

# ============================================
# 4. PROCFILE - Railway Process
# ============================================
echo "4️⃣  Creando Procfile..."
cat > Procfile << 'EOF'
web: bash start_railway.sh
EOF
echo -e "${GREEN}✅ Procfile creado${NC}"

# ============================================
# 5. .RAILWAYIGNORE
# ============================================
echo "5️⃣  Creando .railwayignore..."
cat > .railwayignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
venv/
ENV/
env/

# Logs
*.log
logs/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env.local
.env.development
.env.test

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Build
dist/
build/
*.tsbuildinfo

# Testing
coverage/
.nyc_output/
.tox/

# Documentation
*.md
!README.md
docs/

# Git
.git/
.gitignore
.gitattributes

# Misc
.cache/
tmp/
temp/
EOF
echo -e "${GREEN}✅ .railwayignore creado${NC}"

# ============================================
# 6. NIXPACKS.TOML - Configuración de Build
# ============================================
echo "6️⃣  Creando nixpacks.toml..."
cat > nixpacks.toml << 'EOF'
[phases.setup]
nixPkgs = ['nodejs-18_x', 'python310', 'php82', 'php82Packages.composer']

[phases.install]
cmds = [
    'npm --version',
    'node --version',
    'python3 --version',
    'php --version'
]

[phases.build]
cmds = ['bash setup_railway.sh']

[start]
cmd = 'bash start_railway.sh'
EOF
echo -e "${GREEN}✅ nixpacks.toml creado${NC}"

# ============================================
# 7. RAILWAY ENV TEMPLATE
# ============================================
echo "7️⃣  Creando railway.env (plantilla de variables)..."
cat > railway.env << 'EOF'
# ============================================
# VARIABLES DE ENTORNO PARA RAILWAY
# Copia estas variables en Railway Dashboard
# ============================================

# === MYSQL (Clever Cloud) ===
MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma
MYSQL_ADDON_USER=u7imxhdxstbw6uuy
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc

# === MONGODB (Railway Addon) ===
# Esta variable la proporciona Railway automáticamente al agregar MongoDB
MONGODB_URI=${{MONGO_URL}}

# === PUERTOS ===
PORT=8000
API_GATEWAY_PORT=3000
NLP_SERVICE_PORT=8001
NOTIFICATION_SERVICE_PORT=3005
ANALYTICS_SERVICE_PORT=3006

# === APLICACIÓN ===
NODE_ENV=production
APP_ENV=production
APP_DEBUG=false

# === CORS ===
CORS_ORIGIN=*

# === JWT SECRET ===
JWT_SECRET=upt-chat-system-jwt-secret-2024-super-secure-key

# === DIALOGFLOW ===
DIALOGFLOW_PROJECT_ID=upt-chat-fhps
DIALOGFLOW_LANGUAGE_CODE=es-ES
DIALOGFLOW_CREDENTIALS_PATH=./credentials/dialogflow-credentials.json

# === NLP ===
MODEL_CONFIDENCE_THRESHOLD=0.7
MAX_TOKENS=512
ENVIRONMENT=production
DEBUG=False

# === SMTP (Opcional) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# === URLs INTERNAS (Railway) ===
NLP_SERVICE_URL=http://localhost:8001
NOTIFICATION_SERVICE_URL=http://localhost:3005
ANALYTICS_SERVICE_URL=http://localhost:3006
EOF
echo -e "${GREEN}✅ railway.env creado${NC}"

# ============================================
# 8. CREAR .ENV PARA CADA SERVICIO
# ============================================
echo "8️⃣  Creando archivos .env para cada servicio..."

# API Gateway .env
cat > upt-chat-system/services/api-gateway/.env << 'EOF'
PORT=3000
MONGODB_URI=${MONGODB_URI}
NLP_SERVICE_URL=http://localhost:8001
NOTIFICATION_SERVICE_URL=http://localhost:3005
ANALYTICS_SERVICE_URL=http://localhost:3006
CORS_ORIGIN=*
JWT_SECRET=upt-chat-system-jwt-secret-2024-super-secure-key
NODE_ENV=production
EOF
echo -e "${GREEN}  ✅ api-gateway/.env${NC}"

# NLP Service .env
cat > upt-chat-system/services/nlp-service/.env << 'EOF'
PORT=8001
MONGODB_URI=${MONGODB_URI}
ENVIRONMENT=production
DEBUG=False
CORS_ORIGINS=["*"]
MODEL_CONFIDENCE_THRESHOLD=0.7
MAX_TOKENS=512
DIALOGFLOW_PROJECT_ID=upt-chat-fhps
DIALOGFLOW_CREDENTIALS_PATH=./credentials/dialogflow-credentials.json
DIALOGFLOW_LANGUAGE_CODE=es-ES
EOF
echo -e "${GREEN}  ✅ nlp-service/.env${NC}"

# Notification Service .env
cat > upt-chat-system/services/notification-service/.env << 'EOF'
PORT=3005
MONGODB_URI=${MONGODB_URI}
NODE_ENV=production
EOF
echo -e "${GREEN}  ✅ notification-service/.env${NC}"

# Analytics Service .env
cat > upt-chat-system/services/analytics-service/.env << 'EOF'
PORT=3006
MONGODB_URI=${MONGODB_URI}
NODE_ENV=production
EOF
echo -e "${GREEN}  ✅ analytics-service/.env${NC}"

# Frontend .env
cat > proyectotest/.env << 'EOF'
MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma
MYSQL_ADDON_USER=u7imxhdxstbw6uuy
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc
APP_ENV=production
APP_DEBUG=false
EOF
echo -e "${GREEN}  ✅ proyectotest/.env${NC}"

# ============================================
# 9. README PARA RAILWAY
# ============================================
echo "9️⃣  Creando RAILWAY_DEPLOYMENT.md..."
cat > RAILWAY_DEPLOYMENT.md << 'EOF'
# 🚀 Despliegue en Railway - UPT Chat System

## ✅ Archivos de Configuración Creados

- `railway.json` - Configuración principal de Railway
- `nixpacks.toml` - Configuración de build
- `setup_railway.sh` - Script de instalación
- `start_railway.sh` - Script de inicio
- `Procfile` - Definición de proceso
- `.railwayignore` - Archivos a ignorar
- `railway.env` - Variables de entorno (plantilla)

## 📋 Pasos para Desplegar

### 1. Instalar Railway CLI
```bash
# Opción 1: Usando curl
curl -fsSL https://railway.app/install.sh | sh

# Opción 2: Usando npm
npm install -g @railway/cli
```

### 2. Autenticarse en Railway
```bash
railway login
```

### 3. Crear Proyecto
```bash
railway init
```
- Selecciona "Empty Project"
- Nombre: `upt-chat-system`

### 4. Agregar MongoDB
En Railway Dashboard:
1. Click en tu proyecto
2. Click "+ New"
3. Selecciona "Database" > "Add MongoDB"
4. Copia la variable `MONGO_URL`

### 5. Configurar Variables de Entorno
En Railway Dashboard > Variables, pega TODAS las variables del archivo `railway.env`

**Variables Críticas:**
- `MONGODB_URI` = `${{MONGO_URL}}` (referencia al addon de MongoDB)
- `MYSQL_ADDON_HOST` = Ya configurado en railway.env
- `MYSQL_ADDON_PASSWORD` = Ya configurado en railway.env
- `DIALOGFLOW_PROJECT_ID` = Ya configurado en railway.env

### 6. Conectar GitHub (Recomendado)
En Railway Dashboard:
1. Settings > Service
2. Connect Repo
3. Selecciona `Angelhc123/cosntru`
4. Branch: `main`

### 7. Desplegar
```bash
# Commit y push
git add .
git commit -m "🚀 Configuración Railway lista"
git push origin main

# O deploy directo
railway up
```

### 8. Ver Logs
```bash
railway logs
```

### 9. Obtener URL
En Railway Dashboard verás la URL pública:
```
https://upt-chat-system-production.up.railway.app
```

## 🔧 Comandos Útiles

```bash
# Ver estado
railway status

# Abrir dashboard
railway open

# Ver variables
railway variables

# Ejecutar comando en Railway
railway run <comando>

# Reiniciar servicio
railway restart
```

## 📊 Servicios Desplegados

- ✅ Frontend PHP (Puerto principal)
- ✅ API Gateway (Puerto 3000)
- ✅ NLP Service (Puerto 8001)
- ✅ Notification Service (Puerto 3005)
- ✅ Analytics Service (Puerto 3006)

## 🗄️ Bases de Datos

- **MySQL**: Clever Cloud (ya configurado)
- **MongoDB**: Railway Addon (agregar manualmente)

## ⚠️ Notas Importantes

1. **MongoDB**: Debes agregar el addon de MongoDB en Railway Dashboard
2. **Dialogflow**: Las credenciales ya están en el proyecto
3. **Puertos**: Railway asigna un puerto dinámico, los internos son fijos
4. **Logs**: Disponibles en `logs/` de cada servicio

## 🆘 Troubleshooting

### Build falla
```bash
railway logs
```
Verifica que todas las dependencias se instalaron correctamente.

### Servicio no responde
Verifica las variables de entorno en Railway Dashboard.

### MongoDB no conecta
Asegúrate de haber agregado el addon MongoDB y configurado `MONGODB_URI=${{MONGO_URL}}`.

## 📞 Soporte

- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Project Issues: https://github.com/Angelhc123/cosntru/issues
EOF
echo -e "${GREEN}✅ RAILWAY_DEPLOYMENT.md creado${NC}"

# ============================================
# 10. CREAR SCRIPT DE VARIABLES PARA RAILWAY CLI
# ============================================
echo "🔟 Creando script para configurar variables automáticamente..."
cat > configure_railway_vars.sh << 'EOF'
#!/bin/bash

# Script para configurar variables en Railway usando CLI

echo "🔧 Configurando variables de entorno en Railway..."

railway variables set MYSQL_ADDON_HOST="bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com"
railway variables set MYSQL_ADDON_DB="bj7lnbakskgcgngpmtma"
railway variables set MYSQL_ADDON_USER="u7imxhdxstbw6uuy"
railway variables set MYSQL_ADDON_PORT="3306"
railway variables set MYSQL_ADDON_PASSWORD="uaBOXOPi5TD9PEpIy8Uc"
railway variables set PORT="8000"
railway variables set API_GATEWAY_PORT="3000"
railway variables set NLP_SERVICE_PORT="8001"
railway variables set NOTIFICATION_SERVICE_PORT="3005"
railway variables set ANALYTICS_SERVICE_PORT="3006"
railway variables set NODE_ENV="production"
railway variables set APP_ENV="production"
railway variables set APP_DEBUG="false"
railway variables set CORS_ORIGIN="*"
railway variables set JWT_SECRET="upt-chat-system-jwt-secret-2024-super-secure-key"
railway variables set DIALOGFLOW_PROJECT_ID="upt-chat-fhps"
railway variables set DIALOGFLOW_LANGUAGE_CODE="es-ES"
railway variables set DIALOGFLOW_CREDENTIALS_PATH="./credentials/dialogflow-credentials.json"
railway variables set MODEL_CONFIDENCE_THRESHOLD="0.7"
railway variables set MAX_TOKENS="512"
railway variables set ENVIRONMENT="production"
railway variables set DEBUG="False"
railway variables set NLP_SERVICE_URL="http://localhost:8001"
railway variables set NOTIFICATION_SERVICE_URL="http://localhost:3005"
railway variables set ANALYTICS_SERVICE_URL="http://localhost:3006"

echo ""
echo "✅ Variables configuradas en Railway"
echo ""
echo "⚠️  IMPORTANTE: Debes configurar manualmente:"
echo "  MONGODB_URI = \${{MONGO_URL}}"
echo ""
echo "Para hacerlo:"
echo "1. Ve a Railway Dashboard"
echo "2. Agrega MongoDB addon"
echo "3. En Variables, agrega: MONGODB_URI=\${{MONGO_URL}}"
EOF
chmod +x configure_railway_vars.sh
echo -e "${GREEN}✅ configure_railway_vars.sh creado${NC}"

# ============================================
# RESUMEN FINAL
# ============================================
echo ""
echo "=============================================="
echo -e "${GREEN}  ✅ CONFIGURACIÓN COMPLETADA${NC}"
echo "=============================================="
echo ""
echo -e "${YELLOW}📦 Archivos creados:${NC}"
echo "  ✅ railway.json"
echo "  ✅ nixpacks.toml"
echo "  ✅ setup_railway.sh"
echo "  ✅ start_railway.sh"
echo "  ✅ Procfile"
echo "  ✅ .railwayignore"
echo "  ✅ railway.env (plantilla de variables)"
echo "  ✅ configure_railway_vars.sh (script de variables)"
echo "  ✅ RAILWAY_DEPLOYMENT.md (guía completa)"
echo "  ✅ .env para cada servicio"
echo ""
echo -e "${YELLOW}🚀 Próximos pasos:${NC}"
echo ""
echo "1️⃣  Instalar Railway CLI:"
echo "    curl -fsSL https://railway.app/install.sh | sh"
echo ""
echo "2️⃣  Autenticarse:"
echo "    railway login"
echo ""
echo "3️⃣  Crear proyecto:"
echo "    railway init"
echo ""
echo "4️⃣  Configurar variables automáticamente:"
echo "    ./configure_railway_vars.sh"
echo ""
echo "5️⃣  Agregar MongoDB en Railway Dashboard"
echo "    + New > Database > MongoDB"
echo ""
echo "6️⃣  Configurar MONGODB_URI en Variables:"
echo "    MONGODB_URI=\${{MONGO_URL}}"
echo ""
echo "7️⃣  Desplegar:"
echo "    git add ."
echo "    git commit -m '🚀 Deploy to Railway'"
echo "    git push origin main"
echo ""
echo -e "${BLUE}📖 Lee RAILWAY_DEPLOYMENT.md para más detalles${NC}"
echo ""