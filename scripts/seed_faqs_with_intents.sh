#!/usr/bin/env bash
# Script para insertar/actualizar FAQs en el API Gateway o MongoDB
# USO: ./seed_faqs_with_intents.sh [API_GATEWAY_BASE_URL] [API_TOKEN]
# Si no pasas API_GATEWAY_BASE_URL intentará usar la variable en config.js

API_URL=${1:-https://api-gateway-production-f25f.up.railway.app/api/v1}
TOKEN=${2:-}
SEED_FILE="$(dirname "$0")/../dialogflow/faqs_intents_seed.json"

if [ ! -f "$SEED_FILE" ]; then
  echo "Seed file no encontrado: $SEED_FILE"
  exit 1
fi

echo "Usando API: $API_URL"

# Loop sobre cada FAQ en el JSON y llamar al endpoint de creación/upsert
jq -c '.[]' "$SEED_FILE" | while read -r faq; do
  question=$(echo "$faq" | jq -r '.question')
  answer=$(echo "$faq" | jq -r '.answer')
  intent_name=$(echo "$faq" | jq -r '.intent_name')
  escalate=$(echo "$faq" | jq -r '.escalate')
  priority=$(echo "$faq" | jq -r '.priority')

  echo "Upsert FAQ: $question (intent: $intent_name, escalate: $escalate)"

  # Construir payload para API Gateway - adaptar campos según API real
  payload=$(jq -n \
    --arg q "$question" \
    --arg a "$answer" \
    --arg i "$intent_name" \
    --argjson e $escalate \
    --argjson p $priority \
    '{ nombre: $q, texto_chat: $a, intent_name: $i, escalate: $e, orden: $p, activo: true }')

  if [ -n "$TOKEN" ]; then
    auth_header=( -H "Authorization: Bearer $TOKEN" )
  else
    auth_header=()
  fi

  # Llamada al endpoint (POST para crear)
  curl -s ${auth_header[@]} -X POST "$API_URL/faqs" -H "Content-Type: application/json" -d "$payload" | jq .
  echo "---"
done

echo "✅ Seed completado. Revisa el API Gateway o la base de datos para confirmar."