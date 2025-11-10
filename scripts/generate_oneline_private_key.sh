#!/bin/bash

# Script para generar la private key en formato de UNA SOLA LÍNEA para Railway
# Esto evita problemas con saltos de línea

set -e

if [ $# -eq 0 ]; then
    echo "❌ Error: Debes proporcionar la ruta al archivo JSON de credenciales"
    echo "Uso: $0 <ruta_al_archivo_json>"
    exit 1
fi

CREDENTIALS_FILE="$1"

if [ ! -f "$CREDENTIALS_FILE" ]; then
    echo "❌ Error: El archivo $CREDENTIALS_FILE no existe"
    exit 1
fi

echo "🔧 Generando private key en formato de línea única para Railway..."
echo "📁 Archivo fuente: $CREDENTIALS_FILE"

# Extraer la private key y convertirla a una sola línea con \n literales
PRIVATE_KEY_ONELINE=$(jq -r '.private_key' "$CREDENTIALS_FILE" | sed ':a;N;$!ba;s/\n/\\n/g')

echo ""
echo "📋 VARIABLE GOOGLE_PRIVATE_KEY para Railway (formato de una línea):"
echo "================================================================="
echo "$PRIVATE_KEY_ONELINE"
echo "================================================================="
echo ""
echo "🔄 Copia esta línea COMPLETA como valor de GOOGLE_PRIVATE_KEY en Railway"
echo "✅ Este formato evita problemas con saltos de línea"