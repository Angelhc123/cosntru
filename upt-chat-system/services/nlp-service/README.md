# 🧠 NLP Service

## Descripción
Microservicio de procesamiento de lenguaje natural para entender y procesar las consultas de los usuarios UPT.

## Responsabilidades
- Análisis de intención (intent recognition)
- Extracción de entidades nombradas (NER)
- Integración con DialogFlow
- Clasificación de consultas por categorías UPT
- Medición de confianza en respuestas
- Escalamiento automático cuando confianza < 70%

## Stack Tecnológico Planificado
- **Framework**: Python + FastAPI
- **NLP Engine**: Google DialogFlow
- **ML Libraries**: spaCy, NLTK
- **Base de Datos**: MongoDB (logs y training data)
- **Puerto**: 3002

## Estado
📋 **PENDIENTE DE IMPLEMENTACIÓN**

## Endpoints Planificados
- `POST /api/v1/nlp/analyze` - Analizar mensaje
- `POST /api/v1/nlp/train` - Entrenar modelo
- `GET /api/v1/nlp/intents` - Listar intenciones
- `POST /api/v1/nlp/feedback` - Feedback de respuestas

## Categorías UPT
- **Académico**: Matrícula, notas, horarios
- **Técnico**: Campus virtual, sistemas
- **Administrativo**: Pagos, trámites
- **General**: Información institucional

## Integración
- **Chat Service**: Procesamiento de mensajes
- **Knowledge Base**: Búsqueda de respuestas
- **Analytics**: Métricas de precisión