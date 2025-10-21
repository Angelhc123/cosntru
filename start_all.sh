#!/bin/bash

# Script para iniciar todos los servicios del proyecto UPT Chat System
# Autor: Ángel Hernández Cruz
# Fecha: 2025-10-13

clear
echo "=============================================="
echo "  🚀 INICIANDO SISTEMA UPT CHAT COMPLETO"
echo "=============================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para verificar si un puerto está en uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${RED}❌ Puerto $1 ya está en uso${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Puerto $1 disponible${NC}"
        return 0
    fi
}

# Verificar puertos antes de iniciar
echo -e "${BLUE}🔍 Verificando puertos disponibles...${NC}"
check_port 8000 || { echo "Ejecuta: pkill -f 'php -S localhost:8000'"; }
check_port 3000 || { echo "Ejecuta: pkill -f 'npm.*api-gateway'"; }
check_port 8001 || { echo "Ejecuta: pkill -f 'python3 main.py'"; }
check_port 3005 || { echo "Ejecuta: pkill -f 'npm.*notification'"; }
check_port 4040 || { echo "Puerto 4040 (ngrok web interface) en uso"; }
echo ""

# Verificar si ngrok está instalado
if ! command -v ngrok &> /dev/null; then
    echo -e "${YELLOW}⚠️  ngrok no está instalado. Se instalará automáticamente...${NC}"
    cd /tmp
    wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
    tar xzf ngrok-v3-stable-linux-amd64.tgz
    sudo mv ngrok /usr/local/bin/
    echo -e "${GREEN}✅ ngrok instalado${NC}"
fi
echo ""

# Preguntar qué servicios iniciar
echo -e "${YELLOW}¿Qué deseas iniciar?${NC}"
echo "1) Todo el sistema + ngrok (recomendado para DialogFlow)"
echo "2) Todo el sistema sin ngrok"
echo "3) Solo Backend (API Gateway + NLP + Notifications)"
echo "4) Solo Frontend (ProyectoTest PHP)"
echo "5) Servicios individuales"
echo ""
read -p "Selecciona una opción (1-5): " option

case $option in
    1)
        echo -e "\n${BLUE}🚀 Iniciando TODOS los servicios + ngrok...${NC}\n"
        INIT_ALL=true
        INIT_NGROK=true
        ;;
    2)
        echo -e "\n${BLUE}🚀 Iniciando TODOS los servicios...${NC}\n"
        INIT_ALL=true
        ;;
    3)
        echo -e "\n${BLUE}🚀 Iniciando solo Backend...${NC}\n"
        INIT_BACKEND=true
        ;;
    4)
        echo -e "\n${BLUE}🚀 Iniciando solo Frontend...${NC}\n"
        INIT_FRONTEND=true
        ;;
    5)
        echo -e "\n${YELLOW}Selecciona servicios individuales:${NC}"
        read -p "¿Iniciar API Gateway? (s/n): " api
        read -p "¿Iniciar NLP Service? (s/n): " nlp
        read -p "¿Iniciar Notification Service? (s/n): " notif
        read -p "¿Iniciar Frontend PHP? (s/n): " php
        read -p "¿Iniciar ngrok? (s/n): " ngrok_opt
        if [[ "$ngrok_opt" == "s" ]]; then
            INIT_NGROK=true
        fi
        echo ""
        ;;
    *)
        echo -e "${RED}Opción no válida${NC}"
        exit 1
        ;;
esac

# Base path
BASE_PATH="/home/desci/Documentos/constru"

# 1. NLP SERVICE (Python/FastAPI) - Puerto 8001
if [[ "$INIT_ALL" == true ]] || [[ "$INIT_BACKEND" == true ]] || [[ "$nlp" == "s" ]]; then
    echo -e "${BLUE}🤖 Iniciando NLP Service (Puerto 8001)...${NC}"
    cd "$BASE_PATH/upt-chat-system/services/nlp-service"
    
    if [ ! -f "main.py" ]; then
        echo -e "${RED}❌ No se encontró main.py${NC}"
    else
        nohup python3 main.py > nlp-service.log 2>&1 &
        NLP_PID=$!
        echo -e "${GREEN}✅ NLP Service iniciado (PID: $NLP_PID)${NC}"
        echo "   📄 Logs: $BASE_PATH/upt-chat-system/services/nlp-service/nlp-service.log"
        echo "   🌐 URL: http://localhost:8001"
    fi
    echo ""
    sleep 2
fi

# 2. API GATEWAY (NestJS) - Puerto 3000
if [[ "$INIT_ALL" == true ]] || [[ "$INIT_BACKEND" == true ]] || [[ "$api" == "s" ]]; then
    echo -e "${BLUE}🚪 Iniciando API Gateway (Puerto 3000)...${NC}"
    cd "$BASE_PATH/upt-chat-system/services/api-gateway"
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠️  Instalando dependencias...${NC}"
        npm install
    fi
    
    nohup npm run start:dev > api-gateway.log 2>&1 &
    API_PID=$!
    echo -e "${GREEN}✅ API Gateway iniciado (PID: $API_PID)${NC}"
    echo "   📄 Logs: $BASE_PATH/upt-chat-system/services/api-gateway/api-gateway.log"
    echo "   🌐 URL: http://localhost:3000"
    echo ""
    sleep 3
fi

# 3. NOTIFICATION SERVICE (NestJS) - Puerto 3005
if [[ "$INIT_ALL" == true ]] || [[ "$INIT_BACKEND" == true ]] || [[ "$notif" == "s" ]]; then
    echo -e "${BLUE}📧 Iniciando Notification Service (Puerto 3005)...${NC}"
    cd "$BASE_PATH/upt-chat-system/services/notification-service"
    
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠️  Instalando dependencias...${NC}"
        npm install
    fi
    
    nohup npm run start:dev > notification-service.log 2>&1 &
    NOTIF_PID=$!
    echo -e "${GREEN}✅ Notification Service iniciado (PID: $NOTIF_PID)${NC}"
    echo "   📄 Logs: $BASE_PATH/upt-chat-system/services/notification-service/notification-service.log"
    echo "   🌐 URL: http://localhost:3005"
    echo ""
    sleep 2
fi

# 4. FRONTEND PHP - Puerto 8000
if [[ "$INIT_ALL" == true ]] || [[ "$INIT_FRONTEND" == true ]] || [[ "$php" == "s" ]]; then
    echo -e "${BLUE}🌐 Iniciando Frontend PHP (Puerto 8000)...${NC}"
    cd "$BASE_PATH/proyectotest/public"
    
    nohup php -S localhost:8000 > frontend.log 2>&1 &
    PHP_PID=$!
    echo -e "${GREEN}✅ Frontend PHP iniciado (PID: $PHP_PID)${NC}"
    echo "   📄 Logs: $BASE_PATH/proyectotest/public/frontend.log"
    echo "   🌐 URL: http://localhost:8000"
    echo ""
fi

# 5. NGROK - Túnel HTTPS para DialogFlow
if [[ "$INIT_NGROK" == true ]]; then
    echo -e "${BLUE}🌐 Iniciando ngrok (Túnel HTTPS para NLP Service)...${NC}"
    
    # Verificar si ngrok ya está corriendo
    if pgrep -x "ngrok" > /dev/null; then
        echo -e "${YELLOW}⚠️  ngrok ya está corriendo${NC}"
        echo -e "${YELLOW}   Para ver la URL: curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url'${NC}"
    else
        nohup ngrok http 8001 > /dev/null 2>&1 &
        NGROK_PID=$!
        echo -e "${GREEN}✅ ngrok iniciado (PID: $NGROK_PID)${NC}"
        echo "   🌐 Dashboard: http://localhost:4040"
        echo ""
        
        # Esperar a que ngrok inicie
        echo -e "${YELLOW}⏳ Esperando a que ngrok genere la URL HTTPS...${NC}"
        sleep 3
        
        # Obtener URL de ngrok
        NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)
        
        if [ ! -z "$NGROK_URL" ]; then
            echo -e "${GREEN}✅ Túnel HTTPS creado exitosamente!${NC}"
            echo ""
            echo "╔════════════════════════════════════════════════════════╗"
            echo "║  🔐 URL PARA DIALOGFLOW WEBHOOK:                      ║"
            echo "╠════════════════════════════════════════════════════════╣"
            echo "║                                                        ║"
            echo "   $NGROK_URL/webhook"
            echo "║                                                        ║"
            echo "╚════════════════════════════════════════════════════════╝"
            echo ""
            echo -e "${YELLOW}📝 PASOS PARA CONFIGURAR DIALOGFLOW:${NC}"
            echo "   1. Ve a DialogFlow Console"
            echo "   2. Click en 'Fulfillment' (menú izquierdo)"
            echo "   3. Activa 'Webhook' (toggle)"
            echo "   4. En URL, pega: $NGROK_URL/webhook"
            echo "   5. Click 'SAVE'"
            echo ""
            echo "   📊 Ver requests en tiempo real:"
            echo "   http://localhost:4040"
            echo ""
        else
            echo -e "${RED}❌ No se pudo obtener la URL de ngrok${NC}"
            echo "   Verifica manualmente en: http://localhost:4040"
        fi
    fi
    echo ""
fi

# Resumen final
echo ""
echo "=============================================="
echo -e "${GREEN}  ✨ SISTEMA INICIADO CORRECTAMENTE ✨${NC}"
echo "=============================================="
echo ""
echo -e "${YELLOW}📊 URLs de Acceso:${NC}"
if [[ "$INIT_ALL" == true ]] || [[ "$INIT_FRONTEND" == true ]] || [[ "$php" == "s" ]]; then
    echo "   🏠 Frontend:       http://localhost:8000"
fi
if [[ "$INIT_ALL" == true ]] || [[ "$INIT_BACKEND" == true ]] || [[ "$api" == "s" ]]; then
    echo "   🚪 API Gateway:    http://localhost:3000"
fi
if [[ "$INIT_ALL" == true ]] || [[ "$INIT_BACKEND" == true ]] || [[ "$nlp" == "s" ]]; then
    echo "   🤖 NLP Service:    http://localhost:8001"
fi
if [[ "$INIT_ALL" == true ]] || [[ "$INIT_BACKEND" == true ]] || [[ "$notif" == "s" ]]; then
    echo "   📧 Notifications:  http://localhost:3005"
fi
if [[ "$INIT_NGROK" == true ]]; then
    echo "   🌐 ngrok Dashboard: http://localhost:4040"
    if [ ! -z "$NGROK_URL" ]; then
        echo "   🔐 Webhook URL:    $NGROK_URL/webhook"
    fi
fi
echo ""
echo -e "${YELLOW}🛑 Para detener todo:${NC}"
echo "   ./stop_all.sh"
echo ""
echo -e "${YELLOW}📝 Ver logs en tiempo real:${NC}"
if [[ "$INIT_ALL" == true ]] || [[ "$INIT_BACKEND" == true ]] || [[ "$nlp" == "s" ]]; then
    echo "   tail -f upt-chat-system/services/nlp-service/nlp-service.log"
fi
if [[ "$INIT_ALL" == true ]] || [[ "$INIT_BACKEND" == true ]] || [[ "$api" == "s" ]]; then
    echo "   tail -f upt-chat-system/services/api-gateway/api-gateway.log"
fi
echo ""
echo "=============================================="
