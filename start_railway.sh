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

# Servicios - Crear servicios separados en Railway
echo "🚀 Servicios - Crear servicios separados en Railway:"
echo "   - API Gateway: Crear servicio separado con Node.js"
echo "   - Analytics Service: Crear servicio separado con Node.js"
echo "   - Notification Service: Crear servicio separado con Node.js"
echo "   - NLP Service: Crear servicio separado con Python"
echo ""
echo "📝 Variables de entorno necesarias:"
echo "   - API_GATEWAY_URL: URL del servicio API Gateway"
echo "   - NLP_SERVICE_URL: URL del servicio NLP"
echo "   - NOTIFICATION_SERVICE_URL: URL del servicio Notification"
echo "   - ANALYTICS_SERVICE_URL: URL del servicio Analytics"
echo ""

# Función para limpiar procesos al salir
cleanup() {
    echo "🛑 Deteniendo servicios..."
    exit 0
}

trap cleanup SIGTERM SIGINT

echo ""
echo "✅ Configuración completada"
echo ""
echo "🌐 URL disponible:"
echo "  Frontend: http://0.0.0.0:$PORT"
echo "  Health Check: http://0.0.0.0:$PORT/api/v1/health"
echo ""

# Iniciar Frontend PHP como proceso principal con router
echo "🌐 Iniciando Frontend PHP con router..."
cd proyectotest/public
exec php -S 0.0.0.0:$PORT -t . router.php
