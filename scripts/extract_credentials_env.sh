#!/bin/bash

# Script para extraer campos individuales del JSON de credenciales para Railway
# Uso: ./extract_credentials_env.sh <ruta_al_archivo_json>

set -e

if [ $# -eq 0 ]; then
    echo "❌ Error: Debes proporcionar la ruta al archivo JSON de credenciales"
    echo "Uso: $0 <ruta_al_archivo_json>"
    echo "Ejemplo: $0 /home/desci/Documentos/todo/upt-chat-fhps-32542378a9cb.json"
    exit 1
fi

CREDENTIALS_FILE="$1"

if [ ! -f "$CREDENTIALS_FILE" ]; then
    echo "❌ Error: El archivo $CREDENTIALS_FILE no existe"
    exit 1
fi

echo "🔧 Extrayendo credenciales individuales para Railway..."
echo "📁 Archivo fuente: $CREDENTIALS_FILE"

# Verificar que el archivo es un JSON válido
if ! python3 -m json.tool "$CREDENTIALS_FILE" > /dev/null 2>&1; then
    echo "❌ Error: El archivo no es un JSON válido"
    exit 1
fi

echo "✅ JSON válido verificado"
echo ""

# Extraer cada campo usando jq
echo "📋 VARIABLES PARA CONFIGURAR EN RAILWAY:"
echo "========================================"
echo ""

echo "GOOGLE_PROJECT_ID:"
jq -r '.project_id' "$CREDENTIALS_FILE"
echo ""

echo "GOOGLE_CLIENT_EMAIL:"
jq -r '.client_email' "$CREDENTIALS_FILE"
echo ""

echo "GOOGLE_PRIVATE_KEY_ID:"
jq -r '.private_key_id' "$CREDENTIALS_FILE"
echo ""

echo "GOOGLE_CLIENT_ID:"
jq -r '.client_id' "$CREDENTIALS_FILE"
echo ""

echo "GOOGLE_PRIVATE_KEY (CUIDADO - esta es larga):"
echo "----------------------------------------"
jq -r '.private_key' "$CREDENTIALS_FILE"
echo "----------------------------------------"
echo ""

echo "🔄 Para configurar en Railway:"
echo "1. Ve a tu proyecto Railway → nlp-service → Variables"
echo "2. Añade cada variable con su valor correspondiente"
echo "3. IMPORTANTE: Para GOOGLE_PRIVATE_KEY copia todo incluyendo:"
echo "   -----BEGIN PRIVATE KEY----- y -----END PRIVATE KEY-----"
echo ""
echo "✅ Más simple y confiable que base64!"