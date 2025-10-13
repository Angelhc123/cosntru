# 🗺️ Mapa Visual de Documentación - FD04 SAD

```
📁 Sistema UPT Chat - Documentación Completa
│
├── 📘 DOCUMENTOS PRINCIPALES (Revisión Académica)
│   │
│   ├── 📄 FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md ⭐ [PARTE 1]
│   │   ├── 📑 Control de Versiones (v3.0)
│   │   ├── 📋 Índice General Completo
│   │   ├── 1️⃣ Introducción
│   │   │   ├── 1.1 Propósito
│   │   │   ├── 1.2 Alcance
│   │   │   ├── 1.3 Definiciones y Acrónimos
│   │   │   ├── 1.4 Referencias
│   │   │   └── 1.5 Visión General
│   │   ├── 2️⃣ Representación Arquitectónica
│   │   │   ├── 🎯 Modelo 4+1 de Kruchten (Mermaid)
│   │   │   ├── 🏗️ Arquitectura Microservicios (Mermaid)
│   │   │   ├── 🎨 Clean Architecture (Mermaid)
│   │   │   └── 🔧 Stack Tecnológico (Tabla)
│   │   ├── 3️⃣ Objetivos y Restricciones
│   │   ├── 4️⃣ Vista de Casos de Uso
│   │   │   ├── 📊 Diagrama General (12 RFs) (Mermaid)
│   │   │   ├── 👥 Tabla de Actores
│   │   │   └── 📝 Especificaciones Detalladas
│   │   │       ├── RF001: Chat Widget
│   │   │       ├── RF002: NLP
│   │   │       ├── RF003: FAQs
│   │   │       ├── RF004: Validación Email ✅
│   │   │       ├── RF005: Escalamiento
│   │   │       ├── RF006: Dashboard
│   │   │       ├── RF007: Sistema Académico
│   │   │       ├── RF008: Búsqueda Semántica
│   │   │       ├── RF009: Historial Tickets
│   │   │       ├── RF010: Notificaciones Email ✅
│   │   │       ├── RF011: Mejora Continua
│   │   │       └── RF012: Reportes
│   │   ├── 5️⃣ Vista Lógica
│   │   │   ├── 🏗️ Arquitectura Alto Nivel (Mermaid)
│   │   │   ├── 📦 Diagrama de Paquetes (Mermaid)
│   │   │   └── 🔄 Diagramas de Secuencia
│   │   │       ├── 5.3.1 RF001 (Mermaid)
│   │   │       ├── 5.3.2 RF002 (Mermaid)
│   │   │       ├── 5.3.3 RF003 (Mermaid)
│   │   │       ├── 5.3.4 RF004 ✅ (Mermaid)
│   │   │       ├── 5.3.5 RF005 (Mermaid)
│   │   │       ├── 5.3.6 RF006 (Mermaid)
│   │   │       └── 5.3.7 RF007 (Mermaid)
│   │   ├── 6️⃣ Vista de Implementación
│   │   │   ├── 📁 Estructura de Directorios
│   │   │   └── 🧩 Diagrama de Componentes
│   │   ├── 7️⃣ Vista de Datos
│   │   │   ├── 🍃 MongoDB Schemas
│   │   │   └── 🐬 MySQL Tables
│   │   ├── 8️⃣ Tamaño y Rendimiento
│   │   ├── 9️⃣ Resumen Ejecutivo
│   │   │   ├── Estado Actual
│   │   │   ├── Logros
│   │   │   └── Lecciones Aprendidas
│   │   ├── 🔟 Referencias
│   │   ├── 📎 Apéndices
│   │   │   ├── A: Diagramas Complementarios (→ Parte 2)
│   │   │   ├── B: Cronograma
│   │   │   ├── C: Comandos de Ejecución
│   │   │   ├── D: Variables de Entorno
│   │   │   └── E: Base de Datos
│   │   ├── 📖 Glosario
│   │   ├── 🔤 Acrónimos
│   │   ├── 🖼️ Índice de Figuras (20 figuras)
│   │   └── 📊 Índice de Tablas (20 tablas)
│   │
│   └── 📄 FD04-PARTE2-Diagramas-Complementarios.md ⭐ [PARTE 2]
│       ├── 5️⃣.3.8 Secuencia RF008 (Búsqueda Semántica)
│       │   └── 🔍 Diagrama completo con vectores (Mermaid)
│       ├── 7️⃣ Vista de Procesos
│       │   └── 🔄 Diagrama de Actividades General (Mermaid)
│       │       └── ⚡ Integra TODOS los 12 RFs
│       ├── 8️⃣ Vista de Despliegue
│       │   ├── 🌐 Diagrama Completo (Mermaid)
│       │   ├── 🖥️ Especificaciones Técnicas
│       │   │   ├── Servidor Intranet (192.168.1.10)
│       │   │   ├── Servidor Aplicaciones (192.168.1.20)
│       │   │   ├── Servidor BD (192.168.1.30)
│       │   │   ├── MongoDB Atlas (Cloud)
│       │   │   ├── DialogFlow (GCP)
│       │   │   └── Gmail SMTP
│       │   ├── 🔌 Configuración de Red
│       │   │   ├── Topología
│       │   │   ├── Reglas Firewall
│       │   │   └── Certificados SSL/TLS
│       │   └── 🔐 Seguridad
│       │       ├── Autenticación (JWT, 2FA)
│       │       ├── Cifrado (bcrypt, AES-256)
│       │       ├── Control de Acceso (RBAC)
│       │       └── Auditoría y Logs
│       ├── 9️⃣ Calidad del Software
│       │   ├── 📈 Rendimiento (métricas medidas)
│       │   └── 📊 Escalabilidad (horizontal scaling)
│       ├── 🔟 Decisiones Arquitectónicas
│       │   ├── Microservicios vs Monolito
│       │   ├── Clean Architecture + DDD
│       │   ├── DialogFlow + spaCy Híbrido
│       │   ├── MongoDB + MySQL Dual
│       │   └── Notification Service Separado
│       └── 1️⃣1️⃣ Tamaño y Rendimiento
│           ├── Métricas de Código
│           ├── Benchmarks (Apache Bench)
│           └── Límites del Sistema
│
├── 📗 DOCUMENTOS DE PLANIFICACIÓN
│   │
│   └── 📄 INFORME_PLANIFICACION_FD04.md
│       ├── 🎯 Objetivos
│       ├── 📋 18 Diagramas Identificados
│       ├── 📅 Cronograma 7 días
│       ├── ✅ Checklist Detallado
│       ├── 📐 Ejemplos Mermaid
│       └── 🎓 Criterios de Calidad
│
├── 📙 DOCUMENTOS DE IMPLEMENTACIÓN
│   │
│   ├── 📄 ARQUITECTURA_MICROSERVICIOS_RF004.md
│   │   ├── 🏗️ Arquitectura Detallada RF004
│   │   ├── 🔄 Diagramas de Secuencia
│   │   ├── 💾 Schemas MongoDB
│   │   ├── 🔐 Lógica de Tokens
│   │   └── 📧 Integración Notification Service
│   │
│   └── 📄 RESUMEN_RF004.md
│       ├── ✅ Estado de Implementación
│       ├── 🔄 Flujo Completo
│       ├── 🐛 Issues y Resolución
│       ├── 🧪 Pruebas Realizadas
│       └── 📸 Capturas de Pantalla
│
├── 📕 DOCUMENTOS DE REQUISITOS
│   │
│   └── 📄 FD03-EPIS-Informe_SRS_de_Proyecto-FORMATO.md
│       ├── 📋 Especificación de Requisitos
│       ├── 🎯 12 Requisitos Funcionales
│       ├── 🔧 Requisitos No Funcionales
│       └── 👥 Casos de Uso Iniciales
│
└── 📖 GUÍAS Y REFERENCIAS
    │
    ├── 📄 GUIA_DOCUMENTACION_COMPLETA.md ⭐ [ESTA GUÍA]
    │   ├── 📚 Estructura de Documentación
    │   ├── 📖 Cómo Leer (Académico, Desarrollo, Implementación)
    │   ├── 📊 Resumen de Diagramas (18+)
    │   ├── 🎯 Cobertura de Requisitos
    │   ├── 🔍 Búsqueda Rápida
    │   └── ✅ Checklist de Completitud
    │
    └── 📄 MAPA_VISUAL_DOCUMENTACION.md ⭐ [ESTE ARCHIVO]
        └── 🗺️ Mapa visual interactivo
```

---

## 🎯 Acceso Rápido por Tipo de Usuario

### 👨‍🏫 Profesor / Revisor Académico
```
START HERE ↓

1. 📄 FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md
   ├─ Control de Versiones (v3.0)
   ├─ Índice General
   ├─ Secciones 1-6 (Arquitectura completa)
   └─ Sección 9 (Resumen Ejecutivo)

2. 📄 FD04-PARTE2-Diagramas-Complementarios.md
   ├─ Sección 7 (Diagrama de Actividades - integración completa)
   ├─ Sección 8 (Diagrama de Despliegue - infraestructura)
   └─ Sección 10 (Decisiones Arquitectónicas - justificación)

3. 📄 RESUMEN_RF004.md
   └─ Evidencia de código funcional

⏱️ Tiempo: 45-60 minutos
🎯 Enfoque: Arquitectura, diagramas, decisiones técnicas, evidencia real
```

### 👨‍💻 Estudiante / Desarrollador
```
START HERE ↓

1. 📄 GUIA_DOCUMENTACION_COMPLETA.md [LEER PRIMERO]
   └─ Entender estructura completa

2. 📄 INFORME_PLANIFICACION_FD04.md
   └─ Ver roadmap y checklist

3. 📄 FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md
   ├─ Sección 2 (Patrones Arquitectónicos)
   ├─ Sección 4 (Casos de Uso)
   ├─ Sección 5 (Secuencias)
   └─ Sección 6 (Estructura Código)

4. 📄 ARQUITECTURA_MICROSERVICIOS_RF004.md
   └─ Ver implementación real

5. 📄 FD04-PARTE2-Diagramas-Complementarios.md
   └─ Sección 8 (Setup infraestructura)

⏱️ Tiempo: 2-3 horas
🎯 Enfoque: Aprender arquitectura, estudiar código, entender flujos
```

### 🛠️ Nuevo Desarrollador / Implementador
```
START HERE ↓

1. 📄 FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md
   ├─ Apéndice C (Comandos de Ejecución)
   ├─ Apéndice D (Variables de Entorno)
   └─ Apéndice E (Base de Datos)

2. 📄 FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md
   ├─ Sección 2.2 (Arquitectura Microservicios + Clean)
   ├─ Sección 6 (Estructura de Código)
   └─ Diagrama de Figura 2.3 (Clean Architecture)

3. 📄 ARQUITECTURA_MICROSERVICIOS_RF004.md
   └─ Estudiar ejemplo completo funcional

4. Para nuevo RF:
   ├─ Ver RF similar en Sección 4.3
   ├─ Ver secuencia correspondiente (Sección 5.3)
   └─ Seguir estructura Clean Architecture

5. 📄 FD04-PARTE2-Diagramas-Complementarios.md
   ├─ Sección 8.1 (Diagrama de Despliegue)
   ├─ Sección 8.3 (Configuración Red)
   └─ Sección 8.4 (Seguridad)

⏱️ Tiempo: 1 día setup, 3-5 días para primer RF
🎯 Enfoque: Setup rápido, entender estructura, implementar
```

---

## 📊 Estadísticas de Documentación

```
📄 Total de Archivos: 8
📝 Total de Líneas: ~12,000+
🎨 Total de Diagramas: 20+
📊 Total de Tablas: 25+
⏱️ Tiempo de Generación: 5 días
✅ Completitud: 100%

Distribución:
├─ FD04 Parte 1: ~2,600 líneas (22%)
├─ FD04 Parte 2: ~1,200 líneas (10%)
├─ Planificación: ~800 líneas (7%)
├─ Arquitectura RF004: ~600 líneas (5%)
├─ Resumen RF004: ~400 líneas (3%)
├─ FD03 SRS: ~3,000 líneas (25%)
├─ Guía Documentación: ~600 líneas (5%)
└─ Código Fuente: ~8,100 líneas (código real) (28%)
```

---

## 🔍 Búsqueda de Contenido Específico

| Necesito... | Ir a... | Sección |
|-------------|---------|---------|
| **Diagrama de Casos de Uso** | FD04 Parte 1 | Sección 4.1 |
| **Todos los Casos de Uso Especificados** | FD04 Parte 1 | Sección 4.3 (12 RFs) |
| **Secuencias RF001-RF007** | FD04 Parte 1 | Sección 5.3.1 a 5.3.7 |
| **Secuencia RF008 (Búsqueda Semántica)** | FD04 Parte 2 | Sección 5.3.8 |
| **Diagrama de Actividades (TODOS los RFs)** | FD04 Parte 2 | Sección 7.1 |
| **Diagrama de Despliegue** | FD04 Parte 2 | Sección 8.1 |
| **Configuración de Servidores** | FD04 Parte 2 | Sección 8.2 |
| **Decisiones Arquitectónicas** | FD04 Parte 2 | Sección 10 (completa) |
| **Benchmarks de Performance** | FD04 Parte 2 | Sección 11.2 |
| **Comandos para ejecutar servicios** | FD04 Parte 1 | Apéndice C |
| **Variables de entorno** | FD04 Parte 1 | Apéndice D |
| **Schemas de MongoDB** | FD04 Parte 1 | Apéndice E |
| **Schemas de MySQL** | FD04 Parte 1 | Apéndice E |
| **Stack tecnológico completo** | FD04 Parte 1 | Tabla 2.1, Sección 2.3 |
| **Modelo 4+1 de Kruchten** | FD04 Parte 1 | Sección 2.1 |
| **Clean Architecture detallada** | FD04 Parte 1 | Sección 2.2, Figura 2.3 |
| **Estructura de directorios** | FD04 Parte 1 | Sección 6 |
| **RF004 implementación completa** | ARQUITECTURA_MICROSERVICIOS_RF004.md | Todo el documento |
| **Evidencia de funcionamiento** | RESUMEN_RF004.md | Todo el documento |
| **Roadmap completo** | INFORME_PLANIFICACION_FD04.md | Todo el documento |

---

## 🎨 Leyenda de Símbolos

| Símbolo | Significado |
|---------|-------------|
| ⭐ | Documento principal / Importante |
| ✅ | Implementado y funcional |
| ⏳ | Preparado pero no iniciado |
| 📋 | Planificado |
| 🎯 | Objetivo / Meta |
| 🏗️ | Arquitectura |
| 🔄 | Proceso / Flujo |
| 🔐 | Seguridad |
| 📊 | Métricas / Datos |
| 🧩 | Componente |
| 💾 | Base de Datos |
| 📧 | Email / Notificación |
| 🌐 | Red / Web |
| 🔍 | Búsqueda |
| 📱 | Cliente / Frontend |
| 🖥️ | Servidor / Backend |
| ☁️ | Cloud / Nube |
| 🐛 | Bug / Issue |
| 🧪 | Testing / Pruebas |
| 📸 | Evidencia / Captura |
| 👥 | Usuarios / Actores |

---

## 📈 Progreso del Proyecto

```
Fase 1: Requisitos ████████████████████ 100% ✅
│
├─ FD03 SRS completado
└─ 12 RFs definidos

Fase 2: Arquitectura ████████████████████ 100% ✅
│
├─ FD04 Parte 1 completado
├─ FD04 Parte 2 completado
├─ 20+ diagramas generados
└─ Todas las vistas arquitectónicas

Fase 3: Implementación ████████████░░░░░ 60%
│
├─ NLP Service ████████████████████ 100% ✅
├─ API Gateway ████████████████████ 100% ✅
├─ Notification ████████████████████ 100% ✅
├─ Chat Service ████████░░░░░░░░░░░ 40% ⏳
├─ Knowledge Base ░░░░░░░░░░░░░░░░░░ 0% 📋
└─ Analytics ░░░░░░░░░░░░░░░░░░ 0% 📋

Fase 4: Testing ████░░░░░░░░░░░░░░ 20%
│
├─ Unit Tests ████████░░░░░░░░░░░░ 40%
├─ Integration ░░░░░░░░░░░░░░░░░░ 0%
└─ E2E ░░░░░░░░░░░░░░░░░░ 0%

Progreso General: ████████████░░░░░░░░ 70%
```

---

## 🔗 Flujo de Lectura Recomendado

### Para Entrega Académica
```
1. GUIA_DOCUMENTACION_COMPLETA.md (esta guía)
          ↓
2. FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md
          ↓
3. FD04-PARTE2-Diagramas-Complementarios.md
          ↓
4. RESUMEN_RF004.md (evidencia)
```

### Para Desarrollo Continuo
```
1. INFORME_PLANIFICACION_FD04.md (roadmap)
          ↓
2. FD04 Parte 1 (arquitectura)
          ↓
3. ARQUITECTURA_MICROSERVICIOS_RF004.md (ejemplo)
          ↓
4. Implementar nuevo RF
          ↓
5. FD04 Parte 2 Sección 8 (deploy)
```

---

## 📞 Información de Contacto

**Autores:**
- 👨‍💻 Piero Alexander Paja de la Cruz
  - Código: 2020067576
  - Rol: Arquitecto Principal, Backend Developer

- 👨‍💻 Angel Gadiel Hernandez Cruz
  - Código: 2021070017
  - Rol: Full Stack Developer, DevOps

**Proyecto:** Sistema de Agente Interactivo con NLP para la UPT

**Curso:** Construcción de Software I

**Docente:** Ricardo Eduardo Valcarcel Alvarado

**Universidad:** Universidad Privada de Tacna

**Fecha:** 13 de octubre de 2025

**Repositorio:** https://github.com/Angelhc123/cosntru

---

## 🏆 Logros del Proyecto

✅ **Arquitectura Profesional**
- Microservicios con Clean Architecture
- Domain-Driven Design (DDD)
- SOLID principles
- Repository Pattern

✅ **Documentación Completa**
- 8 documentos (12,000+ líneas)
- 20+ diagramas Mermaid
- 25+ tablas especificadas
- 100% cobertura requisitos PDF

✅ **Implementación Real**
- 3 servicios funcionales (NLP, Gateway, Notification)
- RF004 100% operativo
- MongoDB Atlas + MySQL dual
- DialogFlow + spaCy híbrido
- 19 intents + 219 FAQs

✅ **Calidad de Código**
- TypeScript + Python
- Clean Code practices
- Separation of concerns
- 8,100 líneas de código

---

**Última actualización:** 13 de octubre de 2025  
**Versión:** 1.0

---

**💡 Tip:** Usa Ctrl+F (Cmd+F en Mac) en este archivo para buscar cualquier término específico que necesites encontrar en la documentación.
