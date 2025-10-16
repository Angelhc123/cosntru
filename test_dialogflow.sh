#!/bin/bash

# Script para probar DialogFlow directamente
# Creado: 15 de octubre de 2025

echo "=================================="
echo "  🧪 PRUEBA DE DIALOGFLOW"
echo "=================================="
echo ""

echo "📝 Configuración:"
echo "   Project ID: upt-chat-fhps"
echo "   Credenciales: credentials/dialogflow-credentials.json"
echo ""

# Test 1: Verificar credenciales
echo "🔍 Test 1: Verificando credenciales..."
if [ -f ~/Documentos/constru/upt-chat-system/services/nlp-service/credentials/dialogflow-credentials.json ]; then
    echo "   ✅ Archivo de credenciales encontrado"
else
    echo "   ❌ No se encontró el archivo de credenciales"
    exit 1
fi

# Test 2: Verificar proyecto
PROJECT_ID=$(cat ~/Documentos/constru/upt-chat-system/services/nlp-service/credentials/dialogflow-credentials.json | grep project_id | cut -d'"' -f4)
echo "   Project ID del archivo: $PROJECT_ID"

# Test 3: Probar con mensaje simple
echo ""
echo "🧪 Test 2: Enviando mensaje 'Hola' al NLP Service..."
RESPONSE=$(curl -s -X POST http://localhost:8001/api/v1/nlp/process \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user",
    "message": "Hola",
    "session_id": "test-'$(date +%s)'",
    "language": "es"
  }')

echo "$RESPONSE" | python3 -m json.tool

# Extraer intent y confidence
INTENT=$(echo "$RESPONSE" | grep -o '"intent":[^,]*' | cut -d: -f2 | tr -d ' "')
CONFIDENCE=$(echo "$RESPONSE" | grep -o '"confidence":[0-9.]*' | cut -d: -f2)

echo ""
echo "📊 Resultado:"
echo "   Intent detectado: $INTENT"
echo "   Confidence: $CONFIDENCE"

if [ "$INTENT" == "null" ] || [ -z "$INTENT" ]; then
    echo ""
    echo "⚠️  No se detectó intent. Posibles causas:"
    echo "   1. Los intents en DialogFlow no están entrenados"
    echo "   2. El modelo aún no se ha propagado (espera 2-3 minutos)"
    echo "   3. El nombre del intent no coincide"
    echo ""
    echo "📝 Próximos pasos:"
    echo "   1. Ve a DialogFlow Console"
    echo "   2. Verifica que los intents existan"
    echo "   3. Haz clic en 'TRAIN' (esquina superior derecha)"
    echo "   4. Espera 2-3 minutos"
    echo "   5. Prueba en el panel 'Try it now' de DialogFlow"
    echo "   6. Si funciona ahí, ejecuta este script de nuevo"
else
    echo ""
    echo "✅ DialogFlow está funcionando correctamente!"
fi

echo ""
echo "=================================="
