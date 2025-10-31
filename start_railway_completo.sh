#!/bin/bash
set -e

echo "🚀 Iniciando UPT Chat System Completo en Railway..."

# Crear directorio de logs
mkdir -p logs

# Variables de entorno por defecto
export PORT=${PORT:-8000}
export API_GATEWAY_PORT=${API_GATEWAY_PORT:-3000}
export FRONTEND_PORT=$PORT

echo "🔧 Puertos configurados:"
echo "  Frontend PHP: $FRONTEND_PORT"
echo "  API Gateway: $API_GATEWAY_PORT"

# Ejecutar setup de dependencias
echo "📦 Ejecutando setup de dependencias..."
bash setup_railway.sh

# Función para limpiar procesos al salir
cleanup() {
    echo "🛑 Deteniendo servicios..."
    pkill -P $$ || true
    exit 0
}

trap cleanup SIGTERM SIGINT

# Iniciar API Gateway si está disponible
if [ -d "upt-chat-system/services/api-gateway" ] && [ -f "upt-chat-system/services/api-gateway/dist/main.js" ]; then
    echo "🌐 Iniciando API Gateway..."
    cd upt-chat-system/services/api-gateway
    PORT=$API_GATEWAY_PORT npm run start:prod > ../../../logs/api-gateway.log 2>&1 &
    API_GATEWAY_PID=$!
    echo "  API Gateway PID: $API_GATEWAY_PID"
    cd ../../..
else
    echo "⚠️  API Gateway no está compilado, solo iniciando Frontend"
fi

# Iniciar otros microservicios disponibles
echo "📋 Verificando otros microservicios..."

# Analytics Service
if [ -d "upt-chat-system/services/analytics-service" ] && [ -f "upt-chat-system/services/analytics-service/dist/main.js" ]; then
    echo "📊 Iniciando Analytics Service..."
    cd upt-chat-system/services/analytics-service
    npm run start:prod > ../../../logs/analytics.log 2>&1 &
    echo "  Analytics Service iniciado"
    cd ../../..
fi

# Notification Service  
if [ -d "upt-chat-system/services/notification-service" ] && [ -f "upt-chat-system/services/notification-service/dist/main.js" ]; then
    echo "📱 Iniciando Notification Service..."
    cd upt-chat-system/services/notification-service
    npm run start:prod > ../../../logs/notifications.log 2>&1 &
    echo "  Notification Service iniciado"
    cd ../../..
fi

echo ""
echo "✅ Microservicios iniciados"
echo ""
echo "🌐 URLs disponibles:"
echo "  Frontend: http://0.0.0.0:$FRONTEND_PORT"
echo "  Health Check: http://0.0.0.0:$FRONTEND_PORT/api/v1/health"
if [ -n "$API_GATEWAY_PID" ]; then
    echo "  API Gateway: http://0.0.0.0:$API_GATEWAY_PORT"
fi
echo ""

# Iniciar Frontend PHP como proceso principal con router
echo "🌐 Iniciando Frontend PHP con router..."
cd proyectotest/public
exec php -S 0.0.0.0:$FRONTEND_PORT -t . router.php