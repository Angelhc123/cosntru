#!/bin/bash
set -e

echo "📦 Instalando dependencias..."

# API Gateway
echo "📦 API Gateway..."
cd upt-chat-system/services/api-gateway
npm ci
echo "🔨 Compilando API Gateway..."
npx --package=typescript tsc -p tsconfig.build.json
cd ../../..

# Analytics Service
echo "📊 Analytics Service..."
cd upt-chat-system/services/analytics-service
npm ci
echo "🔨 Compilando Analytics Service..."
npx --package=typescript tsc -p tsconfig.build.json
cd ../../..

# Notification Service
echo "📧 Notification Service..."
cd upt-chat-system/services/notification-service
npm ci
echo "🔨 Compilando Notification Service..."
npx --package=typescript tsc
cd ../../..

# NLP Service
echo "🤖 NLP Service..."
cd upt-chat-system/services/nlp-service
pip install --no-cache-dir -r requirements.txt
cd ../../..

echo "✅ Todas las dependencias instaladas y compiladas"
