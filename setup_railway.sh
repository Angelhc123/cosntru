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
echo "📥 Instalando paquetes Python específicos..."
python3 -m pip install --no-cache-dir spacy python-multipart python-dotenv
echo "📥 Descargando modelo spaCy..."
python3 -m spacy download es_core_news_sm
cd ../../..

echo "✅ Todas las dependencias instaladas y compiladas"
