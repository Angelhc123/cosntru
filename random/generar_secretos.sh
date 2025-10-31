#!/bin/bash

echo "🔐 GENERADOR DE SECRETOS SEGUROS PARA RAILWAY"
echo "=============================================="
echo ""

echo "🔑 JWT_SECRET (Usar el mismo en TODOS los servicios):"
JWT_SECRET=$(openssl rand -hex 32)
echo "$JWT_SECRET"
echo ""

echo "🔐 SESSION_SECRET (Solo Frontend PHP):"
SESSION_SECRET=$(openssl rand -base64 24)
echo "$SESSION_SECRET"
echo ""

echo "🔗 WEBHOOK_SECRET (Solo Notification Service):"
WEBHOOK_SECRET=$(openssl rand -hex 16)
echo "$WEBHOOK_SECRET"
echo ""

echo "💾 Guarda estos valores de forma segura:"
echo "========================================"
echo "JWT_SECRET=$JWT_SECRET"
echo "SESSION_SECRET=$SESSION_SECRET"
echo "WEBHOOK_SECRET=$WEBHOOK_SECRET"
echo ""

echo "⚠️  IMPORTANTE: El JWT_SECRET debe ser IDÉNTICO en todos los servicios"
echo "📋 Copia estos valores a las variables de entorno de Railway"