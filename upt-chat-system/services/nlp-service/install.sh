#!/bin/bash

# Script de instalación rápida para NLP Service

echo "🚀 Instalando NLP Service..."

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "📥 Instalando dependencias..."
pip install --upgrade pip
pip install -r requirements.txt

# Descargar modelo de spaCy
echo "🤖 Descargando modelo de spaCy..."
python -m spacy download es_core_news_sm

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "⚙️  Creando archivo .env..."
    cp .env.example .env
fi

# Crear directorio de logs
mkdir -p logs

echo "✅ Instalación completa!"
echo ""
echo "Para iniciar el servicio ejecuta:"
echo "  source venv/bin/activate"
echo "  python main.py"
echo ""
echo "O con uvicorn:"
echo "  uvicorn main:app --reload --port 8001"
