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
echo "✅ Paquetes Python ya instalados via Nix"
echo "📥 Verificando spaCy..."
python3 -c "import spacy; print('spaCy funciona correctamente')"
echo "📥 Descargando modelo de spaCy..."
python3 -c "
import spacy
import subprocess
import sys
try:
    nlp = spacy.load('es_core_news_sm')
    print('Modelo es_core_news_sm ya existe')
except OSError:
    print('Descargando modelo es_core_news_sm...')
    subprocess.check_call([sys.executable, '-m', 'spacy', 'download', 'es_core_news_sm'])
"
cd ../../..

echo "✅ Todas las dependencias instaladas y compiladas"
