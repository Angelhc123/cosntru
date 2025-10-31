#!/bin/bash

echo "🧪 VALIDADOR DE SERVICIOS RAILWAY"
echo "================================="
echo ""

if [ -z "$1" ]; then
    echo "❌ Uso: $0 <url-base>"
    echo "   Ejemplo: $0 mi-proyecto"
    exit 1
fi

BASE_URL="$1"

# URLs de los servicios
FRONTEND_URL="https://${BASE_URL}-frontend.railway.app"
API_GATEWAY_URL="https://${BASE_URL}-api-gateway.railway.app" 
ANALYTICS_URL="https://${BASE_URL}-analytics.railway.app"
DB_SEEDER_URL="https://${BASE_URL}-db-seeder.railway.app"
NOTIFICATIONS_URL="https://${BASE_URL}-notifications.railway.app"
NLP_URL="https://${BASE_URL}-nlp.railway.app"

echo "🔍 Verificando servicios..."
echo ""

# Función para probar endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local path="$3"
    local full_url="${url}${path}"
    
    echo -n "📡 $name: "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "$full_url" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo "✅ OK"
    elif [ "$response" = "404" ]; then
        echo "⚠️  Servicio activo pero endpoint no encontrado"
    elif [ -n "$response" ]; then
        echo "⚠️  Respuesta: $response"
    else
        echo "❌ No responde"
    fi
}

# Probar cada servicio
test_endpoint "Frontend PHP    " "$FRONTEND_URL" "/api/v1/health"
test_endpoint "API Gateway     " "$API_GATEWAY_URL" "/health"
test_endpoint "Analytics       " "$ANALYTICS_URL" "/health"
test_endpoint "DB Seeder       " "$DB_SEEDER_URL" "/health"
test_endpoint "Notifications   " "$NOTIFICATIONS_URL" "/health"
test_endpoint "NLP Service     " "$NLP_URL" "/health"

echo ""
echo "🌐 URLs probadas:"
echo "=================="
echo "Frontend:      $FRONTEND_URL"
echo "API Gateway:   $API_GATEWAY_URL"
echo "Analytics:     $ANALYTICS_URL"
echo "DB Seeder:     $DB_SEEDER_URL"
echo "Notifications: $NOTIFICATIONS_URL"
echo "NLP Service:   $NLP_URL"

echo ""
echo "💡 Si algún servicio no responde:"
echo "  1. Verifica que esté desplegado en Railway"
echo "  2. Revisa los logs en Railway Dashboard"
echo "  3. Comprueba las variables de entorno"