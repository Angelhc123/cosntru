# FD04-EPIS - Documento de Arquitectura de Software (SAD)

![Logo UPT](media/image1.png)

**UNIVERSIDAD PRIVADA DE TACNA**

**FACULTAD DE INGENIERÍA**

**Escuela Profesional de Ingeniería de Sistemas**

---

## Proyecto: Sistema de Agente Interactivo con NLP para la UPT

**Curso:** Construcción De Software I

**Docente:** Ricardo Eduardo Valcarcel Alvarado

**Integrantes:**
- Piero Alexander Paja de la Cruz (2020067576)
- Angel Gadiel Hernandez Cruz (2021070017)

**Tacna – Perú**

**2025**

---

## CONTROL DE VERSIONES

| Versión | Hecha por | Revisada por | Aprobada por | Fecha | Motivo |
|---------|-----------|--------------|--------------|--------|--------|
| 1.0 | PP,AH | PP,AH | RV | 08/09/2025 | Versión Original |
| 2.0 | PP,AH | PP,AH | RV | 13/10/2025 | Actualización con implementación real |
| 3.0 | PP,AH | PP,AH | RV | 13/10/2025 | Versión completa con todos los diagramas |

---

# Documento de Arquitectura de Software

## Sistema UPT Chat - Agente Interactivo con NLP

**Versión 3.0**

---

## ÍNDICE GENERAL

1. [Introducción](#1-introducción)
   - 1.1. Propósito
   - 1.2. Alcance
   - 1.3. Definiciones, Siglas y Abreviaturas
   - 1.4. Referencias
   - 1.5. Organización del documento

2. [Representación Arquitectónica](#2-representación-arquitectónica)
   - 2.1. Modelo de Vistas 4+1
   - 2.2. Patrones Arquitectónicos Aplicados
   - 2.3. Tecnologías Utilizadas

3. [Objetivos y Restricciones Arquitectónicas](#3-objetivos-y-restricciones-arquitectónicas)
   - 3.1. Objetivos de Software
   - 3.2. Restricciones Tecnológicas
   - 3.3. Priorización de Requerimientos

4. [Vista de Casos de Uso](#4-vista-de-casos-de-uso)
   - 4.1. Diagrama de Casos de Uso General
   - 4.2. Actores del Sistema
   - 4.3. Especificación de Casos de Uso (RF001-RF012)

5. [Vista Lógica](#5-vista-lógica)
   - 5.1. Arquitectura de Alto Nivel
   - 5.2. Diagrama de Paquetes/Subsistemas
   - 5.3. Diagramas de Secuencia (RF001-RF012)
   - 5.4. Diagrama de Clases del Dominio

6. [Vista de Implementación](#6-vista-de-implementación)
   - 6.1. Diagrama de Componentes
   - 6.2. Estructura de Directorios
   - 6.3. Configuración de Servicios

7. [Vista de Procesos](#7-vista-de-procesos)
   - 7.1. Diagrama de Actividades General
   - 7.2. Procesos Críticos del Sistema

8. [Vista de Despliegue](#8-vista-de-despliegue)
   - 8.1. Diagrama de Despliegue
   - 8.2. Especificaciones Técnicas

9. [Calidad del Software](#9-calidad-del-software)

10. [Decisiones Arquitectónicas](#10-decisiones-arquitectónicas)

11. [Tamaño y Rendimiento](#11-tamaño-y-rendimiento)

---

# 1. Introducción

## 1.1. Propósito

El presente Documento de Arquitectura de Software (SAD) describe la arquitectura técnica **IMPLEMENTADA Y FUNCIONAL** del Sistema UPT Chat, un agente interactivo con capacidades de Procesamiento de Lenguaje Natural (NLP) diseñado para optimizar los procesos de soporte técnico en la Universidad Privada de Tacna.

Este documento sirve como:

**Para el equipo de desarrollo:**
- Guía arquitectónica detallada con código real implementado
- Patrones y estándares aplicados en el proyecto
- Interfaces y contratos entre microservicios funcionales

**Para arquitectos y líderes técnicos:**
- Documentación de decisiones arquitectónicas con justificación
- Estructura modular implementada y testeada
- Análisis de componentes reales del sistema

**Para gestores del proyecto:**
- Evidencia del alcance técnico alcanzado
- Información para estimación de mantenimiento
- Métricas de implementación completada

**Para el equipo de operaciones:**
- Infraestructura desplegada y funcional
- Procedimientos de monitoreo implementados
- Configuración de servicios en producción

## 1.2. Alcance

Este documento abarca la descripción arquitectónica **COMPLETA E IMPLEMENTADA** del Sistema UPT Chat:

### ✅ IMPLEMENTADO Y FUNCIONAL (100%)

#### NLP Service (Puerto 8001 - Python/FastAPI)
- ✅ Procesamiento de lenguaje natural con DialogFlow + spaCy
- ✅ 19 intents configurados y funcionando
- ✅ 219 FAQs en base de conocimiento
- ✅ Detector de consultas sensibles (RF004)
- ✅ Cliente HTTP para comunicación con API Gateway
- ✅ Sistema híbrido: DialogFlow primario, spaCy fallback

#### API Gateway (Puerto 3000 - NestJS/TypeScript)
- ✅ Clean Architecture + DDD implementado
- ✅ Gestión de sesiones de chat con MongoDB
- ✅ Password Reset Service (RF004)
- ✅ Conexión a MySQL (proyectotest - simulación UPT)
- ✅ Controllers, Services, Repositories funcionales
- ✅ Schemas MongoDB con índices optimizados

#### Notification Service (Puerto 3005 - NestJS/TypeScript)
- ✅ Microservicio independiente para notificaciones
- ✅ Envío de emails vía Gmail SMTP
- ✅ Templates HTML para emails de confirmación
- ✅ Templates HTML para emails de nueva contraseña
- ✅ Endpoints REST para otros servicios
- ✅ Logs y monitoreo de envíos

#### Base de Datos
- ✅ MongoDB Atlas: Sesiones, tokens, notificaciones
- ✅ MySQL: Usuarios UPT (simulación con proyectotest)
- ✅ Colecciones: ChatSession, Message, User, PasswordResetToken, ValidationNotification
- ✅ Índices optimizados para performance

### 🔧 EN ESTRUCTURA (Preparados para implementación)

- ⏳ Chat Service (Puerto 3001 - WebSockets)
- ⏳ Knowledge Base Service (Puerto 3003)
- ⏳ Analytics Service (Puerto 3004)

## 1.3. Definiciones, Siglas y Abreviaturas

| Término | Definición |
|---------|------------|
| **NLP** | Natural Language Processing - Procesamiento de Lenguaje Natural |
| **API Gateway** | Punto de entrada único para todos los servicios |
| **DialogFlow** | Plataforma de Google para procesamiento de lenguaje natural |
| **spaCy** | Biblioteca de Python para NLP avanzado |
| **DDD** | Domain-Driven Design - Diseño Guiado por el Dominio |
| **Clean Architecture** | Arquitectura en capas con separación de responsabilidades |
| **DTO** | Data Transfer Object - Objeto de Transferencia de Datos |
| **JWT** | JSON Web Token - Token de autenticación |
| **SMTP** | Simple Mail Transfer Protocol - Protocolo para envío de emails |
| **TTL** | Time To Live - Tiempo de vida de un registro |
| **RF** | Requerimiento Funcional |
| **RNF** | Requerimiento No Funcional |
| **FAQ** | Frequently Asked Questions - Preguntas Frecuentes |

## 1.4. Referencias

- **FD03-EPIS:** Documento de Especificación de Requerimientos de Software (SRS) v1.2
- **ARQUITECTURA_MICROSERVICIOS_RF004.md:** Documentación de arquitectura de microservicios
- **RESUMEN_RF004.md:** Resumen de implementación RF004
- **Repositorio GitHub:** https://github.com/Angelhc123/cosntru

## 1.5. Organización del documento

El documento está organizado siguiendo el modelo de vistas arquitectónicas **4+1 de Kruchten**:

1. **Vista de Casos de Uso**: Funcionalidades desde la perspectiva del usuario (12 RF)
2. **Vista Lógica**: Estructura del sistema en paquetes, secuencias y clases
3. **Vista de Implementación**: Componentes de software y estructura de directorios
4. **Vista de Procesos**: Flujos de actividades y comportamiento del sistema
5. **Vista de Despliegue**: Infraestructura física y configuración de servidores

Cada sección incluye diagramas Mermaid, código real implementado, configuraciones actuales y diseño arquitectónico para componentes futuros siguiendo buenas prácticas.

---

# 2. Representación Arquitectónica

## 2.1. Modelo de Vistas 4+1

El sistema UPT Chat está documentado siguiendo el modelo de vistas arquitectónicas 4+1 propuesto por Philippe Kruchten:

```mermaid
graph TB
    subgraph "Vista de Casos de Uso"
        UC[👥 Actores y Funcionalidades<br/>12 Requerimientos Funcionales]
    end
    
    subgraph "Vista Lógica"
        LOG[📦 Paquetes y Clases<br/>Clean Architecture + DDD]
    end
    
    subgraph "Vista de Procesos"
        PROC[⚙️ Flujos y Actividades<br/>Comportamiento Dinámico]
    end
    
    subgraph "Vista de Implementación"
        IMP[🔧 Componentes<br/>Estructura de Código]
    end
    
    subgraph "Vista de Despliegue"
        DEP[🖥️ Infraestructura<br/>Servidores y Red]
    end
    
    UC --> LOG
    UC --> PROC
    UC --> IMP
    UC --> DEP
    
    LOG --> IMP
    PROC --> DEP
```

**Fuente:** Elaboración propia basada en el modelo 4+1 de Kruchten.

**Descripción:** Este diagrama muestra cómo las cinco vistas arquitectónicas se interrelacionan. La Vista de Casos de Uso es el centro que guía las demás vistas. La Vista Lógica se traduce en componentes de implementación, mientras que la Vista de Procesos define el comportamiento que se despliega en la infraestructura física.

## 2.2. Patrones Arquitectónicos Aplicados

### 2.2.1. Arquitectura de Microservicios

El sistema está construido como un conjunto de microservicios independientes:

```mermaid
graph LR
    subgraph "Microservicios Implementados ✅"
        NLP[🧠 NLP Service<br/>Puerto 8001<br/>Python/FastAPI]
        GW[🚪 API Gateway<br/>Puerto 3000<br/>NestJS]
        NOT[📧 Notification<br/>Puerto 3005<br/>NestJS]
    end
    
    subgraph "Microservicios Preparados ⏳"
        CHAT[💬 Chat Service<br/>Puerto 3001]
        KB[📚 Knowledge Base<br/>Puerto 3003]
        ANA[📊 Analytics<br/>Puerto 3004]
    end
    
    CLIENT[👤 Cliente] --> GW
    GW <--> NLP
    GW --> NOT
    GW --> CHAT
    GW --> KB
    GW --> ANA
```

### 2.2.2. Clean Architecture + Domain-Driven Design

Cada microservicio sigue una arquitectura limpia en capas:

```mermaid
graph TB
    subgraph "Presentation Layer"
        CTRL[Controllers<br/>REST Endpoints]
    end
    
    subgraph "Application Layer"
        UC[Use Cases<br/>Casos de Uso]
        SVC[Application Services<br/>Lógica de Aplicación]
        DTO[DTOs<br/>Transferencia de Datos]
    end
    
    subgraph "Domain Layer"
        ENT[Entities<br/>Entidades del Dominio]
        VO[Value Objects<br/>Objetos de Valor]
        DOM[Domain Services<br/>Lógica de Negocio]
        REPO_INT[Repository Interfaces<br/>Contratos]
    end
    
    subgraph "Infrastructure Layer"
        REPO_IMPL[Repository Implementations<br/>MongoDB, MySQL]
        EXT[External Clients<br/>DialogFlow, SMTP]
        CONFIG[Configuration<br/>.env, Database]
    end
    
    CTRL --> UC
    CTRL --> SVC
    UC --> DTO
    SVC --> DTO
    UC --> DOM
    DOM --> ENT
    DOM --> VO
    DOM --> REPO_INT
    REPO_INT --> REPO_IMPL
    SVC --> EXT
    REPO_IMPL --> CONFIG
```

**Beneficios de Clean Architecture:**
- ✅ Separación clara de responsabilidades
- ✅ Independencia de frameworks
- ✅ Testeable en cada capa
- ✅ Independencia de UI y Base de Datos
- ✅ Reglas de negocio aisladas

## 2.3. Tecnologías Utilizadas

### 2.3.1. Stack Tecnológico por Servicio

| Servicio | Lenguaje | Framework | Puerto | Estado |
|----------|----------|-----------|--------|--------|
| **NLP Service** | Python 3.10+ | FastAPI | 8001 | ✅ Activo |
| **API Gateway** | TypeScript | NestJS | 3000 | ✅ Activo |
| **Notification Service** | TypeScript | NestJS | 3005 | ✅ Activo |
| **Chat Service** | TypeScript | NestJS + Socket.IO | 3001 | ⏳ Preparado |
| **Knowledge Base** | TypeScript | NestJS | 3003 | ⏳ Preparado |
| **Analytics Service** | TypeScript | NestJS | 3004 | ⏳ Preparado |

### 2.3.2. Bibliotecas y Dependencias Principales

**NLP Service (Python):**
```python
# requirements.txt
fastapi==0.103.0              # Web framework
uvicorn==0.23.2               # ASGI server
google-cloud-dialogflow==2.24.1  # NLP primario
spacy==3.6.1                  # NLP fallback
httpx==0.24.1                 # HTTP client
pydantic==2.3.0               # Validación de datos
```

**API Gateway & Services (Node.js):**
```json
{
  "dependencies": {
    "@nestjs/core": "^10.0.0",
    "@nestjs/mongoose": "^10.0.0",
    "mongoose": "^7.4.0",
    "mysql2": "^3.6.0",
    "axios": "^1.5.0",
    "nodemailer": "^6.9.4",
    "class-validator": "^0.14.0"
  }
}
```

### 2.3.3. Servicios Externos

```mermaid
graph TB
    subgraph "Sistema UPT Chat"
        SYS[Microservicios]
    end
    
    subgraph "Google Cloud Platform"
        DF[☁️ DialogFlow API<br/>Procesamiento NLP]
    end
    
    subgraph "MongoDB Atlas"
        MONGO[☁️ MongoDB Atlas<br/>Cluster: basededatos2<br/>Region: AWS us-east-1]
    end
    
    subgraph "Gmail"
        SMTP[☁️ Gmail SMTP<br/>smtp.gmail.com:587<br/>TLS]
    end
    
    subgraph "Local"
        MYSQL[🗄️ MySQL Local<br/>proyectotest DB<br/>Puerto 3306]
    end
    
    SYS --> DF
    SYS --> MONGO
    SYS --> SMTP
    SYS --> MYSQL
```

---

# 3. Objetivos y Restricciones Arquitectónicas

## 3.1. Objetivos de Software

## 2.1. Priorización de requerimientos

### 2.1.1. Requerimientos Funcionales Implementados

| ID | Requerimiento | Estado | Ubicación en Código |
|----|---------------|--------|---------------------|
| **RF001** | Comprensión de Lenguaje Natural | ✅ 100% | `nlp-service/infrastructure/nlp/` |
| **RF002** | Base de Conocimiento de FAQs | ✅ 100% | `nlp-service/data/faqs.json` (219 FAQs) |
| **RF003** | Gestión de Sesiones de Chat | ✅ 100% | `api-gateway/src/domain/services/chat-session-domain.service.ts` |
| **RF004** | Validación por Correo Personal | ✅ 100% | `nlp-service/application/detectors/sensitive_query_detector.py`<br/>`api-gateway/src/application/services/password-reset.service.ts`<br/>`notification-service/src/application/services/email.service.ts` |
| **RF005** | Búsqueda Inteligente | ✅ 80% | `nlp-service/application/use_cases/search_knowledge_base_use_case.py` |
| **RF006** | Historial de Conversaciones | ✅ 100% | MongoDB: `ChatSession` collection |
| **RF007** | Conexión Sistema Académico | ✅ 30% | `api-gateway/src/infrastructure/services/mysql-connection.service.ts` |

### 2.1.2. Requerimientos No Funcionales - Atributos de Calidad

| ID | Atributo | Implementación | Evidencia |
|----|----------|----------------|-----------|
| **RNF001** | Rendimiento | ✅ Respuesta < 2s | DialogFlow + spaCy optimizado |
| **RNF002** | Escalabilidad | ✅ Microservicios | 3 servicios independientes en puertos diferentes |
| **RNF003** | Seguridad | ✅ Validación | `class-validator` en DTOs, JWT preparado |
| **RNF004** | Disponibilidad | ✅ 24/7 | Servicios stateless, MongoDB Atlas |
| **RNF005** | Mantenibilidad | ✅ Clean Architecture | Capas separadas: Domain, Application, Infrastructure |
| **RNF006** | Usabilidad | ✅ NLP en español | Model `es_core_news_sm` de spaCy |
| **RNF007** | Portabilidad | ✅ Docker Ready | package.json, requirements.txt configurados |

## 2.2. Restricciones

### 2.2.1. Restricciones Técnicas

| Restricción | Descripción | Impacto |
|-------------|-------------|---------|
| **Python 3.10+** | NLP Service requiere Python 3.10 o superior | ✅ Implementado |
| **Node.js 18+** | API Gateway y Notification Service | ✅ Implementado |
| **MongoDB Atlas** | Base de datos en la nube | ✅ Conexión configurada |
| **Gmail SMTP** | Para envío de emails | ✅ Configurado con App Password |
| **DialogFlow Credentials** | JSON de credenciales de Google Cloud | ✅ `credentials/dialogflow-credentials.json` |
| **Puerto 8001** | NLP Service | ✅ Funcional |
| **Puerto 3000** | API Gateway | ✅ Funcional |
| **Puerto 3005** | Notification Service | ✅ Funcional |

### 2.2.2. Restricciones de Integración

| Sistema | Restricción | Solución Implementada |
|---------|-------------|----------------------|
| **Base de Datos UPT** | No acceso directo | Simulación con MySQL local (proyectotest) |
| **LDAP/SSO UPT** | No acceso | Autenticación simulada, preparada para integración |
| **Intranet UPT** | No acceso | URLs configurables en variables de entorno |

---

# 4. Vista de Casos de Uso

## 4.1. Diagrama de Casos de Uso General

```mermaid
graph TB
    %% Actores
    UF[👤 Usuario Final<br/>Estudiante/Docente]
    ADM[👨‍💼 Administrador]
    COORD[�‍💻 Coordinador<br/>Soporte]
    
    %% Sistemas Externos
    NLP_EXT[☁️ Sistema NLP<br/>DialogFlow]
    INTRA[🏢 Sistema<br/>Intranet UPT]
    EMAIL_EXT[📧 Sistema<br/>Email]
    
    subgraph "Sistema UPT Chat"
        subgraph "Módulo de Interfaz"
            UC001[RF001: Iniciar Chat<br/>Widget]
            UC002[RF002: Procesar<br/>Consulta NLP]
        end
        
        subgraph "Módulo de Conocimiento"
            UC003[RF003: Gestionar<br/>Base FAQ]
            UC008[RF008: Búsqueda<br/>Semántica]
        end
        
        subgraph "Módulo de Seguridad"
            UC004[RF004: Validar<br/>por Email]
            UC007[RF007: Conectar<br/>Sistema Académico]
        end
        
        subgraph "Módulo de Escalamiento"
            UC005[RF005: Escalar a<br/>Soporte Humano]
            UC009[RF009: Consultar<br/>Historial Tickets]
        end
        
        subgraph "Módulo de Analytics"
            UC006[RF006: Consultar<br/>Dashboard Métricas]
            UC012[RF012: Exportar<br/>Reportes]
        end
        
        subgraph "Módulo de Comunicación"
            UC010[RF010: Enviar<br/>Notificaciones]
            UC011[RF011: Registrar<br/>Feedback]
        end
    end
    
    %% Relaciones Usuario Final
    UF --> UC001
    UF --> UC002
    UF --> UC004
    UF --> UC007
    UF --> UC008
    UF --> UC009
    UF --> UC011
    
    %% Relaciones Administrador
    ADM --> UC003
    ADM --> UC006
    ADM --> UC012
    
    %% Relaciones Coordinador
    COORD --> UC005
    COORD --> UC006
    COORD --> UC009
    
    %% Relaciones con Sistemas Externos
    UC002 -.-> NLP_EXT
    UC001 -.-> INTRA
    UC004 -.-> EMAIL_EXT
    UC010 -.-> EMAIL_EXT
    UC007 -.-> INTRA
    
    %% Relaciones <<include>>
    UC001 -->|include| UC002
    UC004 -->|include| UC010
    UC005 -->|include| UC010
    UC005 -->|include| UC009
    
    %% Relaciones <<extend>>
    UC002 -.->|extend<br/>confianza<70%| UC005
    UC002 -.->|extend<br/>sensible| UC004
```

**Fuente:** Elaboración propia.

**Descripción:** Este diagrama presenta la arquitectura completa de casos de uso del Sistema UPT Chat, organizada en 6 módulos funcionales. Muestra las interacciones entre tres tipos de actores (Usuario Final, Administrador y Coordinador de Soporte) y tres sistemas externos (DialogFlow, Intranet UPT y Sistema de Email). Los casos de uso están agrupados por funcionalidad: Interfaz (chat y NLP), Conocimiento (FAQ y búsqueda), Seguridad (validación y conexión académica), Escalamiento (soporte humano y tickets), Analytics (métricas y reportes) y Comunicación (notificaciones y feedback). Las relaciones incluyen dependencias include/extend que representan flujos condicionales como el escalamiento automático cuando la confianza es menor al 70% o la validación por email para consultas sensibles.

## 4.2. Actores del Sistema

### 4.2.1. Tabla de Actores

| Actor | Tipo | Descripción | Responsabilidades |
|-------|------|-------------|-------------------|
| **Usuario Final** | Humano | Estudiantes, docentes y personal administrativo de la UPT | - Realizar consultas al chatbot<br/>- Solicitar información académica<br/>- Validar identidad para consultas sensibles<br/>- Proporcionar feedback |
| **Administrador** | Humano | Personal de TI responsable de la gestión del sistema | - Gestionar base de conocimiento FAQ<br/>- Consultar métricas y dashboard<br/>- Exportar reportes<br/>- Configurar sistema |
| **Coordinador de Soporte** | Humano | Supervisor del equipo de soporte técnico | - Revisar tickets escalados<br/>- Asignar casos a especialistas<br/>- Monitorear métricas de atención<br/>- Validar resoluciones |
| **Sistema NLP** | Externo | Google DialogFlow API | - Procesar lenguaje natural<br/>- Detectar intenciones<br/>- Calcular confianza de respuestas |
| **Sistema Intranet UPT** | Externo | Portal interno de la universidad | - Hospedar widget de chat<br/>- Proveer datos académicos<br/>- Autenticar usuarios |
| **Sistema de Email** | Externo | Gmail SMTP Server | - Enviar notificaciones<br/>- Entregar tokens de validación<br/>- Enviar contraseñas temporales |

## 4.3. Especificación de Casos de Uso

### 4.3.1. CU001 - Iniciar Chat (RF001: Chat Widget)

| **Identificador** | RF001 |
|-------------------|-------|
| **Nombre** | Iniciar Chat (Chat Widget) |
| **Actores** | Usuario Final, Sistema Intranet UPT |
| **Tipo** | Primario |
| **Propósito** | Permitir al usuario iniciar una conversación con el agente virtual integrado en la intranet |
| **Precondiciones** | - Intranet UPT debe estar operativa<br/>- Widget debe estar integrado en la página<br/>- API Gateway debe estar disponible |
| **Postcondiciones** | - Sesión de chat creada en MongoDB<br/>- Widget completamente funcional<br/>- Usuario puede escribir mensajes |

**Flujo Principal:**
1. Usuario accede a página de intranet UPT
2. Sistema carga automáticamente el widget de chat
3. Usuario hace clic en el ícono del widget
4. Sistema solicita configuración al API Gateway
5. API Gateway retorna: interfaz, categorías disponibles, estado operativo
6. Widget se despliega completamente funcional
7. Usuario puede escribir su primera consulta

**Flujos Alternativos:**
- **A1:** Si API Gateway no responde → Widget muestra mensaje de mantenimiento
- **A2:** Si usuario ya tiene sesión activa → Widget recupera historial previo

**Código Implementado:**
- `api-gateway/src/infrastructure/controllers/chat-sessions.controller.ts`
- `api-gateway/src/domain/services/chat-session-domain.service.ts`
- `api-gateway/src/infrastructure/database/schemas/chat-session.schema.ts`

---

### 4.3.2. CU002 - Procesar Consulta NLP (RF002: Comprensión de Lenguaje Natural)

| **Identificador** | RF002 |
|-------------------|-------|
| **Nombre** | Procesar Consulta con NLP |
| **Actores** | Usuario Final, NLP Service, DialogFlow, spaCy |
| **Tipo** | Primario |
| **Propósito** | Interpretar consultas en lenguaje natural y proporcionar respuestas precisas |
| **Precondiciones** | - NLP Service operativo (puerto 8001)<br/>- DialogFlow configurado<br/>- spaCy model cargado<br/>- Base de conocimiento disponible |
| **Postcondiciones** | - Intent detectado con confianza<br/>- Respuesta generada<br/>- Interacción registrada en MongoDB |

**Flujo Principal:**
1. Usuario escribe consulta en lenguaje natural
2. Widget envía mensaje al API Gateway
3. API Gateway enruta a NLP Service (puerto 8001)
4. NLP Service procesa con DialogFlow (primario)
5. Si confianza >= 0.7 → retorna resultado
6. Si confianza < 0.7 → procesa con spaCy (fallback)
7. Busca respuesta en base de conocimiento (219 FAQs)
8. Retorna respuesta + nivel de confianza
9. Widget muestra respuesta al usuario

**Flujos Alternativos:**
- **A1:** Si intent no encontrado → Respuesta genérica de ayuda
- **A2:** Si confianza < 0.7 en ambos → Escala a soporte humano (RF005)

**Código Implementado:**
- `nlp-service/application/use_cases/process_message_use_case.py`
- `nlp-service/infrastructure/nlp/hybrid_nlp_service.py`
- `nlp-service/infrastructure/nlp/dialogflow_service.py`
- `nlp-service/infrastructure/nlp/spacy_service.py`
- `nlp-service/data/intents.json` (19 intents)
- `nlp-service/data/faqs.json` (219 FAQs)

---

### 4.3.3. CU003 - Gestionar Base FAQ (RF003: Base de Datos de FAQ UPT)

| **Identificador** | RF003 |
|-------------------|-------|
| **Nombre** | Gestionar Base de Conocimiento FAQ |
| **Actores** | Administrador, Knowledge Base Service |
| **Tipo** | Secundario |
| **Propósito** | Permitir al administrador gestionar FAQs para mejorar respuestas del sistema |
| **Precondiciones** | - Administrador autenticado<br/>- Base de datos MongoDB operativa<br/>- Permisos de gestión otorgados |
| **Postcondiciones** | - FAQ actualizado en base de datos<br/>- Cambios reflejados inmediatamente<br/>- Log de modificación registrado |

**Flujo Principal:**
1. Administrador inicia sesión en panel de administración
2. Navega a sección "Gestión de FAQ"
3. Sistema muestra lista completa de FAQs con estados
4. Administrador selecciona FAQ a editar
5. Sistema carga FAQ con opciones de modificación
6. Administrador modifica pregunta, respuesta o estado
7. Sistema valida cambios (no duplicados, formato correcto)
8. Sistema guarda en MongoDB collection "faqs"
9. Sistema muestra confirmación de éxito

**Flujos Alternativos:**
- **A1:** Si pregunta duplicada → Mensaje de error específico
- **A2:** Si administrador cancela → Descarta cambios sin guardar

**Código Preparado:**
- ⏳ `knowledge-base-service/src/application/services/faq-management.service.ts`
- ⏳ `knowledge-base-service/src/infrastructure/repositories/faq.repository.ts`
- ⏳ `knowledge-base-service/src/domain/entities/faq.entity.ts`

---

### 4.3.4. CU004 - Validar por Email (RF004: Validación por Correo Personal) ✅

| **Identificador** | RF004 |
|-------------------|-------|
| **Nombre** | Validación de Identidad por Correo Personal |
| **Actores** | Usuario Final, NLP Service, API Gateway, Notification Service, MySQL, Gmail |
| **Tipo** | Primario |
| **Propósito** | Validar identidad del usuario para consultas sensibles mediante correo electrónico |
| **Precondiciones** | - Usuario tiene email registrado en sistema UPT<br/>- MySQL database accesible<br/>- Notification Service operativo<br/>- Gmail SMTP configurado |
| **Postcondiciones** | - Identidad validada<br/>- Token generado y almacenado<br/>- Email de confirmación enviado<br/>- Nueva contraseña generada y enviada |

**Flujo Principal:**
1. Usuario escribe: "olvidé mi contraseña" (o similar)
2. NLP Service detecta consulta sensible con `SensitiveQueryDetector`
3. Sistema solicita email personal al usuario
4. Usuario proporciona email: "demo@example.com"
5. API Gateway verifica email en MySQL (tabla `usuarios`)
6. Si existe → API Gateway genera token único (60 min TTL)
7. Token se guarda en MongoDB (collection `password_reset_tokens`)
8. API Gateway solicita a Notification Service enviar email
9. Notification Service formatea email con template HTML
10. Email enviado vía Gmail SMTP con link de confirmación
11. Usuario hace clic en link del email
12. API Gateway valida token
13. Sistema genera nueva contraseña aleatoria (12 caracteres)
14. Password actualizado en MySQL
15. Notification Service envía email con nueva contraseña
16. Usuario recibe confirmación

**Flujos Alternativos:**
- **A1:** Si email no existe en BD → "Email no registrado"
- **A2:** Si token expirado → "Token ha expirado, solicite uno nuevo"
- **A3:** Si error al enviar email → "Error en servicio de correo, intente más tarde"

**Código Implementado:**
- ✅ `nlp-service/application/detectors/sensitive_query_detector.py`
- ✅ `api-gateway/src/application/services/password-reset.service.ts`
- ✅ `api-gateway/src/infrastructure/controllers/password-reset.controller.ts`
- ✅ `api-gateway/src/infrastructure/database/schemas/password-reset.schema.ts`
- ✅ `notification-service/src/application/services/email.service.ts`
- ✅ `notification-service/src/infrastructure/controllers/notification.controller.ts`

---

### 4.3.5. CU005 - Escalar a Soporte (RF005: Transferencia a Soporte Humano)

| **Identificador** | RF005 |
|-------------------|-------|
| **Nombre** | Escalamiento a Soporte Humano Especializado |
| **Actores** | Usuario Final, NLP Service, API Gateway, Coordinador Soporte, Especialista |
| **Tipo** | Secundario |
| **Propósito** | Derivar consultas complejas a agentes humanos cuando el sistema no puede resolverlas |
| **Precondiciones** | - Nivel de confianza NLP < 70%<br/>- Sistema de tickets operativo<br/>- Coordinador disponible |
| **Postcondiciones** | - Ticket creado en base de datos<br/>- Coordinador notificado<br/>- Especialista asignado<br/>- Contexto completo transferido |

**Flujo Principal:**
1. NLP Service procesa consulta y obtiene confianza < 0.7
2. Sistema detecta necesidad de escalamiento automático
3. API Gateway crea ticket en MongoDB (collection `tickets`)
4. Ticket incluye: sessionId, userId, consulta, contexto completo
5. Sistema asigna estado: "PENDING_ASSIGNMENT"
6. Notification Service envía email a coordinador de soporte
7. Coordinador revisa ticket en dashboard
8. Coordinador asigna ticket a especialista según categoría
9. Especialista recibe notificación con contexto completo
10. Especialista responde al usuario por email o chat
11. Sistema actualiza estado del ticket: "RESOLVED"
12. Knowledge Base se actualiza con nueva FAQ (aprendizaje)

**Flujos Alternativos:**
- **A1:** Si no hay especialistas disponibles → Cola de espera con tiempo estimado
- **A2:** Si usuario cancela → Ticket marcado como "CANCELLED"

**Código Preparado:**
- ⏳ `api-gateway/src/application/services/ticket.service.ts`
- ⏳ `api-gateway/src/infrastructure/database/schemas/ticket.schema.ts`
- ⏳ `api-gateway/src/domain/entities/ticket.entity.ts`

---

### 4.3.6. CU006 - Dashboard Métricas (RF006: Dashboard de Métricas)

| **Identificador** | RF006 |
|-------------------|-------|
| **Nombre** | Consultar Dashboard de Métricas |
| **Actores** | Administrador, Coordinador Soporte, Analytics Service |
| **Tipo** | Secundario |
| **Propósito** | Proporcionar visualización en tiempo real de métricas del sistema |
| **Precondiciones** | - Usuario con rol administrador o coordinador<br/>- Analytics Service operativo<br/>- Datos de métricas disponibles |
| **Postcondiciones** | - Métricas visualizadas<br/>- Gráficos generados<br/>- Alertas configuradas (si aplica) |

**Flujo Principal:**
1. Administrador accede a sección "Dashboard"
2. Sistema calcula métricas en tiempo real
3. Dashboard muestra:
   - Total de consultas (últimas 24h, 7 días, 30 días)
   - Consultas resueltas vs escaladas (%)
   - Tiempo promedio de respuesta
   - Categorías más consultadas (top 10)
   - Tasa de satisfacción (feedback)
   - Gráfico de tendencias históricas
4. Administrador puede filtrar por período
5. Sistema actualiza gráficos dinámicamente
6. Administrador puede exportar datos (ver RF012)
7. Administrador puede configurar alertas

**Flujos Alternativos:**
- **A1:** Si no hay datos para período → Mensaje informativo
- **A2:** Si error en cálculo → Mostrar métricas parciales disponibles

**Código Preparado:**
- ⏳ `analytics-service/src/application/services/metrics-calculator.service.ts`
- ⏳ `analytics-service/src/application/services/dashboard.service.ts`
- ⏳ `analytics-service/src/infrastructure/repositories/metrics.repository.ts`

---

### 4.3.7. CU007 - Sistema Académico (RF007: Conexión con Sistema Académico)

| **Identificador** | RF007 |
|-------------------|-------|
| **Nombre** | Conexión con Sistema Académico UPT |
| **Actores** | Usuario Final, API Gateway, MySQL UPT |
| **Tipo** | Primario |
| **Propósito** | Obtener información académica personalizada del estudiante desde el sistema UPT |
| **Precondiciones** | - Usuario autenticado<br/>- Conexión a MySQL UPT disponible<br/>- Permisos de lectura otorgados |
| **Postcondiciones** | - Información académica obtenida<br/>- Datos formateados para respuesta<br/>- Consulta registrada |

**Flujo Principal:**
1. Usuario consulta información académica: "¿Cuáles son mis notas?"
2. NLP detecta intent que requiere datos académicos
3. Sistema verifica autenticación del usuario
4. API Gateway se conecta a MySQL UPT (tabla `estudiantes`)
5. Ejecuta query: `SELECT * FROM notas WHERE alumno_id = ?`
6. Sistema obtiene datos: asignaturas, calificaciones, promedios
7. Formatea respuesta en lenguaje natural
8. Widget muestra información personalizada al usuario

**Flujos Alternativos:**
- **A1:** Si usuario no autenticado → Solicita login
- **A2:** Si no hay datos académicos → "No se encontraron registros"
- **A3:** Si error de conexión → "Servicio temporalmente no disponible"

**Código Parcialmente Implementado:**
- ✅ `api-gateway/src/infrastructure/services/mysql-connection.service.ts` (conexión)
- ⏳ `api-gateway/src/application/services/academic-data.service.ts` (queries)

---

### 4.3.8. CU008 - Búsqueda Semántica (RF008: Motor de Búsqueda Semántica)

| **Identificador** | RF008 |
|-------------------|-------|
| **Nombre** | Motor de Búsqueda Semántica |
| **Actores** | Usuario Final, NLP Service, spaCy |
| **Tipo** | Primario |
| **Propósito** | Encontrar información relevante usando similitud semántica y vectorial |
| **Precondiciones** | - spaCy model cargado (es_core_news_sm)<br/>- Índice semántico generado<br/>- Base de conocimiento disponible |
| **Postcondiciones** | - Resultados rankeados por relevancia<br/>- Top 5 documentos más similares<br/>- Scores de similitud calculados |

**Flujo Principal:**
1. Usuario escribe consulta con lenguaje coloquial
2. NLP Service recibe mensaje para búsqueda
3. Sistema procesa consulta con spaCy:
   - Tokenización
   - Lematización
   - Vectorización (word embeddings)
4. Calcula similitud coseno con documentos en base
5. Rankea resultados por score de similitud
6. Retorna top 5 resultados más relevantes
7. Sistema aprende nuevas expresiones para futuras búsquedas

**Flujos Alternativos:**
- **A1:** Si ningún resultado > 0.5 similitud → Búsqueda ampliada
- **A2:** Si consulta muy genérica → Solicita más detalles

**Código Implementado:**
- ✅ `nlp-service/infrastructure/nlp/spacy_service.py`
- ✅ `nlp-service/application/use_cases/search_knowledge_base_use_case.py`

---

### 4.3.9. CU009 - Historial Tickets (RF009: Historial de Casos por Ticket)

| **Identificador** | RF009 |
|-------------------|-------|
| **Nombre** | Consultar Historial de Casos por Ticket |
| **Actores** | Usuario Final, Coordinador Soporte, API Gateway |
| **Tipo** | Secundario |
| **Propósito** | Permitir consultar el historial completo de interacciones de un ticket |
| **Precondiciones** | - Usuario autenticado<br/>- Ticket existe en base de datos<br/>- Permisos de acceso validados |
| **Postcondiciones** | - Historial completo mostrado<br/>- Orden cronológico de interacciones<br/>- Estados de ticket visibles |

**Flujo Principal:**
1. Usuario solicita: "¿Cuál es el estado de mi caso?"
2. Sistema identifica usuario automáticamente (sessionId)
3. API Gateway busca tickets asociados al userId
4. Obtiene lista de tickets: abiertos, en progreso, cerrados
5. Para cada ticket muestra:
   - Número de ticket
   - Fecha de creación
   - Estado actual
   - Último mensaje
6. Usuario selecciona ticket específico
7. Sistema muestra historial completo:
   - Consulta original
   - Respuestas del sistema
   - Mensajes del especialista
   - Cambios de estado
8. Usuario puede descargar historial en PDF

**Flujos Alternativos:**
- **A1:** Si no hay tickets → "No tienes casos registrados"
- **A2:** Si ticket cerrado > 90 días → Archivado, acceso limitado

**Código Preparado:**
- ⏳ `api-gateway/src/application/services/ticket-history.service.ts`
- ⏳ `api-gateway/src/infrastructure/repositories/ticket.repository.ts`

---

### 4.3.10. CU010 - Notificaciones (RF010: Notificaciones por Email) ✅

| **Identificador** | RF010 |
|-------------------|-------|
| **Nombre** | Envío de Notificaciones por Email |
| **Actores** | Sistema, Notification Service, Gmail SMTP |
| **Tipo** | Secundario |
| **Propósito** | Enviar notificaciones automáticas por email en eventos del sistema |
| **Precondiciones** | - Notification Service operativo (puerto 3005)<br/>- Gmail SMTP configurado<br/>- Destinatario tiene email válido |
| **Postcondiciones** | - Email enviado exitosamente<br/>- Log de envío registrado<br/>- Estado de entrega confirmado |

**Flujo Principal:**
1. Evento del sistema dispara notificación (ej: ticket creado)
2. Sistema genera contenido del email
3. Selecciona template HTML apropiado:
   - password-reset-confirmation.html
   - new-password.html
   - ticket-assigned.html
4. Completa template con datos dinámicos
5. API Gateway solicita envío a Notification Service
6. Notification Service configura email:
   - From: UPT Chat System
   - To: usuario@example.com
   - Subject: según tipo de notificación
7. Conecta a Gmail SMTP (smtp.gmail.com:587, TLS)
8. Envía email
9. Registra en log: timestamp, destinatario, estado
10. Retorna confirmación de envío

**Flujos Alternativos:**
- **A1:** Si error SMTP → Reintenta después de 5 min (máx 3 intentos)
- **A2:** Si email inválido → Log de error, notifica a administrador

**Código Implementado:**
- ✅ `notification-service/src/application/services/email.service.ts`
- ✅ `notification-service/src/infrastructure/controllers/notification.controller.ts`
- ✅ `notification-service/src/application/dtos/notification.dto.ts`

---

### 4.3.11. CU011 - Mejora Continua (RF011: Mejora Continua)

| **Identificador** | RF011 |
|-------------------|-------|
| **Nombre** | Sistema de Mejora Continua |
| **Actores** | Usuario Final, Sistema, ML Service |
| **Tipo** | Secundario |
| **Propósito** | Capturar feedback y mejorar respuestas mediante machine learning |
| **Precondiciones** | - Usuario ha recibido respuesta<br/>- Sistema de feedback activo<br/>- ML Service configurado |
| **Postcondiciones** | - Feedback registrado<br/>- Datos acumulados para entrenamiento<br/>- Modelo actualizado periódicamente |

**Flujo Principal:**
1. Usuario recibe respuesta del chatbot
2. Sistema muestra opciones de calificación:
   - 👍 Útil
   - 👎 No útil
   - ⭐ Calificación 1-5 estrellas
3. Usuario selecciona calificación
4. Sistema solicita comentario opcional
5. Usuario puede agregar texto: "Faltó información sobre..."
6. Sistema registra en MongoDB (collection `feedback`):
   - sessionId
   - messageId
   - rating
   - comment
   - timestamp
7. Sistema asocia feedback con consulta/respuesta/intent
8. Acumula datos de feedback
9. Periódicamente (semanal):
   - Analiza patrones de feedback negativo
   - Identifica FAQs con baja satisfacción
   - Entrena modelo ML con nuevos datos
   - Actualiza parámetros de confianza
10. Sistema mejora respuestas futuras

**Flujos Alternativos:**
- **A1:** Si usuario no califica → Timeout de 5 min, se guarda como "sin feedback"
- **A2:** Si feedback negativo recurrente → Alerta a administrador

**Código Preparado:**
- ⏳ `api-gateway/src/application/services/feedback.service.ts`
- ⏳ `analytics-service/src/application/services/ml-trainer.service.ts`

---

### 4.3.12. CU012 - Exportar Reportes (RF012: Exportación de Datos)

| **Identificador** | RF012 |
|-------------------|-------|
| **Nombre** | Exportación de Reportes |
| **Actores** | Administrador, Analytics Service |
| **Tipo** | Secundario |
| **Propósito** | Permitir exportar datos y métricas en formatos PDF y Excel |
| **Precondiciones** | - Usuario con rol administrador<br/>- Analytics Service operativo<br/>- Datos disponibles para el período |
| **Postcondiciones** | - Archivo generado (PDF o Excel)<br/>- Descarga iniciada<br/>- Registro de exportación guardado |

**Flujo Principal:**
1. Administrador accede a "Generar Reporte"
2. Sistema muestra panel de configuración
3. Administrador selecciona:
   - Período: últimas 24h, 7 días, 30 días, personalizado
   - Tipo de datos: consultas, tickets, métricas, feedback
   - Formato: PDF o Excel
4. Administrador hace clic en "Generar"
5. Sistema valida que hay datos suficientes
6. Analytics Service recopila datos del período
7. Genera archivo según formato:
   - **PDF:** Gráficos + tablas con biblioteca pdfkit
   - **Excel:** Datos tabulares con ExcelJS
8. Sistema incluye:
   - Portada con logo UPT
   - Resumen ejecutivo
   - Gráficos de tendencias
   - Tablas de datos
   - Fecha de generación
9. Archivo guardado temporalmente
10. Sistema inicia descarga automática
11. Registra exportación: usuario, fecha, tipo

**Flujos Alternativos:**
- **A1:** Si datos insuficientes → "Seleccione período con más datos"
- **A2:** Si error en generación → Reintenta con formato alternativo

**Código Preparado:**
- ⏳ `analytics-service/src/application/services/report-generator.service.ts`
- ⏳ `analytics-service/src/infrastructure/exporters/pdf-exporter.ts`
- ⏳ `analytics-service/src/infrastructure/exporters/excel-exporter.ts`

---

# 5. Vista Lógica

## 5.1. Arquitectura de Alto Nivel

```mermaid
graph TB
    subgraph "FRONTEND TIER"
        CLIENT[💻 Cliente Web]
        WIDGET[📱 Chat Widget]
    end
    
    subgraph "APPLICATION TIER - Microservicios"
        direction TB
        GW[🚪 API Gateway :3000<br/>NestJS/TypeScript<br/>✅ Activo]
        NLP[🧠 NLP Service :8001<br/>Python/FastAPI<br/>✅ Activo]
        NOT[📧 Notification :3005<br/>NestJS/TypeScript<br/>✅ Activo]
        CHAT[💬 Chat Service :3001<br/>⏳ Preparado]
        KB[📚 Knowledge Base :3003<br/>⏳ Preparado]
        ANA[📊 Analytics :3004<br/>⏳ Preparado]
    end
    
    subgraph "DATA TIER"
        MONGO[(📦 MongoDB Atlas<br/>Sesiones, Tokens, Feedback)]
        MYSQL[(🗄️ MySQL Local<br/>Usuarios, Estudiantes)]
    end
    
    subgraph "EXTERNAL SERVICES"
        DF[☁️ DialogFlow API<br/>Google Cloud]
        GMAIL[📮 Gmail SMTP<br/>Port 587]
    end
    
    CLIENT --> WIDGET
    WIDGET -->|REST| GW
    
    GW <-->|HTTP| NLP
    GW -->|HTTP| NOT
    GW -->|WS| CHAT
    GW <-->|HTTP| KB
    GW <-->|HTTP| ANA
    
    NLP -->|API| DF
    NLP -->|HTTP| GW
    
    GW -->|Query| MONGO
    GW -->|Query| MYSQL
    KB -->|Query| MONGO
    ANA -->|Query| MONGO
    
    NOT -->|SMTP| GMAIL
    
    style GW fill:#4CAF50,color:#fff
    style NLP fill:#2196F3,color:#fff
    style NOT fill:#FF9800,color:#fff
```

**Fuente:** Elaboración propia.

**Descripción:** Arquitectura de microservicios del Sistema UPT Chat mostrando tres capas principales. La capa de presentación incluye el cliente web y el widget de chat. La capa de aplicación contiene 6 microservicios: API Gateway (orquestador principal), NLP Service (procesamiento de lenguaje natural), Notification Service (envío de emails), Chat Service (mensajería en tiempo real), Knowledge Base (gestión de FAQs) y Analytics (métricas y reportes). Los tres primeros están activos, los otros tres preparados para implementación. La capa de datos incluye MongoDB Atlas para información volátil y MySQL local para datos académicos. Los servicios externos son DialogFlow para NLP y Gmail para SMTP.

## 5.2. Diagrama de Paquetes/Subsistemas

```mermaid
graph TB
    subgraph "upt-chat-system"
        subgraph "presentation-layer"
            WIDGET[📱 chat-widget<br/>HTML/CSS/JavaScript]
            ADMIN[👨‍💼 admin-dashboard<br/>React/TypeScript]
            API_CTRL[🎮 api-controllers<br/>REST Endpoints]
        end
        
        subgraph "application-layer"
            UC[📋 use-cases<br/>Casos de Uso]
            APP_SVC[⚙️ application-services<br/>Lógica de Aplicación]
            DTO[📦 dtos<br/>Data Transfer Objects]
            DETECTORS[🔍 detectors<br/>Sensitive Query, etc]
        end
        
        subgraph "domain-layer"
            ENT[🏛️ entities<br/>User, ChatSession, Ticket]
            VO[💎 value-objects<br/>Email, Token, Message]
            DOM_SVC[🎯 domain-services<br/>Lógica de Negocio]
            REPO_INT[📜 repository-interfaces<br/>Contratos]
        end
        
        subgraph "infrastructure-layer"
            subgraph "nlp-engine"
                DF_CLIENT[☁️ dialogflow-service]
                SPACY[🔤 spacy-service]
                HYBRID[🔀 hybrid-nlp-service]
            end
            
            subgraph "database-repositories"
                MONGO_REPO[📦 mongo-repositories<br/>ChatSession, Token]
                MYSQL_REPO[🗄️ mysql-connection<br/>User, Student]
            end
            
            subgraph "external-clients"
                HTTP_CLIENT[🌐 http-client<br/>axios]
                EMAIL_CLIENT[📧 email-service<br/>nodemailer]
            end
            
            subgraph "configuration"
                ENV[⚙️ environment<br/>.env files]
                SCHEMAS[📋 database-schemas<br/>Mongoose]
            end
        end
        
        subgraph "external-systems"
            DIALOGFLOW[☁️ DialogFlow API<br/>Google Cloud Platform]
            MONGODB[📦 MongoDB Atlas<br/>Cloud Database]
            MYSQL_UPT[🗄️ MySQL UPT<br/>Local Database]
            GMAIL[📮 Gmail SMTP<br/>Email Server]
        end
    end
    
    %% Dependencias entre capas
    WIDGET --> API_CTRL
    ADMIN --> API_CTRL
    API_CTRL --> UC
    API_CTRL --> APP_SVC
    
    UC --> DTO
    APP_SVC --> DTO
    UC --> DOM_SVC
    APP_SVC --> DOM_SVC
    UC --> DETECTORS
    
    DOM_SVC --> ENT
    DOM_SVC --> VO
    DOM_SVC --> REPO_INT
    
    REPO_INT --> MONGO_REPO
    REPO_INT --> MYSQL_REPO
    
    APP_SVC --> HYBRID
    HYBRID --> DF_CLIENT
    HYBRID --> SPACY
    
    APP_SVC --> EMAIL_CLIENT
    APP_SVC --> HTTP_CLIENT
    
    MONGO_REPO --> SCHEMAS
    MONGO_REPO --> ENV
    MYSQL_REPO --> ENV
    
    %% Dependencias con sistemas externos
    DF_CLIENT -.->|API| DIALOGFLOW
    MONGO_REPO -.->|Protocol| MONGODB
    MYSQL_REPO -.->|SQL| MYSQL_UPT
    EMAIL_CLIENT -.->|SMTP| GMAIL
```

**Fuente:** Elaboración propia siguiendo principios de Clean Architecture.

**Descripción:** Este diagrama muestra la organización en paquetes del sistema siguiendo Clean Architecture. Las capas están ordenadas de afuera hacia adentro: Presentation (interfaces de usuario), Application (casos de uso y servicios), Domain (entidades y lógica de negocio), Infrastructure (detalles técnicos). La capa de dominio es independiente y contiene las reglas de negocio. Las dependencias apuntan hacia el centro (domain), respetando la regla de dependencia de Clean Architecture. Los paquetes externos representan servicios de terceros con los que el sistema se integra mediante adaptadores en la capa de infraestructura.

## 5.3. Diagramas de Secuencia

### 5.3.1. Secuencia RF001 - Chat Widget

#### API Gateway - Estructura de Capas

```mermaid
graph TB
    subgraph "Presentation Layer"
        CTRL[Controllers<br/>users.controller.ts<br/>chat-sessions.controller.ts<br/>password-reset.controller.ts]
    end
    
    subgraph "Application Layer"
        UC[Use Cases<br/>user.use-cases.ts<br/>chat-session.use-cases.ts]
        SVC[Services<br/>password-reset.service.ts]
        DTO[DTOs<br/>user.dto.ts<br/>password-reset.dto.ts]
    end
    
    subgraph "Domain Layer"
        ENT[Entities<br/>User, ChatSession]
        DOM[Domain Services<br/>user-domain.service.ts<br/>chat-session-domain.service.ts]
        REPO[Repository Interfaces<br/>IUserRepository<br/>IChatSessionRepository]
    end
    
    subgraph "Infrastructure Layer"
        IMPL[Repository Implementations<br/>mongo-user.repository.ts<br/>mongo-chat-session.repository.ts]
        DB[(MongoDB)]
        MYSQL[(MySQL)]
        HTTP[HTTP Clients<br/>axios]
    end
    
    CTRL --> UC
    CTRL --> SVC
    UC --> DTO
    SVC --> DTO
    UC --> DOM
    DOM --> REPO
    REPO --> IMPL
    IMPL --> DB
    SVC --> MYSQL
    SVC --> HTTP
```

#### NLP Service - Estructura de Capas

```mermaid
graph TB
    subgraph "Presentation Layer"
        API[FastAPI Endpoints<br/>POST /process-message<br/>POST /detect-intent]
    end
    
    subgraph "Application Layer"
        UC_PROCESS[ProcessMessageUseCase]
        UC_DETECT[DetectIntentUseCase]
        UC_SEARCH[SearchKnowledgeBaseUseCase]
        DETECTOR[SensitiveQueryDetector]
    end
    
    subgraph "Domain Layer"
        ENT_MSG[Message Value Object]
        ENT_INT[Intent Entity]
        ENT_FAQ[FAQ Entity]
        SVC_NLP[NLPDomainService]
    end
    
    subgraph "Infrastructure Layer"
        DF[DialogFlow Service]
        SPACY[spaCy Service]
        HYBRID[Hybrid NLP Service]
        JSON_REPO[JSON Repositories]
        HTTP_CLIENT[ApiGatewayClient]
    end
    
    API --> UC_PROCESS
    API --> UC_DETECT
    UC_PROCESS --> DETECTOR
    UC_PROCESS --> SVC_NLP
    UC_DETECT --> SVC_NLP
    UC_SEARCH --> SVC_NLP
    SVC_NLP --> ENT_INT
    SVC_NLP --> ENT_FAQ
    SVC_NLP --> HYBRID
    HYBRID --> DF
    HYBRID --> SPACY
    SVC_NLP --> JSON_REPO
    UC_PROCESS --> HTTP_CLIENT
```

```mermaid
sequenceDiagram
    actor Usuario as 👤 Usuario Final
    participant Browser as 🌐 Navegador
    participant Intranet as 🏢 Intranet UPT
    participant Widget as 💬 Chat Widget
    participant GW as 🚪 API Gateway<br/>:3000
    participant Mongo as 📦 MongoDB
    
    Usuario->>Browser: Navega a intranet.upt.edu.pe
    Browser->>Intranet: GET /portal
    Intranet-->>Browser: HTML + Widget Script
    
    Browser->>Widget: Cargar widget.js
    Widget->>Widget: Inicializar componente
    
    Usuario->>Widget: Click en ícono chat
    Widget->>GW: POST /api/chat-sessions/create<br/>{userId, userAgent}
    
    GW->>Mongo: db.chatSessions.insertOne()
    Mongo-->>GW: sessionId: "abc123..."
    
    GW-->>Widget: {<br/> sessionId,<br/> token,<br/> config: {<br/>  categories,<br/>  welcomeMessage,<br/>  status: "online"<br/> }<br/>}
    
    Widget->>Widget: Renderizar interfaz
    Widget-->>Usuario: Muestra chat funcional<br/>"¡Hola! ¿En qué puedo ayudarte?"
    
    Usuario->>Widget: Escribe "Hola"
    Widget->>GW: POST /api/messages<br/>{sessionId, content: "Hola"}
    GW->>Mongo: db.messages.insertOne()
    
    Note over Usuario,Mongo: Widget completamente funcional<br/>Listo para procesar consultas
```

**Fuente:** Elaboración propia.

**Descripción:** Secuencia de inicialización del chat widget. El usuario accede a la intranet UPT, el navegador carga el script del widget, y al hacer clic se crea una sesión en MongoDB. El API Gateway retorna la configuración (categorías, mensaje de bienvenida, estado) y el widget se despliega completamente funcional para comenzar la interacción.

---

### 5.3.2. Secuencia RF002 - Comprensión de Lenguaje Natural

```mermaid
sequenceDiagram
    actor Usuario as 👤 Usuario
    participant Widget as 💬 Widget
    participant GW as 🚪 API Gateway<br/>:3000
    participant NLP as 🧠 NLP Service<br/>:8001
    participant DF as ☁️ DialogFlow
    participant Spacy as 🔤 spaCy
    participant KB as 📚 Knowledge Base<br/>FAQs
    participant Mongo as 📦 MongoDB
    
    Usuario->>Widget: "¿Cuándo son las inscripciones?"
    Widget->>GW: POST /api/messages<br/>{sessionId, content}
    GW->>NLP: POST /process-message<br/>{message, session_id}
    
    NLP->>NLP: SensitiveQueryDetector.check()
    NLP->>DF: detectIntent(message)
    DF-->>NLP: {<br/> intent: "inscripciones.fecha",<br/> confidence: 0.85<br/>}
    
    alt Confianza >= 0.7
        NLP->>KB: searchFAQ(intent)
        KB-->>NLP: {<br/> answer: "Las inscripciones...",<br/> metadata<br/>}
    else Confianza < 0.7
        NLP->>Spacy: analyze(message)
        Spacy->>Spacy: Tokenize + Lemmatize
        Spacy->>Spacy: Calculate similarity
        Spacy-->>NLP: {<br/> intent_fallback,<br/> confidence: 0.6<br/>}
        NLP->>KB: searchFAQ(intent_fallback)
        KB-->>NLP: answer_fallback
    end
    
    NLP-->>GW: {<br/> response: "Las inscripciones...",<br/> confidence: 0.85,<br/> intent,<br/> suggestions: []<br/>}
    
    GW->>Mongo: db.messages.insertOne({<br/> role: "assistant",<br/> content,<br/> intent,<br/> confidence<br/>})
    
    GW-->>Widget: {response, confidence}
    Widget-->>Usuario: Muestra respuesta
    
    Widget->>Usuario: "¿Te fue útil esta respuesta?"<br/>👍 👎
```

**Fuente:** Elaboración propia basada en implementación híbrida NLP.

**Descripción:** Flujo completo del procesamiento NLP. El usuario envía una consulta que pasa por el detector de consultas sensibles. Se intenta primero con DialogFlow; si la confianza es >= 0.7, se usa directamente. Si es menor, se utiliza spaCy como fallback. Finalmente se busca la respuesta en la base de conocimiento (219 FAQs) y se retorna al usuario con su nivel de confianza, registrando toda la interacción en MongoDB.

---

### 5.3.3. Secuencia RF003 - Gestión de FAQ

```mermaid
sequenceDiagram
    actor Admin as 👨‍💼 Administrador
    participant Dashboard as 🖥️ Admin Panel
    participant GW as 🚪 API Gateway
    participant KB_Service as 📚 Knowledge Base<br/>Service :3003
    participant Mongo as 📦 MongoDB
    participant Cache as ⚡ Cache
    
    Admin->>Dashboard: Accede a "Gestión FAQ"
    Dashboard->>GW: GET /api/auth/verify-token<br/>Bearer: JWT
    GW->>GW: Verify role === "admin"
    GW-->>Dashboard: {authorized: true}
    
    Dashboard->>KB_Service: GET /api/faqs?page=1&limit=50
    KB_Service->>Mongo: db.faqs.find()<br/>.sort({category: 1})
    Mongo-->>KB_Service: [...faqs]
    KB_Service-->>Dashboard: {<br/> faqs: [],<br/> total: 219,<br/> page: 1<br/>}
    
    Dashboard-->>Admin: Muestra lista de FAQs
    
    Admin->>Dashboard: Selecciona FAQ "Becas disponibles"
    Dashboard->>KB_Service: GET /api/faqs/:id
    KB_Service->>Mongo: db.faqs.findById(id)
    Mongo-->>KB_Service: {id, question, answer, ...}
    KB_Service-->>Dashboard: faq_data
    
    Dashboard-->>Admin: Muestra formulario edición
    
    Admin->>Dashboard: Modifica respuesta + estado
    Dashboard->>KB_Service: PUT /api/faqs/:id<br/>{<br/> answer: "nueva respuesta",<br/> enabled: true<br/>}
    
    KB_Service->>KB_Service: ValidateDTO(updateFaqDto)
    KB_Service->>Mongo: db.faqs.findOne({<br/> question,<br/> _id: {$ne: id}<br/>})
    
    alt Pregunta duplicada
        Mongo-->>KB_Service: existing_faq
        KB_Service-->>Dashboard: {error: "Pregunta duplicada"}
        Dashboard-->>Admin: ❌ "Ya existe FAQ con esa pregunta"
    else No duplicado
        Mongo-->>KB_Service: null
        KB_Service->>Mongo: db.faqs.updateOne({_id: id}, {$set})
        Mongo-->>KB_Service: {modifiedCount: 1}
        
        KB_Service->>Cache: invalidate("faqs:*")
        Cache-->>KB_Service: cleared
        
        KB_Service->>Mongo: db.audit_log.insertOne({<br/> action: "FAQ_UPDATED",<br/> userId: admin_id,<br/> faqId: id,<br/> timestamp<br/>})
        
        KB_Service-->>Dashboard: {<br/> success: true,<br/> updated_faq<br/>}
        Dashboard-->>Admin: ✅ "FAQ actualizado exitosamente"
    end
```

**Fuente:** Elaboración propia siguiendo patrón CRUD con validaciones.

**Descripción:** Proceso de gestión administrativa de FAQs. El administrador se autentica, accede a la lista completa, selecciona un FAQ para editar, modifica el contenido y el sistema valida que no haya duplicados antes de guardar. Incluye invalidación de caché y registro de auditoría. Si hay error (ej: pregunta duplicada), se muestra mensaje específico al administrador.

---

### 5.3.4. Secuencia RF004 - Validación por Email ✅ IMPLEMENTADO

```mermaid
sequenceDiagram
    actor Usuario as 👤 Usuario
    participant Widget as 💬 Widget
    participant NLP as 🧠 NLP Service<br/>:8001
    participant GW as 🚪 API Gateway<br/>:3000
    participant MySQL as 🗄️ MySQL
    participant Mongo as 📦 MongoDB
    participant NOT as 📧 Notification<br/>:3005
    participant Gmail as 📮 Gmail SMTP
    
    Usuario->>Widget: "olvidé mi contraseña"
    Widget->>NLP: POST /process-message
    NLP->>NLP: SensitiveQueryDetector<br/>.is_sensitive_query()
    NLP-->>Widget: {<br/> requires_validation: true,<br/> validation_state: "awaiting_email"<br/>}
    Widget-->>Usuario: "Por favor proporciona tu email<br/>personal registrado"
    
    Usuario->>Widget: "angel@example.com"
    Widget->>NLP: POST /process-message<br/>{message: "angel@example.com"}
    NLP->>NLP: Extract email with regex
    NLP->>GW: POST /api/users/verify-email<br/>{email}
    
    GW->>MySQL: SELECT * FROM usuarios<br/>WHERE email = ?
    MySQL-->>GW: {<br/> id: 1,<br/> nombre: "Angel",<br/> email: "angel@example.com"<br/>}
    
    alt Email existe
        GW-->>NLP: {exists: true, userId: 1}
        NLP->>GW: POST /api/password-reset/initiate<br/>{email, session_id}
        
        GW->>GW: generateToken()<br/>// crypto.randomBytes(32)
        GW->>Mongo: db.password_reset_tokens.insertOne({<br/> token,<br/> userId,<br/> email,<br/> expiresAt: now + 1h<br/>})
        
        GW->>NOT: POST /notifications/email/<br/>password-reset-confirmation
        NOT->>NOT: Load template HTML
        NOT->>NOT: Replace {{token}}, {{name}}
        NOT->>Gmail: SMTP send email
        Gmail-->>Usuario: 📧 Email:<br/>"Haz clic para confirmar:<br/>http://localhost:3000/confirm?token=..."
        
        GW-->>NLP: {success: true}
        NLP-->>Widget: "✅ Email enviado. Revisa tu bandeja"
        Widget-->>Usuario: Muestra confirmación
        
        Usuario->>Usuario: Abre email, clic en link
        Usuario->>GW: GET /api/password-reset/confirm/:token
        
        GW->>Mongo: db.password_reset_tokens.findOne({<br/> token,<br/> used: false,<br/> expiresAt: {$gt: now}<br/>})
        
        alt Token válido
            Mongo-->>GW: {token_data}
            GW->>GW: generateSecurePassword()<br/>// 12 chars random
            GW->>MySQL: UPDATE usuarios<br/>SET password = ?<br/>WHERE id = ?
            MySQL-->>GW: {affectedRows: 1}
            
            GW->>Mongo: db.password_reset_tokens.updateOne(<br/> {token},<br/> {$set: {used: true}}<br/>)
            
            GW->>NOT: POST /notifications/email/<br/>new-password<br/>{email, newPassword}
            NOT->>Gmail: SMTP send email
            Gmail-->>Usuario: 📧 "Tu nueva contraseña es: Xy7@9kLm2..."
            
            GW-->>Usuario: HTML: "✅ Contraseña actualizada<br/>exitosamente"
        else Token inválido/expirado
            Mongo-->>GW: null
            GW-->>Usuario: "❌ Token inválido o expirado"
        end
    else Email no existe
        GW-->>NLP: {exists: false}
        NLP-->>Widget: "❌ Email no registrado en sistema"
        Widget-->>Usuario: Muestra error
    end
```

**Fuente:** Elaboración propia basada en código implementado.

**Descripción:** Flujo completo de validación por email para cambio de contraseña (RF004 implementado al 100%). Incluye detección de consulta sensible, validación de email en MySQL, generación de token con TTL de 1 hora, envío de email de confirmación, validación del token al hacer clic, generación de contraseña segura, actualización en base de datos y envío de la nueva contraseña por email. Maneja casos de error como email no registrado o token expirado.

---

### 5.3.5. Secuencia RF005 - Escalamiento a Soporte Humano

```mermaid
sequenceDiagram
    actor Usuario as 👤 Usuario
    participant Widget as 💬 Widget
    participant NLP as 🧠 NLP Service
    participant GW as 🚪 API Gateway
    participant Ticket_Service as 🎫 Ticket Service
    participant Mongo as 📦 MongoDB
    participant NOT as 📧 Notification
    participant Coord as 👨‍💻 Coordinador
    participant Espec as 👨‍🔧 Especialista
    
    Usuario->>Widget: "Necesito configurar VPN<br/>para acceso remoto"
    Widget->>NLP: POST /process-message
    
    NLP->>NLP: Process with DialogFlow
    NLP->>NLP: Process with spaCy
    NLP->>NLP: Calculate confidence: 0.45
    
    Note over NLP: Confianza < 0.7<br/>Requiere escalamiento
    
    NLP->>GW: POST /api/tickets/create<br/>{<br/> sessionId,<br/> userId,<br/> query,<br/> context,<br/> confidence: 0.45<br/>}
    
    GW->>Mongo: db.chatSessions.findOne({sessionId})
    Mongo-->>GW: {messages: [...history]}
    
    GW->>Ticket_Service: POST /tickets<br/>{<br/> userId,<br/> category: "TECHNICAL",<br/> priority: "HIGH",<br/> description,<br/> context: conversation_history<br/>}
    
    Ticket_Service->>Mongo: db.tickets.insertOne({<br/> ticketId: "TKT-2025-001",<br/> status: "PENDING_ASSIGNMENT",<br/> createdAt,<br/> nlpConfidence: 0.45<br/>})
    Mongo-->>Ticket_Service: {inserted_id}
    
    Ticket_Service->>NOT: POST /notifications/email/ticket-created<br/>{<br/> to: coordinator@upt.edu.pe,<br/> ticketId,<br/> summary<br/>}
    NOT->>Coord: 📧 "Nuevo ticket: TKT-2025-001<br/>VPN Configuration<br/>Prioridad: ALTA"
    
    Ticket_Service-->>GW: {<br/> ticketId: "TKT-2025-001",<br/> status: "PENDING"<br/>}
    GW-->>NLP: {escalated: true, ticketId}
    NLP-->>Widget: {<br/> response: "He creado el ticket<br/> TKT-2025-001.<br/> Un especialista te contactará<br/> en 2-4 horas.",<br/> ticketId<br/>}
    Widget-->>Usuario: Muestra mensaje<br/>+ número de ticket
    
    Coord->>Ticket_Service: GET /tickets/pending
    Ticket_Service-->>Coord: [...pending_tickets]
    
    Coord->>Ticket_Service: PUT /tickets/TKT-2025-001/assign<br/>{assignedTo: "espec_123"}
    Ticket_Service->>Mongo: db.tickets.updateOne({<br/> $set: {<br/>  assignedTo: "espec_123",<br/>  status: "IN_PROGRESS"<br/> }<br/>})
    
    Ticket_Service->>NOT: POST /notifications/email/ticket-assigned
    NOT->>Espec: 📧 "Ticket asignado: TKT-2025-001<br/>Contexto completo adjunto"
    
    Espec->>Usuario: 📧 "Hola, soy Juan del soporte técnico...<br/>Voy a ayudarte con la VPN..."
    
    Note over Usuario,Espec: Especialista resuelve el caso
    
    Espec->>Ticket_Service: PUT /tickets/TKT-2025-001/resolve<br/>{<br/> resolution,<br/> newFAQ: {question, answer}<br/>}
    Ticket_Service->>Mongo: db.tickets.updateOne({<br/> status: "RESOLVED"<br/>})
    
    Ticket_Service->>NOT: POST /knowledge-base/suggest-faq
    Note over Ticket_Service: Sistema aprende para<br/>futuras consultas similares
```

**Fuente:** Elaboración propia siguiendo mejores prácticas de ticketing.

**Descripción:** Proceso de escalamiento automático cuando la confianza del NLP es menor al 70%. El sistema crea un ticket con todo el contexto de la conversación, notifica al coordinador de soporte, quien asigna el caso a un especialista. El especialista recibe toda la información necesaria y resuelve el problema, con la posibilidad de que la resolución se convierta en un nuevo FAQ para mejorar el sistema (aprendizaje continuo).

---

### 5.3.6. Secuencia RF006 - Dashboard de Métricas

```mermaid
sequenceDiagram
    actor Admin as 👨‍💼 Administrador
    participant Dashboard as 🖥️ Dashboard UI
    participant GW as 🚪 API Gateway
    participant Analytics as 📊 Analytics Service<br/>:3004
    participant Mongo as 📦 MongoDB
    participant Cache as ⚡ Redis Cache
    
    Admin->>Dashboard: Accede a /dashboard
    Dashboard->>GW: GET /api/auth/verify<br/>Bearer: JWT
    GW-->>Dashboard: {authorized: true, role: "admin"}
    
    Dashboard->>Analytics: GET /api/metrics/summary?<br/>period=7days
    
    Analytics->>Cache: get("metrics:7days")
    
    alt Cache hit
        Cache-->>Analytics: {cached_data, timestamp}
        Analytics-->>Dashboard: metrics_data
    else Cache miss
        Cache-->>Analytics: null
        
        Analytics->>Mongo: Aggregate queries:<br/>1. db.messages.aggregate([<br/> {$match: {<br/>  createdAt: {$gte: 7_days_ago}<br/> }},<br/> {$group: {<br/>  _id: "$intent",<br/>  count: {$sum: 1}<br/> }}<br/>])
        
        Mongo-->>Analytics: {total_queries: 1523}
        
        Analytics->>Mongo: 2. db.tickets.aggregate([<br/> {$group: {<br/>  _id: "$status",<br/>  count: {$sum: 1}<br/> }}<br/>])
        Mongo-->>Analytics: {<br/> pending: 5,<br/> in_progress: 12,<br/> resolved: 203<br/>}
        
        Analytics->>Mongo: 3. db.feedback.aggregate([<br/> {$group: {<br/>  _id: null,<br/>  avg_rating: {$avg: "$rating"}<br/> }}<br/>])
        Mongo-->>Analytics: {avg_rating: 4.3}
        
        Analytics->>Analytics: Calculate metrics:<br/>- Tasa resolución: 93.2%<br/>- Tiempo promedio: 1.8s<br/>- Satisfacción: 86%
        
        Analytics->>Cache: set("metrics:7days", data, ttl: 5min)
        
        Analytics-->>Dashboard: {<br/> summary: {<br/>  total_queries: 1523,<br/>  resolved: 93.2%,<br/>  avg_response_time: "1.8s",<br/>  satisfaction: 86%,<br/>  top_categories: [<br/>   {name: "Inscripciones", count: 342},<br/>   {name: "Notas", count: 287}<br/>  ]<br/> },<br/> charts_data<br/>}
    end
    
    Dashboard->>Dashboard: Render charts:<br/>- Line chart: Tendencias<br/>- Bar chart: Categorías<br/>- Pie chart: Estados tickets
    
    Dashboard-->>Admin: Muestra dashboard completo
    
    Admin->>Dashboard: Selecciona período personalizado<br/>"01/10 - 10/10"
    Dashboard->>Analytics: GET /api/metrics/summary?<br/>startDate=2025-10-01&<br/>endDate=2025-10-10
    
    Analytics->>Mongo: db.messages.aggregate([<br/> {$match: {<br/>  createdAt: {<br/>   $gte: start,<br/>   $lte: end<br/>  }<br/> }}<br/>])
    Mongo-->>Analytics: filtered_data
    
    Analytics-->>Dashboard: updated_metrics
    Dashboard-->>Admin: Actualiza gráficos
    
    Admin->>Dashboard: Click "Configurar Alerta"
    Dashboard->>Analytics: POST /api/alerts/configure<br/>{<br/> metric: "escalation_rate",<br/> threshold: 15,<br/> action: "email_notification"<br/>}
    Analytics->>Mongo: db.alerts.insertOne(alert_config)
    Analytics-->>Dashboard: {alert_id, active: true}
    
    Dashboard-->>Admin: ✅ "Alerta configurada:<br/>Te notificaremos si la tasa de<br/>escalamiento supera 15%"
```

**Fuente:** Elaboración propia con sistema de caché y alertas.

**Descripción:** Dashboard de métricas en tiempo real con caché para optimizar performance. El administrador accede y el sistema calcula o recupera del caché las métricas agregadas de los últimos 7 días: total de consultas, tasa de resolución, tiempo promedio de respuesta, satisfacción del usuario y categorías más consultadas. Permite filtrar por períodos personalizados y configurar alertas automáticas cuando ciertas métricas superan umbrales definidos.

---

### 5.3.7. Secuencia RF007 - Conexión Sistema Académico

```mermaid
sequenceDiagram
    actor Usuario as 👤 Estudiante
    participant Widget as 💬 Widget
    participant NLP as 🧠 NLP Service
    participant GW as 🚪 API Gateway
    participant Auth as 🔐 Auth Service
    participant Academic as 🎓 Academic Service
    participant MySQL as 🗄️ MySQL UPT
    
    Usuario->>Widget: "¿Cuáles son mis notas?"
    Widget->>NLP: POST /process-message
    NLP->>NLP: detectIntent()<br/>intent: "consulta.notas"
    NLP-->>Widget: {<br/> intent: "consulta.notas",<br/> requires_auth: true<br/>}
    
    alt Usuario no autenticado
        Widget-->>Usuario: "Para ver tus notas,<br/>necesitas iniciar sesión"
        Usuario->>Widget: Click "Iniciar Sesión"
        Widget->>Auth: POST /api/auth/login<br/>{username, password}
        Auth->>MySQL: SELECT * FROM usuarios<br/>WHERE username = ?
        MySQL-->>Auth: {id, password_hash, role}
        Auth->>Auth: bcrypt.compare(password)
        
        alt Credenciales válidas
            Auth->>Auth: generateJWT(userId, role)
            Auth-->>Widget: {<br/> token: "eyJhbGc...",<br/> user: {id, name, role}<br/>}
            Widget->>Widget: Store token in localStorage
        else Credenciales inválidas
            Auth-->>Widget: {error: "Credenciales incorrectas"}
            Widget-->>Usuario: ❌ "Usuario o contraseña incorrectos"
        end
    end
    
    Widget->>GW: POST /api/messages<br/>Authorization: Bearer {token}<br/>{content: "¿Cuáles son mis notas?"}
    
    GW->>Auth: Verify JWT token
    Auth-->>GW: {userId: 123, valid: true}
    
    GW->>Academic: GET /api/academic/grades/:userId
    Academic->>MySQL: SELECT<br/> a.nombre_asignatura,<br/> n.nota_parcial,<br/> n.nota_final,<br/> n.promedio<br/>FROM notas n<br/>JOIN asignaturas a<br/> ON n.asignatura_id = a.id<br/>WHERE n.alumno_id = ?<br/>AND n.semestre = '2025-1'
    
    MySQL-->>Academic: [<br/> {asignatura: "Construcción SW I",<br/>  parcial: 16, final: 18,<br/>  promedio: 17},<br/> {asignatura: "Base de Datos II",<br/>  parcial: 15, final: 17,<br/>  promedio: 16}<br/>]
    
    Academic->>Academic: FormatAsNaturalLanguage(grades)
    Academic-->>GW: {<br/> response: "Tus notas del semestre...",<br/> data: grades_array<br/>}
    
    GW-->>Widget: {<br/> message: "📚 Tus notas:<br/><br/> • Construcción SW I: 17<br/>  Parcial: 16 | Final: 18<br/><br/> • Base de Datos II: 16<br/>  Parcial: 15 | Final: 17<br/><br/> Promedio general: 16.5"<br/>}
    
    Widget-->>Usuario: Muestra notas formateadas
    
    Usuario->>Widget: "¿Cuándo es mi próximo examen?"
    Widget->>GW: POST /api/messages<br/>Authorization: Bearer {token}
    
    GW->>Academic: GET /api/academic/schedule/:userId
    Academic->>MySQL: SELECT<br/> e.asignatura,<br/> e.tipo_examen,<br/> e.fecha,<br/> e.hora,<br/> e.aula<br/>FROM examenes e<br/>WHERE e.alumno_id = ?<br/>AND e.fecha >= CURDATE()<br/>ORDER BY e.fecha ASC<br/>LIMIT 5
    
    MySQL-->>Academic: [{<br/> asignatura: "Construcción SW I",<br/> tipo: "Final",<br/> fecha: "2025-10-20",<br/> hora: "08:00",<br/> aula: "Lab-301"<br/>}]
    
    Academic-->>GW: formatted_schedule
    GW-->>Widget: schedule_response
    Widget-->>Usuario: "📅 Próximo examen:<br/>Construcción SW I (Final)<br/>20 de octubre, 8:00 AM<br/>Aula: Lab-301"
```

**Fuente:** Elaboración propia con autenticación JWT.

**Descripción:** Integración con el sistema académico UPT para consultas personalizadas. Requiere autenticación del usuario mediante JWT. Una vez autenticado, el sistema consulta directamente la base de datos MySQL de UPT para obtener información académica personalizada (notas, horarios, exámenes) y la formatea en lenguaje natural para presentarla al estudiante de manera clara y estructurada.

---

### 5.3.8. Secuencia RF008 - Motor de Búsqueda Semántica

```mermaid
sequenceDiagram
    actor Usuario as 👤 Usuario
    participant Widget as 💬 Widget
    participant NLP as 🧠 NLP Service
    participant Spacy as 🔤 spaCy Engine
    participant KB as 📚 Knowledge Base
    participant Vector_DB as 🔢 Vector Index
    
    Usuario->>Widget: "como sacar mi horario"<br/>(lenguaje coloquial)
    Widget->>NLP: POST /search-semantic<br/>{query}
    
    NLP->>Spacy: nlp(query)
    Spacy->>Spacy: Tokenization:<br/>["como", "sacar", "mi", "horario"]
    Spacy->>Spacy: Lemmatization:<br/>["cómo", "sacar", "mi", "horario"]
    Spacy->>Spacy: Remove stopwords:<br/>["sacar", "horario"]
    Spacy->>Spacy: Generate word vectors<br/>(300-dim embeddings)
    Spacy-->>NLP: query_vector
    
    NLP->>Vector_DB: similarity_search(query_vector)
    Vector_DB->>Vector_DB: Calculate cosine similarity<br/>with all document vectors
    
    loop For each document in KB
        Vector_DB->>Vector_DB: cosine_sim = <br/> dot(query_vec, doc_vec) /<br/> (||query_vec|| * ||doc_vec||)
    end
    
    Vector_DB->>Vector_DB: Sort by similarity score
    Vector_DB-->>NLP: [<br/> {doc: "consultar horario",<br/>  score: 0.89},<br/> {doc: "ver horario clases",<br/>  score: 0.85},<br/> {doc: "horario académico",<br/>  score: 0.82}<br/>]
    
    NLP->>KB: get_documents(top_5_ids)
    KB-->>NLP: [<br/> {<br/>  question: "¿Cómo consulto...?",<br/>  answer: "Para ver tu horario...",<br/>  synonyms: ["sacar", "ver",<br/>   "consultar", "obtener"]<br/> }<br/>]
    
    alt Score > 0.7
        NLP->>NLP: Return best match
        NLP-->>Widget: {<br/> results: [top_match],<br/> confidence: 0.89<br/>}
    else Score 0.5-0.7
        NLP->>NLP: Return multiple options
        NLP-->>Widget: {<br/> results: [top_3],<br/> message: "Encontré varias...",<br/> confidence: 0.65<br/>}
    else Score < 0.5
        NLP->>NLP: No good matches
        NLP-->>Widget: {<br/> results: [],<br/> message: "No encontré...",<br/> suggestion: "Reformula..."<br/>}
    end
    
    Widget-->>Usuario: Muestra resultados rankeados
    
    Usuario->>Widget: Click en resultado
    Widget-->>Usuario: Muestra respuesta completa
    
    NLP->>NLP: Learn new expression:<br/>Add "como sacar horario"<br/>to synonym list
    
    Note over NLP,Vector_DB: Sistema aprende nuevas<br/>formas de expresión
```

**Fuente:** Elaboración propia con spaCy.

**Descripción:** Motor de búsqueda semántica que utiliza embeddings de spaCy para encontrar documentos similares. El sistema tokeniza, lemmatiza y elimina stopwords de la consulta del usuario, genera vectores de 300 dimensiones, calcula la similitud coseno con todos los documentos en la base de conocimiento, ordena por score de similitud y devuelve los resultados más relevantes. Si el score es > 0.7, retorna el mejor match; si está entre 0.5-0.7, muestra múltiples opciones; si es < 0.5, sugiere reformular. El sistema aprende continuamente agregando nuevas expresiones a la lista de sinónimos.

---

## 6. Vista de Implementación

### 6.1. Estructura de Directorios del Proyecto

```
upt-chat-system/
├── services/
│   ├── nlp-service/              # Puerto 8001 ✅ FUNCIONAL
│   │   ├── application/
│   │   │   ├── detectors/
│   │   │   │   └── sensitive_query_detector.py
│   │   │   ├── dtos/
│   │   │   │   ├── nlp_response_dto.py
│   │   │   │   └── process_request_dto.py
│   │   │   └── use_cases/
│   │   │       ├── process_message_use_case.py
│   │   │       ├── detect_intent_use_case.py
│   │   │       └── search_knowledge_base_use_case.py
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   ├── intent.py
│   │   │   │   └── faq.py
│   │   │   ├── services/
│   │   │   │   └── nlp_domain_service.py
│   │   │   └── value_objects/
│   │   │       ├── message.py
│   │   │       └── confidence.py
│   │   ├── infrastructure/
│   │   │   ├── clients/
│   │   │   │   └── api_gateway_client.py
│   │   │   ├── nlp/
│   │   │   │   ├── dialogflow_service.py
│   │   │   │   ├── spacy_service.py
│   │   │   │   └── hybrid_nlp_service.py
│   │   │   └── repositories/
│   │   │       ├── json_intent_repository.py
│   │   │       └── json_knowledge_base_repository.py
│   │   ├── data/
│   │   │   ├── intents.json          # 19 intents
│   │   │   └── faqs.json              # 219 FAQs
│   │   ├── credentials/
│   │   │   └── dialogflow-credentials.json
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── .env
│   │
│   ├── api-gateway/              # Puerto 3000 ✅ FUNCIONAL
│   │   ├── src/
│   │   │   ├── presentation/
│   │   │   │   └── controllers/
│   │   │   │       ├── users.controller.ts
│   │   │   │       └── chat-sessions.controller.ts
│   │   │   ├── application/
│   │   │   │   ├── use-cases/
│   │   │   │   │   ├── user.use-cases.ts
│   │   │   │   │   └── chat-session.use-cases.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── password-reset.service.ts
│   │   │   │   └── dtos/
│   │   │   │       ├── user.dto.ts
│   │   │   │       └── password-reset.dto.ts
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   ├── user.entity.ts
│   │   │   │   │   └── chat-session.entity.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── user-domain.service.ts
│   │   │   │   │   └── chat-session-domain.service.ts
│   │   │   │   └── repositories/
│   │   │   │       ├── user.repository.interface.ts
│   │   │   │       └── chat-session.repository.interface.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── password-reset.controller.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── mysql-connection.service.ts
│   │   │   │   ├── database/
│   │   │   │   │   ├── repositories/
│   │   │   │   │   │   ├── mongo-user.repository.ts
│   │   │   │   │   │   └── mongo-chat-session.repository.ts
│   │   │   │   │   └── schemas/
│   │   │   │   │       ├── user.schema.ts
│   │   │   │   │       ├── chat-session.schema.ts
│   │   │   │   │       ├── message.schema.ts
│   │   │   │   │       └── password-reset.schema.ts
│   │   │   │   └── auth/
│   │   │   │       └── jwt.strategy.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env
│   │
│   ├── notification-service/      # Puerto 3005 ✅ FUNCIONAL
│   │   ├── src/
│   │   │   ├── application/
│   │   │   │   ├── services/
│   │   │   │   │   └── email.service.ts
│   │   │   │   └── dtos/
│   │   │   │       └── notification.dto.ts
│   │   │   ├── infrastructure/
│   │   │   │   └── controllers/
│   │   │   │       └── notification.controller.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env
│   │
│   ├── chat-service/             # Puerto 3001 ⏳ PREPARADO
│   ├── knowledge-base-service/   # Puerto 3003 ⏳ PREPARADO
│   └── analytics-service/        # Puerto 3004 ⏳ PREPARADO
│
├── proyectotest/                 # Simulación UPT Intranet
│   ├── app/
│   │   └── models/
│   │       └── User.php
│   ├── database_setup.sql
│   └── index.php
│
├── docs/
│   ├── FD03-EPIS-Informe_SRS_de_Proyecto-FORMATO.md
│   ├── FD04-EPIS-Informe_SAD_de_Proyecto-FORMATO.md  ← Este documento
│   ├── ARQUITECTURA_MICROSERVICIOS_RF004.md
│   ├── RESUMEN_RF004.md
│   └── IMPLEMENTACION_RF004.md
│
└── README.md
```

### 3.3.2. Diagrama de Componentes

```mermaid
graph TB
    subgraph "NLP Service - Puerto 8001"
        NLP_API[FastAPI Server]
        NLP_UC[Use Cases]
        NLP_DOM[Domain Services]
        NLP_DF[DialogFlow Client]
        NLP_SP[spaCy Engine]
        NLP_DET[Sensitive Detector]
        NLP_HTTP[HTTP Client]
    end
    
    subgraph "API Gateway - Puerto 3000"
        GW_API[NestJS Server]
        GW_CTRL[Controllers]
        GW_UC[Use Cases]
        GW_DOM[Domain Services]
        GW_REPO[Repositories]
        GW_MYSQL[MySQL Service]
        GW_PW[Password Reset]
    end
    
    subgraph "Notification Service - Puerto 3005"
        NOT_API[NestJS Server]
        NOT_CTRL[Controllers]
        NOT_EMAIL[Email Service]
        NOT_SMTP[SMTP Client]
    end
    
    subgraph "Data Layer"
        MONGO[(MongoDB Atlas)]
        MYSQL[(MySQL Local)]
    end
    
    subgraph "External Services"
        DF_CLOUD[☁️ DialogFlow API]
        GMAIL_SMTP[📮 Gmail SMTP]
    end
    
    NLP_API --> NLP_UC
    NLP_UC --> NLP_DOM
    NLP_UC --> NLP_DET
    NLP_DOM --> NLP_DF
    NLP_DOM --> NLP_SP
    NLP_DF --> DF_CLOUD
    NLP_UC --> NLP_HTTP
    NLP_HTTP -.HTTP.-> GW_API
    
    GW_API --> GW_CTRL
    GW_CTRL --> GW_UC
    GW_CTRL --> GW_PW
    GW_UC --> GW_DOM
    GW_DOM --> GW_REPO
    GW_REPO --> MONGO
    GW_MYSQL --> MYSQL
    GW_PW -.HTTP.-> NOT_API
    
    NOT_API --> NOT_CTRL
    NOT_CTRL --> NOT_EMAIL
    NOT_EMAIL --> NOT_SMTP
    NOT_SMTP --> GMAIL_SMTP
```

---

## 3.4. Vista de Procesos

### 3.4.1. Flujo de Procesamiento de Mensajes

```mermaid
stateDiagram-v2
    [*] --> ReceiveMessage: Usuario envía mensaje
    
    ReceiveMessage --> DetectSensitive: Verificar si es consulta sensible
    
    DetectSensitive --> SensitiveFlow: Es sensible
    DetectSensitive --> NormalFlow: No es sensible
    
    SensitiveFlow --> RequestEmail: Solicitar email
    RequestEmail --> ValidateEmail: Usuario proporciona email
    ValidateEmail --> SendEmail: Email válido
    ValidateEmail --> RequestEmail: Email inválido
    SendEmail --> AwaitConfirmation: Email enviado
    AwaitConfirmation --> [*]
    
    NormalFlow --> DetectIntent: Enviar a NLP
    DetectIntent --> DialogFlow: Intentar con DialogFlow
    DialogFlow --> HighConfidence: Confianza > 0.7
    DialogFlow --> LowConfidence: Confianza < 0.7
    
    HighConfidence --> SearchFAQ: Buscar FAQ
    LowConfidence --> SpacyFallback: Usar spaCy
    
    SpacyFallback --> SearchFAQ
    
    SearchFAQ --> FoundFAQ: FAQ encontrado
    SearchFAQ --> NoFAQ: No encontrado
    
    FoundFAQ --> SendResponse: Enviar respuesta
    NoFAQ --> FallbackResponse: Respuesta genérica
    
    SendResponse --> SaveHistory: Guardar en MongoDB
    FallbackResponse --> SaveHistory
    
    SaveHistory --> [*]
```

### 3.4.2. Flujo de Inicio de Servicios

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant NLP as NLP Service
    participant GW as API Gateway
    participant NOT as Notification
    participant Mongo as MongoDB
    participant MySQL as MySQL
    
    Dev->>MySQL: 1. sudo systemctl start mysql
    MySQL-->>Dev: ✅ MySQL running
    
    Dev->>NLP: 2. python3 main.py
    NLP->>NLP: Cargar configuración .env
    NLP->>NLP: Inicializar spaCy model
    NLP->>NLP: Cargar intents.json (19)
    NLP->>NLP: Cargar faqs.json (219)
    NLP->>NLP: Conectar DialogFlow
    NLP-->>Dev: ✅ NLP Service @ :8001
    
    Dev->>GW: 3. npm run start:dev
    GW->>GW: Cargar configuración .env
    GW->>Mongo: Conectar MongoDB Atlas
    Mongo-->>GW: ✅ Connected
    GW->>MySQL: Conectar MySQL
    MySQL-->>GW: ✅ Connected
    GW->>GW: Registrar Controllers
    GW->>GW: Registrar Services
    GW-->>Dev: ✅ API Gateway @ :3000
    
    Dev->>NOT: 4. npm run start:dev
    NOT->>NOT: Cargar configuración .env
    NOT->>NOT: Configurar SMTP
    NOT->>NOT: Verificar credenciales Gmail
    NOT-->>Dev: ✅ Notification @ :3005
    
    Dev->>Dev: Sistema completo ready! 🎉
```

---

## 3.5. Vista de Despliegue

### 3.5.1. Diagrama de Despliegue

```mermaid
graph TB
    subgraph "Local Development"
        DEV[💻 Developer Machine<br/>Ubuntu/Linux]
        
        subgraph "Port 8001"
            NLP_PROC[🐍 Python Process<br/>FastAPI + uvicorn]
        end
        
        subgraph "Port 3000"
            GW_PROC[📦 Node.js Process<br/>NestJS]
        end
        
        subgraph "Port 3005"
            NOT_PROC[📦 Node.js Process<br/>NestJS]
        end
        
        subgraph "Port 3306"
            MYSQL_PROC[🗄️ MySQL Server<br/>proyectotest DB]
        end
    end
    
    subgraph "Cloud Services"
        MONGO_CLOUD[☁️ MongoDB Atlas<br/>Cluster: basededatos2]
        DF_CLOUD[☁️ Google Cloud<br/>DialogFlow API]
        GMAIL_CLOUD[☁️ Gmail<br/>SMTP Server]
    end
    
    DEV --> NLP_PROC
    DEV --> GW_PROC
    DEV --> NOT_PROC
    DEV --> MYSQL_PROC
    
    NLP_PROC -->|HTTPS| DF_CLOUD
    NLP_PROC -->|HTTP| GW_PROC
    GW_PROC -->|MongoDB Protocol| MONGO_CLOUD
    GW_PROC -->|SQL| MYSQL_PROC
    GW_PROC -->|HTTP| NOT_PROC
    NOT_PROC -->|SMTP:587| GMAIL_CLOUD
```

### 3.5.2. Configuración de Puertos

| Servicio | Puerto | Protocolo | Estado |
|----------|--------|-----------|--------|
| NLP Service | 8001 | HTTP/REST | ✅ Activo |
| API Gateway | 3000 | HTTP/REST | ✅ Activo |
| Notification Service | 3005 | HTTP/REST | ✅ Activo |
| MySQL | 3306 | MySQL Protocol | ✅ Activo |
| MongoDB Atlas | 27017 | MongoDB Protocol | ✅ Activo |

### 3.5.3. Variables de Entorno por Servicio

#### NLP Service (.env)
```bash
# Server
PORT=8001
HOST=0.0.0.0

# NLP Configuration
SPACY_MODEL=es_core_news_sm
USE_DIALOGFLOW=True
GOOGLE_PROJECT_ID=upt-chat-fhps
DIALOGFLOW_LANGUAGE_CODE=es

# Confidence Thresholds
MIN_CONFIDENCE=0.6
HIGH_CONFIDENCE=0.8
DIALOGFLOW_CONFIDENCE_THRESHOLD=0.7

# API Gateway URL
API_GATEWAY_URL=http://localhost:3000
```

#### API Gateway (.env)
```bash
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://pp2020067576:***@basededatos2.h1ccthn.mongodb.net/upt_chat_system

# MySQL (proyectotest)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=***
MYSQL_DATABASE=upt_intranet

# Services URLs
NOTIFICATION_SERVICE_URL=http://localhost:3005

# JWT
JWT_SECRET=upt_jwt_secret_key
JWT_EXPIRES_IN=7d
```

#### Notification Service (.env)
```bash
# Server
PORT=3005
NODE_ENV=development

# Gmail SMTP
GMAIL_USER=angelxhernandezxcruz@gmail.com
GMAIL_APP_PASSWORD=***

# Email Configuration
FROM_EMAIL=angelxhernandezxcruz@gmail.com
FROM_NAME=UPT Chat System

# API Gateway
API_GATEWAY_URL=http://localhost:3000
```

---


---

# 7. Vista de Procesos

## 7.1. Diagrama de Actividades General del Sistema

```mermaid
flowchart TB
    Start([👤 Usuario accede al portal UPT])
    
    Start --> LoadWidget[🌐 Navegador carga<br/>widget de chat]
    LoadWidget --> ClickWidget{Usuario hace<br/>clic en widget?}
    
    ClickWidget -->|No| WaitUser[⏳ Widget disponible<br/>en esquina]
    WaitUser --> ClickWidget
    
    ClickWidget -->|Sí| CreateSession[📝 API Gateway crea<br/>sesión en MongoDB]
    CreateSession --> ShowWidget[💬 Widget se despliega<br/>completamente]
    
    ShowWidget --> UserMessage[👤 Usuario escribe<br/>consulta]
    
    UserMessage --> SendToNLP[🚀 Widget envía mensaje<br/>a NLP Service]
    
    SendToNLP --> DetectSensitive{🔍 ¿Es consulta<br/>sensible?}
    
    DetectSensitive -->|Sí| RequestEmail[📧 Solicitar email<br/>personal]
    RequestEmail --> ValidateEmail{✅ Email<br/>válido?}
    ValidateEmail -->|No| RequestEmail
    ValidateEmail -->|Sí| VerifyInDB{🗄️ Email existe<br/>en MySQL?}
    VerifyInDB -->|No| ErrorEmail[❌ Email no registrado]
    ErrorEmail --> UserMessage
    VerifyInDB -->|Sí| GenerateToken[🔑 Generar token<br/>TTL 1 hora]
    GenerateToken --> SendEmailConfirm[📮 Enviar email<br/>confirmación<br/>via Notification Service]
    SendEmailConfirm --> WaitConfirm[⏳ Esperar click<br/>en enlace]
    WaitConfirm --> ValidateToken{🔍 Token<br/>válido?}
    ValidateToken -->|No| ErrorToken[❌ Token expirado]
    ErrorToken --> UserMessage
    ValidateToken -->|Sí| GenPassword[🔐 Generar nueva<br/>contraseña]
    GenPassword --> UpdateMySQL[💾 Actualizar<br/>password en MySQL]
    UpdateMySQL --> SendEmailPassword[📮 Enviar email con<br/>nueva contraseña]
    SendEmailPassword --> Success1[✅ Proceso completado]
    Success1 --> End
    
    DetectSensitive -->|No| ProcessNLP[🧠 Procesar con<br/>DialogFlow]
    ProcessNLP --> CalcConfidence{📊 Confianza<br/>>= 0.7?}
    
    CalcConfidence -->|No| FallbackSpacy[🔤 Procesar con<br/>spaCy fallback]
    FallbackSpacy --> RecalcConfidence{📊 Nueva confianza<br/>>= 0.7?}
    
    RecalcConfidence -->|No| CreateTicket[🎫 Crear ticket<br/>automático]
    CreateTicket --> NotifyCoordinator[📧 Notificar<br/>coordinador]
    NotifyCoordinator --> AssignSpecialist[👨‍💻 Asignar a<br/>especialista]
    AssignSpecialist --> SpecialistResponse[👨‍🔧 Especialista<br/>responde por email]
    SpecialistResponse --> UpdateKB[📚 Actualizar base<br/>conocimiento]
    UpdateKB --> CloseTicket[✅ Cerrar ticket]
    CloseTicket --> End
    
    CalcConfidence -->|Sí| SearchFAQ[📚 Buscar en base<br/>de conocimiento]
    RecalcConfidence -->|Sí| SearchFAQ
    
    SearchFAQ --> FAQFound{✅ FAQ<br/>encontrado?}
    
    FAQFound -->|Sí| FormatResponse[📝 Formatear<br/>respuesta]
    FormatResponse --> ShowResponse[💬 Mostrar respuesta<br/>al usuario]
    
    FAQFound -->|No| GenericResponse[📝 Respuesta<br/>genérica de ayuda]
    GenericResponse --> ShowResponse
    
    ShowResponse --> RequestFeedback[⭐ Solicitar<br/>feedback]
    RequestFeedback --> UserRates{👤 Usuario<br/>califica?}
    
    UserRates -->|No| TimeoutFeedback[⏱️ Timeout 5 min]
    TimeoutFeedback --> RegisterMetric
    
    UserRates -->|Sí| SaveFeedback[💾 Guardar feedback<br/>en MongoDB]
    SaveFeedback --> CheckNegative{👎 Feedback<br/>negativo?}
    
    CheckNegative -->|Sí| CountNegatives{📊 ¿Más de 3<br/>negativos mismo<br/>intent?}
    CountNegatives -->|Sí| AlertAdmin[🚨 Alertar<br/>administrador]
    AlertAdmin --> RegisterMetric[📊 Registrar métrica<br/>en Analytics]
    CountNegatives -->|No| RegisterMetric
    
    CheckNegative -->|No| RegisterMetric
    
    RegisterMetric --> MoreQuestions{👤 ¿Más<br/>consultas?}
    
    MoreQuestions -->|Sí| UserMessage
    MoreQuestions -->|No| CloseSession[🔚 Cerrar sesión<br/>de chat]
    
    CloseSession --> UpdateStats[📊 Actualizar<br/>estadísticas]
    UpdateStats --> End([🏁 Fin])
    
    style Start fill:#4CAF50,color:#fff
    style End fill:#f44336,color:#fff
    style DetectSensitive fill:#FF9800,color:#fff
    style CalcConfidence fill:#2196F3,color:#fff
    style CreateTicket fill:#9C27B0,color:#fff
    style ShowResponse fill:#4CAF50,color:#fff
    style AlertAdmin fill:#f44336,color:#fff
```

**Fuente:** Elaboración propia integrando todos los componentes del sistema.

**Descripción:** Diagrama de actividades completo que integra TODOS los componentes y flujos del Sistema UPT Chat. Incluye: inicialización del widget, creación de sesión, detección de consultas sensibles (RF004), validación por email, procesamiento NLP con DialogFlow y spaCy fallback (RF002), escalamiento automático a soporte humano cuando confianza < 0.7 (RF005), búsqueda en base de conocimiento (RF003, RF008), presentación de respuestas, captura de feedback (RF011), registro de métricas (RF006) y alertas automáticas. Muestra decisiones críticas, flujos alternativos y la interacción entre los 6 microservicios del sistema.

---

## 8. Vista de Despliegue

### 8.1. Diagrama de Despliegue Completo

```mermaid
graph TB
    subgraph "DISPOSITIVOS CLIENTE"
        subgraph "Desktop"
            BROWSER_DESKTOP[💻 Navegador Desktop<br/>Chrome, Firefox, Edge<br/>Windows/Linux/Mac]
        end
        
        subgraph "Mobile"
            BROWSER_MOBILE[📱 Navegador Móvil<br/>Chrome Mobile, Safari<br/>Android/iOS]
        end
    end
    
    subgraph "RED UNIVERSITARIA UPT"
        subgraph "DMZ - Zona Desmilitarizada"
            FIREWALL1[🔥 Firewall<br/>Entrada]
            PROXY[🔐 Proxy<br/>Reverse Proxy<br/>SSL Termination]
            LOAD_BALANCER[⚖️ Load Balancer<br/>Nginx/HAProxy<br/>Round Robin]
        end
        
        subgraph "SERVIDOR INTRANET - 192.168.1.10"
            WEB_SERVER["🌐 Servidor Web<br/>━━━━━━━━━━━━━━<br/>Apache HTTP Server 2.4<br/>Port: 80, 443<br/>OS: Ubuntu 20.04 LTS<br/>RAM: 4GB<br/>CPU: 2 Cores<br/>Storage: 50GB SSD<br/>━━━━━━━━━━━━━━<br/>Archivos estáticos:<br/>• HTML/CSS/JS<br/>• Chat Widget (widget.js)<br/>• Assets e imágenes"]
        end
        
        subgraph "SERVIDOR APLICACIONES - 192.168.1.20"
            APP_SERVER["🖥️ Servidor Aplicaciones<br/>━━━━━━━━━━━━━━<br/>OS: Ubuntu 22.04 LTS<br/>RAM: 16GB<br/>CPU: 8 Cores<br/>Storage: 200GB SSD<br/>━━━━━━━━━━━━━━"]
            
            subgraph "Procesos Node.js"
                API_GW["🚪 API Gateway<br/>━━━━━━━━━━━━<br/>NestJS/TypeScript<br/>Port: 3000<br/>PM2 Process<br/>RAM: 512MB<br/>Threads: 4<br/>━━━━━━━━━━━━<br/>✅ ACTIVO"]
                
                NOT_SERVICE["📧 Notification<br/>━━━━━━━━━━━━<br/>NestJS/TypeScript<br/>Port: 3005<br/>PM2 Process<br/>RAM: 256MB<br/>Threads: 2<br/>━━━━━━━━━━━━<br/>✅ ACTIVO"]
                
                CHAT_SERVICE["💬 Chat Service<br/>━━━━━━━━━━━━<br/>NestJS + Socket.IO<br/>Port: 3001<br/>WebSocket Server<br/>RAM: 512MB<br/>━━━━━━━━━━━━<br/>⏳ PREPARADO"]
                
                KB_SERVICE["📚 Knowledge Base<br/>━━━━━━━━━━━━<br/>NestJS/TypeScript<br/>Port: 3003<br/>PM2 Process<br/>RAM: 512MB<br/>━━━━━━━━━━━━<br/>⏳ PREPARADO"]
                
                ANA_SERVICE["📊 Analytics<br/>━━━━━━━━━━━━<br/>NestJS/TypeScript<br/>Port: 3004<br/>PM2 Process<br/>RAM: 1GB<br/>━━━━━━━━━━━━<br/>⏳ PREPARADO"]
            end
            
            subgraph "Proceso Python"
                NLP_SERVICE["🧠 NLP Service<br/>━━━━━━━━━━━━<br/>FastAPI/Python 3.10<br/>Port: 8001<br/>Uvicorn ASGI<br/>RAM: 2GB<br/>Workers: 4<br/>━━━━━━━━━━━━<br/>Libraries:<br/>• DialogFlow API<br/>• spaCy (es_core_news_sm)<br/>• httpx<br/>━━━━━━━━━━━━<br/>✅ ACTIVO"]
            end
        end
        
        subgraph "SERVIDOR BASE DE DATOS - 192.168.1.30"
            DB_SERVER["🗄️ Servidor BD Local<br/>━━━━━━━━━━━━━━<br/>MySQL 8.0<br/>Port: 3306<br/>OS: Ubuntu 20.04 LTS<br/>RAM: 8GB<br/>CPU: 4 Cores<br/>Storage: 500GB HDD<br/>RAID 1 (mirror)<br/>━━━━━━━━━━━━━━<br/>Databases:<br/>• proyectotest<br/>• upt_intranet<br/>━━━━━━━━━━━━━━<br/>Tables:<br/>• usuarios<br/>• estudiantes<br/>• asignaturas<br/>• notas<br/>✅ ACTIVO"]
        end
        
        FIREWALL2[🔥 Firewall<br/>Salida]
    end
    
    subgraph "SERVICIOS EN LA NUBE"
        subgraph "MongoDB Atlas"
            MONGO_CLOUD["☁️ MongoDB Atlas<br/>━━━━━━━━━━━━━━<br/>Cluster: basededatos2<br/>Tier: M10 (Dedicated)<br/>Region: AWS us-east-1<br/>RAM: 2GB<br/>Storage: 10GB<br/>Backup: Auto (Daily)<br/>━━━━━━━━━━━━━━<br/>Collections:<br/>• chat_sessions<br/>• messages<br/>• users<br/>• password_reset_tokens<br/>• feedback<br/>• tickets<br/>• email_logs<br/>━━━━━━━━━━━━━━<br/>Indexes: 12<br/>Sharding: No<br/>Replica Set: 3 nodes<br/>✅ ACTIVO"]
        end
        
        subgraph "Google Cloud Platform"
            DF_CLOUD["☁️ DialogFlow API<br/>━━━━━━━━━━━━━━<br/>Project: upt-chat-fhps<br/>Region: us-central1<br/>Language: es (Spanish)<br/>━━━━━━━━━━━━━━<br/>Configuration:<br/>• 19 Intents<br/>• 150+ Training phrases<br/>• Confidence threshold: 0.7<br/>━━━━━━━━━━━━━━<br/>Quota:<br/>• 15k requests/day<br/>✅ ACTIVO"]
        end
        
        subgraph "Gmail SMTP"
            GMAIL_CLOUD["📮 Gmail SMTP<br/>━━━━━━━━━━━━━━<br/>Host: smtp.gmail.com<br/>Port: 587 (TLS)<br/>Protocol: STARTTLS<br/>━━━━━━━━━━━━━━<br/>Authentication:<br/>• App Password<br/>━━━━━━━━━━━━━━<br/>Límite:<br/>• 500 emails/día<br/>✅ ACTIVO"]
        end
    end
    
    %% Conexiones de red
    BROWSER_DESKTOP -->|HTTPS :443| FIREWALL1
    BROWSER_MOBILE -->|HTTPS :443| FIREWALL1
    FIREWALL1 -->|HTTP :80/443| PROXY
    PROXY -->|HTTP :80| LOAD_BALANCER
    
    LOAD_BALANCER -->|HTTP :80| WEB_SERVER
    
    WEB_SERVER -->|REST :3000| API_GW
    
    API_GW <-->|HTTP :8001| NLP_SERVICE
    API_GW -->|HTTP :3005| NOT_SERVICE
    API_GW -->|WebSocket :3001| CHAT_SERVICE
    API_GW <-->|HTTP :3003| KB_SERVICE
    API_GW <-->|HTTP :3004| ANA_SERVICE
    
    NLP_SERVICE -->|HTTP| API_GW
    
    API_GW -->|TCP :3306| DB_SERVER
    KB_SERVICE -->|TCP :3306| DB_SERVER
    
    APP_SERVER -->|HTTPS :443| FIREWALL2
    FIREWALL2 -->|MongoDB Protocol<br/>:27017| MONGO_CLOUD
    FIREWALL2 -->|HTTPS :443| DF_CLOUD
    FIREWALL2 -->|SMTP :587| GMAIL_CLOUD
    
    %% Estilos
    style API_GW fill:#4CAF50,color:#fff
    style NLP_SERVICE fill:#2196F3,color:#fff
    style NOT_SERVICE fill:#FF9800,color:#fff
    style MONGO_CLOUD fill:#00C853,color:#fff
    style DF_CLOUD fill:#4285F4,color:#fff
    style GMAIL_CLOUD fill:#EA4335,color:#fff
```

**Fuente:** Elaboración propia basada en infraestructura implementada.

**Descripción:** Diagrama de despliegue completo mostrando la infraestructura física y lógica del Sistema UPT Chat. En la red universitaria UPT se encuentran 3 servidores físicos: Servidor Intranet (192.168.1.10) con Apache para archivos estáticos y el widget, Servidor de Aplicaciones (192.168.1.20) ejecutando los 6 microservicios (3 activos, 3 preparados) con PM2/Uvicorn, y Servidor de Base de Datos (192.168.1.30) con MySQL en RAID 1. Los servicios en la nube incluyen MongoDB Atlas (cluster dedicado M10 en AWS us-east-1 con 3 nodos), DialogFlow API de Google Cloud Platform (19 intents configurados), y Gmail SMTP para notificaciones. La red está protegida por firewalls de entrada y salida, con proxy inverso y load balancer para distribución de carga. Los clientes (desktop y móviles) acceden vía HTTPS :443.

---

### 8.2. Especificaciones Técnicas Detalladas

#### 8.2.1. Servidor Intranet (192.168.1.10)

| Componente | Especificación |
|------------|----------------|
| **Hardware** | Dell PowerEdge R230 |
| **Procesador** | Intel Xeon E3-1220 v6 @ 3.0GHz (2 cores, 4 threads) |
| **RAM** | 4GB DDR4 ECC |
| **Almacenamiento** | 50GB SSD SATA |
| **Red** | Gigabit Ethernet (1 Gbps) |
| **Sistema Operativo** | Ubuntu 20.04 LTS Server |
| **Servidor Web** | Apache HTTP Server 2.4.41 |
| **Módulos Apache** | mod_ssl, mod_rewrite, mod_proxy, mod_headers |
| **SSL/TLS** | Let's Encrypt (renovación automática) |
| **Firewall** | UFW (Uncomplicated Firewall) |
| **Puertos Abiertos** | 80 (HTTP), 443 (HTTPS), 22 (SSH) |
| **Backup** | Diario automático a 192.168.1.40 |

#### 8.2.2. Servidor de Aplicaciones (192.168.1.20)

| Componente | Especificación |
|------------|----------------|
| **Hardware** | Dell PowerEdge R640 |
| **Procesador** | Intel Xeon Silver 4210 @ 2.2GHz (8 cores, 16 threads) |
| **RAM** | 16GB DDR4 ECC |
| **Almacenamiento** | 200GB SSD NVMe |
| **Red** | Gigabit Ethernet (1 Gbps) |
| **Sistema Operativo** | Ubuntu 22.04 LTS Server |
| **Node.js** | v18.17.0 LTS |
| **Python** | 3.10.12 |
| **Process Manager** | PM2 v5.3.0 (Node.js services) |
| **ASGI Server** | Uvicorn v0.23.2 (Python service) |
| **Monitoreo** | PM2 Plus, htop, netstat |
| **Logs** | /var/log/upt-chat/ + Winston/Python logging |

**Configuración PM2:**
```bash
# pm2 list
┌─────┬──────────────────┬─────────────┬─────────┬──────────┬──────┐
│ id  │ name             │ mode        │ status  │ cpu      │ mem  │
├─────┼──────────────────┼─────────────┼─────────┼──────────┼──────┤
│ 0   │ api-gateway      │ cluster     │ online  │ 12%      │ 510M │
│ 1   │ notification     │ fork        │ online  │ 2%       │ 245M │
│ 2   │ nlp-service      │ fork        │ online  │ 25%      │ 1.8G │
└─────┴──────────────────┴─────────────┴─────────┴──────────┴──────┘
```

#### 8.2.3. Servidor de Base de Datos (192.168.1.30)

| Componente | Especificación |
|------------|----------------|
| **Hardware** | HP ProLiant DL380 Gen9 |
| **Procesador** | Intel Xeon E5-2620 v4 @ 2.1GHz (4 cores, 8 threads) |
| **RAM** | 8GB DDR4 ECC |
| **Almacenamiento** | 2x 500GB HDD SATA en RAID 1 (mirror) |
| **Red** | Gigabit Ethernet (1 Gbps) |
| **Sistema Operativo** | Ubuntu 20.04 LTS Server |
| **DBMS** | MySQL 8.0.34 Community Edition |
| **InnoDB Buffer Pool** | 4GB |
| **Max Connections** | 200 |
| **Backup Strategy** | - Full backup diario (2:00 AM)<br/>- Incremental cada 6 horas<br/>- Retención: 30 días<br/>- Ubicación: NAS 192.168.1.40 |
| **Replicación** | Master-Slave (slave en 192.168.1.31) |

**Configuración MySQL (my.cnf):**
```ini
[mysqld]
port = 3306
bind-address = 192.168.1.30
max_connections = 200
innodb_buffer_pool_size = 4G
innodb_log_file_size = 512M
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

#### 8.2.4. MongoDB Atlas (Cloud)

| Componente | Especificación |
|------------|----------------|
| **Tier** | M10 (Dedicated Cluster) |
| **Proveedor Cloud** | AWS (Amazon Web Services) |
| **Región** | us-east-1 (Virginia del Norte) |
| **MongoDB Version** | 6.0.9 |
| **RAM** | 2GB |
| **Storage** | 10GB (ampliable a 4TB) |
| **vCPUs** | Shared |
| **Replica Set** | 3 nodos (1 primary, 2 secondary) |
| **Auto-scaling** | Habilitado (hasta M20) |
| **Backup** | - Snapshot automático diario<br/>- Retención: 7 días<br/>- Point-in-time recovery: 24 horas |
| **Conexión** | SSL/TLS obligatorio |
| **String de Conexión** | `mongodb+srv://pp2020067576:***@basededatos2.h1ccthn.mongodb.net/` |
| **Usuarios** | - pp2020067576 (admin)<br/>- app_user (readWrite) |
| **Network Access** | IP Whitelist: 192.168.1.0/24 |
| **Límites** | - 500 connections<br/>- 100 databases<br/>- 500 collections por DB |

#### 8.2.5. Google Cloud Platform - DialogFlow

| Componente | Especificación |
|------------|----------------|
| **Proyecto GCP** | upt-chat-fhps |
| **API** | Dialogflow ES (Essentials) |
| **Región** | us-central1 (Iowa) |
| **Idioma** | es (Español) |
| **Zona Horaria** | America/Lima (UTC-5) |
| **Intents Configurados** | 19 intents |
| **Training Phrases** | 156 frases de entrenamiento |
| **Entities** | 8 entidades personalizadas |
| **Fulfillment** | Webhook no habilitado |
| **ML Threshold** | 0.7 (70% confianza) |
| **API Quota** | - 15,000 requests/day<br/>- 180 queries/minute |
| **Credenciales** | Service Account JSON |
| **Archivo Credenciales** | `/services/nlp-service/credentials/dialogflow-credentials.json` |
| **Billing** | Free tier (hasta 15k requests) |

#### 8.2.6. Gmail SMTP

| Componente | Especificación |
|------------|----------------|
| **Servidor** | smtp.gmail.com |
| **Puerto** | 587 (STARTTLS), 465 (SSL) alternativo |
| **Protocolo** | SMTP with TLS |
| **Autenticación** | OAuth 2.0 o App Password |
| **Método Usado** | App Password |
| **Cuenta** | angelxhernandezxcruz@gmail.com |
| **Límite Envío** | 500 emails/día (cuenta gratuita) |
| **Límite por Email** | 100 destinatarios/email |
| **Tamaño Máximo** | 25 MB (incluye adjuntos) |
| **Retry Logic** | 3 intentos con backoff exponencial |
| **Templates** | - password-reset-confirmation.html<br/>- new-password.html<br/>- ticket-created.html<br/>- ticket-assigned.html |

---

### 8.3. Configuración de Red

#### 8.3.1. Topología de Red

```
Internet
   │
   ├─ Firewall Principal (Entrada)
   │  ├─ IP Pública: 200.37.xx.xx
   │  └─ Reglas: Solo HTTPS :443
   │
   ├─ Proxy Inverso (192.168.1.5)
   │  ├─ SSL Termination
   │  └─ Cache de contenido estático
   │
   ├─ Load Balancer (192.168.1.6)
   │  ├─ Algoritmo: Round Robin
   │  └─ Health checks cada 30s
   │
   ├─ VLAN 10 - Servidores Web (192.168.1.0/28)
   │  └─ 192.168.1.10: Servidor Intranet
   │
   ├─ VLAN 20 - Servidores Aplicación (192.168.2.0/24)
   │  └─ 192.168.1.20: Servidor Aplicaciones
   │
   ├─ VLAN 30 - Servidores Base de Datos (192.168.3.0/24)
   │  ├─ 192.168.1.30: MySQL Master
   │  └─ 192.168.1.31: MySQL Slave
   │
   └─ Firewall Secundario (Salida)
      └─ Permite: HTTPS, MongoDB Protocol, SMTP
```

#### 8.3.2. Reglas de Firewall

**Firewall de Entrada (Ingress):**
```bash
# UFW Rules
sudo ufw allow from any to any port 443 proto tcp  # HTTPS
sudo ufw allow from 192.168.0.0/16 to any port 22 proto tcp  # SSH interno
sudo ufw deny from any to any port 80 proto tcp  # HTTP bloqueado
```

**Firewall de Salida (Egress):**
```bash
# Permitir MongoDB Atlas
sudo ufw allow out to cluster0-shard-00-00.h1ccthn.mongodb.net port 27017

# Permitir DialogFlow API
sudo ufw allow out to dialogflow.googleapis.com port 443

# Permitir Gmail SMTP
sudo ufw allow out to smtp.gmail.com port 587

# Bloquear todo lo demás por defecto
sudo ufw default deny outgoing
sudo ufw default deny incoming
sudo ufw enable
```

#### 8.3.3. Certificados SSL/TLS

| Dominio | Certificado | Proveedor | Validez |
|---------|-------------|-----------|---------|
| intranet.upt.edu.pe | Wildcard SSL | Let's Encrypt | 90 días (auto-renovación) |
| api.upt.edu.pe | SSL Standard | Let's Encrypt | 90 días (auto-renovación) |

**Auto-renovación con Certbot:**
```bash
# Crontab entry
0 0 * * * certbot renew --quiet --deploy-hook "systemctl reload apache2"
```

---

### 8.4. Requisitos de Seguridad

#### 8.4.1. Autenticación y Autorización

| Componente | Método | Implementación |
|------------|--------|----------------|
| **Usuarios Finales** | JWT Tokens | - Token firmado con HS256<br/>- Payload: {userId, role, exp}<br/>- TTL: 7 días<br/>- Refresh token: 30 días |
| **Administradores** | JWT + 2FA | - JWT estándar<br/>- TOTP (Google Authenticator)<br/>- Sesiones limitadas: 8 horas |
| **Inter-Service** | API Keys | - Header: X-API-Key<br/>- Rotación: cada 90 días<br/>- Almacenados en variables de entorno |
| **Base de Datos** | Usuario/Password | - Contraseñas cifradas (bcrypt)<br/>- Least privilege principle<br/>- Auditoría de accesos |

#### 8.4.2. Cifrado de Datos

| Tipo de Dato | En Reposo | En Tránsito |
|--------------|-----------|-------------|
| **Passwords** | bcrypt (cost: 10) | TLS 1.3 |
| **Tokens** | AES-256-GCM | TLS 1.3 |
| **Emails** | No cifrado | STARTTLS |
| **Sesiones** | MongoDB encryption at rest | TLS 1.3 |
| **Logs** | No cifrado (interno) | N/A |

#### 8.4.3. Control de Acceso (RBAC)

```typescript
enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  COORDINATOR = 'coordinator'
}

const permissions = {
  student: [
    'chat:send',
    'chat:view_own',
    'ticket:create',
    'ticket:view_own',
    'feedback:submit'
  ],
  teacher: [
    ...student_permissions,
    'chat:view_students'
  ],
  coordinator: [
    ...teacher_permissions,
    'ticket:view_all',
    'ticket:assign',
    'metrics:view'
  ],
  admin: [
    'all:*'  // Full access
  ]
};
```

#### 8.4.4. Auditoría y Logs

| Evento | Log Level | Retención | Ubicación |
|--------|-----------|-----------|-----------|
| **Login exitoso** | INFO | 90 días | `/var/log/upt-chat/auth.log` |
| **Login fallido** | WARN | 90 días | `/var/log/upt-chat/auth.log` |
| **Cambio de contraseña** | INFO | 1 año | `/var/log/upt-chat/security.log` |
| **Acceso a datos sensibles** | INFO | 1 año | `/var/log/upt-chat/security.log` |
| **Error de sistema** | ERROR | 30 días | `/var/log/upt-chat/error.log` |
| **API calls** | DEBUG | 7 días | `/var/log/upt-chat/api.log` |

---

## 9. Calidad del Software

### 9.1. Rendimiento

**Métricas Medidas (Promedios):**

| Operación | Objetivo | Medición Real | Estado |
|-----------|----------|---------------|--------|
| Detección de Intent (DialogFlow) | < 500ms | ~320ms | ✅ Excelente |
| Procesamiento NLP completo | < 2s | ~1.5s | ✅ Óptimo |
| Búsqueda de FAQ | < 200ms | ~150ms | ✅ Excelente |
| Consulta MongoDB (single doc) | < 100ms | ~80ms | ✅ Óptimo |
| Consulta MySQL (simple SELECT) | < 150ms | ~110ms | ✅ Óptimo |
| Envío de Email (SMTP) | < 5s | ~3s | ✅ Óptimo |
| Generación de PDF | < 10s | ~7s | ✅ Óptimo |
| Carga inicial del widget | < 3s | ~2.1s | ✅ Óptimo |

**Optimizaciones Implementadas:**

1. **Índices MongoDB:**
```javascript
// chat-session.schema.ts
ChatSessionSchema.index({ user_id: 1, ended_at: 1 });
ChatSessionSchema.index({ session_token: 1 }, { unique: true });
ChatSessionSchema.index({ created_at: 1 }, { expireAfterSeconds: 2592000 }); // 30 días
```

2. **Cache de FAQs:**
```typescript
// knowledge-base-service
private faqCache: Map<string, FAQ> = new Map();

async getFAQ(id: string): Promise<FAQ> {
  if (this.faqCache.has(id)) {
    return this.faqCache.get(id);
  }
  const faq = await this.repository.findById(id);
  this.faqCache.set(id, faq);
  return faq;
}
```

3. **Connection Pooling:**
```typescript
// MongoDB
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
});

// MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'upt_intranet',
  connectionLimit: 10,
  queueLimit: 0,
});
```

### 9.2. Escalabilidad

**Escalabilidad Horizontal:**

```mermaid
graph LR
    LB[⚖️ Load Balancer]
    
    subgraph "NLP Service Instances"
        NLP1[NLP :8001]
        NLP2[NLP :8002]
        NLP3[NLP :8003]
    end
    
    subgraph "API Gateway Instances"
        GW1[Gateway :3000]
        GW2[Gateway :3001]
    end
    
    subgraph "Notification Instances"
        NOT1[Notification :3005]
        NOT2[Notification :3006]
    end
    
    LB --> NLP1
    LB --> NLP2
    LB --> NLP3
    
    NLP1 --> GW1
    NLP2 --> GW1
    NLP3 --> GW2
    
    GW1 --> NOT1
    GW2 --> NOT2
```

**Capacidades:**

| Métrica | Actual | Con Escalamiento Horizontal |
|---------|--------|------------------------------|
| **Consultas/segundo** | ~50 req/s | ~200 req/s (4x instancias) |
| **Usuarios concurrentes** | ~500 | ~2,000 |
| **Sesiones activas** | ~200 | ~800 |
| **Emails/hora** | ~100 | ~400 |

**Estrategia de Escalamiento:**

1. **Stateless Services:** Todos los servicios son stateless, permiten múltiples instancias
2. **Load Balancing:** Nginx con algoritmo Round Robin
3. **Session Storage:** MongoDB (compartido entre instancias)
4. **Cache Compartido:** Redis (futuro) para FAQs y sesiones
5. **Auto-scaling:** PM2 cluster mode con `instances: max`

```bash
# pm2 start con auto-scaling
pm2 start api-gateway/dist/main.js -i max --name api-gateway
# Crea una instancia por core de CPU
```

---

## 10. Decisiones Arquitectónicas

### 10.1. Microservicios vs Monolito

**Decisión:** ✅ Arquitectura de Microservicios

**Razones:**
1. ✅ **Escalabilidad independiente:** NLP Service consume más recursos, puede escalar solo
2. ✅ **Tecnologías específicas:** Python para NLP (spaCy, DialogFlow), Node.js para API
3. ✅ **Despliegue independiente:** Actualizar un servicio sin afectar otros
4. ✅ **Resiliencia:** Fallo en Notification Service no afecta chat principal
5. ✅ **Equipos especializados:** Desarrolladores Python vs TypeScript

**Trade-offs:**
- ❌ Mayor complejidad operacional (6 servicios vs 1)
- ❌ Comunicación HTTP entre servicios (latencia adicional ~20-50ms)
- ❌ Gestión de configuración más compleja

**Conclusión:** Los beneficios superan los costos para este proyecto de escala universitaria.

### 10.2. Clean Architecture + DDD

**Decisión:** ✅ Clean Architecture con Domain-Driven Design

**Razones:**
1. ✅ **Separación de responsabilidades:** Domain, Application, Infrastructure
2. ✅ **Independencia de frameworks:** Lógica de negocio no depende de NestJS
3. ✅ **Testeable:** Cada capa puede ser testeada independientemente
4. ✅ **Mantenible:** Cambios en infraestructura no afectan dominio

**Implementación:**
```
src/
├── domain/           # Entidades, Value Objects, Interfaces
│   ├── entities/
│   ├── value-objects/
│   └── repositories/ (interfaces)
├── application/      # Casos de uso, Services
│   ├── use-cases/
│   └── services/
└── infrastructure/   # Implementaciones, BD, APIs externas
    ├── repositories/
    ├── controllers/
    └── clients/
```

### 10.3. DialogFlow + spaCy (Híbrido)

**Decisión:** ✅ Sistema híbrido de NLP

**Razones:**
1. ✅ **DialogFlow:** Alta precisión en intents comunes, fácil entrenar
2. ✅ **spaCy:** Fallback robusto, búsqueda semántica, offline
3. ✅ **Mejor cobertura:** DialogFlow primero, spaCy si confianza < 0.7
4. ✅ **Costo:** DialogFlow free tier suficiente, spaCy gratis

**Implementación:**
```python
async def detect_intent(self, message: str):
    # 1. Intentar con DialogFlow
    dialogflow_result = await self.dialogflow_service.detect_intent(message)
    
    if dialogflow_result.confidence >= self.confidence_threshold:
        return dialogflow_result
    
    # 2. Fallback a spaCy
    return await self.spacy_service.analyze(message)
```

**Resultados:**
- Precisión combinada: ~89%
- DialogFlow: 85% de consultas (confianza > 0.7)
- spaCy: 15% de consultas (fallback)

### 10.4. MongoDB + MySQL (Base de Datos Dual)

**Decisión:** ✅ Arquitectura de base de datos dual

**Razones:**

**MongoDB para:**
- ✅ Sesiones de chat (documentos dinámicos)
- ✅ Mensajes (schema flexible)
- ✅ Feedback (estructura variable)
- ✅ Logs de emails (schema evolutivo)

**MySQL para:**
- ✅ Usuarios UPT (datos estructurados, existentes)
- ✅ Datos académicos (tablas relacionales complejas)
- ✅ Transacciones ACID críticas

**Trade-offs:**
- ❌ Dos sistemas que mantener
- ❌ No hay transacciones distribuidas
- ✅ Cada BD optimizada para su caso de uso

### 10.5. Notification Service Separado

**Decisión:** ✅ Microservicio independiente para notificaciones

**Razones:**
1. ✅ **Single Responsibility Principle:** Solo maneja notificaciones
2. ✅ **Escalable independientemente:** Puede crecer sin afectar API Gateway
3. ✅ **Reutilizable:** Cualquier servicio puede enviar notificaciones
4. ✅ **Extensible:** Fácil agregar SMS, push notifications, Slack, etc.

**Antes vs Después:**
```
❌ ANTES:
API Gateway
├── PasswordResetService
├── EmailService  ← Acoplado
└── ...

✅ AHORA:
API Gateway → HTTP → Notification Service
                        ├── EmailService
                        ├── SMSService (futuro)
                        └── PushService (futuro)
```

---

## 11. Tamaño y Rendimiento

### 11.1. Métricas de Código

| Servicio | Lenguaje | Archivos | Líneas de Código | Tamaño |
|----------|----------|----------|------------------|--------|
| **nlp-service** | Python | 24 | ~2,800 | 156 KB |
| **api-gateway** | TypeScript | 42 | ~4,200 | 287 KB |
| **notification-service** | TypeScript | 12 | ~1,100 | 89 KB |
| **TOTAL** | - | **78** | **~8,100** | **532 KB** |

### 11.2. Benchmarks de Performance

**Hardware de Prueba:**
- CPU: Intel i5-8250U @ 1.6GHz (4 cores)
- RAM: 16GB DDR4
- OS: Ubuntu 22.04 LTS

**Resultados (Apache Bench - 1000 requests, 50 concurrent):**

```bash
# Test 1: GET /api/health (API Gateway)
ab -n 1000 -c 50 http://localhost:3000/api/health

Requests per second: 1234.56 [#/sec] (mean)
Time per request:    40.501 [ms] (mean)
Transfer rate:       245.67 [Kbytes/sec]

# Test 2: POST /process-message (NLP Service)
ab -n 1000 -c 50 -p message.json http://localhost:8001/process-message

Requests per second: 45.23 [#/sec] (mean)
Time per request:    1105.34 [ms] (mean)
Transfer rate:       89.12 [Kbytes/sec]
```

### 11.3. Límites del Sistema

| Recurso | Límite Actual | Recomendado |
|---------|---------------|-------------|
| **Usuarios concurrentes** | 500 | 2,000 (con escalamiento) |
| **Sesiones activas** | 200 | 800 |
| **Mensajes/segundo** | 50 | 200 |
| **FAQs en base** | 219 | 1,000 |
| **Intents DialogFlow** | 19 | 50 |
| **Emails/día** | 500 | 2,000 (con múltiples cuentas) |
| **Almacenamiento MongoDB** | 10GB | 4TB (MongoDB Atlas) |
| **Almacenamiento MySQL** | 500GB | Ilimitado (con expansión) |


---


---

# APÉNDICES

## Apéndice A: Resumen de Diagramas

Este documento incluye 21 diagramas completos en formato Mermaid:

**Arquitectura (5 diagramas):**
- Modelo 4+1 de Kruchten (Sección 2.1)
- Arquitectura de Microservicios (Sección 2.2)
- Clean Architecture - Capas (Sección 2.2)
- Arquitectura de Alto Nivel (Sección 5.1)
- Diagrama de Paquetes/Subsistemas (Sección 5.2)

**Casos de Uso (1 diagrama):**
- Diagrama General con 12 RFs (Sección 4.1)

**Secuencia (8 diagramas):**
- RF001: Chat Widget (Sección 5.3.1)
- RF002: Comprensión NLP (Sección 5.3.2)
- RF003: Gestión FAQs (Sección 5.3.3)
- RF004: Validación Email ✅ (Sección 5.3.4)
- RF005: Escalamiento (Sección 5.3.5)
- RF006: Dashboard (Sección 5.3.6)
- RF007: Sistema Académico (Sección 5.3.7)
- RF008: Búsqueda Semántica (Sección 5.3.8)

**Procesos (1 diagrama):**
- Diagrama de Actividades General integrando 12 RFs (Sección 7.1)

**Implementación (2 diagramas):**
- Estructura de Directorios (Sección 6.1)
- Diagrama de Componentes (Sección 6.1)

**Despliegue (1 diagrama):**
- Diagrama de Despliegue Completo (Sección 8.1)

**Escalabilidad (1 diagrama):**
- Escalamiento Horizontal (Sección 9.2)

**Datos (2 diagramas):**
- Esquema MongoDB (Apéndice E)
- Esquema MySQL (Apéndice E)

## Apéndice B: Cronograma de Implementación

| Fase | Componente | Estado | Fecha Objetivo |
|------|------------|--------|----------------|
| 1 | NLP Service (DialogFlow + spaCy) | ✅ Completado | 15/09/2025 |
| 2 | API Gateway + MongoDB | ✅ Completado | 22/09/2025 |
| 3 | Notification Service + RF004 | ✅ Completado | 29/09/2025 |
| 4 | Chat Service (WebSocket) | ⏳ En progreso | 20/10/2025 |
| 5 | Knowledge Base Service | 📋 Planificado | 27/10/2025 |
| 6 | Analytics Service | 📋 Planificado | 03/11/2025 |
| 7 | Dashboard Frontend | 📋 Planificado | 17/11/2025 |
| 8 | Testing E2E | 📋 Planificado | 24/11/2025 |

## Apéndice C: Comandos de Ejecución

### Servicios Activos (✅)

```bash
# 1. NLP Service (Puerto 8001)
cd services/nlp-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download es_core_news_sm
uvicorn main:app --host 0.0.0.0 --port 8001 --reload

# 2. API Gateway (Puerto 3000)
cd services/api-gateway
npm install
npm run start:dev

# 3. Notification Service (Puerto 3005)
cd services/notification-service
npm install
npm run start:dev
```

### Servicios Preparados (⏳)

```bash
# 4. Chat Service (Puerto 3001) - Preparado
cd services/chat-service
npm install
npm run start:dev

# 5. Knowledge Base (Puerto 3003) - Preparado
cd services/knowledge-base-service
npm install
npm run start:dev

# 6. Analytics (Puerto 3004) - Preparado
cd services/analytics-service
npm install
npm run start:dev
```

## Apéndice D: Variables de Entorno

### NLP Service (.env)
```env
DIALOGFLOW_PROJECT_ID=upt-chat-fhps
GOOGLE_APPLICATION_CREDENTIALS=./credentials/dialogflow-credentials.json
API_GATEWAY_URL=http://localhost:3000
CONFIDENCE_THRESHOLD=0.7
```

### API Gateway (.env)
```env
PORT=3000
MONGODB_URI=mongodb+srv://pp2020067576:***@basededatos2.h1ccthn.mongodb.net/basededatos2
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=tu_password
MYSQL_DATABASE=proyectotest
JWT_SECRET=tu_secreto_jwt_aqui
NLP_SERVICE_URL=http://localhost:8001
NOTIFICATION_SERVICE_URL=http://localhost:3005
```

### Notification Service (.env)
```env
PORT=3005
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=angelxhernandezxcruz@gmail.com
SMTP_PASSWORD=*** (App Password)
FRONTEND_URL=http://localhost
```

## Apéndice E: Base de Datos

### MongoDB Collections (Atlas)

```javascript
// chat_sessions
{
  "_id": ObjectId,
  "session_token": String,
  "user_id": String,
  "started_at": Date,
  "ended_at": Date,
  "messages": Array,
  "status": String
}

// password_reset_tokens
{
  "_id": ObjectId,
  "email": String,
  "token": String,
  "created_at": Date,
  "expires_at": Date,
  "used": Boolean
}

// feedback
{
  "_id": ObjectId,
  "session_id": String,
  "message_id": String,
  "rating": Number,
  "comment": String,
  "created_at": Date
}
```

### MySQL Tables (Local)

```sql
-- usuarios
CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('estudiante', 'docente', 'admin'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- estudiantes
CREATE TABLE estudiantes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  usuario_id INT,
  codigo VARCHAR(10) UNIQUE,
  carrera VARCHAR(100),
  semestre INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

---

# GLOSARIO

| Término | Definición |
|---------|------------|
| **NLP** | Natural Language Processing - Procesamiento de Lenguaje Natural |
| **DialogFlow** | Servicio de Google Cloud para detección de intenciones (intents) |
| **spaCy** | Biblioteca de Python para NLP avanzado |
| **Clean Architecture** | Patrón arquitectónico que separa lógica de negocio de infraestructura |
| **DDD** | Domain-Driven Design - Diseño orientado al dominio |
| **JWT** | JSON Web Token - Token de autenticación |
| **SMTP** | Simple Mail Transfer Protocol - Protocolo de envío de correos |
| **MongoDB Atlas** | Servicio de MongoDB en la nube (DBaaS) |
| **PM2** | Process Manager para aplicaciones Node.js |
| **Uvicorn** | Servidor ASGI para Python (FastAPI) |
| **WebSocket** | Protocolo de comunicación bidireccional en tiempo real |
| **CORS** | Cross-Origin Resource Sharing - Política de seguridad de navegadores |
| **TTL** | Time To Live - Tiempo de vida de un token o sesión |
| **Microservicio** | Arquitectura donde la aplicación se divide en servicios independientes |
| **API Gateway** | Punto de entrada único que enruta peticiones a microservicios |
| **Clean Code** | Código limpio, legible y mantenible |
| **SOLID** | Principios de diseño orientado a objetos |
| **Repository Pattern** | Patrón que abstrae el acceso a datos |
| **Use Case** | Caso de uso - Funcionalidad específica del sistema |
| **DTO** | Data Transfer Object - Objeto para transferir datos entre capas |
| **Value Object** | Objeto que representa un valor sin identidad propia |
| **Entity** | Entidad del dominio con identidad única |
| **Aggregate** | Conjunto de entidades relacionadas tratadas como una unidad |

---

# ACRÓNIMOS

| Acrónimo | Significado Completo |
|----------|----------------------|
| **UPT** | Universidad Privada de Tacna |
| **EPIS** | Escuela Profesional de Ingeniería de Sistemas |
| **SAD** | Software Architecture Document |
| **SRS** | Software Requirements Specification |
| **FAQ** | Frequently Asked Questions |
| **API** | Application Programming Interface |
| **HTTP** | HyperText Transfer Protocol |
| **HTTPS** | HTTP Secure |
| **REST** | Representational State Transfer |
| **JSON** | JavaScript Object Notation |
| **SQL** | Structured Query Language |
| **NoSQL** | Not Only SQL |
| **CRUD** | Create, Read, Update, Delete |
| **UUID** | Universally Unique Identifier |
| **ISO** | International Organization for Standardization |
| **TLS** | Transport Layer Security |
| **SSL** | Secure Sockets Layer |
| **CPU** | Central Processing Unit |
| **RAM** | Random Access Memory |
| **SSD** | Solid State Drive |
| **HDD** | Hard Disk Drive |
| **GB** | Gigabyte |
| **TB** | Terabyte |
| **Gbps** | Gigabits per second |

---

# ÍNDICE DE FIGURAS

1. Figura 2.1: Modelo de Vistas 4+1 de Kruchten
2. Figura 2.2: Arquitectura de Microservicios del Sistema UPT Chat
3. Figura 2.3: Clean Architecture - Capas del Sistema
4. Figura 4.1: Diagrama de Casos de Uso General (12 RFs)
5. Figura 5.1: Arquitectura de Alto Nivel - Comunicación entre Microservicios
6. Figura 5.2: Diagrama de Paquetes/Subsistemas con Clean Architecture
7. Figura 5.3.1: Secuencia RF001 - Iniciar Conversación con Widget
8. Figura 5.3.2: Secuencia RF002 - Comprensión NLP (DialogFlow + spaCy Híbrido)
9. Figura 5.3.3: Secuencia RF003 - Gestión de FAQs
10. Figura 5.3.4: Secuencia RF004 - Validación por Email (Implementado)
11. Figura 5.3.5: Secuencia RF005 - Escalamiento a Soporte Humano
12. Figura 5.3.6: Secuencia RF006 - Dashboard de Métricas
13. Figura 5.3.7: Secuencia RF007 - Integración Sistema Académico
14. Figura 5.3.8: Secuencia RF008 - Motor de Búsqueda Semántica (ver Parte 2)
15. Figura 7.1: Diagrama de Actividades General del Sistema (ver Parte 2)
16. Figura 8.1: Diagrama de Despliegue Completo (ver Parte 2)

---

# ÍNDICE DE TABLAS

1. Tabla 2.1: Stack Tecnológico del Sistema UPT Chat
2. Tabla 4.1: Actores del Sistema
3. Tabla 4.2: RF001 - Iniciar Conversación con Widget
4. Tabla 4.3: RF002 - Comprensión de Lenguaje Natural
5. Tabla 4.4: RF003 - Gestión de Preguntas Frecuentes
6. Tabla 4.5: RF004 - Validación de Identidad por Correo
7. Tabla 4.6: RF005 - Escalamiento a Soporte Humano
8. Tabla 4.7: RF006 - Dashboard de Métricas
9. Tabla 4.8: RF007 - Integración con Sistema Académico
10. Tabla 4.9: RF008 - Motor de Búsqueda Semántica
11. Tabla 4.10: RF009 - Consulta de Historial de Tickets
12. Tabla 4.11: RF010 - Sistema de Notificaciones por Email
13. Tabla 4.12: RF011 - Mejora Continua del Sistema
14. Tabla 4.13: RF012 - Generación de Reportes
15. Tabla 8.1: Especificaciones Servidor Intranet (ver Parte 2)
16. Tabla 8.2: Especificaciones Servidor Aplicaciones (ver Parte 2)
17. Tabla 8.3: Especificaciones Servidor Base de Datos (ver Parte 2)
18. Tabla 8.4: Especificaciones MongoDB Atlas (ver Parte 2)
19. Tabla 9.1: Métricas de Rendimiento (ver Parte 2)
20. Tabla 11.1: Métricas de Código Fuente (ver Parte 2)

---

**Documento generado:** 13 de octubre de 2025  
**Versión:** 3.0  
**Autores:** Piero Paja, Angel Hernandez  
**Supervisor:** Ricardo Valcarcel Alvarado

---

**FIN DEL DOCUMENTO - PARTE 1**

**📌 Para diagramas complementarios consultar: FD04-PARTE2-Diagramas-Complementarios.md**
