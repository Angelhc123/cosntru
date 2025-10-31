#!/bin/bash

echo "🚀 Script de Prueba - Chatbox Integration"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}1. Verificando API Gateway...${NC}"
API_RESPONSE=$(curl -s http://localhost:3000/api/v1/health/ping)
if [[ $API_RESPONSE == *"ok"* ]]; then
    echo -e "${GREEN}✅ API Gateway está corriendo${NC}"
else
    echo -e "${RED}❌ API Gateway NO está corriendo${NC}"
    echo "   Ejecuta: cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway && npm run start:dev"
    exit 1
fi

echo ""
echo -e "${YELLOW}2. Probando endpoint de inicio de sesión (Usuario Invitado)...${NC}"
SESSION_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/chat-sessions/start/guest \
  -H "Content-Type: application/json" \
  -d '{"guest_identifier": "test_guest_'$(date +%s)'"}')

if [[ $SESSION_RESPONSE == *"session"* ]]; then
    echo -e "${GREEN}✅ Sesión de invitado creada correctamente${NC}"
    echo "   Response: $SESSION_RESPONSE"
else
    echo -e "${RED}❌ Error al crear sesión${NC}"
    echo "   Response: $SESSION_RESPONSE"
fi

echo ""
echo -e "${YELLOW}3. Probando endpoint de inicio de sesión (Usuario Registrado)...${NC}"
SESSION_REG_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/chat-sessions/start/123 \
  -H "Content-Type: application/json" \
  -d '{"user_id": 123}')

if [[ $SESSION_REG_RESPONSE == *"session"* ]]; then
    echo -e "${GREEN}✅ Sesión de usuario registrado creada correctamente${NC}"
    echo "   Response: $SESSION_REG_RESPONSE"
else
    echo -e "${RED}❌ Error al crear sesión${NC}"
    echo "   Response: $SESSION_REG_RESPONSE"
fi

echo ""
echo -e "${YELLOW}4. Verificando MongoDB Atlas...${NC}"
DB_RESPONSE=$(curl -s http://localhost:3000/api/v1/health/database)
if [[ $DB_RESPONSE == *"connected"* ]] || [[ $DB_RESPONSE == *"ok"* ]]; then
    echo -e "${GREEN}✅ MongoDB Atlas conectado${NC}"
else
    echo -e "${RED}❌ MongoDB Atlas NO conectado${NC}"
    echo "   Response: $DB_RESPONSE"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Pruebas completadas${NC}"
echo ""
echo "📝 Siguiente paso:"
echo "   1. Iniciar servidor PHP: cd /home/desci/Documentos/constru/proyectotest/public && php -S localhost:8000"
echo "   2. Abrir navegador: http://localhost:8000/login.php"
echo "   3. Probar el chatbox como invitado"
echo "   4. Login con: demo / demo123 / 8"
echo "   5. Probar el chatbox como usuario registrado"
echo ""
