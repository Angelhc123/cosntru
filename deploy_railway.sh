#!/bin/bash

# 🚀 Script de Despliegue en Railway - UPT Chat System
# Autor: Sistema UPT
# Fecha: $(date)

clear
echo "=============================================="
echo "  🚀 DESPLIEGUE EN RAILWAY - UPT CHAT SYSTEM"
echo "=============================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
PROJECT_NAME="upt-chat-system"
GITHUB_REPO="https://github.com/Angelhc123/cosntru.git"

echo -e "${BLUE}📋 PASOS PARA DESPLEGAR EN RAILWAY${NC}"
echo ""
echo "Este script te guiará paso a paso para desplegar en Railway"
echo ""

# Función para esperar input del usuario
wait_for_user() {
    read -p "Presiona ENTER cuando hayas completado este paso..."
    echo ""
}

# Función para mostrar paso
show_step() {
    local step_num=$1
    local title=$2
    echo -e "${YELLOW}PASO $step_num: $title${NC}"
    echo "----------------------------------------"
}

# PASO 1: Verificar Railway CLI
show_step "1" "INSTALAR RAILWAY CLI"
echo "1.1. Ve a: https://railway.app/"
echo "1.2. Crea una cuenta o inicia sesión"
echo "1.3. Instala Railway CLI:"
echo ""
echo -e "${GREEN}# En Ubuntu/Debian:${NC}"
echo "curl -fsSL https://railway.app/install.sh | sh"
echo ""
echo -e "${GREEN}# O con npm:${NC}"
echo "npm install -g @railway/cli"
echo ""
wait_for_user

# PASO 2: Login
show_step "2" "AUTENTICARSE EN RAILWAY"
echo "Ejecuta este comando para autenticarte:"
echo ""
echo -e "${GREEN}railway login${NC}"
echo ""
echo "Se abrirá tu navegador para autenticarte"
wait_for_user

# PASO 3: Preparar el proyecto
show_step "3" "PREPARAR ARCHIVOS DE CONFIGURACIÓN"
echo "Creando archivos necesarios para Railway..."

# Crear railway.json
cat > railway.json << 'EOF'
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "chmod +x start_railway.sh && ./start_railway.sh",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "on_failure"
  }
}
EOF
echo -e "${GREEN}✅ railway.json creado${NC}"

# Crear start_railway.sh
cat > start_railway.sh << 'EOF'
#!/bin/bash

echo "🚀 Iniciando UPT Chat System en Railway..."

# Instalar dependencias de todos los servicios
echo "📦 Instalando dependencias..."

# API Gateway
cd upt-chat-system/services/api-gateway
npm install
npm run build
cd ../../..

# Analytics Service  
cd upt-chat-system/services/analytics-service
npm install
npm run build
cd ../../..

# Notification Service
cd upt-chat-system/services/notification-service
npm install
npm run build
cd ../../..

# NLP Service
cd upt-chat-system/services/nlp-service
pip install -r requirements.txt
cd ../../..

echo "✅ Dependencias instaladas"

# Iniciar servicios en segundo plano
echo "🔄 Iniciando servicios..."

# MongoDB (Railway lo provee como addon)
echo "📄 Conectando a MongoDB..."

# Iniciar NLP Service
cd upt-chat-system/services/nlp-service
python -m uvicorn presentation.main:app --host 0.0.0.0 --port ${PORT:-8001} &
NLP_PID=$!
cd ../../..

# Iniciar Notification Service
cd upt-chat-system/services/notification-service
npm run start:prod &
NOTIFICATION_PID=$!
cd ../../..

# Iniciar Analytics Service
cd upt-chat-system/services/analytics-service
npm run start:prod &
ANALYTICS_PID=$!
cd ../../..

# Iniciar API Gateway (servicio principal)
cd upt-chat-system/services/api-gateway
npm run start:prod &
API_GATEWAY_PID=$!
cd ../../..

# Iniciar Frontend PHP
cd proyectotest/public
php -S 0.0.0.0:${PORT:-8000} &
PHP_PID=$!
cd ../..

echo "✅ Todos los servicios iniciados"
echo "🌐 Sistema disponible en puerto $PORT"

# Mantener el proceso principal vivo
wait $API_GATEWAY_PID
EOF

chmod +x start_railway.sh
echo -e "${GREEN}✅ start_railway.sh creado${NC}"

# Crear Procfile
cat > Procfile << 'EOF'
web: ./start_railway.sh
EOF
echo -e "${GREEN}✅ Procfile creado${NC}"

# Crear .railwayignore
cat > .railwayignore << 'EOF'
node_modules/
*.log
.env.local
.git/
.gitignore
README.md
*.md
.vscode/
.idea/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
pip-log.txt
pip-delete-this-directory.txt
.coverage
.tox
.env
venv/
ENV/
env/
.DS_Store
Thumbs.db
EOF
echo -e "${GREEN}✅ .railwayignore creado${NC}"

echo ""
wait_for_user

# PASO 4: Configurar variables de entorno
show_step "4" "CONFIGURAR VARIABLES DE ENTORNO"
echo "Necesitas configurar estas variables en Railway:"
echo ""
echo -e "${BLUE}# Base de datos MySQL (ya tienes estas)${NC}"
echo "MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com"
echo "MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma"
echo "MYSQL_ADDON_USER=u7imxhdxstbw6uuy"
echo "MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc"
echo "MYSQL_ADDON_PORT=3306"
echo ""
echo -e "${BLUE}# Configuración de la app${NC}"
echo "NODE_ENV=production"
echo "APP_ENV=production"
echo "PORT=\${{PORT}}"
echo ""
echo -e "${BLUE}# MongoDB (Railway addon)${NC}"
echo "MONGODB_URI=\${{MONGO_URL}}"
echo ""
echo -e "${BLUE}# Dialogflow${NC}"
echo "DIALOGFLOW_PROJECT_ID=upt-chat-fhps"
echo "DIALOGFLOW_LANGUAGE_CODE=es-ES"
echo ""
wait_for_user

# PASO 5: Crear proyecto en Railway
show_step "5" "CREAR PROYECTO EN RAILWAY"
echo "5.1. Ejecuta estos comandos:"
echo ""
echo -e "${GREEN}# Inicializar proyecto Railway${NC}"
echo "railway init"
echo ""
echo "5.2. Selecciona 'Empty Project'"
echo "5.3. Dale un nombre: '$PROJECT_NAME'"
echo ""
wait_for_user

# PASO 6: Conectar GitHub
show_step "6" "CONECTAR CON GITHUB"
echo "6.1. Ve a Railway Dashboard: https://railway.app/dashboard"
echo "6.2. Selecciona tu proyecto '$PROJECT_NAME'"
echo "6.3. Ve a Settings > Service"
echo "6.4. Conecta tu repositorio de GitHub:"
echo "     Repository: Angelhc123/cosntru"
echo "     Branch: main"
echo ""
wait_for_user

# PASO 7: Configurar servicios
show_step "7" "CONFIGURAR ADDONS Y SERVICIOS"
echo "7.1. En Railway Dashboard, agrega estos addons:"
echo ""
echo -e "${GREEN}🗄️  MongoDB${NC} - Click en '+ New' > 'Database' > 'Add MongoDB'"
echo -e "${GREEN}🔧 Redis (Opcional)${NC} - Para cache"
echo ""
echo "7.2. Después de agregar MongoDB, copia la URL de conexión"
echo "7.3. Ve a Variables y agrega MONGODB_URI con esa URL"
echo ""
wait_for_user

# PASO 8: Configurar variables
show_step "8" "CONFIGURAR VARIABLES DE ENTORNO EN RAILWAY"
echo "8.1. Ve a tu proyecto > Variables"
echo "8.2. Agrega TODAS las variables mostradas en el PASO 4"
echo "8.3. Variables críticas:"
echo ""
echo -e "${RED}MONGODB_URI${NC} - URL de MongoDB de Railway"
echo -e "${RED}MYSQL_ADDON_HOST${NC} - Tu host de Clever Cloud"
echo -e "${RED}MYSQL_ADDON_PASSWORD${NC} - Tu password de MySQL"
echo -e "${RED}DIALOGFLOW_PROJECT_ID${NC} - upt-chat-fhps"
echo ""
wait_for_user

# PASO 9: Desplegar
show_step "9" "DESPLEGAR EL PROYECTO"
echo "9.1. Commit y push tus cambios:"
echo ""
echo -e "${GREEN}git add .${NC}"
echo -e "${GREEN}git commit -m \"🚀 Configuración para Railway\"${NC}"
echo -e "${GREEN}git push origin main${NC}"
echo ""
echo "9.2. Railway detectará automáticamente los cambios y desplegará"
echo "9.3. O puedes forzar un despliegue:"
echo ""
echo -e "${GREEN}railway up${NC}"
echo ""
wait_for_user

# PASO 10: Verificar despliegue
show_step "10" "VERIFICAR DESPLIEGUE"
echo "10.1. Ve a Railway Dashboard > Tu proyecto"
echo "10.2. Verifica que el despliegue sea exitoso (círculo verde)"
echo "10.3. Copia la URL generada por Railway"
echo "10.4. Prueba la aplicación en esa URL"
echo ""
echo -e "${GREEN}Ejemplo de URL: https://upt-chat-system-production.up.railway.app${NC}"
echo ""
wait_for_user

# PASO 11: Configurar dominio (opcional)
show_step "11" "CONFIGURAR DOMINIO PERSONALIZADO (OPCIONAL)"
echo "11.1. En Railway Dashboard > Settings > Domains"
echo "11.2. Agrega tu dominio personalizado"
echo "11.3. Configura los DNS según las instrucciones"
echo ""
wait_for_user

echo ""
echo "=============================================="
echo -e "${GREEN}  ✅ CONFIGURACIÓN COMPLETADA${NC}"
echo "=============================================="
echo ""
echo -e "${YELLOW}📝 RESUMEN DE ARCHIVOS CREADOS:${NC}"
echo "✅ railway.json - Configuración de Railway"
echo "✅ start_railway.sh - Script de inicio"
echo "✅ Procfile - Configuración de proceso"
echo "✅ .railwayignore - Archivos a ignorar"
echo ""
echo -e "${YELLOW}🔧 PRÓXIMOS PASOS:${NC}"
echo "1. Ejecuta: railway login"
echo "2. Ejecuta: railway init"
echo "3. Configura variables en Railway Dashboard"
echo "4. Conecta GitHub repository"
echo "5. Push código: git push origin main"
echo ""
echo -e "${BLUE}📞 SOPORTE:${NC}"
echo "- Railway Docs: https://docs.railway.app/"
echo "- Railway Discord: https://discord.gg/railway"
echo ""
echo -e "${GREEN}🚀 ¡Tu proyecto estará desplegado en Railway!${NC}"
echo ""
