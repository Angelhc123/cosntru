#!/bin/bash

# ============================================
# INSTALACIÓN COMPLETA NLP SERVICE + DIALOGFLOW
# ============================================

echo "🚀 Instalando NLP Service con DialogFlow..."

# 1. Instalar dependencias Python
echo "📦 Instalando dependencias Python..."
pip install -r requirements.txt

# 2. Instalar modelo spaCy para español
echo "🧠 Instalando modelo spaCy para español..."
python -m spacy download es_core_news_sm

# 3. Verificar instalación de Google Cloud SDK
if ! command -v gcloud &> /dev/null; then
    echo "⚠️  Google Cloud SDK no encontrado"
    echo "📋 Instala desde: https://cloud.google.com/sdk/docs/install"
    echo "💡 O continúa sin DialogFlow (solo NLP local)"
else
    echo "✅ Google Cloud SDK encontrado"
fi

# 4. Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p logs
mkdir -p credentials

# 5. Verificar archivos de configuración
if [ ! -f ".env" ]; then
    echo "📝 Copiando archivo .env.example..."
    cp .env.example .env
    echo "⚠️  Edita el archivo .env con tus configuraciones"
fi

# 6. Verificar credenciales DialogFlow
if [ ! -f "credentials/dialogflow-credentials.json" ]; then
    echo "🔑 Archivo de credenciales no encontrado"
    echo "📋 Copia tu archivo de credenciales de Google Cloud a:"
    echo "   credentials/dialogflow-credentials.json"
    echo "💡 O usa el archivo .example como plantilla"
fi

# 7. Verificar instalación
echo "🧪 Probando instalación..."
python -c "
import fastapi
import spacy
print('✅ FastAPI:', fastapi.__version__)
print('✅ spaCy:', spacy.__version__)

try:
    import google.cloud.dialogflow
    print('✅ DialogFlow SDK instalado')
except ImportError:
    print('❌ DialogFlow SDK no instalado')

try:
    nlp = spacy.load('es_core_news_sm')
    print('✅ Modelo español de spaCy cargado')
except OSError:
    print('❌ Modelo español no encontrado')
"

echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo "1. 📝 Edita .env con tus configuraciones"
echo "2. 🔑 Configura credenciales DialogFlow en credentials/"
echo "3. 🚀 Ejecuta: python main.py"
echo "4. 📚 Visita: http://localhost:8001/docs"
echo ""
echo "🔗 ENDPOINTS DISPONIBLES:"
echo "• /api/v1/nlp/process-message    - Procesar mensaje (híbrido)"
echo "• /api/v1/dialogflow/status      - Estado DialogFlow"
echo "• /api/v1/dialogflow/intents     - Gestionar intents"
echo "• /docs                          - Documentación Swagger"
echo ""
echo "✅ Instalación completada!"