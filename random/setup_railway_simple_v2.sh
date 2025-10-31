#!/bin/bash

# 🚀 Estrategia Railway: Servicios Separados
# Cada servicio se despliega independiente = MÁS FÁCIL

clear
echo "=============================================="
echo "  🚀 RAILWAY: SERVICIOS SEPARADOS"
echo "=============================================="
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

cd /home/desci/Documentos/constru

echo -e "${YELLOW}📋 ESTRATEGIA: Un servicio por deployment${NC}"
echo ""

# ============================================
# 1. FRONTEND PHP (PRINCIPAL)
# ============================================
echo "1️⃣  Configurando Frontend PHP..."

# railway.json para el frontend
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "cd proyectotest/public && php -S 0.0.0.0:$PORT",
    "healthcheckPath": "/health.php",
    "healthcheckTimeout": 60
  }
}
EOF

# nixpacks.toml para PHP
cat > nixpacks.toml << 'EOF'
[phases.setup]
nixPkgs = ['php82', 'php82Extensions.pdo', 'php82Extensions.pdo_mysql']

[start]
cmd = 'cd proyectotest/public && php -S 0.0.0.0:$PORT'
EOF

# Health check para PHP
cat > proyectotest/public/health.php << 'EOF'
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Cargar configuración de base de datos
try {
    $host = $_ENV['MYSQL_ADDON_HOST'] ?? 'localhost';
    $port = $_ENV['MYSQL_ADDON_PORT'] ?? 3306;
    $dbname = $_ENV['MYSQL_ADDON_DB'] ?? 'test';
    $username = $_ENV['MYSQL_ADDON_USER'] ?? 'root';
    $password = $_ENV['MYSQL_ADDON_PASSWORD'] ?? '';

    // Intentar conexión a MySQL
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [PDO::ATTR_TIMEOUT => 3]
    );
    
    $mysql_status = "connected";
} catch (Exception $e) {
    $mysql_status = "error: " . $e->getMessage();
}

echo json_encode([
    'status' => 'healthy',
    'service' => 'upt-chat-frontend',
    'timestamp' => date('c'),
    'mysql' => $mysql_status,
    'php_version' => PHP_VERSION
]);
?>
EOF

echo -e "${GREEN}✅ Frontend PHP configurado${NC}"

# ============================================
# 2. CREAR ARCHIVOS PARA CADA SERVICIO
# ============================================
echo ""
echo "2️⃣  Creando configuraciones separadas..."

# API Gateway
mkdir -p configs/api-gateway
cat > configs/api-gateway/railway.json << 'EOF'
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "cd upt-chat-system/services/api-gateway && npm run build && npm run start:prod",
    "healthcheckPath": "/api/v1/health"
  }
}
EOF

cat > configs/api-gateway/nixpacks.toml << 'EOF'
[phases.setup]
nixPkgs = ['nodejs-18_x']

[start]
cmd = 'cd upt-chat-system/services/api-gateway && npm run start:prod'
EOF

# NLP Service
mkdir -p configs/nlp-service
cat > configs/nlp-service/railway.json << 'EOF'
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "cd upt-chat-system/services/nlp-service && python3 -m uvicorn presentation.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health"
  }
}
EOF

cat > configs/nlp-service/nixpacks.toml << 'EOF'
[phases.setup]
nixPkgs = ['python310']

[phases.install]
cmds = ['cd upt-chat-system/services/nlp-service && pip install -r requirements.txt']

[start]
cmd = 'cd upt-chat-system/services/nlp-service && python3 -m uvicorn presentation.main:app --host 0.0.0.0 --port $PORT'
EOF

# Analytics Service
mkdir -p configs/analytics-service
cat > configs/analytics-service/railway.json << 'EOF'
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "cd upt-chat-system/services/analytics-service && npm run build && npm run start:prod",
    "healthcheckPath": "/api/v1/analytics/health"
  }
}
EOF

# Notification Service
mkdir -p configs/notification-service
cat > configs/notification-service/railway.json << 'EOF'
{
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "cd upt-chat-system/services/notification-service && npm run build && npm run start:prod",
    "healthcheckPath": "/api/v1/notifications/health"
  }
}
EOF

echo -e "${GREEN}✅ Configuraciones separadas creadas${NC}"

# ============================================
# 3. SCRIPT DE DESPLIEGUE FÁCIL
# ============================================
echo ""
echo "3️⃣  Creando script de despliegue fácil..."

cat > deploy_railway_easy.sh << 'EOF'
#!/bin/bash

echo "🚀 DESPLIEGUE FÁCIL EN RAILWAY"
echo "==============================="
echo ""

# Verificar Railway CLI
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI no instalado"
    echo "Instala con: curl -fsSL https://railway.app/install.sh | sh"
    exit 1
fi

echo "✅ Railway CLI detectado"
echo ""

echo "📋 PASOS A SEGUIR:"
echo ""
echo "1️⃣  FRONTEND (PRINCIPAL):"
echo "   railway login"
echo "   railway init (nombre: upt-chat-frontend)"
echo "   railway up"
echo ""
echo "2️⃣  AGREGAR MONGODB:"
echo "   En Railway Dashboard → + New → Database → MongoDB"
echo ""
echo "3️⃣  VARIABLES DEL FRONTEND:"
echo "   MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com"
echo "   MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma"
echo "   MYSQL_ADDON_USER=u7imxhdxstbw6uuy"
echo "   MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc"
echo "   MYSQL_ADDON_PORT=3306"
echo ""
echo "4️⃣  CREAR OTROS SERVICIOS (OPCIONAL):"
echo "   Para cada microservicio, crea un nuevo proyecto Railway"
echo "   Copia las configuraciones de configs/"
echo ""
echo "🎯 RECOMENDACIÓN: Empezar solo con el FRONTEND"
echo "   Los microservicis los puedes agregar después"
echo ""

read -p "¿Continuar con el despliegue del frontend? (s/n): " continuar

if [[ "$continuar" == "s" ]]; then
    echo ""
    echo "🚀 Iniciando despliegue del frontend..."
    railway login
    railway init
    railway up
else
    echo "👍 ¡Perfecto! Ejecuta los pasos manualmente cuando estés listo"
fi
EOF
chmod +x deploy_railway_easy.sh

echo -e "${GREEN}✅ Script de despliegue creado${NC}"

# ============================================
# 4. .RAILWAYIGNORE SIMPLE
# ============================================
cat > .railwayignore << 'EOF'
# Ignorer otros servicios para el frontend
upt-chat-system/
configs/
node_modules/
*.log
.git/
*.md
EOF

echo -e "${GREEN}✅ .railwayignore actualizado${NC}"

echo ""
echo "=============================================="
echo -e "${GREEN}  ✅ CONFIGURACIÓN FÁCIL COMPLETADA${NC}"
echo "=============================================="
echo ""
echo -e "${YELLOW}🎯 ESTRATEGIA SIMPLE:${NC}"
echo ""
echo "1️⃣  Despliega SOLO el FRONTEND primero"
echo "2️⃣  Una vez funcionando, agrega servicios de a uno"
echo "3️⃣  Cada servicio = Un proyecto Railway separado"
echo ""
echo -e "${BLUE}🚀 Para empezar:${NC}"
echo "./deploy_railway_easy.sh"
echo ""
echo -e "${YELLOW}📂 Archivos creados:${NC}"
echo "✅ railway.json (frontend)"
echo "✅ nixpacks.toml (PHP optimizado)"  
echo "✅ health.php (check de salud)"
echo "✅ configs/ (para otros servicios)"
echo "✅ deploy_railway_easy.sh"
echo ""
EOF
chmod +x setup_railway_simple_v2.sh

echo -e "${GREEN}✅ Script principal creado${NC}"
echo ""
echo "🎯 Ejecuta: ./setup_railway_simple_v2.sh"