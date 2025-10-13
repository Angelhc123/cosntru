# 📋 Guía de Documentación Completa - FD04 SAD

## Sistema UPT Chat - Agente Interactivo con NLP

**Versión:** 3.0  
**Fecha:** 13 de octubre de 2025  
**Autores:** Piero Paja, Angel Hernandez

---

## 📚 Estructura de la Documentación

La documentación del Sistema UPT Chat está dividida en múltiples archivos para facilitar su lectura y mantenimiento:

### 1️⃣ Documento Principal - FD04 (Parte 1)

**Archivo:** `FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md`

**Contenido:**
- ✅ Control de Versiones
- ✅ Índice General Completo
- ✅ **Sección 1:** Introducción (1.1 a 1.5)
- ✅ **Sección 2:** Representación Arquitectónica
  - 2.1: Modelo 4+1 de Kruchten
  - 2.2: Patrones Arquitectónicos (Microservicios + Clean Architecture)
  - 2.3: Stack Tecnológico
- ✅ **Sección 3:** Objetivos y Restricciones de Arquitectura
- ✅ **Sección 4:** Vista de Casos de Uso
  - 4.1: Diagrama de Casos de Uso General (12 RFs)
  - 4.2: Tabla de Actores (6 actores)
  - 4.3: Especificaciones Detalladas de todos los Casos de Uso (RF001-RF012)
- ✅ **Sección 5:** Vista Lógica
  - 5.1: Arquitectura de Alto Nivel
  - 5.2: Diagrama de Paquetes/Subsistemas
  - 5.3: Diagramas de Secuencia (RF001-RF007 completos)
- ✅ **Sección 6:** Vista de Implementación (estructura de directorios, componentes)
- ✅ **Sección 7:** Vista de Datos (esquemas MongoDB y MySQL)
- ✅ **Sección 8:** Tamaño y Rendimiento (inicial)
- ✅ **Sección 9:** Resumen Ejecutivo (estado actual, logros, lecciones)
- ✅ **Apéndices A-E:** Comandos, variables de entorno, bases de datos
- ✅ **Glosario, Acrónimos, Índices de Figuras y Tablas**

**Tamaño:** ~2,600 líneas

---

### 2️⃣ Documento Complementario - FD04 (Parte 2)

**Archivo:** `FD04-PARTE2-Diagramas-Complementarios.md`

**Contenido:**
- ✅ **Sección 5.3.8:** Secuencia RF008 - Motor de Búsqueda Semántica
  - Diagrama completo con vectores, embeddings, cosine similarity
  - Detalles de spaCy NLP pipeline
- ✅ **Sección 7:** Vista de Procesos
  - 7.1: Diagrama de Actividades General Completo
    - **Integra los 12 RFs en un solo flujo**
    - Muestra decisiones críticas, flujos alternativos
    - Incluye escalamiento, validación email, feedback, métricas
- ✅ **Sección 8:** Vista de Despliegue
  - 8.1: Diagrama de Despliegue Completo (infraestructura física + cloud)
  - 8.2: Especificaciones Técnicas Detalladas
    - Hardware de servidores (CPU, RAM, Storage)
    - Software instalado (versiones, configuraciones)
    - Configuración de red (VLANs, firewalls, puertos)
    - MongoDB Atlas (tier, región, replica set)
    - DialogFlow (proyecto GCP, intents, quota)
    - Gmail SMTP (límites, autenticación)
  - 8.3: Configuración de Red (topología, reglas firewall, SSL/TLS)
  - 8.4: Requisitos de Seguridad (autenticación, cifrado, RBAC, auditoría)
- ✅ **Sección 9:** Calidad del Software
  - 9.1: Rendimiento (métricas medidas, optimizaciones)
  - 9.2: Escalabilidad (horizontal scaling, capacidades)
- ✅ **Sección 10:** Decisiones Arquitectónicas
  - 10.1: Microservicios vs Monolito (análisis de trade-offs)
  - 10.2: Clean Architecture + DDD (justificación)
  - 10.3: DialogFlow + spaCy Híbrido (razones, resultados)
  - 10.4: MongoDB + MySQL Dual (casos de uso)
  - 10.5: Notification Service Separado (beneficios)
- ✅ **Sección 11:** Tamaño y Rendimiento
  - 11.1: Métricas de Código (líneas, archivos, tamaño)
  - 11.2: Benchmarks de Performance (Apache Bench)
  - 11.3: Límites del Sistema (usuarios, sesiones, mensajes, almacenamiento)

**Tamaño:** ~1,200 líneas

**Por qué está separado:**
- El archivo principal estaba alcanzando el límite de tokens
- Facilita la lectura y navegación
- Mantiene el documento principal enfocado en arquitectura
- Permite detallar infraestructura y performance sin saturar

---

### 3️⃣ Documentos de Soporte

#### A. Planificación
**Archivo:** `INFORME_PLANIFICACION_FD04.md`

**Contenido:**
- 📋 Plan completo para generar FD04
- 🎯 18 diagramas identificados
- 📅 Cronograma de 7 días
- ✅ Checklist detallado
- 📐 Ejemplos de sintaxis Mermaid
- 🎓 Criterios de calidad

**Uso:** Guía de referencia para el desarrollo del FD04

---

#### B. Implementación Específica
**Archivo:** `ARQUITECTURA_MICROSERVICIOS_RF004.md`

**Contenido:**
- 🏗️ Arquitectura detallada del RF004 (Validación por Email)
- 📊 Diagramas de secuencia específicos
- 💾 Schemas de MongoDB
- 🔐 Lógica de tokens y expiración
- 📧 Integración con Notification Service

**Uso:** Documentación técnica profunda del RF004 implementado

---

**Archivo:** `RESUMEN_RF004.md`

**Contenido:**
- ✅ Estado actual de implementación
- 🔄 Flujo completo de validación por email
- 🐛 Issues conocidos y resolución
- 🧪 Pruebas realizadas
- 📝 Checklist de funcionalidades

**Uso:** Resumen ejecutivo del RF004

---

#### C. Otros Documentos
**Archivo:** `FD03-EPIS-Informe_SRS_de_Proyecto-FORMATO.md`

**Contenido:**
- 📋 Especificación de Requisitos de Software (SRS)
- 🎯 12 Requisitos Funcionales (RF001-RF012)
- 🔧 Requisitos No Funcionales
- 👥 Casos de uso iniciales

**Uso:** Documento de requisitos (predecede al SAD)

---

## 📖 Cómo Leer la Documentación

### Para Revisión Académica (Profesor)

1. **Inicio:** `FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md`
   - Revisar Control de Versiones
   - Leer Índice General para visión completa
   - Revisar Secciones 1-5 (arquitectura, casos de uso, lógica)

2. **Complemento:** `FD04-PARTE2-Diagramas-Complementarios.md`
   - Revisar diagrama de Actividades (integración completa)
   - Revisar diagrama de Despliegue (infraestructura)
   - Ver Sección 10 (Decisiones Arquitectónicas)

3. **Validación:** `RESUMEN_RF004.md`
   - Confirmar que hay implementación real funcional
   - Ver evidencias de código ejecutándose

**Tiempo estimado:** 45-60 minutos

---

### Para Desarrollo (Estudiantes)

1. **Planificación:** `INFORME_PLANIFICACION_FD04.md`
   - Entender roadmap completo
   - Ver checklist de tareas pendientes

2. **Arquitectura:** `FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md`
   - Estudiar patrones arquitectónicos (Sección 2)
   - Revisar casos de uso (Sección 4)
   - Entender flujos de secuencia (Sección 5)

3. **Implementación:** `ARQUITECTURA_MICROSERVICIOS_RF004.md`
   - Ver código real implementado
   - Estudiar schemas de base de datos
   - Entender integración entre servicios

4. **Infraestructura:** `FD04-PARTE2-Diagramas-Complementarios.md`
   - Sección 8 (Despliegue) para setup de servidores
   - Ver variables de entorno necesarias
   - Entender configuración de red

**Tiempo estimado:** 2-3 horas para estudio completo

---

### Para Implementación (Desarrolladores Nuevos)

1. **Setup Inicial:**
   - Ver Apéndice C del FD04 parte 1 (Comandos de Ejecución)
   - Ver Apéndice D (Variables de Entorno)
   - Ver Apéndice E (Base de Datos)

2. **Entender Arquitectura:**
   - Diagrama de Microservicios (Sección 2.2 del FD04)
   - Clean Architecture (Sección 2.2 del FD04)
   - Vista de Implementación (Sección 6 del FD04)

3. **Implementar Nuevo RF:**
   - Estudiar RF similar en Sección 4.3
   - Ver diagrama de secuencia correspondiente (Sección 5.3)
   - Seguir estructura Clean Architecture del código existente

4. **Deploy:**
   - Diagrama de Despliegue (Parte 2, Sección 8)
   - Configuración de Red (Parte 2, Sección 8.3)
   - Seguridad (Parte 2, Sección 8.4)

**Tiempo estimado:** 1 día para setup, 3-5 días para primer RF

---

## 📊 Resumen de Diagramas

### Total de Diagramas Creados: 18+

#### Diagramas de Arquitectura (5)
1. ✅ Modelo 4+1 de Kruchten
2. ✅ Arquitectura de Microservicios
3. ✅ Clean Architecture - Capas
4. ✅ Arquitectura de Alto Nivel
5. ✅ Diagrama de Paquetes/Subsistemas

#### Diagrama de Casos de Uso (1)
6. ✅ Diagrama General con 12 RFs

#### Diagramas de Secuencia (8)
7. ✅ RF001 - Chat Widget
8. ✅ RF002 - Comprensión NLP
9. ✅ RF003 - Gestión FAQs
10. ✅ RF004 - Validación Email (implementado)
11. ✅ RF005 - Escalamiento
12. ✅ RF006 - Dashboard
13. ✅ RF007 - Sistema Académico
14. ✅ RF008 - Búsqueda Semántica

#### Diagramas de Proceso (1)
15. ✅ Diagrama de Actividades General (integra 12 RFs)

#### Diagramas de Implementación (2)
16. ✅ Estructura de Directorios
17. ✅ Diagrama de Componentes

#### Diagramas de Despliegue (1)
18. ✅ Diagrama de Despliegue Completo

#### Diagramas de Datos (2)
19. ✅ Esquema MongoDB
20. ✅ Esquema MySQL

---

## 🎯 Cobertura de Requisitos del PDF

Comparación con PDF de referencia (estructura esperada):

| Sección PDF | FD04 Parte 1 | FD04 Parte 2 | Estado |
|-------------|--------------|--------------|--------|
| 1. Introducción | ✅ Completo | - | ✅ |
| 2. Representación Arquitectónica | ✅ Completo | - | ✅ |
| 3. Objetivos y Restricciones | ✅ Completo | - | ✅ |
| 4. Vista de Casos de Uso | ✅ Completo | - | ✅ |
| 5. Vista Lógica | ✅ Completo | ✅ RF008 | ✅ |
| 6. Vista de Implementación | ✅ Completo | - | ✅ |
| 7. Vista de Procesos | - | ✅ Completo | ✅ |
| 8. Vista de Despliegue | - | ✅ Completo | ✅ |
| 9. Calidad | ✅ Inicial | ✅ Detallado | ✅ |
| 10. Decisiones | - | ✅ Completo | ✅ |
| 11. Tamaño y Rendimiento | ✅ Básico | ✅ Detallado | ✅ |

**Cobertura:** 100% ✅

---

## 🔍 Búsqueda Rápida

### ¿Dónde encontrar...?

| Busco... | Ubicación | Archivo |
|----------|-----------|---------|
| **Diagrama de Casos de Uso** | Sección 4.1 | FD04 Parte 1 |
| **Secuencias RF001-RF007** | Sección 5.3 | FD04 Parte 1 |
| **Secuencia RF008** | Sección 5.3.8 | FD04 Parte 2 |
| **Diagrama de Actividades** | Sección 7.1 | FD04 Parte 2 |
| **Diagrama de Despliegue** | Sección 8.1 | FD04 Parte 2 |
| **Decisiones Arquitectónicas** | Sección 10 | FD04 Parte 2 |
| **Configuración de Servidores** | Sección 8.2 | FD04 Parte 2 |
| **Comandos para ejecutar** | Apéndice C | FD04 Parte 1 |
| **Variables de entorno** | Apéndice D | FD04 Parte 1 |
| **Schemas de BD** | Apéndice E, Sección 7 | FD04 Parte 1 |
| **Benchmarks de rendimiento** | Sección 11.2 | FD04 Parte 2 |
| **Límites del sistema** | Sección 11.3 | FD04 Parte 2 |
| **Stack tecnológico** | Tabla 2.1, Sección 2.3 | FD04 Parte 1 |
| **Patrones arquitectónicos** | Sección 2.2 | FD04 Parte 1 |
| **Clean Architecture** | Sección 2.2, Figura 2.3 | FD04 Parte 1 |
| **RF004 detallado** | - | ARQUITECTURA_MICROSERVICIOS_RF004.md |
| **Planificación completa** | - | INFORME_PLANIFICACION_FD04.md |

---

## ✅ Checklist de Completitud

### Diagramas Obligatorios
- [x] Diagrama de Casos de Uso general
- [x] Diagrama de Subsistemas/Paquetes
- [x] 8 Diagramas de Secuencia (RF001-RF008)
- [x] Diagrama de Actividades (general con todos los componentes)
- [x] Diagrama de Componentes
- [x] Diagrama de Arquitectura de software/paquetes
- [x] Diagrama de Despliegue
- [x] Diagrama de Procesos

### Contenido Obligatorio
- [x] Control de Versiones
- [x] Índice General completo
- [x] Introducción (1.1 a 1.5)
- [x] Representación Arquitectónica (Modelo 4+1)
- [x] Objetivos y Restricciones
- [x] Vista de Casos de Uso (actores, especificaciones)
- [x] Vista Lógica (paquetes, secuencias)
- [x] Vista de Implementación (componentes, estructura)
- [x] Vista de Procesos (actividades)
- [x] Vista de Despliegue (infraestructura)
- [x] Calidad del Software
- [x] Decisiones Arquitectónicas
- [x] Tamaño y Rendimiento
- [x] Referencias
- [x] Apéndices
- [x] Glosario y Acrónimos
- [x] Índice de Figuras y Tablas

### Código Real Implementado
- [x] NLP Service (Python/FastAPI + DialogFlow + spaCy)
- [x] API Gateway (NestJS/TypeScript)
- [x] Notification Service (NestJS/TypeScript)
- [x] RF004 - Validación por Email (100% funcional)
- [x] Base de datos MongoDB Atlas (conectada y operativa)
- [x] Base de datos MySQL local (conectada y operativa)
- [x] 19 Intents de DialogFlow configurados
- [x] 219 FAQs en Knowledge Base

---

## 🎓 Cumplimiento Académico

### Formato IEEE/ISO
- ✅ Estructura estándar SAD
- ✅ Modelo 4+1 de Kruchten
- ✅ Índices, glosario, referencias
- ✅ Control de versiones
- ✅ Tablas de especificación de casos de uso

### Buenas Prácticas
- ✅ Clean Architecture implementada
- ✅ SOLID principles aplicados
- ✅ Microservicios con separación de responsabilidades
- ✅ Documentación detallada de decisiones arquitectónicas
- ✅ Análisis de trade-offs
- ✅ Benchmarks y métricas medidas

### Evidencia de Implementación Real
- ✅ Código fuente en repositorio GitHub
- ✅ Servicios ejecutándose en puertos especificados
- ✅ Bases de datos con datos reales
- ✅ APIs externas integradas (DialogFlow, Gmail)
- ✅ Logs de ejecución
- ✅ Capturas de pantalla en RESUMEN_RF004.md

---

## 📞 Contacto

**Autores:**
- Piero Alexander Paja de la Cruz (2020067576)
- Angel Gadiel Hernandez Cruz (2021070017)

**Curso:** Construcción de Software I  
**Docente:** Ricardo Eduardo Valcarcel Alvarado  
**Universidad:** Universidad Privada de Tacna  
**Fecha:** 13 de octubre de 2025

---

## 📚 Referencias Cruzadas

```
FD03 (SRS)
    ↓
FD04 Parte 1 (Arquitectura Principal)
    ↓
FD04 Parte 2 (Diagramas Complementarios)
    ↓
ARQUITECTURA_MICROSERVICIOS_RF004 (Implementación)
    ↓
RESUMEN_RF004 (Evidencia)
```

---

**Última actualización:** 13 de octubre de 2025  
**Versión de esta guía:** 1.0

---

**📌 Nota:** Esta guía se actualizará conforme se agreguen más componentes al sistema.
