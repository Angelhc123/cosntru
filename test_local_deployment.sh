#!/bin/bash
set -e

echo "🧪 Probando configuración local antes del despliegue..."

# Variables
PORT=${PORT:-8000}
HEALTH_URL="http://localhost:$PORT/api/v1/health"

echo "📦 Ejecutando setup..."
bash setup_railway.sh

echo ""
echo "🚀 Iniciando servidor en puerto $PORT..."
cd proyectotest/public

# Iniciar servidor en background con router
php -S 0.0.0.0:$PORT -t . router.php > ../../logs/test.log 2>&1 &
SERVER_PID=$!

# Función de limpieza
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidor de prueba..."
    kill $SERVER_PID 2>/dev/null || true
    exit 0
}

trap cleanup SIGTERM SIGINT

echo "📊 Servidor iniciado con PID: $SERVER_PID"
echo "⏳ Esperando que el servidor esté listo..."
sleep 3

echo ""
echo "🔍 Probando endpoints..."

# Probar health check
echo "📡 Probando health check: $HEALTH_URL"
if curl -s "$HEALTH_URL" | jq . > /dev/null 2>&1; then
    echo "✅ Health check funciona correctamente"
    curl -s "$HEALTH_URL" | jq .
else
    echo "❌ Error en health check"
    echo "📋 Logs del servidor:"
    tail -10 ../../logs/test.log
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
echo "✅ Todas las pruebas pasaron!"
echo "🌐 URLs disponibles:"
echo "  - Frontend: http://localhost:$PORT"
echo "  - Health Check: $HEALTH_URL"
echo ""
echo "💡 Presiona Ctrl+C para detener el servidor de prueba"

# Mantener servidor corriendo para inspección manual
wait $SERVER_PID