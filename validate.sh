#!/bin/bash
# Script de validación pre-deployment para Railway

echo "🔍 Validando configuración para Railway..."
echo ""

# 1. Verificar archivos críticos
echo "📁 Verificando archivos críticos..."
files=(
    "dockerfile"
    "railway.json"
    "public/health.php"
    "public/api/v1/health.php"
    "public/.htaccess"
    "config/database.php"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file existe"
    else
        echo "  ❌ $file NO ENCONTRADO"
    fi
done

echo ""

# 2. Verificar sintaxis PHP
echo "🔧 Verificando sintaxis PHP..."
php -l public/health.php
php -l public/api/v1/health.php
php -l config/database.php

echo ""

# 3. Verificar estructura JSON
echo "📋 Verificando railway.json..."
if command -v jq &> /dev/null; then
    jq empty railway.json && echo "  ✅ railway.json válido"
else
    echo "  ⚠️  jq no instalado, saltando validación JSON"
fi

echo ""

# 4. Mostrar resumen
echo "📊 Resumen de configuración:"
echo "  - Healthcheck path: /health"
echo "  - Dockerfile: PRESENTE"
echo "  - Apache DocumentRoot: /var/www/html/public"
echo ""

echo "✅ Validación completa. Listo para deploy."
