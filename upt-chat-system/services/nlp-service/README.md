# 🧠 NLP Service con DialogFlow

## Descripción
Microservicio híbrido de procesamiento de lenguaje natural que combina **Google DialogFlow** como motor primario y **NLP local** como fallback para procesar consultas de usuarios UPT.

## 🎯 Características Principales
- **NLP Híbrido**: DialogFlow + spaCy local
- **Alta Disponibilidad**: Fallback automático si DialogFlow falla
- **Configuración Flexible**: Habilitar/deshabilitar DialogFlow dinámicamente
- **37 archivos Python** con arquitectura DDD + Clean Architecture
- **20 intents categorizados** específicos para UPT
- **40 FAQs** con información real de la universidad

## 🏗️ Arquitectura
- **Primary**: Google DialogFlow (confianza > 70%)
- **Fallback**: NLP Local con spaCy + scikit-learn
- **Framework**: FastAPI + Pydantic
- **Persistencia**: JSON files (intents + FAQs)

## 🚀 Estado Actual
✅ **COMPLETAMENTE IMPLEMENTADO** (100%)
- ✅ DialogFlow Service integrado
- ✅ Hybrid NLP Service funcional
- ✅ API REST completa con 12+ endpoints
- ✅ Arquitectura DDD + Clean Architecture
- ✅ Docker ready + documentación completa

## 🔗 Endpoints Implementados

### **Core NLP (Híbrido)**
- `POST /api/v1/nlp/process-message` - Procesar mensaje (DialogFlow + Local)
- `POST /api/v1/nlp/detect-intent` - Detectar intención
- `POST /api/v1/nlp/search-knowledge` - Búsqueda semántica
- `GET /api/v1/nlp/health` - Estado del servicio

### **DialogFlow específico**
- `GET /api/v1/dialogflow/status` - Estado de DialogFlow
- `POST /api/v1/dialogflow/detect-intent` - Solo DialogFlow
- `GET /api/v1/dialogflow/intents` - Listar intents
- `POST /api/v1/dialogflow/intents` - Crear intent
- `POST /api/v1/dialogflow/train` - Entrenar agente

### **Administración**
- `GET /api/v1/admin/intents` - Gestionar intents locales
- `GET /api/v1/admin/faqs` - Gestionar FAQs
- `POST /api/v1/admin/reset-data` - Resetear datos

## 📊 Categorías UPT Implementadas
- **inscripciones**: Matrícula y registro
- **horarios**: Clases y calendarios
- **notas**: Calificaciones y promedios
- **pagos**: Pensiones y aranceles
- **biblioteca**: Servicios bibliotecarios
- **tramites**: Documentos y certificados
- **contacto**: Información de contacto
- **campus_virtual**: Plataformas digitales

## 🔄 Integración con Microservicios
- **API Gateway**: Enrutamiento centralizado
- **Chat Service**: Procesamiento de mensajes en tiempo real
- **Knowledge Base**: Consulta de FAQ ampliada
- **Analytics**: Métricas de confianza y uso

## ⚡ Inicio Rápido

```bash
# 1. Instalar dependencias
pip install -r requirements.txt
python -m spacy download es_core_news_sm

# 2. Configurar DialogFlow (opcional)
# Ver DIALOGFLOW_SETUP.md para guía completa

# 3. Configurar ambiente
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Ejecutar servicio
python main.py

# 5. Documentación
http://localhost:8001/docs
```

## 📚 Documentación Adicional
- **[DIALOGFLOW_SETUP.md](DIALOGFLOW_SETUP.md)** - Guía completa de DialogFlow
- **[AVANCE_7_README.md](../../docs/avances/AVANCE_7_README.md)** - Documentación técnica detallada