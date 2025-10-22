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

# Detener por puerto PRIMERO (más confiable)
echo -e "${YELLOW}🔍 Buscando y deteniendo servicios por puerto...${NC}\n"

kill_port 8000 "Frontend PHP"
kill_port 3000 "API Gateway" 
kill_port 8001 "NLP Service"
kill_port 3005 "Notification Service"

# Detener por proceso (por si quedaron zombies)
echo ""
echo -e "${YELLOW}🔍 Limpiando procesos residuales...${NC}\n"

# Frontend PHP
if pkill -9 -f "php -S localhost:8000" 2>/dev/null; then
    echo -e "${GREEN}✅ Proceso PHP limpiado${NC}"
fi

# NLP Service (FastAPI/Uvicorn)
if pkill -9 -f "main.py" 2>/dev/null; then
    echo -e "${GREEN}✅ Proceso NLP Service limpiado${NC}"
fi

# API Gateway (NestJS)
if pkill -9 -f "nest start" 2>/dev/null || pkill -9 -f "api-gateway" 2>/dev/null; then
    echo -e "${GREEN}✅ Proceso API Gateway limpiado${NC}"
fi

# Notification Service
if pkill -9 -f "notification-service" 2>/dev/null; then
    echo -e "${GREEN}✅ Proceso Notification Service limpiado${NC}"
fi

# ngrok
if pkill -9 ngrok 2>/dev/null; then
    echo -e "${GREEN}✅ ngrok detenido${NC}"
    kill_port 4040 "ngrok web interface"
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
