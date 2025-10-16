#!/bin/bash

# Script para detener todos los servicios del proyecto UPT Chat System

clear
echo "=============================================="
echo "  🛑 DETENIENDO SISTEMA UPT CHAT"
echo "=============================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para matar proceso por puerto
kill_port() {
    local port=$1
    local name=$2
    
    PID=$(lsof -ti:$port)
    if [ ! -z "$PID" ]; then
        kill -9 $PID 2>/dev/null
        echo -e "${GREEN}✅ $name detenido (Puerto $port)${NC}"
    else
        echo -e "${YELLOW}⚠️  $name no estaba corriendo (Puerto $port)${NC}"
    fi
}

# Detener por puerto
echo -e "${YELLOW}🔍 Buscando y deteniendo servicios...${NC}\n"

kill_port 8000 "Frontend PHP"
kill_port 3000 "API Gateway"
kill_port 8001 "NLP Service"
kill_port 3005 "Notification Service"

# Detener por proceso
echo ""
echo -e "${YELLOW}🔍 Buscando procesos por nombre...${NC}\n"

# NLP Service
if pkill -f "python3 main.py" 2>/dev/null; then
    echo -e "${GREEN}✅ NLP Service detenido${NC}"
else
    echo -e "${YELLOW}⚠️  NLP Service no encontrado${NC}"
fi

# API Gateway
if pkill -f "nest start" 2>/dev/null; then
    echo -e "${GREEN}✅ API Gateway detenido${NC}"
else
    echo -e "${YELLOW}⚠️  API Gateway no encontrado${NC}"
fi

# Notification Service
if pkill -f "notification-service" 2>/dev/null; then
    echo -e "${GREEN}✅ Notification Service detenido${NC}"
else
    echo -e "${YELLOW}⚠️  Notification Service no encontrado${NC}"
fi

# Frontend PHP
if pkill -f "php -S localhost:8000" 2>/dev/null; then
    echo -e "${GREEN}✅ Frontend PHP detenido${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend PHP no encontrado${NC}"
fi

# Limpiar archivos de log (opcional)
echo ""
read -p "¿Deseas limpiar los archivos de log? (s/n): " clean_logs

if [[ "$clean_logs" == "s" ]]; then
    echo -e "\n${YELLOW}🧹 Limpiando logs...${NC}"
    rm -f /home/desci/Documentos/constru/upt-chat-system/services/nlp-service/nlp-service.log
    rm -f /home/desci/Documentos/constru/upt-chat-system/services/api-gateway/api-gateway.log
    rm -f /home/desci/Documentos/constru/upt-chat-system/services/notification-service/notification-service.log
    rm -f /home/desci/Documentos/constru/proyectotest/public/frontend.log
    echo -e "${GREEN}✅ Logs limpiados${NC}"
fi

echo ""
echo "=============================================="
echo -e "${GREEN}  ✨ TODOS LOS SERVICIOS DETENIDOS ✨${NC}"
echo "=============================================="
echo ""
echo -e "${YELLOW}💡 Para volver a iniciar:${NC}"
echo "   ./start_all.sh"
echo ""
