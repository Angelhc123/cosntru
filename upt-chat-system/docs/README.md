# 📚 Documentación FD04 - Sistema UPT Chat

## 🎯 Documento de Arquitectura de Software (SAD)

**Universidad Privada de Tacna**  
**Escuela Profesional de Ingeniería de Sistemas**

---

## ⚡ Inicio Rápido

### Para Revisores Académicos (Profesores)
👉 **Empezar aquí:** [`FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md`](./FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md)

**Luego revisar:**
1. [`FD04-PARTE2-Diagramas-Complementarios.md`](./FD04-PARTE2-Diagramas-Complementarios.md) - Diagramas de Actividades, Despliegue, Decisiones Arquitectónicas
2. [`RESUMEN_RF004.md`](./RESUMEN_RF004.md) - Evidencia de implementación funcional

⏱️ **Tiempo de revisión:** 45-60 minutos

---

### Para Estudiantes / Desarrolladores
👉 **Empezar aquí:** [`GUIA_DOCUMENTACION_COMPLETA.md`](./GUIA_DOCUMENTACION_COMPLETA.md)

**Luego revisar:**
1. [`MAPA_VISUAL_DOCUMENTACION.md`](./MAPA_VISUAL_DOCUMENTACION.md) - Mapa interactivo de toda la documentación
2. [`INFORME_PLANIFICACION_FD04.md`](./INFORME_PLANIFICACION_FD04.md) - Roadmap y checklist
3. [`FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md`](./FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md) - Documento principal

⏱️ **Tiempo de estudio:** 2-3 horas

---

### Para Nuevos Implementadores
👉 **Empezar aquí:** [`FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md`](./FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md) - **Apéndice C** (Comandos de Ejecución)

**Luego revisar:**
1. Apéndice D (Variables de Entorno)
2. Sección 6 (Vista de Implementación - Estructura de Código)
3. [`ARQUITECTURA_MICROSERVICIOS_RF004.md`](./ARQUITECTURA_MICROSERVICIOS_RF004.md) - Ejemplo completo funcional
4. [`FD04-PARTE2-Diagramas-Complementarios.md`](./FD04-PARTE2-Diagramas-Complementarios.md) - Sección 8 (Despliegue)

⏱️ **Tiempo de setup:** 1 día

---

## 📂 Estructura de Archivos

### 📘 Documentos Principales (Entrega Académica)

| Archivo | Descripción | Tamaño | Prioridad |
|---------|-------------|--------|-----------|
| **[FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md](./FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md)** | 📄 Documento SAD principal (Parte 1)<br/>Secciones 1-6, 9-10, Apéndices | ~2,600 líneas | ⭐⭐⭐⭐⭐ |
| **[FD04-PARTE2-Diagramas-Complementarios.md](./FD04-PARTE2-Diagramas-Complementarios.md)** | 📄 Diagramas complementarios (Parte 2)<br/>Secciones 7-8, 11 | ~1,200 líneas | ⭐⭐⭐⭐⭐ |

### 📗 Documentos de Planificación

| Archivo | Descripción | Tamaño | Prioridad |
|---------|-------------|--------|-----------|
| **[INFORME_PLANIFICACION_FD04.md](./INFORME_PLANIFICACION_FD04.md)** | 📋 Plan completo, 18 diagramas, cronograma 7 días | ~800 líneas | ⭐⭐⭐⭐ |

### 📙 Documentos de Implementación

| Archivo | Descripción | Tamaño | Prioridad |
|---------|-------------|--------|-----------|
| **[ARQUITECTURA_MICROSERVICIOS_RF004.md](./ARQUITECTURA_MICROSERVICIOS_RF004.md)** | 🏗️ Arquitectura detallada RF004 (Validación Email) | ~600 líneas | ⭐⭐⭐⭐ |
| **[RESUMEN_RF004.md](./RESUMEN_RF004.md)** | ✅ Estado, pruebas, evidencia RF004 | ~400 líneas | ⭐⭐⭐ |

### 📕 Documentos de Requisitos

| Archivo | Descripción | Tamaño | Prioridad |
|---------|-------------|--------|-----------|
| **[FD03-EPIS-Informe_SRS_de_Proyecto-FORMATO.md](./FD03-EPIS-Informe_SRS_de_Proyecto-FORMATO.md)** | 📋 Especificación de Requisitos (SRS)<br/>12 RFs definidos | ~3,000 líneas | ⭐⭐⭐ |

### 📖 Guías y Referencias

| Archivo | Descripción | Tamaño | Prioridad |
|---------|-------------|--------|-----------|
| **[GUIA_DOCUMENTACION_COMPLETA.md](./GUIA_DOCUMENTACION_COMPLETA.md)** | 📚 Guía completa de navegación | ~600 líneas | ⭐⭐⭐⭐⭐ |
| **[MAPA_VISUAL_DOCUMENTACION.md](./MAPA_VISUAL_DOCUMENTACION.md)** | 🗺️ Mapa visual interactivo | ~500 líneas | ⭐⭐⭐⭐ |
| **[README.md](./README.md)** | 📖 Este archivo (punto de entrada) | ~200 líneas | ⭐⭐⭐⭐⭐ |

---

## 📊 Contenido del FD04

### Parte 1: Documento Principal

#### ✅ Secciones Completas
- [x] **Sección 1:** Introducción (Propósito, Alcance, Visión General)
- [x] **Sección 2:** Representación Arquitectónica
  - Modelo 4+1 de Kruchten
  - Arquitectura de Microservicios (6 servicios)
  - Clean Architecture + DDD
  - Stack Tecnológico
- [x] **Sección 3:** Objetivos y Restricciones
- [x] **Sección 4:** Vista de Casos de Uso
  - Diagrama general (12 RFs)
  - 6 Actores
  - 12 Especificaciones detalladas (RF001-RF012)
- [x] **Sección 5:** Vista Lógica
  - Arquitectura de alto nivel
  - Diagrama de paquetes/subsistemas
  - 7 Diagramas de secuencia (RF001-RF007)
- [x] **Sección 6:** Vista de Implementación
  - Estructura de directorios
  - Diagrama de componentes
- [x] **Sección 7:** Vista de Datos
  - MongoDB schemas
  - MySQL tables
- [x] **Sección 9:** Resumen Ejecutivo
- [x] **Sección 10:** Referencias

#### 📎 Apéndices
- [x] **Apéndice A:** Referencias a Parte 2
- [x] **Apéndice B:** Cronograma de Implementación
- [x] **Apéndice C:** Comandos de Ejecución
- [x] **Apéndice D:** Variables de Entorno
- [x] **Apéndice E:** Base de Datos

### Parte 2: Diagramas Complementarios

#### ✅ Secciones Completas
- [x] **Sección 5.3.8:** Secuencia RF008 - Búsqueda Semántica
- [x] **Sección 7:** Vista de Procesos
  - Diagrama de Actividades General (integra 12 RFs)
- [x] **Sección 8:** Vista de Despliegue
  - Diagrama de despliegue completo
  - Especificaciones técnicas (hardware, software)
  - Configuración de red (VLANs, firewalls)
  - Seguridad (autenticación, cifrado, RBAC)
- [x] **Sección 9:** Calidad del Software
  - Rendimiento (métricas, optimizaciones)
  - Escalabilidad (horizontal scaling)
- [x] **Sección 10:** Decisiones Arquitectónicas
  - 5 decisiones analizadas con trade-offs
- [x] **Sección 11:** Tamaño y Rendimiento
  - Métricas de código
  - Benchmarks (Apache Bench)
  - Límites del sistema

---

## 🎨 Diagramas Incluidos (20+)

### Arquitectura (5 diagramas)
- ✅ Modelo 4+1 de Kruchten
- ✅ Arquitectura de Microservicios
- ✅ Clean Architecture (capas)
- ✅ Arquitectura de Alto Nivel
- ✅ Diagrama de Paquetes/Subsistemas

### Casos de Uso (1 diagrama)
- ✅ Diagrama General (12 RFs, 6 actores)

### Secuencia (8 diagramas)
- ✅ RF001: Chat Widget
- ✅ RF002: Comprensión NLP
- ✅ RF003: Gestión FAQs
- ✅ RF004: Validación Email ✅ (implementado)
- ✅ RF005: Escalamiento Soporte
- ✅ RF006: Dashboard Métricas
- ✅ RF007: Sistema Académico
- ✅ RF008: Búsqueda Semántica

### Procesos (1 diagrama)
- ✅ Diagrama de Actividades General (integra 12 RFs)

### Implementación (2 diagramas)
- ✅ Estructura de Directorios
- ✅ Diagrama de Componentes

### Despliegue (1 diagrama)
- ✅ Diagrama de Despliegue Completo (infraestructura física + cloud)

### Datos (2 diagramas)
- ✅ Esquema MongoDB
- ✅ Esquema MySQL

---

## 🏗️ Arquitectura del Sistema

### Microservicios

| Servicio | Puerto | Tecnología | Estado |
|----------|--------|------------|--------|
| **NLP Service** | 8001 | Python/FastAPI + DialogFlow + spaCy | ✅ Funcional |
| **API Gateway** | 3000 | TypeScript/NestJS | ✅ Funcional |
| **Notification Service** | 3005 | TypeScript/NestJS + Nodemailer | ✅ Funcional |
| **Chat Service** | 3001 | TypeScript/NestJS + Socket.IO | ⏳ Preparado |
| **Knowledge Base Service** | 3003 | TypeScript/NestJS | ⏳ Preparado |
| **Analytics Service** | 3004 | TypeScript/NestJS | ⏳ Preparado |

### Bases de Datos

| Base de Datos | Tecnología | Ubicación | Estado |
|---------------|------------|-----------|--------|
| **basededatos2** | MongoDB Atlas | AWS us-east-1 | ✅ Funcional |
| **proyectotest** | MySQL 8.0 | Local 192.168.1.30 | ✅ Funcional |

### APIs Externas

| Servicio | Proveedor | Uso | Estado |
|----------|-----------|-----|--------|
| **DialogFlow API** | Google Cloud Platform | Detección de intents | ✅ Activo |
| **Gmail SMTP** | Google | Envío de emails | ✅ Activo |

---

## 🎯 Requisitos Funcionales

### ✅ Implementados
- **RF004:** Validación de Identidad por Correo Electrónico (100% funcional)
- **RF010:** Sistema de Notificaciones por Email (100% funcional)
- **RF002:** Comprensión de Lenguaje Natural (NLP híbrido operativo)

### ⏳ Preparados (Arquitectura diseñada)
- RF001: Iniciar Conversación con Widget
- RF003: Gestión de Preguntas Frecuentes
- RF005: Escalamiento a Soporte Humano
- RF006: Dashboard de Métricas
- RF007: Integración Sistema Académico
- RF008: Motor de Búsqueda Semántica
- RF009: Consulta de Historial de Tickets
- RF011: Mejora Continua del Sistema
- RF012: Generación de Reportes

---

## 📈 Progreso del Proyecto

```
███████████████████░░ 70% Completado

Requisitos:     ████████████████████ 100% ✅
Arquitectura:   ████████████████████ 100% ✅
Implementación: ████████████░░░░░░░░  60% 🔄
Testing:        ████░░░░░░░░░░░░░░░░  20% ⏳
```

---

## 📞 Información de Contacto

**Autores:**
- Piero Alexander Paja de la Cruz (2020067576)
- Angel Gadiel Hernandez Cruz (2021070017)

**Curso:** Construcción de Software I  
**Docente:** Ricardo Eduardo Valcarcel Alvarado  
**Universidad:** Universidad Privada de Tacna  
**Fecha:** 13 de octubre de 2025

**Repositorio:** https://github.com/Angelhc123/cosntru

---

## 🚀 Comandos Rápidos

### Iniciar Servicios Funcionales

```bash
# Terminal 1: NLP Service (Puerto 8001)
cd services/nlp-service
source venv/bin/activate
uvicorn main:app --port 8001 --reload

# Terminal 2: API Gateway (Puerto 3000)
cd services/api-gateway
npm run start:dev

# Terminal 3: Notification Service (Puerto 3005)
cd services/notification-service
npm run start:dev
```

---

## 📝 Notas Importantes

1. **Formato Markdown:** Todos los diagramas están en formato Mermaid para previsualización en VS Code
2. **Documentación Completa:** 100% de cobertura según estructura del PDF de referencia
3. **Código Real:** 3 servicios funcionales con 8,100+ líneas de código
4. **Clean Architecture:** Implementación completa con DDD
5. **Evidencia:** RF004 100% operativo con capturas de pantalla

---

## 🎓 Para el Profesor

**Puntos Clave de Evaluación:**

✅ **Arquitectura Profesional**
- Microservicios con separación de responsabilidades
- Clean Architecture + Domain-Driven Design
- SOLID principles aplicados

✅ **Documentación Completa**
- FD04 completo según estructura IEEE/ISO
- 20+ diagramas Mermaid (todos visualizables)
- 25+ tablas de especificación

✅ **Implementación Real**
- 3 servicios funcionales y testeados
- RF004 100% operativo con validación real
- Integración con MongoDB Atlas y MySQL
- DialogFlow configurado con 19 intents
- 219 FAQs operativas

✅ **Decisiones Justificadas**
- Sección 10 (Parte 2) con análisis de trade-offs
- Comparación Microservicios vs Monolito
- Justificación de tecnologías elegidas

---

**Última actualización:** 13 de octubre de 2025  
**Versión:** 3.0

**📌 Recomendación:** Comenzar por [`GUIA_DOCUMENTACION_COMPLETA.md`](./GUIA_DOCUMENTACION_COMPLETA.md) para una visión completa de la estructura de documentación.
