# 📚 Knowledge Base Service

## Descripción
Microservicio de gestión de la base de conocimiento UPT, incluyendo FAQs, documentos y respuestas automáticas.

## Responsabilidades
- Gestión de FAQs categorizadas
- Búsqueda semántica de respuestas
- Administración de contenido UPT
- Versionado de respuestas
- Análisis de efectividad de respuestas
- Sugerencias de nuevas FAQs

## Stack Tecnológico Planificado
- **Framework**: NestJS + TypeScript
- **Búsqueda**: Elasticsearch o MongoDB Atlas Search
- **Base de Datos**: MongoDB
- **Almacenamiento**: AWS S3 o local para documentos
- **Puerto**: 3003

## Estado
📋 **PENDIENTE DE IMPLEMENTACIÓN**

## Endpoints Planificados
- `GET /api/v1/kb/search` - Búsqueda de respuestas
- `POST /api/v1/kb/faqs` - Crear FAQ
- `PUT /api/v1/kb/faqs/:id` - Actualizar FAQ
- `GET /api/v1/kb/categories` - Listar categorías
- `POST /api/v1/kb/documents` - Subir documentos
- `GET /api/v1/kb/analytics` - Estadísticas de uso

## Categorías UPT
- **Académico**: Matrícula, certificados, notas
- **Financiero**: Pagos, becas, pensiones
- **Técnico**: Campus virtual, correo, WiFi
- **Administrativo**: Trámites, horarios de oficina
- **Bienestar**: Servicios estudiantiles, salud

## Integración
- **NLP Service**: Búsqueda inteligente
- **Chat Service**: Respuestas automáticas
- **Analytics**: Métricas de efectividad