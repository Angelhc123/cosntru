![C:\\Users\\EPIS\\Documents\\upt.png](media/image1.png){width="1.0926727909011373in"
height="1.468837489063867in"}

**UNIVERSIDAD PRIVADA DE TACNA**

**FACULTAD DE INGENIERÍA**

**Escuela Profesional de Ingeniería de Sistemas**

***Proyecto "Producción de un agente interactivo con procesamiento de
lenguaje natural(NLP) para la optimización de procesos internos de
soporte técnico en entornos corporativos"***

Curso: *Construcción De Software I*

Docente: *Ricardo Eduardo Valcarcel Alvarado*

Integrantes:

***Piero Alexander Paja de la Cruz (2020067576)***

***Angel Gadiel Hernandez Cruz (2021070017)***

**Tacna -- Perú**

***2025***

  ----------------------------------------------------------------------------------
  CONTROL DE                                                
  VERSIONES                                                 
  ----------- -------- ----------- ----------- ------------ ------------------------
  Versión     Hecha    Revisada    Aprobada    Fecha        Motivo
              por      por         por                      

  1.0         MPV      ELV         ARV         10/10/2020   Versión Original
  ----------------------------------------------------------------------------------

Producción de un agente interactivo con procesamiento de lenguaje
natural(NLP) para la optimización de procesos internos de soporte
técnico en entornos corporativos

Documento de Arquitectura de Software

Versión *1.0*

  ----------------------------------------------------------------------------------
  CONTROL DE                                                
  VERSIONES                                                 
  ----------- -------- ----------- ----------- ------------ ------------------------
  Versión     Hecha    Revisada    Aprobada    Fecha        Motivo
              por      por         por                      

  1.0         PPAH     PPAH        RV          08/09/2025   Versión Original
  ----------------------------------------------------------------------------------

ÍNDICE GENERAL

1\. Introducción

1.1. Propósito

1.2. Alcance

1.3. Definiciones, Siglas y Abreviaturas

1.4. Organización del documento

2\. Objetivos y Restricciones Arquitectónicas

2.1. Priorización de requerimientos

2.1.1. Requerimientos Funcionales

2.1.2. Requerimientos No Funcionales - Atributos de Calidad

2.2. Restricciones

3\. Representación de la Arquitectura del Sistema

3.1. Vista de Caso de Uso

3.1.1. Diagramas de Casos de Uso

3.2. Vista de Lógica

3.2.1. Diagrama de Subsistemas (paquetes)

3.2.2. Diagrama de Secuencia (vista de diseño)

3.2.3. Diagrama de Actividades con Objetos

3.2.4. Diagrama de Clases

3.2.5. Diagrama de Base de Datos

3.3. Vista de Implementación (vista de desarrollo)

3.3.1. Diagrama de arquitectura de software (paquetes)

3.3.2. Diagrama de arquitectura del sistema (diagrama de componentes)

3.4. Vista de Procesos

3.4.1. Diagrama de procesos del sistema (diagrama de actividad)

3.5. Vista de Despliegue

3.5.1. Diagrama de despliegue

4\. Atributos de Calidad del Software

4.1. Escenario de Usabilidad

4.2. Escenario de Confiabilidad

4.3. Escenario de Rendimiento

4.4. Otros Escenarios

1.  Introducción

> El presente Documento de Arquitectura de Software (SAD) describe la
> arquitectura técnica del sistema de Agente Interactivo con
> Procesamiento de Lenguaje Natural (NLP) para la Universidad Privada de
> Tacna, una solución diseñada para optimizar los procesos de soporte
> técnico mediante la automatización de consultas frecuentes y la mejora
> de la experiencia del usuario.
>
> Este documento sigue el modelo de vistas arquitectónicas 4+1 de
> Kruchten, proporcionando una representación completa del sistema desde
> múltiples perspectivas: casos de uso, lógica, implementación, procesos
> y despliegue. La arquitectura propuesta se fundamenta en los
> principios de Clean Architecture y Domain-Driven Design (DDD),
> implementados a través de una arquitectura de microservicios que
> garantiza escalabilidad, mantenibilidad y separación de
> responsabilidades.
>
> El sistema se compone de seis microservicios principales orquestados
> mediante Docker: API Gateway (puerto 3000), Chat Service (puerto
> 3001), NLP Service (puerto 3002), Knowledge Base Service (puerto
> 3003), Analytics Service (puerto 3004) y Notification Service (puerto
> 3005), todos trabajando coordinadamente para proporcionar una
> experiencia integrada de soporte técnico automatizado.
>
> La plataforma implementa capacidades avanzadas de procesamiento de
> lenguaje natural mediante la integración de Google DialogFlow, spaCy y
> NLTK, permitiendo la comprensión de consultas en español con
> terminología universitaria específica. El sistema mantiene una base de
> conocimiento estructurada en MongoDB con FAQs categorizadas por áreas:
> Académico, Técnico, Administrativo y Biblioteca.

1.  Propósito

> Este documento tiene como propósito principal servir como referencia
> técnica completa para todos los stakeholders involucrados en el
> desarrollo, implementación y mantenimiento del sistema UPT Chat
> System. Los objetivos específicos incluyen:
>
> Para el equipo de desarrollo:

-   Proporcionar una guía arquitectónica detallada que oriente las
    > decisiones de diseño e implementación

-   Establecer patrones y estándares técnicos que garanticen la
    > consistencia del código

-   Definir las interfaces y contratos entre los diferentes componentes
    > del sistema

> Para arquitectos y líderes técnicos:

-   Documentar las decisiones arquitectónicas fundamentales y su
    > justificación

-   Presentar la estructura modular del sistema y las relaciones entre
    > componentes

-   Facilitar el análisis de impacto para cambios futuros

> Para gestores del proyecto:

-   Comunicar el alcance técnico y las capacidades del sistema

-   Proporcionar información para estimación de recursos y planificación

-   Establecer criterios de éxito medibles para la implementación

> Para el equipo de operaciones:

-   Describir la infraestructura necesaria y los requisitos de
    > despliegue

-   Documentar los procedimientos de monitoreo y mantenimiento

-   Definir los puntos críticos del sistema que requieren atención
    > especial

> El diagrama 4+1 presenta las cinco vistas arquitectónicas
> fundamentales del sistema:

![](media/image21.png){width="6.240256999125109in"
height="2.5093099300087487in"}

> Fuente: Elaboración propia.
>
> Este diagrama representa cómo se organiza y funciona el sistema desde
> distintas perspectivas.
>
> Primero, en la Vista de Casos de Uso, se muestran los tipos de
> usuarios (estudiantes, docentes y administrativos) y las principales
> funcionalidades que utilizan, como consultas de FAQ, escalamiento y
> analytics.
>
> Luego, en la Vista Lógica, se define la estructura del sistema en
> capas: dominio, aplicación, infraestructura y presentación, que
> organizan las funcionalidades.
>
> La Vista de Procesos describe cómo fluye el comportamiento dinámico
> del sistema: procesamiento de mensajes, consultas al NLP, escalamiento
> automático y generación de métricas.
>
> En la Vista de Implementación, se detallan los componentes de software
> concretos, como el API Gateway, el servicio de chat, el servicio NLP,
> la base de conocimiento, analytics y notificaciones.
>
> Finalmente, en la Vista de Despliegue, se muestra cómo todo esto se
> ejecuta en la infraestructura física: contenedores Docker, base de
> datos MongoDB, caché Redis y los servicios de la UPT.
>
> En conjunto, el diagrama ilustra cómo los usuarios interactúan con el
> sistema, cómo las funcionalidades se estructuran en capas, cómo se
> procesan los mensajes, y cómo estos componentes se implementan y
> despliegan en la infraestructura tecnológica.

1.  Alcance

> Este documento abarca la descripción arquitectónica completa del
> sistema UPT Chat System desarrollado durante los tres avances del
> proyecto:
>
> Avance 1 - Arquitectura Base y API Gateway:

-   Implementación completa del API Gateway con Clean Architecture + DDD

-   Sistema de usuarios UPT con autenticación JWT

-   Sistema de sesiones de chat con persistencia

-   Configuración de Docker y containerización

-   Estructura base de 6 microservicios planificados

> Avance 2 - Optimización de Base de Datos:

-   Análisis del diagrama de clases PlantUML

-   Diseño e implementación de 6 colecciones MongoDB optimizadas

-   Datos de prueba específicos UPT (usuarios, FAQs, sesiones)

-   15+ índices optimizados para performance

-   Configuración de datos iniciales representativos

> Avance 3 - Estructura de Microservicios:

-   Arquitectura completa de 6 microservicios documentados

-   Preparación de contenedores Docker para todos los servicios

-   Definición de stack tecnológico por servicio

-   Roadmap de implementación detallado

> Inclusiones específicas:
>
> Componentes Implementados:

-   API Gateway funcional (100%) con NestJS + TypeScript

-   Base de datos MongoDB optimizada con datos UPT reales

-   Sistema de autenticación y autorización JWT

-   Gestión de sesiones de chat con analytics

-   Base de conocimiento con FAQs categorizadas

> Componentes en Estructura (Preparados para Implementación):

-   Chat Service (WebSockets con Socket.IO)

-   NLP Service (Python + FastAPI + DialogFlow)

-   Knowledge Base Service (gestión avanzada de FAQs)

-   Analytics Service (métricas en tiempo real)

-   Notification Service (emails y alertas)

> Integraciones Planificadas:

-   Sistema Académico UPT

-   Campus Virtual UPT

-   Sistema de Tickets UPT

-   Servidor Email institucional

-   LDAP/AD UPT para autenticación

> Exclusiones:
>
> Este documento NO cubre:

-   Implementación detallada del código fuente de servicios no
    > completados

-   Procedimientos operativos específicos de la infraestructura UPT

-   Políticas de seguridad institucionales (documentadas separadamente)

-   Planes de capacitación de usuarios finales

-   Procedimientos administrativos no técnicos

-   Análisis financiero detallado (cubierto en documento de
    > factibilidad)

    1.  Definiciones, Siglas y Abreviaturas

> La siguiente tabla presenta los principales términos, siglas y
> abreviaturas utilizados en el desarrollo del Agente Virtual UPT, con
> el fin de unificar criterios y facilitar la comprensión de los
> conceptos técnicos empleados a lo largo del documento.

  -----------------------------------------------------------------------
  **Término/Sigla**                   **Definición**
  ----------------------------------- -----------------------------------
  API Gateway                         Punto de entrada único que gestiona
                                      y enruta todas las peticiones a los
                                      microservicios

  NLP                                 Natural Language Processing -
                                      Procesamiento de Lenguaje Natural

  DDD                                 Domain-Driven Design - Diseño
                                      Orientado al Dominio

  Clean Architecture                  Patrón arquitectónico que separa el
                                      código en capas con dependencias
                                      unidireccionales

  DTO                                 Data Transfer Object - Objeto de
                                      Transferencia de Datos

  Value Object                        Objeto inmutable que representa un
                                      concepto del dominio sin identidad
                                      propia

  Use Case                            Caso de uso - Operación específica
                                      del dominio que representa una
                                      funcionalidad

  Repository                          Patrón que abstrae el acceso a
                                      datos proporcionando una interfaz
                                      orientada a colecciones

  Entity                              Entidad del dominio con identidad
                                      única que persiste en el tiempo

  JWT                                 JSON Web Token - Estándar para
                                      autenticación basada en tokens

  SSO                                 Single Sign-On - Inicio de sesión
                                      único

  FAQ                                 Frequently Asked Questions -
                                      Preguntas Frecuentes

  ODM                                 Object-Document Mapper - Mapeador
                                      de objetos a documentos (para
                                      MongoDB)

  CRUD                                Create, Read, Update, Delete -
                                      Operaciones básicas de persistencia

  Rate Limiting                       Limitación de frecuencia de
                                      peticiones para prevenir abuso

  WebSocket                           Protocolo de comunicación
                                      bidireccional en tiempo real

  Microservicio                       Servicio independiente que
                                      implementa una funcionalidad
                                      específica del negocio

  Docker                              Plataforma de containerización para
                                      empaquetar aplicaciones

  MongoDB                             Base de datos NoSQL orientada a
                                      documentos

  Redis                               Sistema de almacenamiento en
                                      memoria para caché y pub/sub

  DialogFlow                          Plataforma de Google para
                                      procesamiento de lenguaje natural

  spaCy                               Biblioteca de Python para
                                      procesamiento avanzado de lenguaje
                                      natural

  Swagger/OpenAPI                     Especificación para documentación
                                      automática de APIs REST

  Uptime                              Tiempo de disponibilidad
                                      operacional del sistema

  SLA                                 Service Level Agreement - Acuerdo
                                      de Nivel de Servicio

  TIR                                 Tasa Interna de Retorno

  ROI                                 Return on Investment - Retorno de
                                      Inversión
  -----------------------------------------------------------------------

Fuente: Elaboración propia.

2.  Organización del documento

> Este documento está estructurado siguiendo el modelo de vistas
> arquitectónicas 4+1, organizando la información en las siguientes
> secciones principales:
>
> Sección 1: Introducción
>
> Contexto general del proyecto, propósito del documento, alcance de la
> arquitectura y definiciones clave necesarias para la comprensión del
> sistema.
>
> Sección 2: Objetivos y Restricciones Arquitectónicas
>
> Priorización de requerimientos funcionales y no funcionales
> identificados en el documento SRS, junto con las restricciones
> técnicas, organizacionales y regulatorias que condicionan el diseño
> arquitectónico.
>
> Sección 3: Representación de la Arquitectura del Sistema
>
> Desarrollo completo de las cinco vistas arquitectónicas:

-   Vista de Casos de Uso: Diagramas que muestran la interacción entre
    > actores y funcionalidades

-   Vista Lógica: Organización conceptual del sistema (paquetes, clases,
    > secuencias)

-   Vista de Implementación: Estructura del código y componentes de
    > software

-   Vista de Procesos: Aspectos dinámicos y concurrencia del sistema

-   Vista de Despliegue: Distribución física de componentes en la
    > infraestructura

> Sección 4: Atributos de Calidad del Software
>
> Escenarios detallados que especifican cómo el sistema satisface los
> requerimientos no funcionales de usabilidad, confiabilidad,
> rendimiento, seguridad y otros atributos críticos.

2.  Objetivos y Restricciones Arquitectónicas

    1.  Priorización de requerimientos

        1.  Requerimientos Funcionales

> A continuación, se presentan los requerimientos funcionales
> priorizados, los cuales definen las características y funcionalidades
> que el sistema debe cumplir para satisfacer las necesidades del
> usuario y garantizar el correcto funcionamiento del agente virtual.

  -------------------------------------------------------------------------
  **ID**     **Requerimiento     **Descripción**            **Prioridad**
             Funcional**                                    
  ---------- ------------------- -------------------------- ---------------
  RF-01      Widget de Chat      Proporcionar interfaz de   Crítica
             Embebible           chat integrable en         
                                 intranet UPT con diseño    
                                 responsivo                 

  RF-02      Comprensión de      Procesar consultas en      Crítica
             Lenguaje Natural    español con terminología   
                                 UPT, expresiones           
                                 coloquiales y              
                                 abreviaciones              

  RF-03      Base de Datos FAQ   Mantener base de           Crítica
             UPT                 conocimiento categorizada  
                                 (Académico, Técnico,       
                                 Administrativo)            

  RF-04      Validación por      Validar identidad mediante Crítica
             Correo Personal     email institucional        
                                 \@upt.pe para consultas    
                                 sensibles                  

  RF-05      Transferencia a     Escalar automáticamente    Crítica
             Soporte Humano      cuando confianza \< 70%    
                                 con creación de ticket     

  RF-06      Dashboard de        Mostrar métricas en tiempo Alta
             Métricas            real (consultas/hora, tasa 
                                 resolución, satisfacción)  

  RF-07      Conexión Sistema    Integrar con BD UPT para   Alta
             Académico           respuestas personalizadas  

  RF-08      Motor Búsqueda      Encontrar información      Alta
             Semántica           relevante con consultas    
                                 imprecisas                 

  RF-09      Historial de Casos  Mantener contexto completo Media
             por Ticket          de conversaciones por      
                                 ticket                     

  RF-10      Notificaciones por  Enviar resúmenes y         Media
             Email               actualizaciones al correo  
                                 institucional              

  RF-11      Mejora Continua     Registrar feedback y       Media
                                 mejorar modelo mediante    
                                 aprendizaje supervisado    

  RF-12      Exportación de      Generar reportes en        Baja
             Datos               PDF/Excel para análisis    
                                 gerencial                  
  -------------------------------------------------------------------------

2.  Requerimientos No Funcionales - Atributos de Calidad

> Posteriormente, se detallan los requerimientos no funcionales
> priorizados, que establecen los atributos de calidad, rendimiento,
> seguridad y usabilidad que debe poseer el sistema para asegurar una
> experiencia eficiente y confiable.

  ------------------------------------------------------------------------------------
  **ID**    **Atributo**     **Requerimiento**   **Descripción**       **Prioridad**
  --------- ---------------- ------------------- --------------------- ---------------
  RNF-01    Rendimiento      Tiempo de Respuesta ≤ 60 segundos para    Crítica
                                                 95% de consultas      
                                                 frecuentes            

  RNF-02    Escalabilidad    Usuarios            Soportar 100 usuarios Crítica
                             Concurrentes        simultáneos sin       
                                                 degradación           

  RNF-03    Disponibilidad   Uptime del Sistema  ≥ 99.5%               Crítica
                                                 disponibilidad        
                                                 mensual               

  RNF-04    Seguridad        Protección de Datos Cumplimiento GDPR +   Crítica
                                                 normativas locales,   
                                                 HTTPS obligatorio     

  RNF-05    Usabilidad       Facilidad de Uso    90% usuarios          Alta
                                                 completan tareas sin  
                                                 ayuda                 

  RNF-06    Compatibilidad   Navegadores Web     Chrome 90+, Firefox   Alta
                                                 88+, Safari 14+       
                                                 certificado           

  RNF-07    Mantenibilidad   Actualizaciones     Despliegue continuo   Alta
                                                 sin downtime          

  RNF-08    Precisión        Calidad de          ≥ 85% respuestas      Alta
                             Respuestas          correctas automáticas 

  RNF-09    Portabilidad     Responsividad       Funcionalidad         Media
                                                 completa en móviles y 
                                                 tablets               

  RNF-10    Confiabilidad    Recuperación de     Recovery automático   Media
                             Errores             \< 30 segundos        
  ------------------------------------------------------------------------------------

> Fuente: Elaboración propia.

2.  Restricciones

> Las restricciones arquitectónicas establecen condiciones fijas que
> deben cumplirse durante el desarrollo del sistema, limitando las
> decisiones de diseño y las tecnologías a emplear. Estas restricciones
> no son negociables y deben respetarse a lo largo de todo el ciclo de
> vida del proyecto.

1.  Restricciones de Infraestructura

> Infraestructura Institucional: El sistema debe desplegarse
> exclusivamente en la infraestructura de servidores de la Universidad
> Privada de Tacna, sin dependencia de servicios en la nube externos.
> Todos los microservicios se ejecutarán en contenedores Docker
> orquestados mediante Docker Compose en servidores on-premise.
>
> Acceso de Red: El agente estará disponible únicamente dentro de la red
> institucional de la UPT, salvo que se definan políticas futuras
> específicas para acceso remoto autorizado. El sistema operará en red
> interna con acceso controlado mediante firewall institucional.
>
> Recursos de Hardware: El sistema debe ajustarse a las capacidades de
> CPU, memoria y almacenamiento disponibles en los servidores
> institucionales existentes, con asignación específica de puertos: API
> Gateway (3000), Chat Service (3001), NLP Service (3002), Knowledge
> Base (3003), Analytics (3004), Notifications (3005).

2.  Restricciones Tecnológicas

> Stack Backend - Microservicios Node.js:

-   API Gateway: NestJS + TypeScript (implementado)

-   Chat Service: NestJS + TypeScript + Socket.IO

-   Knowledge Base Service: NestJS + TypeScript

-   Analytics Service: NestJS + TypeScript

-   Notification Service: NestJS + TypeScript

> Stack Backend - Servicio Especializado:

-   NLP Service: Python + FastAPI como lenguaje y framework obligatorio
    > para la construcción del motor de procesamiento de lenguaje
    > natural y APIs REST especializadas

> Stack Frontend:

-   Widget de Chat: JavaScript vanilla con compatibilidad para
    > frameworks React, Angular y Vue.js

-   Integración directa en PHP nativo y HTML estático para
    > compatibilidad con intranet UPT existente

> Base de Datos Principal: Se utilizará MongoDB 7.0 como sistema de
> gestión de base de datos NoSQL orientada a documentos para almacenar
> de forma flexible la información del sistema (usuarios, sesiones,
> FAQs, métricas, configuraciones y logs de auditoría).
>
> Sistema de Caché: Se implementará Redis como sistema de almacenamiento
> en memoria para optimizar consultas frecuentes, gestionar tokens de
> sesión y publicación/suscripción entre microservicios.
>
> Procesamiento NLP: Se utilizarán librerías especializadas como Google
> DialogFlow, spaCy, NLTK o Hugging Face Transformers para el motor de
> procesamiento de lenguaje natural, con modelos entrenados para español
> peruano y terminología universitaria UPT.

1.  Restricciones de Seguridad

> Autenticación: Integración obligatoria con el sistema de credenciales
> institucionales existente de la UPT mediante JSON Web Tokens (JWT) en
> fase actual, con migración futura planificada a Single Sign-On (SSO)
> mediante LDAP/Active Directory institucional.
>
> Protocolo de Seguridad: Todas las comunicaciones deben utilizar
> protocolo HTTPS con certificados SSL/TLS institucionales. Las
> comunicaciones internas entre microservicios también deben estar
> cifradas.
>
> Validación de Emails: Solo se permiten correos electrónicos
> institucionales con dominio \@upt.pe para validación de usuarios y
> consultas sensibles.

2.  Restricciones de Desarrollo

> Patrón Arquitectónico Obligatorio: Todos los servicios Node.js deben
> implementar Clean Architecture + Domain-Driven Design (DDD) con
> separación estricta en capas:

-   Domain Layer (entidades, value objects, repositorios)

-   Application Layer (DTOs, use cases)

-   Infrastructure Layer (schemas, implementaciones de repositorios)

-   Presentation Layer (controladores)

> Gestión de Dependencias: Uso de npm workspaces para gestión
> centralizada de múltiples microservicios desde el directorio raíz del
> proyecto.
>
> Containerización Obligatoria: Cada microservicio debe tener su propio
> Dockerfile y ser ejecutable mediante Docker Compose para garantizar
> portabilidad y consistencia entre entornos.

1.  Restricciones de Integración con Sistemas UPT

> Sistemas Externos (Solo Consumo):

-   Base de Datos UPT → Información académica (solo lectura mediante
    > APIs)

-   Sistema de Tickets UPT → Escalamiento de casos complejos

-   Servidor Email UPT (smtp.upt.pe) → Notificaciones institucionales

-   LDAP/AD UPT → Autenticación institucional (integración futura)

> Protocolo: El sistema NO debe modificar datos en sistemas legacy de la
> UPT, solo consumir información mediante APIs REST autorizadas.

1.  Restricciones Operacionales

> Disponibilidad Mínima: El sistema debe mantener un uptime ≥ 99.5%
> mensual con estrategias de tolerancia a fallos y recuperación
> automática.
>
> Capacidad: Debe soportar mínimo 100 usuarios concurrentes sin
> degradación significativa del rendimiento.
>
> Monitoreo: Implementación obligatoria de health checks y logging
> centralizado para todos los microservicios.
>
> Backup: Respaldos automáticos diarios de MongoDB con retención mínima
> de 30 días para cumplir auditoría institucional (RN007).

3.  Representación de la Arquitectura del Sistema

    1.  Vista de Caso de Uso

        1.  Diagramas de Casos de Uso

> El diagrama de casos de uso del Agente Virtual UPT muestra las
> interacciones entre los diferentes actores (estudiantes, docentes,
> personal administrativo y administradores del sistema) y las
> funcionalidades principales del agente virtual.

![](media/image4.png){width="6.723639545056868in"
height="4.13576334208224in"}

> Fuente: Elaboración propia.

2.  Vista de Lógica

    1.  Diagrama de Subsistemas (paquetes)

> El sistema UPT Chat System se organiza en seis microservicios
> principales, cada uno con responsabilidades claramente definidas
> siguiendo los principios de Clean Architecture y DDD:

![](media/image11.png){width="6.3345209973753285in"
height="6.739930008748907in"}

Fuente: Elaboración propia.

Este diagrama muestra cómo se organiza la plataforma basada en
microservicios para procesar consultas en lenguaje natural, gestionar
interacciones de chat y generar métricas.

API Gateway (Puerto 3000)

-   Es el punto de entrada del sistema.

-   Recibe las peticiones de los usuarios (controladores de usuarios y
    > sesiones) y las enruta hacia los microservicios correspondientes.

-   Implementa la validación de datos, casos de uso y acceso a entidades
    > de dominio.

-   Se conecta directamente a MongoDB y Redis para persistencia y
    > gestión de sesiones.

Chat Service (Puerto 3001)

Maneja la comunicación en tiempo real usando WebSockets (Socket.IO).

-   Procesa mensajes, adjuntos y gestiona el contexto de la
    > conversación.

-   Se comunica con el NLP Service para entender la intención de la
    > consulta y con la Knowledge Base para buscar respuestas.

-   Usa Redis para publicar y suscribirse a eventos en tiempo real.

NLP Service (Puerto 3002)

-   Núcleo de procesamiento de lenguaje natural (NLP).

-   Usa integraciones con DialogFlow, modelos de spaCy, NLTK y modelos
    > propios de la UPT.

-   Extrae intenciones y entidades de los mensajes.

-   Incluye un motor de confianza que decide si la consulta debe
    > escalarse a un humano.

Knowledge Base Service (Puerto 3003)

-   Gestiona las FAQs y documentos.

-   Permite búsquedas semánticas, indexación de texto completo y
    > coincidencias de similitud.

-   Sus datos se almacenan en MongoDB.

-   Está previsto integrarlo con sistemas externos de la UPT (ej.
    > sistema de tickets).

Analytics Service (Puerto 3004)

-   Recolecta métricas de uso en tiempo real.

-   Ofrece APIs para dashboards, generación de reportes y exportación de
    > datos.

-   Utiliza InfluxDB/MongoDB como almacenamiento de series temporales.

Notification Service (Puerto 3005)

-   Envía notificaciones a usuarios y administradores.

-   Soporta emails, alertas de escalamiento, resúmenes de sesión y
    > alertas del sistema.

-   Se conecta a sistemas externos de la UPT como el servidor de correo
    > SMTP.

Infraestructura de soporte

-   MongoDB 7.0 → Almacena usuarios, sesiones, FAQs, métricas y logs.

-   Redis Cache → Maneja tokens de sesión, caché de FAQs y canales
    > pub/sub.

-   Sistemas externos UPT → Incluyen la base de datos institucional,
    > sistema de tickets, servidor de correo y autenticación futura con
    > LDAP/AD.

    1.  Diagrama de Secuencia (vista de diseño)

> **RF001 Widget de Chat**
>
> ![](media/image5.png){width="4.960569772528434in"
> height="6.4398654855643045in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama describe la interacción del usuario con el widget de
> chat integrado en la intranet UPT. El proceso inicia cuando el usuario
> accede al portal y el widget se carga automáticamente, consultando su
> configuración desde el API Gateway. Al hacer clic en el ícono de chat,
> se crea una sesión única con token de validación. Cuando el usuario
> escribe una consulta, el sistema la procesa mediante NLP y retorna la
> respuesta, garantizando una experiencia fluida y funcional.
>
> **RF002 Comprensión de Lenguaje Natural**
>
> ![](media/image2.png){width="5.084375546806649in"
> height="5.280722878390201in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama muestra el proceso completo de procesamiento de lenguaje
> natural. La consulta del usuario pasa por cuatro etapas:
> preprocesamiento (tokenización, normalización), análisis de intención
> usando DialogFlow, extracción de entidades nombradas, y búsqueda
> semántica en la base de conocimiento. El sistema calcula un nivel de
> confianza (0-1) basado en la similitud entre la consulta y las FAQs
> disponibles. Si la confianza es alta (≥0.70), retorna la respuesta
> directamente; si es baja, activa el escalamiento automático. El
> feedback del usuario se registra para mejorar continuamente el modelo.
>
> **RF003 Base de Datos de FAQ UPT**
>
> ![](media/image10.png){width="4.1885422134733155in"
> height="5.8151596675415576in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama ilustra la gestión administrativa de la base de
> conocimiento. El administrador se autentica con credenciales
> especiales y obtiene acceso al panel de gestión. El sistema lista
> todas las FAQs almacenadas en la colección knowledge_base de MongoDB,
> ordenadas por prioridad. Al seleccionar una FAQ, el administrador
> puede modificar su nombre (pregunta), respuesta, categoría o estado
> (habilitada/deshabilitada). El sistema valida que no existan preguntas
> duplicadas y mantiene un historial de versiones para auditoría. Si la
> validación falla, muestra un mensaje de error específico; si es
> exitosa, actualiza la FAQ y confirma la operación.
>
> **RF004 Validación por Correo Personal**
>
> ![](media/image3.png){width="4.001041119860018in"
> height="6.174196194225722in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama detalla el proceso de validación de identidad para
> consultas sensibles (contraseñas, datos personales, calificaciones).
> Cuando el sistema detecta keywords relacionadas con información
> confidencial, activa automáticamente un flujo de validación. El
> usuario debe proporcionar su correo institucional \@upt.pe, el cual se
> verifica contra la base de datos de usuarios registrados. Si el email
> existe, el sistema genera un token temporal de validación (válido por
> 5 minutos) y lo envía al correo mediante el Notification Service. El
> usuario ingresa el código recibido, el sistema lo verifica y, si es
> correcto, marca la sesión como validada permitiendo proceder con
> acciones sensibles. Si el email no existe en la BD o el código es
> inválido, se muestra un mensaje de error apropiado.
>
> **RF005 Transferencia a Soporte Humano**
>
> ![](media/image18.png){width="4.978898731408574in"
> height="5.3708552055993in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama muestra el proceso de escalamiento automático a soporte
> humano cuando el nivel de confianza es inferior al 70% (regla de
> negocio RN001). El Chat Service envía la consulta al NLP Service, que
> analiza la intención, extrae entidades y calcula la confianza
> basándose en la similitud con FAQs existentes y la especificidad de la
> consulta. Si la confianza es baja, el sistema activa automáticamente
> el escalamiento: crea un ticket en el Sistema de Tickets UPT con todo
> el contexto de la conversación, lo asigna a un especialista del área
> correspondiente, actualiza el estado de la sesión en MongoDB y envía
> notificaciones automáticas al usuario con el número de ticket y tiempo
> estimado de respuesta. Esto garantiza que casos complejos reciban
> atención humana especializada sin perder contexto.
>
> **RF006 Dashboard de Métricas**
>
> ![](media/image22.png){width="5.1485990813648295in"
> height="7.049620516185477in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama describe el funcionamiento del dashboard de métricas en
> tiempo real. El administrador accede al panel y el sistema consulta la
> colección analytics de MongoDB utilizando agregaciones para calcular
> estadísticas como total de consultas, distribución por categorías,
> tasa de resolución automática y satisfacción promedio. El Analytics
> Service procesa estos datos y genera información derivada como
> tendencias horarias y problemas frecuentes. El panel renderiza
> gráficos interactivos usando Chart.js y Recharts, permitiendo al
> administrador cambiar rangos de tiempo y visualizar datos con
> diferentes granularidades. Además, el sistema permite configurar
> alertas automáticas que se disparan cuando métricas específicas cruzan
> umbrales definidos.
>
> **RF007 Conexión con Sistema Académico**
>
> ![](media/image16.png){width="5.084375546806649in"
> height="4.904220253718285in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama ilustra la integración del agente con el sistema
> académico UPT para proporcionar respuestas personalizadas. Cuando el
> Chat Service detecta que una consulta requiere información académica
> específica del usuario (horarios, notas, calendario de exámenes), el
> API Gateway se conecta automáticamente al Sistema Académico UPT
> mediante una API REST autenticada con API key institucional. El
> sistema externo valida los permisos y retorna los datos del estudiante
> basándose en su código UPT. El Gateway formatea la respuesta de manera
> amigable, incorporando el nombre del usuario y presentando la
> información de forma estructurada. Todas las consultas a sistemas
> externos se registran en MongoDB para auditoría y analytics.
>
> **RF008 Motor de Búsqueda Semántica**
>
> ![](media/image6.png){width="3.9281255468066494in"
> height="6.120062335958005in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama describe el funcionamiento del motor de búsqueda
> semántica avanzado. Cuando un usuario utiliza expresiones coloquiales
> o imprecisas (\"campus online\" en lugar de \"campus virtual\"), el
> NLP Service preprocesa la consulta normalizando términos y expandiendo
> sinónimos. Luego genera embeddings vectoriales usando modelos de spaCy
> que representan el significado semántico de la consulta. El Knowledge
> Base Service realiza una búsqueda vectorial en MongoDB usando índices
> especializados que comparan similitudes entre vectores en lugar de
> coincidencias exactas de texto. El sistema implementa caché
> inteligente con Redis para optimizar consultas repetidas (TTL de 1
> hora). Los resultados se rankean combinando similitud vectorial (60%),
> popularidad de la FAQ (20%) y actualidad del contenido (20%). El
> sistema aprende automáticamente nuevas expresiones coloquiales para
> mejorar búsquedas futuras.
>
> **RF009 Historial de Casos por Ticket**
>
> ![](media/image20.png){width="5.4809919072615925in"
> height="8.999653324584427in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama muestra el sistema de seguimiento de casos por ticket
> que mantiene continuidad en las conversaciones. Cuando un usuario
> solicita información sobre casos anteriores, el sistema consulta
> MongoDB filtrando sesiones que tienen ticketId asociado y pertenecen
> al usuario autenticado. Muestra una lista de tickets con su estado
> actual (resuelto/pendiente/en progreso). Al seleccionar un ticket
> específico, el sistema recupera el historial completo de la
> conversación incluyendo mensajes del usuario, respuestas del bot y
> comunicaciones del agente humano asignado. El usuario puede agregar
> mensajes de seguimiento que se registran automáticamente en el ticket
> y notifican al especialista. Esto garantiza que no se pierda contexto
> entre interacciones y facilita el seguimiento de casos complejos que
> requieren múltiples interacciones.
>
> **RF010 Notificaciones por Email**
>
> ![](media/image14.png){width="4.636458880139982in"
> height="8.697431102362204in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama ilustra el sistema de notificaciones automáticas por
> correo institucional. Cuando se escala un caso o se produce un evento
> relevante, el Notification Service recibe la solicitud y recupera
> información del usuario y contexto de la sesión desde MongoDB.
> Selecciona la plantilla HTML apropiada y genera contenido
> personalizado incluyendo nombre del usuario, resumen de la
> conversación, número de ticket y datos de seguimiento. El email se
> encola en Bull Queue + Redis para procesamiento asíncrono con
> priorización. Un worker dedicado procesa la cola y envía emails
> mediante el servidor SMTP UPT. Si el envío falla, el sistema
> implementa reintentos automáticos con backoff exponencial (máximo 3
> intentos). Todos los envíos se registran en audit_logs para
> trazabilidad. El usuario recibe un correo profesional con toda la
> información necesaria y un archivo PDF adjunto con el resumen
> completo.
>
> **RF011 Mejora Continua**
>
> ![](media/image15.png){width="5.905216535433071in"
> height="8.958333333333334in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama muestra el sistema de mejora continua mediante
> aprendizaje supervisado. Cuando el usuario califica una respuesta
> (positivo/negativo), el sistema registra el feedback completo en la
> colección analytics incluyendo la consulta original, respuesta
> proporcionada, intención detectada, nivel de confianza y tiempo de
> respuesta. Si el usuario agrega comentarios textuales, estos se
> analizan para extraer insights adicionales. El Analytics Service
> dispara automáticamente un análisis de feedback acumulado cada 24
> horas, enviando datos al Sistema ML que identifica patrones como FAQs
> con bajo rating, intenciones mal clasificadas o respuestas
> desactualizadas. El ML genera recomendaciones específicas (actualizar
> FAQ-TEC-005, reentrenar clasificador) y calcula métricas de precisión
> por categoría. Si la precisión cae por debajo del 85%, se genera una
> alerta automática para el administrador. El sistema implementa
> reentrenamiento automático semanal incorporando el nuevo feedback,
> creando un ciclo de mejora continua.
>
> **RF012 Exportación de Datos**
>
> ![](media/image19.png){width="5.905216535433071in" height="8.875in"}
>
> Fuente: Elaboración propia.
>
> Este diagrama describe el flujo completo de generación y exportación
> de reportes personalizados para análisis gerencial. El administrador
> configura parámetros del reporte (rango de fechas, tipos de datos,
> formato) a través del panel administrativo. El sistema valida los
> parámetros (rango máximo 90 días, permisos apropiados) y envía la
> solicitud al Analytics Service. Este ejecuta consultas agregadas
> complejas en MongoDB para extraer métricas del período seleccionado:
> total de consultas, satisfacción promedio, tiempos de respuesta,
> distribución por categorías, etc. Para formato PDF, utiliza PDFKit
> generando un documento profesional con portada UPT, resumen ejecutivo,
> gráficos renderizados como imágenes (Chart.js), tablas detalladas y
> conclusiones. Para formato Excel, usa ExcelJS creando un libro con
> múltiples hojas (Resumen, Datos diarios, FAQs, Satisfacción)
> incluyendo formato condicional y gráficos integrados. Cada exportación
> se registra en audit_logs para trazabilidad. Los reportes generados
> tienen validez de 24 horas y se almacenan temporalmente para descarga.
> El administrador recibe un enlace de descarga seguro que verifica
> autorización antes de servir el archivo.

2.  Diagrama de Actividades con Objetos

![](media/image17.png){width="6.629215879265092in"
height="5.202398293963254in"}

Fuente: Elaboración propia.

Este diagrama representa el flujo operacional completo y principal del
sistema UPT Chat System, mostrando cómo una consulta de usuario es
procesada desde su ingreso hasta su resolución, identificando los
objetos específicos responsables de cada actividad a lo largo del
proceso.

Fase 1: Captura e Ingreso (Usuario → ChatWidget → APIGateway)

El flujo inicia cuando el Usuario accede al portal de intranet UPT y
abre el widget de chat para escribir su consulta. El objeto ChatWidget
captura esta entrada, valida que no esté vacía y envía una petición HTTP
POST al API Gateway.

El objeto APIGateway recibe la petición y ejecuta la validación de
autenticación mediante el objeto JWTValidator, que verifica el token JWT
incluido en los headers. Si el token es inválido, el sistema retorna un
error 401 y detiene el flujo. Si es válido, extrae el userId del objeto
TokenPayload y enruta la petición al ChatService.

Fase 2: Persistencia Inicial (ChatService)

El ChatService crea un objeto Consulta que encapsula los datos
esenciales: sessionId, userId, texto de la consulta y timestamp. Este
objeto es persistido inmediatamente en MongoDB mediante el objeto
MongoRepository, garantizando trazabilidad completa de todas las
interacciones antes de cualquier procesamiento adicional.

Fase 3: Procesamiento de Lenguaje Natural (NLPService)

La consulta se envía al NLPService donde comienza el análisis
inteligente:

1.  El objeto TextPreprocessor normaliza el texto, eliminando caracteres
    > especiales, convirtiendo a minúsculas y tokenizando la entrada

2.  El objeto IntentAnalyzer determina la intención del usuario
    > consultando DialogFlow API, que retorna una intención clasificada
    > con su nivel de confianza

3.  El objeto EntityExtractor utiliza spaCy con modelos de Named Entity
    > Recognition (NER) para identificar entidades clave como nombres,
    > fechas, ubicaciones o temas específicos

Fase 4: Búsqueda de Respuesta (KnowledgeBase)

El KnowledgeBase Service ejecuta una estrategia de búsqueda optimizada:

El objeto RedisCache se consulta primero para verificar si existe una
respuesta cacheada para esta consulta (identificada por un hash). Si hay
cache hit, la respuesta se retorna inmediatamente, reduciendo latencia y
carga en la base de datos.

Si hay cache miss, el sistema inicia búsqueda semántica:

-   El objeto EmbeddingGenerator utiliza modelos de spaCy para convertir
    > la consulta en un vector denso de 512 dimensiones que representa
    > su significado semántico

-   El objeto VectorSearchEngine ejecuta búsqueda de similitud coseno en
    > MongoDB utilizando el índice vectorial especializado vector_index

-   El objeto ResultRanker ordena los resultados aplicando un algoritmo
    > ponderado: similitud vectorial (60%), popularidad de la FAQ (20%)
    > y actualidad del contenido (20%)

-   Los resultados se guardan en RedisCache para consultas futuras

Fase 5: Cálculo de Confianza (NLPService)

El objeto ConfidenceCalculator procesa las FAQs retornadas y calcula un
nivel de confianza final usando la fórmula: confidence = (similarity ×
0.7) + (intentScore × 0.3). Este valor numérico entre 0 y 1 determina si
el sistema puede responder automáticamente o debe escalar.

Fase 6: Punto de Decisión Crítico

El sistema evalúa ¿Confianza \>= 0.70? Este es el punto de bifurcación
más importante del flujo, implementando la regla de negocio RN001 del
documento SRS.

Camino A: Respuesta Automática (Confianza ≥ 70%)

1.  Si la confianza es suficiente, el sistema entra en la partición
    > \"Respuesta Automática\":

2.  El ChatService crea un objeto Respuesta que encapsula el contenido
    > de la respuesta, nivel de confianza y fuentes (IDs de FAQs
    > consultadas)

3.  Este objeto se persiste en MongoDB mediante MongoRepository

4.  El AnalyticsService registra un objeto Metrica con datos de
    > rendimiento: tiempo de respuesta, nivel de confianza y categoría
    > de la consulta

5.  El ChatWidget muestra la respuesta al usuario junto con botones de
    > feedback (👍/👎)

6.  Si el usuario proporciona feedback, el AnalyticsService crea un
    > objeto Feedback y lo envía al objeto MLService que ejecuta
    > análisis de sentimiento y puede disparar reentrenamiento del
    > modelo

Camino B: Escalamiento Automático (Confianza \< 70%)

Si la confianza es insuficiente, el sistema entra en la partición
\"Escalamiento Automático\":

1.  El ChatService evalúa explícitamente la regla RN001 y obtiene el
    > contexto completo de la conversación mediante un objeto
    > ContextoSesion que incluye todos los mensajes previos y metadata
    > relevante

2.  Se invoca al SistemaTicketsUPT (sistema externo legacy) para crear
    > un objeto Ticket con el contexto completo, que incluye: ticketId
    > único, contexto de la conversación y especialista asignado
    > automáticamente según la categoría detectada

3.  El ChatService actualiza el objeto ChatSession cambiando su estado a
    > \"escalated\" y asociándolo con el ticketId generado

4.  El NotificationService genera un correo usando un objeto
    > EmailTemplate (template \"escalation\") que incluye saludo
    > personalizado, resumen de conversación, número de ticket y tiempo
    > estimado de respuesta

5.  El email se encola como un objeto EmailJob en Bull Queue con
    > prioridad \"high\" para procesamiento asíncrono

6.  El objeto SMTPClient intenta enviar el email via servidor SMTP
    > institucional (smtp.upt.pe)

7.  Si el envío es exitoso, se registra en un objeto AuditLog para
    > trazabilidad; si falla, se reencola automáticamente con backoff
    > exponencial (reintentos a los 5, 15 y 30 minutos)

8.  El ChatWidget muestra confirmación de escalamiento con el número de
    > ticket al usuario

    1.  Diagrama de Clases

> El Diagrama de Clases del Agente Virtual UPT organiza la estructura
> estática siguiendo principios de arquitectura limpia, separando las
> entidades de dominio, servicios de aplicación y componentes de
> infraestructura.
>
> ![](media/image12.png){width="4.988542213473316in"
> height="2.5338626421697286in"}
>
> Fuente: Elaboración propia

2.  Diagrama de Base de Datos

> ![](media/image13.png){width="5.067796369203849in"
> height="8.875346675415573in"}

1.  Vista de Implementación (vista de desarrollo)

    1.  Diagrama de arquitectura de software (paquetes)

![](media/image23.png){width="6.7965277777777775in"
height="1.9538517060367455in"}

2.  Diagrama de arquitectura del sistema (diagrama de componentes)

![](media/image7.png){width="6.816321084864392in"
height="1.86336832895888in"}

2.  Vista de Procesos

    1.  Diagrama de procesos del sistema (diagrama de actividad)

> ![](media/image8.png){width="5.083333333333333in"
> height="7.520833333333333in"}

3.  Vista de Despliegue

    1.  Diagrama de despliegue

> Este diagrama de despliegue representa la infraestructura on-premise
> del UPT Chat System distribuida en servidores institucionales. Los
> seis microservicios containerizados con Docker se ejecutan en el
> servidor de aplicaciones (puertos 3000-3005), mientras el servidor de
> base de datos aloja MongoDB 7.0 y Redis para persistencia y caché. El
> sistema se integra en la intranet UPT existente mediante un widget
> JavaScript y se conecta con sistemas institucionales como el
> académico, de tickets, email y LDAP, operando completamente dentro de
> la red universitaria con acceso controlado por firewall.

![](media/image9.png){width="6.956372484689414in"
height="1.3581485126859143in"}

4.  Atributos de Calidad del Software

> Los atributos de calidad definen las características no funcionales
> que garantizan el correcto funcionamiento, seguridad y experiencia del
> usuario en el Agente Virtual UPT. Estos atributos fueron establecidos
> basándose en los requerimientos específicos de la comunidad
> universitaria y las capacidades técnicas de la infraestructura
> institucional.

1.  Escenario de Usabilidad

> El sistema está diseñado para ofrecer una experiencia intuitiva a
> estudiantes, docentes y personal administrativo mediante una interfaz
> de chat responsive integrada directamente en la intranet UPT. La
> plataforma garantiza que el 90% de los usuarios complete consultas
> básicas sin asistencia externa, manteniendo coherencia visual con la
> identidad institucional y accesibilidad para usuarios con diferentes
> capacidades técnicas y dispositivos.

2.  Escenario de Confiabilidad

> Se garantiza una disponibilidad del 99.5% mensual mediante monitoreo
> continuo y mecanismos de recuperación automática que resuelven errores
> menores en menos de 30 segundos. El sistema implementa autenticación
> integrada con credenciales institucionales, respaldos automáticos de
> base de datos y registros completos de auditoría para asegurar la
> estabilidad operativa incluso durante picos de demanda.

3.  Escenario de Rendimiento

> La plataforma responde a consultas frecuentes en menos de 60 segundos
> y soporta 100 usuarios concurrentes sin degradación del servicio.
> Utiliza caché inteligente con Redis para optimizar respuestas
> recurrentes y técnicas de optimización en MongoDB. El motor NLP
> procesa consultas en español peruano con terminología universitaria,
> manteniendo un 85% de precisión en respuestas automáticas.

4.  Otros Escenarios

> Seguridad: Implementa comunicación HTTPS exclusiva, autenticación
> integrada con sistemas UPT y protección de datos según normativas
> locales, con auditorías periódicas y trazabilidad completa de accesos.
>
> Adaptabilidad: La arquitectura modular permite incorporar nuevas
> funcionalidades como soporte multilingüe, expansión de base de
> conocimiento e integración con sistemas universitarios adicionales sin
> impactar la operación existente.
