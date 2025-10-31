#!/bin/bash
set -e

echo "📦 Instalando dependencias y compilando servicios..."

# Frontend PHP
echo "🔨 Instalando dependencias del Frontend PHP..."
cd proyectotest
if [ -f "composer.json" ]; then
    composer install --no-dev --optimize-autoloader
    echo "✅ Dependencias PHP instaladas"
else
    echo "⚠️  No se encontró composer.json, omitiendo instalación de dependencias PHP"
fi
cd ..

# Microservicios Node.js
echo "🔨 Instalando dependencias de microservicios..."

# API Gateway
if [ -d "upt-chat-system/services/api-gateway" ]; then
    echo "📡 Instalando API Gateway..."
    cd upt-chat-system/services/api-gateway
    npm ci --only=production
    echo "🏗️  Compilando API Gateway..."
    npm run build
    echo "✅ API Gateway listo"
    cd ../../..
else
    echo "⚠️  API Gateway no encontrado"
fi

# Analytics Service
if [ -d "upt-chat-system/services/analytics-service" ]; then
    echo "📊 Instalando Analytics Service..."
    cd upt-chat-system/services/analytics-service
    npm ci --only=production
    if [ -f "tsconfig.build.json" ]; then
        npm run build
        echo "✅ Analytics Service compilado"
    else
        echo "✅ Analytics Service listo"
    fi
    cd ../../..
else
    echo "⚠️  Analytics Service no encontrado"
fi

# Notification Service
if [ -d "upt-chat-system/services/notification-service" ]; then
    echo "📱 Instalando Notification Service..."
    cd upt-chat-system/services/notification-service
    npm ci --only=production
    if [ -f "tsconfig.build.json" ]; then
        npm run build
        echo "✅ Notification Service compilado"
    else
        echo "✅ Notification Service listo"
    fi
    cd ../../..
else
    echo "⚠️  Notification Service no encontrado"
fi

echo "✅ Setup completado - Todos los servicios listos para Railway"
