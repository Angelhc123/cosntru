#!/bin/bash

# 🚀 GUÍA RÁPIDA: CONFIGURAR NGROK PARA DIALOGFLOW WEBHOOK

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║        🌐 CONFIGURACIÓN NGROK PARA DIALOGFLOW                 ║"
echo "║          DialogFlow requiere HTTPS (no HTTP)                  ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# OPCIÓN 1: INSTALAR NGROK (RECOMENDADO)
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 OPCIÓN 1: INSTALAR NGROK (Gratis, Fácil, Seguro)
═══════════════════════════════════════════════════════════════

ngrok crea un túnel HTTPS desde internet hacia tu localhost.
DialogFlow podrá conectarse a tu NLP Service local de forma segura.

PASO 1: Descargar ngrok
----------------------------
Visita: https://ngrok.com/download

O descarga directamente con wget:

# Para Linux:
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/

PASO 2: Registrarse (gratis)
----------------------------
1. Ve a: https://dashboard.ngrok.com/signup
2. Crea una cuenta (puedes usar Gmail)
3. Copia tu authtoken desde: https://dashboard.ngrok.com/get-started/your-authtoken

PASO 3: Configurar authtoken
----------------------------
ngrok config add-authtoken TU_TOKEN_AQUI

PASO 4: Iniciar túnel HTTPS
----------------------------
# Exponer puerto 8001 (NLP Service)
ngrok http 8001

Verás algo como:

┌────────────────────────────────────────────────────────────┐
│ Session Status  │ online                                   │
│ Forwarding      │ https://abc123.ngrok.io -> localhost:8001│
└────────────────────────────────────────────────────────────┘

PASO 5: Copiar URL HTTPS
----------------------------
En DialogFlow Fulfillment, usar:
https://abc123.ngrok.io/webhook
                    ^^^^^^^^ Tu URL única

EOF

# ============================================================================
# OPCIÓN 2: USAR LOCALTUNNEL (Alternativa sin registro)
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 OPCIÓN 2: LOCALTUNNEL (Sin registro, pero menos estable)
═══════════════════════════════════════════════════════════════

PASO 1: Instalar localtunnel
----------------------------
npm install -g localtunnel

PASO 2: Exponer puerto 8001
----------------------------
lt --port 8001

Te dará una URL como:
https://random-name-123.loca.lt

PASO 3: En DialogFlow usar:
https://random-name-123.loca.lt/webhook

⚠️ ADVERTENCIA: La URL cambia cada vez que reinicias localtunnel

EOF

# ============================================================================
# OPCIÓN 3: DESPLEGAR EN SERVIDOR CON SSL (Producción)
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 OPCIÓN 3: SERVIDOR CON HTTPS (Para producción)
═══════════════════════════════════════════════════════════════

Si tienes un servidor (DigitalOcean, AWS, Railway, etc.):

OPCIÓN 3A: Railway (Gratis con GitHub)
----------------------------
1. Sube tu código a GitHub
2. Conecta con Railway (https://railway.app)
3. Railway genera automáticamente HTTPS
4. URL será: https://tu-app.railway.app/webhook

OPCIÓN 3B: Nginx con Let's Encrypt
----------------------------
1. Servidor con IP pública
2. Instalar Nginx
3. Configurar certificado SSL con certbot
4. Proxy reverso hacia puerto 8001

EOF

# ============================================================================
# COMANDOS RÁPIDOS PARA PROBAR
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 🧪 COMANDOS DE PRUEBA
═══════════════════════════════════════════════════════════════

1. Iniciar NLP Service:
----------------------------
cd /home/desci/Documentos/constru/upt-chat-system/services/nlp-service
python main.py

2. En OTRA terminal, iniciar ngrok:
----------------------------
ngrok http 8001

3. Copiar la URL HTTPS que aparece (ejemplo):
----------------------------
https://abc123.ngrok.io

4. En DialogFlow Fulfillment → Webhook URL:
----------------------------
https://abc123.ngrok.io/webhook

5. Probar que funciona:
----------------------------
curl https://abc123.ngrok.io/webhook/health

Deberías ver:
{
  "status": "healthy",
  "service": "nlp-service-webhook",
  "api_gateway_url": "http://localhost:3000"
}

EOF

# ============================================================================
# SCRIPT DE INSTALACIÓN AUTOMÁTICA DE NGROK
# ============================================================================

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo " ¿Quieres que instale ngrok automáticamente? (y/n)"
echo "═══════════════════════════════════════════════════════════════"
read -r respuesta

if [ "$respuesta" = "y" ] || [ "$respuesta" = "Y" ]; then
    echo ""
    echo "📥 Descargando ngrok..."
    
    cd /tmp
    wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
    
    if [ $? -eq 0 ]; then
        echo "✅ ngrok descargado"
        
        tar xzf ngrok-v3-stable-linux-amd64.tgz
        sudo mv ngrok /usr/local/bin/
        
        echo "✅ ngrok instalado en /usr/local/bin/ngrok"
        echo ""
        echo "📝 SIGUIENTE PASO:"
        echo "1. Regístrate en: https://dashboard.ngrok.com/signup"
        echo "2. Copia tu authtoken"
        echo "3. Ejecuta: ngrok config add-authtoken TU_TOKEN"
        echo "4. Ejecuta: ngrok http 8001"
        echo ""
    else
        echo "❌ Error descargando ngrok"
        echo "Descarga manualmente desde: https://ngrok.com/download"
    fi
else
    echo ""
    echo "OK, puedes instalarlo manualmente siguiendo los pasos de arriba."
    echo ""
fi

# ============================================================================
# RESUMEN FINAL
# ============================================================================

cat << 'EOF'
═══════════════════════════════════════════════════════════════
 📋 RESUMEN: PARA USAR DIALOGFLOW CON LOCALHOST
═══════════════════════════════════════════════════════════════

DialogFlow REQUIERE HTTPS (no acepta http://localhost)

✅ SOLUCIÓN RÁPIDA: ngrok
1. Instalar ngrok
2. Ejecutar: ngrok http 8001
3. Copiar URL HTTPS: https://abc123.ngrok.io
4. En DialogFlow: https://abc123.ngrok.io/webhook

⚠️ IMPORTANTE:
- Mantén ngrok corriendo mientras pruebas
- La URL gratuita cambia cada vez que reinicias ngrok
- Para URL permanente: ngrok plan de pago ($10/mes)

🔄 FLUJO COMPLETO:

Terminal 1: ProyectoTest
cd /home/desci/Documentos/constru/proyectotest
php -S localhost:8000

Terminal 2: API Gateway
cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway
npm run start:dev

Terminal 3: NLP Service
cd /home/desci/Documentos/constru/upt-chat-system/services/nlp-service
python main.py

Terminal 4: ngrok
ngrok http 8001

Luego en DialogFlow:
- Fulfillment → Webhook URL: https://tu-ngrok-url.ngrok.io/webhook
- Save

EOF

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo " 📚 Documentación completa en:"
echo " /home/desci/Documentos/constru/PASOS_CONFIGURACION_WEBHOOK.md"
echo "═══════════════════════════════════════════════════════════════"
echo ""
