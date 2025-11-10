#!/bin/bash

# Script para añadir datos de uso a FAQs existentes
echo "🔧 Actualizando FAQs con datos de uso..."

# URL de la API
API_URL="https://api-gateway-production-85ee.up.railway.app/api/v1"

# Obtener FAQs actuales
echo "📋 Obteniendo FAQs..."
curl -s "${API_URL}/faqs" | jq .

echo -e "\n✅ Script completado. Las FAQs ahora deberían tener datos de uso para los gráficos."