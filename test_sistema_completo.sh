#!/bin/bash
set -e

echo "🧪 Probando configuración completa local antes del despliegue..."

# Variables
PORT=${PORT:-8000}
API_GATEWAY_PORT=${API_GATEWAY_PORT:-3000}
HEALTH_URL="http://localhost:$PORT/api/v1/health"

echo "📦 Ejecutando setup completo..."
bash setup_railway.sh

echo ""
echo "🚀 Iniciando sistema completo en puerto $PORT..."

# Iniciar con el script completo en background
./start_railway_completo.sh > logs/test_completo.log 2>&1 &
SYSTEM_PID=$!

# Función de limpieza
cleanup() {
    echo ""
    echo "🛑 Deteniendo sistema completo..."
    kill -TERM $SYSTEM_PID 2>/dev/null || true
    sleep 2
    kill -KILL $SYSTEM_PID 2>/dev/null || true
    pkill -f "php -S" 2>/dev/null || true
    pkill -f "node.*main" 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

echo "📊 Sistema iniciado con PID: $SYSTEM_PID"
echo "⏳ Esperando que el sistema esté listo..."
sleep 8

echo ""
echo "🔍 Probando endpoints..."

# Probar health check
echo "📡 Probando health check completo: $HEALTH_URL"
if curl -s "$HEALTH_URL" | jq . > /dev/null 2>&1; then
    echo "✅ Health check funciona correctamente"
    echo ""
    echo "📋 Estado del sistema:"
    curl -s "$HEALTH_URL" | jq .
else
    echo "❌ Error en health check"
    echo "📋 Logs del sistema:"
    tail -20 logs/test_completo.log
    cleanup
    exit 1
fi

echo ""
echo "🌐 Probando página principal..."
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT" | grep -q "302\|200"; then
    echo "✅ Página principal responde correctamente"
else
    echo "❌ Error en página principal"
fi

echo ""
echo "🔧 Probando API Gateway..."
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$API_GATEWAY_PORT" 2>/dev/null | grep -q "200\|404"; then
    echo "✅ API Gateway responde"
else
    echo "⚠️  API Gateway no responde (puede estar aún iniciando)"
fi

echo ""
echo "✅ Pruebas del sistema completo completadas!"
echo "🌐 URLs disponibles:"
echo "  - Frontend: http://localhost:$PORT"
echo "  - Health Check: $HEALTH_URL"
echo "  - API Gateway: http://localhost:$API_GATEWAY_PORT"
echo ""
echo "💡 Presiona Ctrl+C para detener el sistema de prueba"

# Mantener sistema corriendo para inspección manual
wait $SYSTEM_PID