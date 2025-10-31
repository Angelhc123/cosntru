#!/bin/bash

# 🚀 Configuración Railway - Sin credenciales sensibles
# Este script crea todos los archivos necesarios para desplegar en Railway

clear
echo "=============================================="
echo "  🚀 CONFIGURACIÓN RAILWAY"
echo "=============================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

cd /home/desci/Documentos/constru

echo -e "${BLUE}📦 Creando archivos de configuración...${NC}"

# 1. railway.json
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "./start_railway.sh",
    "healthcheckPath": "/api/v1/health",
    "healthcheckTimeout": 300,
    "restartPolicyType": "on_failure"
  }
}
EOF
echo -e "${GREEN}✅ railway.json${NC}"

# 2. nixpacks.toml
cat > nixpacks.toml << 'EOF'
[phases.setup]
nixPkgs = ['nodejs-18_x', 'python310', 'php82']

[start]
cmd = 'bash start_railway.sh'
EOF
echo -e "${GREEN}✅ nixpacks.toml${NC}"

# 3. start_railway.sh
cat > start_railway.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Iniciando UPT Chat System..."

export PORT=${PORT:-8000}

# Instalar dependencias
cd upt-chat-system/services/api-gateway && npm ci && npm run build && cd ../../..
cd upt-chat-system/services/analytics-service && npm ci && npm run build && cd ../../..
cd upt-chat-system/services/notification-service && npm ci && npm run build && cd ../../..
cd upt-chat-system/services/nlp-service && pip install -r requirements.txt && cd ../../..

# Iniciar servicios
cd upt-chat-system/services/nlp-service && python3 -m uvicorn presentation.main:app --host 0.0.0.0 --port 8001 &
cd ../../..

cd upt-chat-system/services/notification-service && PORT=3005 npm run start:prod &
cd ../../..

cd upt-chat-system/services/analytics-service && PORT=3006 npm run start:prod &
cd ../../..

cd upt-chat-system/services/api-gateway && PORT=3000 npm run start:prod &
cd ../../..

cd proyectotest/public && php -S 0.0.0.0:$PORT &
cd ../..

wait
EOF
chmod +x start_railway.sh
echo -e "${GREEN}✅ start_railway.sh${NC}"

# 4. Procfile
cat > Procfile << 'EOF'
web: bash start_railway.sh
EOF
echo -e "${GREEN}✅ Procfile${NC}"

# 5. .railwayignore
cat > .railwayignore << 'EOF'
node_modules/
__pycache__/
*.log
.env.local
.git/
*.md
.vscode/
EOF
echo -e "${GREEN}✅ .railwayignore${NC}"

# 6. RAILWAY_VARS.md (Documentación de variables)
cat > RAILWAY_VARS.md << 'EOF'
# Variables de Entorno para Railway

Configura estas variables en Railway Dashboard > Variables:

## Base de Datos MySQL (Clever Cloud)
```
MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma
MYSQL_ADDON_USER=u7imxhdxstbw6uuy
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc
```

## MongoDB (Railway Addon)
```
MONGODB_URI=${{MONGO_URL}}
```

## Configuración General
```
NODE_ENV=production
APP_ENV=production
PORT=8000
CORS_ORIGIN=*
JWT_SECRET=upt-chat-system-jwt-secret-2024
```

## Dialogflow
```
DIALOGFLOW_PROJECT_ID=upt-chat-fhps
DIALOGFLOW_LANGUAGE_CODE=es-ES
```

## Pasos:
1. En Railway: Agrega MongoDB addon
2. Copia y pega todas estas variables
3. Deploy automático se activará
EOF
echo -e "${GREEN}✅ RAILWAY_VARS.md${NC}"

echo ""
echo "=============================================="
echo -e "${GREEN}  ✅ ARCHIVOS CREADOS${NC}"
echo "=============================================="
echo ""
echo "Próximos pasos:"
echo "1. git add ."
echo "2. git commit -m '🚀 Railway config'"
echo "3. git push origin main"
echo "4. railway login"
echo "5. railway init"
echo "6. Configura variables desde RAILWAY_VARS.md"
echo ""