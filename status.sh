#!/bin/bash

# Script para verificar el estado de todos los servicios

clear
echo "=============================================="
echo "  📊 ESTADO DEL SISTEMA UPT CHAT"
echo "=============================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para verificar puerto
check_service() {
    local port=$1
    local name=$2
    local url=$3
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        PID=$(lsof -ti:$port)
        echo -e "${GREEN}✅ $name${NC}"
        echo "   Puerto: $port (PID: $PID)"
        echo "   URL: $url"
    else
        echo -e "${RED}❌ $name - NO CORRIENDO${NC}"
        echo "   Puerto: $port"
    fi
    echo ""
}

echo -e "${YELLOW}🔍 Verificando servicios...${NC}\n"

check_service 8000 "Frontend PHP" "http://localhost:8000"
check_service 3000 "API Gateway (NestJS)" "http://localhost:3000"
check_service 8001 "NLP Service (Python)" "http://localhost:8001"
check_service 3005 "Notification Service" "http://localhost:3005"

# Verificar ngrok
echo -e "${YELLOW}🌐 Túnel HTTPS (ngrok):${NC}"
if pgrep -x "ngrok" > /dev/null; then
    PID=$(pgrep -x ngrok)
    echo -e "${GREEN}✅ ngrok corriendo (PID: $PID)${NC}"
    
    # Intentar obtener URL
    NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)
    
    if [ ! -z "$NGROK_URL" ]; then
        echo "   Dashboard: http://localhost:4040"
        echo ""
        echo "   ╔════════════════════════════════════════════════════════╗"
        echo "   ║  🔐 URL WEBHOOK PARA DIALOGFLOW:                      ║"
        echo "   ╠════════════════════════════════════════════════════════╣"
        echo "      $NGROK_URL/webhook"
        echo "   ╚════════════════════════════════════════════════════════╝"
    else
        echo "   Dashboard: http://localhost:4040"
        echo -e "   ${YELLOW}⚠️  No se pudo obtener URL automáticamente${NC}"
        echo "   Verifica en: http://localhost:4040"
    fi
else
    echo -e "${RED}❌ ngrok - NO CORRIENDO${NC}"
    echo "   Para iniciar con ngrok: ./start_all.sh → Opción 1"
fi
echo ""

# Verificar base de datos
echo -e "${YELLOW}🗄️  Base de Datos:${NC}"
if [ -f "/home/desci/Documentos/constru/proyectotest/.env" ]; then
    source /home/desci/Documentos/constru/proyectotest/.env
    echo -e "${GREEN}✅ Configuración encontrada${NC}"
    echo "   Host: $MYSQL_ADDON_HOST"
    echo "   Database: $MYSQL_ADDON_DB"
else
    echo -e "${RED}❌ Archivo .env no encontrado${NC}"
fi

echo ""
echo "=============================================="
echo -e "${YELLOW}💡 Comandos útiles:${NC}"
echo "   Iniciar todo:  ./start_all.sh"
echo "   Detener todo:  ./stop_all.sh"
echo "   Ver este estado: ./status.sh"
echo "=============================================="
echo ""
