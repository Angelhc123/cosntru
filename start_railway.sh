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
