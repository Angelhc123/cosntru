#!/bin/bash
set -e

echo "📦 Instalando dependencias del Frontend PHP..."

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

echo "✅ Setup completado - Servicios se compilarán en Railway por separado"
