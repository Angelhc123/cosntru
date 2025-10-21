#!/bin/bash

# Test del webhook de DialogFlow con flujo conversacional
# Simula las requests que DialogFlow envía al webhook

WEBHOOK_URL="https://pentangular-laree-floggingly.ngrok-free.dev/webhook"
SESSION="projects/test-project/agent/sessions/test-session-123"

echo "═══════════════════════════════════════════════════════════"
echo "  🧪 TEST DEL FLUJO CONVERSACIONAL RF004"
echo "═══════════════════════════════════════════════════════════"
echo ""

# ============================================================================
# TEST 1: Usuario dice "olvidé mi contraseña" (SIN email)
# ============================================================================
echo "📝 TEST 1: Usuario dice 'Olvidé mi contraseña'"
echo "─────────────────────────────────────────────────────────────"

REQUEST1='{
  "responseId": "test-response-1",
  "queryResult": {
    "queryText": "Olvidé mi contraseña",
    "intent": {
      "name": "projects/test-project/agent/intents/password-recovery",
      "displayName": "Contraseña Olvidada"
    },
    "parameters": {},
    "outputContexts": []
  },
  "session": "'$SESSION'"
}'

echo "Enviando request..."
RESPONSE1=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$REQUEST1")

echo "✅ Respuesta del webhook:"
echo "$RESPONSE1" | jq -r '.fulfillmentText'
echo ""
echo "🔄 Contextos creados:"
echo "$RESPONSE1" | jq -r '.outputContexts[]?.name // "Ninguno"'
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Esperar un momento
sleep 2

# ============================================================================
# TEST 2: Usuario responde con su email
# ============================================================================
echo "📝 TEST 2: Usuario responde 'juan.perez@gmail.com'"
echo "─────────────────────────────────────────────────────────────"

REQUEST2='{
  "responseId": "test-response-2",
  "queryResult": {
    "queryText": "juan.perez@gmail.com",
    "intent": {
      "name": "projects/test-project/agent/intents/default-fallback",
      "displayName": "Default Fallback Intent"
    },
    "parameters": {
      "email": "juan.perez@gmail.com"
    },
    "outputContexts": [
      {
        "name": "'$SESSION'/contexts/awaiting-email",
        "lifespanCount": 2,
        "parameters": {
          "email": "juan.perez@gmail.com"
        }
      }
    ]
  },
  "session": "'$SESSION'"
}'

echo "Enviando request con contexto 'awaiting-email'..."
RESPONSE2=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$REQUEST2")

echo "✅ Respuesta del webhook:"
echo "$RESPONSE2" | jq -r '.fulfillmentText'
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================================================
# TEST 3: Usuario da email desde el inicio
# ============================================================================
echo "📝 TEST 3: Usuario dice 'Olvidé mi contraseña, mi email es maria.lopez@hotmail.com'"
echo "─────────────────────────────────────────────────────────────"

REQUEST3='{
  "responseId": "test-response-3",
  "queryResult": {
    "queryText": "Olvidé mi contraseña, mi email es maria.lopez@hotmail.com",
    "intent": {
      "name": "projects/test-project/agent/intents/password-recovery",
      "displayName": "Contraseña Olvidada"
    },
    "parameters": {
      "email": "maria.lopez@hotmail.com"
    },
    "outputContexts": []
  },
  "session": "'$SESSION'-2"
}'

echo "Enviando request con email incluido..."
RESPONSE3=$(curl -s -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$REQUEST3")

echo "✅ Respuesta del webhook:"
echo "$RESPONSE3" | jq -r '.fulfillmentText'
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "✨ Tests completados!"
echo ""
echo "📊 Puedes ver más detalles en:"
echo "   • ngrok dashboard: http://localhost:4040"
echo "   • Logs NLP Service: tail -f upt-chat-system/services/nlp-service/nlp-service.log"
