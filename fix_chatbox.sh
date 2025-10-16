#!/bin/bash

# Script para configurar y probar el chatbox rápidamente
# Creado: 15 de octubre de 2025

echo "======================================"
echo "  🔧 CONFIGURACIÓN RÁPIDA CHATBOX"
echo "======================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Configurar NLP Service para usar FAQs locales
echo "📝 Paso 1: Configurando NLP Service..."
cd upt-chat-system/services/nlp-service

# Crear backup del .env
if [ -f .env ]; then
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
    echo "   ✅ Backup de .env creado"
fi

# Desactivar DialogFlow temporalmente
if grep -q "USE_DIALOGFLOW=True" .env; then
    sed -i 's/USE_DIALOGFLOW=True/USE_DIALOGFLOW=False/' .env
    echo "   ✅ DialogFlow desactivado (usando FAQs locales)"
else
    echo "   ⚠️  USE_DIALOGFLOW ya estaba en False"
fi

echo ""
echo "📊 Paso 2: Verificando datos locales..."

# Verificar intents.json
if [ -f data/intents.json ]; then
    INTENT_COUNT=$(grep -o '"id"' data/intents.json | wc -l)
    echo "   ✅ Intents disponibles: $INTENT_COUNT"
else
    echo "   ❌ No se encontró data/intents.json"
    exit 1
fi

# Verificar faqs.json
if [ -f data/faqs.json ]; then
    FAQ_COUNT=$(grep -o '"id"' data/faqs.json | wc -l)
    echo "   ✅ FAQs disponibles: $FAQ_COUNT"
else
    echo "   ❌ No se encontró data/faqs.json"
    exit 1
fi

echo ""
echo "🔄 Paso 3: Reiniciando NLP Service..."

# Buscar proceso del NLP Service
NLP_PID=$(ps aux | grep '[u]vicorn main:app' | grep '8001' | awk '{print $2}')

if [ ! -z "$NLP_PID" ]; then
    echo "   🛑 Deteniendo proceso anterior (PID: $NLP_PID)..."
    kill $NLP_PID
    sleep 2
fi

echo "   🚀 Iniciando NLP Service en modo FAQs locales..."
echo ""
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
echo -e "${YELLOW}  Iniciando en segundo plano...${NC}"
echo -e "${YELLOW}  Ver logs: tail -f logs/nlp-service.log${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
echo ""

# Iniciar en background
nohup uvicorn main:app --reload --port 8001 > nlp-service.log 2>&1 &
NLP_NEW_PID=$!

sleep 3

# Verificar que inició correctamente
if ps -p $NLP_NEW_PID > /dev/null; then
    echo -e "   ${GREEN}✅ NLP Service corriendo (PID: $NLP_NEW_PID)${NC}"
else
    echo -e "   ${RED}❌ Error al iniciar NLP Service${NC}"
    echo "   Ver logs: cat nlp-service.log"
    exit 1
fi

echo ""
echo "🧪 Paso 4: Probando el servicio..."

# Esperar un poco más para que el servicio esté listo
sleep 2

# Test básico
RESPONSE=$(curl -s -X POST http://localhost:8001/api/v1/nlp/process \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hola",
    "session_id": "test-123",
    "language": "es"
  }')

if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "   ${GREEN}✅ NLP Service responde correctamente${NC}"
    echo ""
    echo "📋 Respuesta de ejemplo:"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
else
    echo -e "   ${RED}❌ Error en la respuesta del servicio${NC}"
    echo "   Respuesta: $RESPONSE"
fi

echo ""
echo "======================================"
echo "  ✅ CONFIGURACIÓN COMPLETADA"
echo "======================================"
echo ""
echo -e "${GREEN}El chatbox ahora usará FAQs locales${NC}"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Abre http://localhost:8000 en tu navegador"
echo "   2. Haz login (usuario: demo, contraseña: demo123)"
echo "   3. Prueba el chatbox con estos mensajes:"
echo "      • 'Hola'"
echo "      • '¿Cuándo son las inscripciones?'"
echo "      • '¿Cuánto cuesta la matrícula?'"
echo "      • '¿Dónde veo mi horario?'"
echo ""
echo "📊 Monitorear logs:"
echo "   tail -f logs/nlp-service.log"
echo ""
echo "🔄 Restaurar DialogFlow:"
echo "   sed -i 's/USE_DIALOGFLOW=False/USE_DIALOGFLOW=True/' .env"
echo "   kill $NLP_NEW_PID && uvicorn main:app --reload --port 8001"
echo ""
echo "======================================"
