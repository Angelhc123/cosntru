#!/bin/bash
set -e

echo "🚀 Iniciando UPT Chat System en Railway..."

# Crear directorio de logs
mkdir -p logs

# Variables de entorno por defecto
export PORT=${PORT:-8000}

echo "🔧 Puerto configurado:"
echo "  Frontend: $PORT"

# Ejecutar setup de dependencias
echo "📦 Ejecutando setup de dependencias..."
bash setup_railway.sh

# Iniciar servicios en background
echo "🚀 Iniciando servicios..."

# Iniciar NLP Service
echo "🤖 Iniciando NLP Service..."
cd upt-chat-system/services/nlp-service
python3 -m uvicorn main:app --host 0.0.0.0 --port 8001 > ../../../logs/nlp-service.log 2>&1 &
NLP_PID=$!
echo "  PID: $NLP_PID"
cd ../../..

# Iniciar Notification Service
echo "📧 Iniciando Notification Service..."
cd upt-chat-system/services/notification-service
PORT=3005 npm run start:prod > ../../../logs/notification-service.log 2>&1 &
NOTIFICATION_PID=$!
echo "  PID: $NOTIFICATION_PID"
cd ../../..

# Iniciar Analytics Service
echo "📊 Iniciando Analytics Service..."
cd upt-chat-system/services/analytics-service
PORT=3006 npm run start:prod > ../../../logs/analytics-service.log 2>&1 &
ANALYTICS_PID=$!
echo "  PID: $ANALYTICS_PID"
cd ../../..

# Iniciar API Gateway
echo "🚪 Iniciando API Gateway..."
cd upt-chat-system/services/api-gateway
PORT=3000 npm run start:prod > ../../../logs/api-gateway.log 2>&1 &
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
echo "  API Gateway:  http://0.0.0.0:3000"
echo "  NLP Service:  http://0.0.0.0:8001"
echo "  Notification: http://0.0.0.0:3005"
echo "  Analytics:    http://0.0.0.0:3006"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo "🛑 Deteniendo servicios..."
    kill $PHP_PID $API_GATEWAY_PID $ANALYTICS_PID $NOTIFICATION_PID $NLP_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

# Iniciar Frontend PHP como proceso principal
echo "🌐 Iniciando Frontend PHP..."
cd proyectotest/public
exec php -S 0.0.0.0:$PORT -t .
