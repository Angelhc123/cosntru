# Sistema de Agente Interactivo UPT
## Producción de un agente interactivo con procesamiento de lenguaje natural (NLP) para la optimización de procesos internos de soporte técnico

### 🏛️ Universidad Privada de Tacna (UPT)

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-red.svg)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

## 📋 Descripción del Proyecto

Sistema de microservicios desarrollado para la Universidad Privada de Tacna que implementa un agente interactivo con procesamiento de lenguaje natural (NLP) para optimizar los procesos de soporte técnico universitario.

### 🎯 Objetivos

- **Reducir tiempo de respuesta**: De 6-12 horas a menos de 60 segundos
- **Disponibilidad 24/7**: Soporte continuo para toda la comunidad universitaria
- **Automatización**: 75% de consultas frecuentes resueltas automáticamente
- **Escalamiento inteligente**: Derivación automática cuando confianza < 70%

## 🏗️ Arquitectura

### Microservicios

```
upt-chat-system/
├── services/
│   ├── api-gateway/          # 🚪 Punto de entrada centralizado
│   ├── chat-service/         # 💬 Gestión de conversaciones
│   ├── nlp-service/          # 🧠 Procesamiento de lenguaje natural
│   ├── knowledge-base-service/ # 📚 Base de conocimiento UPT
│   ├── analytics-service/    # 📊 Métricas y análisis
│   └── notification-service/ # 📧 Notificaciones automáticas
├── shared/                   # 🔧 Utilidades compartidas
└── docker/                   # 🐳 Configuración de contenedores
```

### Tecnologías

- **Backend**: Node.js + NestJS (TypeScript)
- **Base de Datos**: MongoDB Atlas
- **Arquitectura**: Clean Architecture + DDD
- **Contenedores**: Docker + Docker Compose
- **API Gateway**: Autenticación centralizada
- **NLP**: Integración con DialogFlow

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20.x o superior
- npm 9.x o superior
- MongoDB (local o Atlas)
- Docker (opcional)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd upt-chat-system
   ```

2. **Instalar dependencias**
   ```bash
   npm run install:all
   ```

3. **Configurar variables de entorno**
   ```bash
   cp services/api-gateway/.env.example services/api-gateway/.env
   # Editar .env con tus configuraciones
   ```

4. **Iniciar el API Gateway**
   ```bash
   npm run dev:api-gateway
   ```

### 🐳 Con Docker

```bash
# Construir contenedores
npm run docker:build

# Iniciar todos los servicios
npm run docker:up

# Ver logs
npm run docker:logs
```

## 📊 Estado del Desarrollo

### ✅ Completado

- [x] **API Gateway**: Estructura completa con Clean Architecture + DDD
- [x] **Entidades de Dominio**: User, ChatSession con lógica de negocio
- [x] **Repositorios**: MongoDB con esquemas optimizados
- [x] **Casos de Uso**: Gestión completa de usuarios y sesiones
- [x] **Controladores**: APIs REST con validación y documentación
- [x] **Configuración**: Environment, CORS, Rate Limiting, Swagger

### 🚧 En Progreso

- [ ] **Chat Service**: Gestión de mensajes y conversaciones
- [ ] **NLP Service**: Integración con DialogFlow
- [ ] **Knowledge Base Service**: FAQ y base de conocimiento UPT
- [ ] **Analytics Service**: Métricas en tiempo real
- [ ] **Notification Service**: Email y notificaciones

### 📋 Por Hacer

- [ ] Autenticación JWT completa
- [ ] Integración con sistema académico UPT
- [ ] Dashboard de administración
- [ ] Testing unitario e integración
- [ ] CI/CD Pipeline
- [ ] Documentación técnica completa

## 🔧 Comandos Disponibles

### API Gateway
```bash
# Desarrollo
npm run dev:api-gateway

# Producción
npm run build:api-gateway
npm run start:api-gateway

# Testing
npm run test:api-gateway

# Linting
npm run lint:api-gateway
```

### Docker
```bash
# Gestión completa
npm run docker:build    # Construir imágenes
npm run docker:up       # Iniciar servicios
npm run docker:down     # Detener servicios
npm run docker:logs     # Ver logs
```

## 📚 Documentación API

Una vez iniciado el API Gateway, la documentación Swagger estará disponible en:
- **URL**: `http://localhost:3000/api/docs`
- **Incluye**: Todos los endpoints, esquemas, ejemplos y testing interactivo

## 🏛️ Dominios del Negocio (DDD)

### 📱 Usuarios (Users Domain)
- **Entidad**: `User` - Estudiantes, docentes, administrativos
- **Servicios**: Autenticación, validación, gestión de perfiles
- **Casos de Uso**: Registro, login, validación para chat

### 💬 Sesiones de Chat (Chat Sessions Domain)
- **Entidad**: `ChatSession` - Conversaciones activas
- **Servicios**: Gestión de sesiones, métricas, escalamiento
- **Casos de Uso**: Iniciar/finalizar sesión, analíticas, limpieza

## 🎓 Especificaciones UPT

### Tipos de Usuario
- **STUDENT**: Estudiantes universitarios
- **TEACHER**: Docentes y catedráticos
- **ADMIN**: Administradores del sistema
- **STAFF**: Personal administrativo

### Reglas de Negocio
- Emails institucionales obligatorios para estudiantes/docentes
- Una sesión activa por usuario
- Escalamiento automático con confianza < 70%
- Sesiones expiran en 24 horas
- Limpieza automática de sesiones antiguas

## 👥 Equipo de Desarrollo

- **Piero Alexander Paja de la Cruz** (2020067576)
- **Angel Gadiel Hernandez Cruz** (2021070017)

**Docente**: Ricardo Eduardo Valcarcel Alvarado  
**Curso**: Construcción De Software I  
**Universidad**: Universidad Privada de Tacna

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

**Universidad Privada de Tacna** - Facultad de Ingeniería - Escuela Profesional de Ingeniería de Sistemas  
*Tacna - Perú 2025*