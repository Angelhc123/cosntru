#!/bin/bash

# Script para generar correctamente las credenciales base64 para Railway
# Uso: ./generate_base64_credentials.sh <ruta_al_archivo_json>

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

echo "🔧 Generando base64 correctamente..."
echo "📁 Archivo fuente: $CREDENTIALS_FILE"

# Verificar que el archivo es un JSON válido
if ! python3 -m json.tool "$CREDENTIALS_FILE" > /dev/null 2>&1; then
    echo "❌ Error: El archivo no es un JSON válido"
    exit 1
fi

echo "✅ JSON válido verificado"

# Generar base64 SIN saltos de línea y con padding correcto
BASE64_CONTENT=$(base64 -w 0 "$CREDENTIALS_FILE")

# Verificar que se puede decodificar correctamente
echo "$BASE64_CONTENT" | base64 -d > /tmp/test_decode.json 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ Base64 generado correctamente y verificado"
    rm -f /tmp/test_decode.json
else
    echo "❌ Error: Falló la verificación del base64"
    exit 1
fi

echo ""
echo "📋 COPIA ESTE VALOR PARA LA VARIABLE GOOGLE_CREDENTIALS_BASE64 EN RAILWAY:"
echo "----------------------------------------"
echo "$BASE64_CONTENT"
echo "----------------------------------------"
echo ""
echo "🔄 Para configurarlo en Railway:"
echo "1. Ve a tu proyecto Railway"
echo "2. Selecciona el servicio nlp-service"
echo "3. Ve a Variables"
echo "4. Añade/edita: GOOGLE_CREDENTIALS_BASE64"
echo "5. Pega el valor de arriba (sin espacios ni saltos de línea)"
echo ""
echo "✅ Listo para usar en Railway"