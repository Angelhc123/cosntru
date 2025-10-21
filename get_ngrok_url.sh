#!/bin/bash

# Script para obtener la URL de ngrok
echo "🔍 Obteniendo URL de ngrok..."
echo ""

# Esperar un momento para que ngrok inicie completamente
sleep 2

# Obtener la URL HTTPS de ngrok
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | jq -r '.tunnels[0].public_url' 2>/dev/null)

if [ -z "$NGROK_URL" ] || [ "$NGROK_URL" = "null" ]; then
    echo "❌ No se pudo obtener la URL de ngrok"
    echo ""
    echo "Verifica que ngrok esté corriendo:"
    echo "  ps aux | grep ngrok"
    echo ""
    echo "Si no está corriendo, inícialo con:"
    echo "  ngrok http 8001"
    exit 1
fi

echo "✅ ngrok está corriendo!"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    URL DE NGROK                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  🌐 URL pública: $NGROK_URL"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║          USAR EN DIALOGFLOW                                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  📋 URL del Webhook:"
echo "  $NGROK_URL/webhook"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "📝 PASOS EN DIALOGFLOW:"
echo ""
echo "1. Ve a: https://dialogflow.cloud.google.com"
echo "2. Selecciona tu agente"
echo "3. Click en 'Fulfillment' (menú izquierdo)"
echo "4. Activa el toggle 'Webhook'"
echo "5. Pega esta URL en el campo 'URL':"
echo ""
echo "   $NGROK_URL/webhook"
echo ""
echo "6. Click en 'SAVE'"
echo ""
echo "7. Ve al intent 'Contraseña Olvidada'"
echo "8. Scroll down hasta 'Fulfillment'"
echo "9. Activa: 'Enable webhook call for this intent'"
echo "10. Click en 'SAVE'"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "🧪 PROBAR EL WEBHOOK:"
echo ""
echo "curl $NGROK_URL/webhook/health"
echo ""

# Guardar la URL en un archivo temporal para uso posterior
echo "$NGROK_URL" > /tmp/ngrok_url.txt
echo "💾 URL guardada en: /tmp/ngrok_url.txt"
echo ""
