#!/bin/bash

echo "📋 CONFIGURADOR DE VARIABLES RAILWAY"
echo "===================================="
echo ""

read -p "🌐 Ingresa la URL base de tu proyecto Railway (ej: mi-proyecto): " BASE_URL

if [ -z "$BASE_URL" ]; then
    echo "❌ URL base requerida"
    exit 1
fi

echo ""
echo "🔗 URLs generadas para tus servicios:"
echo "======================================"

FRONTEND_URL="https://${BASE_URL}-frontend.railway.app"
API_GATEWAY_URL="https://${BASE_URL}-api-gateway.railway.app"
ANALYTICS_URL="https://${BASE_URL}-analytics.railway.app"
DB_SEEDER_URL="https://${BASE_URL}-db-seeder.railway.app"
NOTIFICATIONS_URL="https://${BASE_URL}-notifications.railway.app"
NLP_URL="https://${BASE_URL}-nlp.railway.app"

echo "FRONTEND_URL=$FRONTEND_URL"
echo "API_GATEWAY_URL=$API_GATEWAY_URL"
echo "ANALYTICS_SERVICE_URL=$ANALYTICS_URL"
echo "DB_SEEDER_URL=$DB_SEEDER_URL"
echo "NOTIFICATION_SERVICE_URL=$NOTIFICATIONS_URL"
echo "NLP_SERVICE_URL=$NLP_URL"

echo ""
echo "📝 Variables para FRONTEND PHP:"
echo "==============================="
cat << EOF
API_GATEWAY_URL=$API_GATEWAY_URL
ANALYTICS_SERVICE_URL=$ANALYTICS_URL
DB_SEEDER_URL=$DB_SEEDER_URL
NOTIFICATION_SERVICE_URL=$NOTIFICATIONS_URL
NLP_SERVICE_URL=$NLP_URL
EOF

echo ""
echo "📝 Variables para API GATEWAY:"
echo "=============================="
cat << EOF
ANALYTICS_SERVICE_URL=$ANALYTICS_URL
DB_SEEDER_URL=$DB_SEEDER_URL
NOTIFICATION_SERVICE_URL=$NOTIFICATIONS_URL
NLP_SERVICE_URL=$NLP_URL
FRONTEND_URL=$FRONTEND_URL
CORS_ORIGIN=$FRONTEND_URL,http://localhost:8000
EOF

echo ""
echo "📝 Variables para otros servicios:"
echo "=================================="
cat << EOF
API_GATEWAY_URL=$API_GATEWAY_URL
EOF

echo ""
echo "⚠️  NOTA: Estas URLs son estimadas. Usa las URLs reales que te dé Railway."
echo "📋 Copia y pega estas variables en cada servicio correspondiente en Railway."