#!/bin/bash

WEBHOOK_URL="https://pentangular-laree-floggingly.ngrok-free.dev/webhook"
SESSION="projects/test-project/agent/sessions/real-test-$(date +%s)"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🧪 TEST REAL CON USUARIOS DE PRUEBA                    ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "📧 Usuarios de prueba:"
echo "   1. xxdescixx@gmail.com"
echo "   2. angelxhernandezxcruz@gmail.com"
echo ""

# TEST 1: Inicio del flujo
echo "───────────────────────────────────────────────────────────"
echo "📝 TEST 1: Usuario dice 'Olvidé mi contraseña'"
echo "───────────────────────────────────────────────────────────"

REQUEST1='{
  "responseId": "real-test-1",
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

RESPONSE1=$(curl -s -X POST "$WEBHOOK_URL" -H "Content-Type: application/json" -d "$REQUEST1")
echo "✅ Bot responde:"
echo "$RESPONSE1" | jq -r '.fulfillmentText'
echo ""

sleep 2

# TEST 2: Usuario da email válido
echo "───────────────────────────────────────────────────────────"
echo "📝 TEST 2: Usuario responde 'xxdescixx@gmail.com'"
echo "───────────────────────────────────────────────────────────"

REQUEST2='{
  "responseId": "real-test-2",
  "queryResult": {
    "queryText": "xxdescixx@gmail.com",
    "intent": {
      "name": "projects/test-project/agent/intents/default-fallback",
      "displayName": "Default Fallback Intent"
    },
    "parameters": {
      "email": "xxdescixx@gmail.com"
    },
    "outputContexts": [
      {
        "name": "'$SESSION'/contexts/awaiting-email",
        "lifespanCount": 2,
        "parameters": {
          "email": "xxdescixx@gmail.com"
        }
      }
    ]
  },
  "session": "'$SESSION'"
}'

RESPONSE2=$(curl -s -X POST "$WEBHOOK_URL" -H "Content-Type: application/json" -d "$REQUEST2")
echo "✅ Bot responde:"
echo "$RESPONSE2" | jq -r '.fulfillmentText'
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✨ Tests completados - Verifica las respuestas arriba  ║"
echo "╚══════════════════════════════════════════════════════════╝"
