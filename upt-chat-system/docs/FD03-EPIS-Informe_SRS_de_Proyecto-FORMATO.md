![C:\\Users\\EPIS\\Documents\\upt.png](media/image26.png){width="1.0926727909011373in"
height="1.468837489063867in"}

**UNIVERSIDAD PRIVADA DE TACNA**

**FACULTAD DE INGENIERÍA**

**Escuela Profesional de Ingeniería de Sistemas**

**Proyecto "*Producción de un agente interactivo con procesamiento de
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

  1.0         PP,AH    PP,AH       RV          13/08/2025   Versión Original

  1.1         PP,AH    PP,AH       RV          31/08/25     Corrección de Narrativa

  1.2         PP,AH    PP,AH       RV          13/09/25     Corrección Diagramas
  ----------------------------------------------------------------------------------

Agente interactivo usando NLP para mejorar el tiempo de resolución en
soporte técnico

Documento de Especificación de Requerimientos de Software

Versión *1.0*

  --------------------------------------------------------------------------------
  CONTROL DE                                              
  VERSIONES                                               
  ----------- -------- ----------- ----------- ---------- ------------------------
  Versión     Hecha    Revisada    Aprobada    Fecha      Motivo
              por      por         por                    

  1.2         PP,AH    PP,AH       RV          13/09/25   Versión Original
  --------------------------------------------------------------------------------

**ÍNDICE GENERAL**

[INTRODUCCIÓN](#_heading=h.8nt472kzcoky) 4

[I. Generalidades de la Empresa](#_heading=h.5t8r8pcwb16z) 5

> 1\. Nombre de la Empresa 5
>
> 2\. Visión 5
>
> 3\. Misión 5
>
> 4\. Organigrama 5

[II. Visionamiento de la Empresa](#_heading=h.5t8r8pcwb16z) 5

> 1\. Descripción del Problema 5
>
> 2\. Objetivos de Negocios 5
>
> 3\. Objetivos de Diseño 5
>
> 4\. Alcance del proyecto 5
>
> 5\. Viabilidad del Sistema 5
>
> 6\. Información obtenida del Levantamiento de Información 6

[III. Análisis de Procesos](#_heading=h.5t8r8pcwb16z) 6

> a\) Diagrama del Proceso Actual -- Diagrama de actividades 6
>
> b\) Diagrama del Proceso Propuesto -- Diagrama de actividades Inicial
> 7

[IV Especificación de Requerimientos de
Software](#_heading=h.5t8r8pcwb16z) 7

> a\) Cuadro de Requerimientos funcionales Inicial 7
>
> b\) Cuadro de Requerimientos No funcionales 7
>
> c\) Cuadro de Requerimientos funcionales Final 8
>
> d\) Reglas de Negocio 9

[V Fase de Desarrollo](#_heading=h.5t8r8pcwb16z) 12

> 1\. Perfiles de Usuario 12
>
> 2\. Modelo Conceptual 5
>
> a\) Diagrama de Paquetes 5
>
> b\) Diagrama de Casos de Uso 12
>
> c\) Escenarios de Caso de Uso (narrativa) 14
>
> [3. Modelo Lógico](#_heading=h.5t8r8pcwb16z) 23
>
> a\) Análisis de Objetos 23
>
> b\) Diagrama de Actividades con objetos 32
>
> c) Diagrama de Secuencia 37
>
> d\) Diagrama de Clases 42

[CONCLUSIONES](#_heading=h.c136ccmkm7wl) 46

[RECOMENDACIONES](#_heading=h.50va1gmt4app) 46

[BIBLIOGRAFÍA](#_heading=h.knlf6dvyoqnp) 46

[WEBGRAFÍA](#_heading=h.2095j6oeabh2) 46

**INTRODUCCIÓN**

> El presente documento de Especificación de Requerimientos de Software
> (SRS) describe los requerimientos funcionales y no funcionales para el
> desarrollo de un agente interactivo basado en procesamiento de
> lenguaje natural (NLP) destinado a mejorar los servicios de soporte
> técnico en la plataforma de intranet de la Universidad Privada de
> Tacna (UPT).
>
> En el contexto educativo actual, las instituciones universitarias
> enfrentan un volumen creciente de consultas técnicas por parte de
> estudiantes, docentes y personal administrativo. La Universidad
> Privada de Tacna, comprometida con la innovación tecnológica y la
> mejora continua de sus servicios académicos, busca implementar una
> solución inteligente que optimice los tiempos de respuesta y mejore la
> calidad del soporte técnico ofrecido a través de su plataforma de
> intranet.
>
> Este proyecto representa una iniciativa estratégica para modernizar
> los procesos de soporte técnico universitario, aprovechando las
> capacidades de la inteligencia artificial para proporcionar asistencia
> inmediata, precisa y disponible las 24 horas del día a toda la
> comunidad universitaria UPT.

**I. Generalidades de la Empresa\
**  1. Nombre de la Empresa

Universidad Privada de Tacna (UPT)

2\. Visión

> La Universidad Privada de Tacna está orientada a ser una de las
> mejores instituciones de educación superior en el país, mediante el
> desarrollo en la excelencia académica y logrando un liderazgo en la
> formación del potencial humano que contribuya al desarrollo de nuestra
> región y del país.

 3. Misión

> La Universidad Privada de Tacna, fundada por inspiración cristiana, es
> una institución autónoma del más alto nivel académico; destinada a
> educar profesionales generadores de puestos de trabajo, con una
> formación integral humanística, científica y técnica; orientada hacia
> el liderazgo, cultura de calidad, respecto a la dignidad humana,
> protección del medio ambiente, aprecio de sus valores culturales y con
> una identificación total con su institución. Promueve la investigación
> y la proyección social comprometida con la transformación de la
> sociedad hacia una civilización superior
>
> 4\. Organigrama
>
> ![](media/image19.png){width="4.043225065616798in" height="3.71875in"}

**Fuente:** Elaboración propia.

> **Descripción:** Estructura organizacional jerárquica de la
> Universidad Privada de Tacna que muestra la cadena de mando para la
> implementación del sistema. En la cúspide se encuentra el Rector,
> seguido del Administrador de TI quien supervisa dos áreas principales:
> Soporte Humano y Servicios Internos UPT. Ambas áreas convergen en el
> Usuario Final (Estudiantes y Docentes), estableciendo el contexto
> organizacional donde operará el agente interactivo. Esta estructura
> define las líneas de autoridad, responsabilidad y flujo de
> comunicación para el proyecto.

**II. Visionamiento de la Empresa\
**  1. Descripción del Problema

> La Universidad Privada de Tacna enfrenta desafíos significativos en la
> gestión del soporte técnico a través de su plataforma de intranet. Los
> problemas identificados incluyen:
>
> **Tiempos de respuesta prolongados:** Los usuarios experimentan
> tiempos de espera promedio de 6-12 horas para consultas básicas y
> hasta 48 horas durante períodos de alta demanda (inicio de semestres,
> períodos de matrícula y exámenes finales).
>
> **Limitaciones de horario:** El soporte técnico actual opera en
> horario laboral ( 08:00 a 13:00 hrs. y de 14:00 a 17:00 hrs. de lunes
> a viernes), dejando sin atención a estudiantes y docentes que trabajan
> o estudian en horarios extendidos, especialmente aquellos en programas
> de educación continua y modalidades semi-presenciales.
>
> **Inconsistencia en respuestas:** Diferentes técnicos proporcionan
> soluciones variadas para problemas similares, generando confusión en
> los usuarios y potenciales errores en la implementación de
> procedimientos académicos y administrativos.
>
> **Impacto en la experiencia universitaria:** Estos problemas afectan
> directamente el rendimiento académico, la satisfacción estudiantil y
> la eficiencia operativa de la universidad, especialmente en un
> contexto donde la digitalización de procesos académicos es
> fundamental.

 2. Objetivos de Negocios

> **Objetivo General:** Mejorar la eficiencia y calidad del soporte
> técnico universitario mediante la implementación de un agente
> interactivo inteligente que reduzca en un 50% los tiempos de
> resolución de consultas técnicas y mejore la satisfacción de la
> comunidad universitaria UPT.
>
> **Objetivos Específicos:**

-   **Automatización de consultas frecuentes:** Lograr que el 75% de las
    > consultas técnicas comunes sean resueltas automáticamente sin
    > intervención del personal de TI, liberando recursos para atender
    > problemas más complejos.

-   **Disponibilidad continua:** Proporcionar soporte técnico 24/7 a
    > estudiantes, docentes y personal administrativo con tiempo de
    > respuesta menor a 60 segundos para consultas frecuentes.

-   **Integración con sistema universitario:** Conectar exitosamente el
    > agente con el sistema existente de la UPT

-   **Mejora en satisfacción del usuario:** Alcanzar un índice de
    > satisfacción superior al 85% en la resolución de consultas
    > técnicas según encuestas post-interacción.

-   **Reducción de costos operativos:** Generar ahorros del 30% en
    > costos de soporte técnico durante el primer año de operación.

 3. Objetivos de Diseño

> **Usabilidad y Accesibilidad:**

-   Diseñar una interfaz conversacional intuitiva que no requiere
    > capacitación específica para su uso

-   Implementar principios de diseño universal para garantizar
    > accesibilidad a usuarios con discapacidades

-   Asegurar compatibilidad con dispositivos móviles y diferentes
    > navegadores web

> **Rendimiento y Escalabilidad:**

-   Garantizar tiempos de respuesta menores a 3 segundos para consultas
    > estándar

-   Diseñar la arquitectura para soportar hasta 500 usuarios
    > concurrentes

-   Implementar capacidades de escalamiento horizontal para períodos de
    > alta demanda

> **Integración:**

-   Desarrollar APIs RESTful para integración con sistemas
    > universitarios existentes

-   Asegurar compatibilidad con estándares de autenticación
    > institucional

-   Implementar conectores para sistemas de gestión académica y
    > administrativa

> **Mantenibilidad y Extensibilidad:**

-   Utilizar arquitectura de microservicios para facilitar
    > actualizaciones y mantenimiento

-   Documentar completamente la arquitectura y procesos de desarrollo

 4. Alcance del Proyecto

> **Dentro del Alcance:**
>
> **Módulo de Procesamiento de Lenguaje Natural:**

-   Implementación de modelos de NLP para comprensión de consultas en
    > español

-   Capacidad de interpretación de sinónimos y variaciones lingüísticas

-   Detección de intenciones y extracción de entidades relevantes

> **Interfaz de Usuario Web:**

-   Chat widget integrable en la plataforma de intranet UPT

-   Panel de administración para gestión de conocimientos

-   Dashboard con métricas y analytics en tiempo real

> **Base de Conocimiento Universitaria:**

-   Repositorio de información específica de la UPT (procedimientos,
    > políticas, FAQ)

-   Sistema de gestión de contenido con versionado

-   Capacidades de búsqueda semántica avanzada

> **Integraciones Específicas:**

-   Campus Virtual para soporte técnico de plataformas educativas

-   Sistema de tickets para escalamiento a soporte humano

> **Sistema de Analytics y Reportes:**

-   Métricas de uso y rendimiento del agente

-   Identificación de tendencias y problemas recurrentes

 5. Viabilidad del Sistema

> **Viabilidad Técnica:** La Universidad Privada de Tacna cuenta con la
> infraestructura tecnológica necesaria para soportar el sistema
> propuesto:

-   Servidores dedicados con capacidad de procesamiento adecuada

-   Ancho de banda suficiente para soportar tráfico concurrente

-   Personal técnico con experiencia en desarrollo web y administración
    > de sistemas

-   Sistemas universitarios con APIs disponibles para integración

> **Viabilidad Económica:** Basándose en el análisis financiero del
> documento de factibilidad:

-   Inversión inicial: S/ 17,200

-   Beneficios anuales proyectados: S/ 23,048

-   ROI esperado: 18.7% TIR

-   Período de recuperación: 12 meses aproximadamente

> **Viabilidad Operativa:**

-   Alta demanda por parte de la comunidad universitaria por mejores
    > servicios de soporte

-   Apoyo directo de la administración universitaria

-   Personal de TI capacitado para administrar y mantener el sistema

-   Cultura organizacional receptiva a innovaciones tecnológicas

> **Viabilidad Legal:**

-   Cumplimiento con normativas de protección de datos personales

-   Políticas de privacidad alineadas con regulaciones educativas

-   Contratos de licenciamiento de software debidamente gestionados\
    > 6. Información Obtenida del Levantamiento de Información

**III. Análisis de Procesos\
**  a) Diagrama del Proceso Actual -- Diagrama de Actividades

![](media/image15.png){width="2.613614391951006in"
height="6.578754374453194in"} 

**Fuente:** Elaboración propia.

Este diagrama describe el flujo actual del proceso de mesa de ayuda,
mostrando las interacciones entre Usuario Final, Mesa de Ayuda TI y
Áreas de Apoyo. El proceso inicia cuando el usuario detecta un problema
y busca solución en recursos disponibles. Si no encuentra respuesta,
solicita ayuda por correo/Teams. La Mesa de Ayuda registra manualmente
el caso, lo clasifica y puede derivarlo a áreas especializadas según su
complejidad. Las Áreas de Apoyo consultan sistemas manuales y pueden
escalar casos internamente antes de devolver la solución. El objetivo es
mapear el proceso actual para identificar oportunidades de mejora en la
gestión de incidencias.

b\) Diagrama del Proceso Propuesto -- Diagrama de Actividades Inicial

![](media/image17.png){width="3.0380172790901137in"
height="5.257346894138233in"}

**Fuente:** Elaboración propia.

Este diagrama presenta el proceso mejorado del sistema de mesa de ayuda,
incorporando tecnología de inteligencia artificial para optimizar la
atención al usuario. El flujo inicia cuando el usuario accede al portal
corporativo y abre un chat virtual con un agente interactivo, donde
puede escribir su consulta en lenguaje natural. El Agente Virtual
analiza automáticamente el mensaje, consulta bases de conocimiento y
sistemas relacionados para generar respuestas, calculando un nivel de
confianza. Si la confianza es mayor al 70%, proporciona la respuesta
directamente y registra métricas para retroalimentación. En caso
contrario, escala el caso al Coordinador de Soporte, quien revisa la
información, prepara una respuesta personalizada y actualiza la base de
conocimiento. El objetivo es automatizar la resolución de consultas
frecuentes y mejorar la eficiencia del proceso de soporte.

**IV. Especificación de Requerimientos de Software\
**  a) Cuadro de Requerimientos Funcionales Inicial

+-------+-------------+----------------------+-------------------------+
| ID    | Necesidad   | Descripción          | Requerimientos que la   |
|       |             |                      | Satisfacen              |
+=======+=============+======================+=========================+
| N001  | C           | Los estudiantes      | -   RF001 Comprensión   |
|       | omunicación | necesitan            |     > de Lenguaje       |
|       | Natural con | comunicarse con el   |     > Natural           |
|       | Estudiantes | sistema usando su    |                         |
|       |             | lenguaje cotidiano,  |                         |
|       |             | expresiones          |                         |
|       |             | coloquiales y        |                         |
|       |             | terminología         |                         |
|       |             | académica local      |                         |
+-------+-------------+----------------------+-------------------------+
| N002  | Acceso      | Los usuarios         | -   RF002 Chat Widget   |
|       | Inmediato a | requieren obtener    |                         |
|       | Información | respuestas           | -   RF003 Base de Datos |
|       |             | instantáneas a sus   |     > de FAQ UPT        |
|       |             | consultas sin        |                         |
|       |             | esperar turnos o     |                         |
|       |             | horarios de atención |                         |
+-------+-------------+----------------------+-------------------------+
| N003  | Resolución  | Automatizar la       | -   RF003 Base de Datos |
|       | de          | resolución de las    |     > de FAQ UPT        |
|       | Problemas   | consultas más        |                         |
|       | Comunes     | frecuentes para      | -   RF008 Motor de      |
|       |             | reducir carga en     |     > Búsqueda          |
|       |             | personal de soporte  |     > Semántica         |
+-------+-------------+----------------------+-------------------------+
| N004  | Seguridad y | Proteger información | -   RF004 Validación    |
|       | Privacidad  | sensible de          |     > por Correo        |
|       | de Datos    | estudiantes y        |     > Personal          |
|       |             | validar identidad    |                         |
|       |             | antes de mostrar     |                         |
|       |             | datos personales     |                         |
+-------+-------------+----------------------+-------------------------+
| N005  | E           | Transferir casos     | -   RF005 Transferencia |
|       | scalamiento | complejos a humanos  |     > a Soporte Humano  |
|       | Efectivo    | sin perder contexto  |                         |
|       |             | ni información       | -   RF010               |
|       |             | previa               |     > Notificaciones    |
|       |             |                      |     > por Email         |
+-------+-------------+----------------------+-------------------------+
| N006  | Monitoreo y | Supervisar el        | -   RF006 Dashboard de  |
|       | Mejora      | rendimiento del      |     > Métricas          |
|       | Continua    | sistema y            |                         |
|       |             | identificar          | -   RF011 Mejora        |
|       |             | oportunidades de     |     > Continua          |
|       |             | mejora               |                         |
|       |             |                      | -   RF012 Exportación   |
|       |             |                      |     > de Datos          |
+-------+-------------+----------------------+-------------------------+
| N007  | Información | Brindar respuestas   | -   RF007 Conexión con  |
|       | Pe          | específicas basadas  |     > Sistema Académico |
|       | rsonalizada | en el perfil y       |                         |
|       |             | situación particular | -   RF009 Historial de  |
|       |             | del estudiante       |     > Casos por Ticket  |
+-------+-------------+----------------------+-------------------------+
| N008  | Búsqueda    | Encontrar            | -   RF008 Motor de      |
|       | Inteligente | información          |     > Búsqueda          |
|       |             | relevante incluso    |     > Semántica         |
|       |             | con consultas        |                         |
|       |             | imprecisas o         |                         |
|       |             | incompletas          |                         |
+-------+-------------+----------------------+-------------------------+
| N009  | Continuidad | Mantener historial y | -   RF009 Historial de  |
|       | de Servicio | contexto de          |     > Casos por Ticket  |
|       |             | conversaciones para  |                         |
|       |             | seguimiento de casos | -   RF010               |
|       |             |                      |     > Notificaciones    |
|       |             |                      |     > por Email         |
+-------+-------------+----------------------+-------------------------+
| N010  | Integración | Conectar el chatbot  | -   RF007 Conexión con  |
|       | Org         | con los sistemas y   |     > Sistema Académico |
|       | anizacional | canales existentes   |                         |
|       |             | en la universidad    |                         |
+-------+-------------+----------------------+-------------------------+
| N011  | Análisis    | Proporcionar         | -   RF006 Dashboard de  |
|       | Gerencial   | información          |     > Métricas          |
|       |             | estratégica para     |                         |
|       |             | toma de decisiones   | -   RF012 Exportación   |
|       |             | administrativas      |     > de Datos          |
+-------+-------------+----------------------+-------------------------+
| N012  | Ac          | Garantizar que todos | -   RF002 Chat Widget   |
|       | cesibilidad | los estudiantes      |                         |
|       | Universal   | puedan usar el       |                         |
|       |             | sistema              |                         |
|       |             | independientemente   |                         |
|       |             | de sus capacidades   |                         |
|       |             | técnicas             |                         |
+-------+-------------+----------------------+-------------------------+
| N013  | Eficiencia  | Reducir costos       | -   RF003 Base de Datos |
|       | Operativa   | operativos           |     > de FAQ UPT        |
|       |             | automatizando tareas |                         |
|       |             | repetitivas del área | -   RF005 Transferencia |
|       |             | de soporte           |     > a Soporte Humano  |
|       |             |                      |                         |
|       |             |                      | -   RF008               |
+-------+-------------+----------------------+-------------------------+
| N014  | Experiencia | Brindar una          | -   RF002 Chat Widget   |
|       | de Usuario  | experiencia uniforme |                         |
|       | Consistente |                      |                         |
+-------+-------------+----------------------+-------------------------+
| N015  | Aprendizaje | Capturar             | -   RF011 Mejora        |
|       | Org         | conocimiento de      |     > Continua          |
|       | anizacional | interacciones para   |                         |
|       |             | mejorar procesos y   | -   RF006 Dashboard de  |
|       |             | servicios            |     > Métricas          |
+-------+-------------+----------------------+-------------------------+

**Fuente:** Elaboración propia.

> **Descripción:** Matriz que mapea las necesidades identificadas
> (N001-N015) con los requerimientos funcionales que las satisfacen
> (RF001-RF012). Incluye descripción detallada de cada necesidad como
> comunicación natural, acceso inmediato, seguridad de datos, etc.

 b) Cuadro de Requerimientos No Funcionales

  --------------------------------------------------------------------------------
  ID       Tipo             Requerimiento No  Descripción         Criterio de
                            Funcional                             Aceptación
  -------- ---------------- ----------------- ------------------- ----------------
  RNF001   Rendimiento      Tiempo de         El sistema debe     ≤ 60 segundos
                            Respuesta         responder a         para 95% de
                                              consultas           consultas
                                              frecuentes en menos 
                                              de 60 segundos      

  RNF002   Escalabilidad    Usuarios          El sistema debe     100 usuarios
                            Concurrentes      soportar hasta 100  simultáneos
                                              usuarios            
                                              concurrentes sin    
                                              degradación         

  RNF003   Disponibilidad   Uptime del        El sistema debe     ≥ 99.5% uptime
                            Sistema           mantener una        
                                              disponibilidad      
                                              mínima del 99.5%    
                                              mensual             

  RNF004   Seguridad        Protección de     El sistema debe     Cumplimiento
                            Datos             cumplir con         GDPR y
                                              estándares de       normativas
                                              seguridad           locales
                                              universitarios y    
                                              protección de datos 

  RNF005   Usabilidad       Facilidad de Uso  La interfaz debe    90% de usuarios
                                              ser intuitiva para  completan tareas
                                              usuarios sin        sin ayuda
                                              conocimientos       
                                              técnicos avanzados  

  RNF006   Compatibilidad   Navegadores Web   El sistema debe     Compatibilidad
                                              funcionar en        certificada
                                              navegadores         
                                              modernos (Chrome    
                                              90+, Firefox 88+,   
                                              Safari 14+)         

  RNF007   Mantenibilidad   Actualizaciones   El sistema debe     Despliegue
                                              permitir            continuo sin
                                              actualizaciones sin downtime
                                              interrumpir el      
                                              servicio            

  RNF008   Precisión        Calidad de        El sistema debe     ≥ 85% respuestas
                            Respuestas        mantener una        correctas
                                              precisión mínima    
                                              del 85% en          
                                              respuestas          
                                              automáticas         

  RNF009   Portabilidad     Responsividad     El sistema debe     Funcionalidad
                                              funcionar           completa en
                                              correctamente en    móviles
                                              dispositivos        
                                              móviles y tablets   

  RNF010   Confiabilidad    Recuperación de   El sistema debe     Recovery
                            Errores           recuperarse         automático \< 30
                                              automáticamente de  segundos
                                              errores menores sin 
                                              intervención manual 
  --------------------------------------------------------------------------------

**Fuente:** Elaboración propia.

> **Descripción:** Tabla que especifica los requisitos técnicos del
> sistema incluyendo rendimiento, escalabilidad, disponibilidad,
> seguridad y usabilidad. Cada requerimiento incluye criterios de
> aceptación cuantificables (ej: ≤60 segundos, 99.5% uptime).

 c) Cuadro de Requerimientos Funcionales Final

  ---------------------------------------------------------------------------------------------
  ID      Módulo            Requerimiento    Descripción Detallada  Actor           Prioridad
                            Funcional                                               
  ------- ----------------- ---------------- ---------------------- --------------- -----------
  RF001   Interfaz          Chat Widget      El sistema debe        Usuario Final   Crítica
                                             proporcionar un widget                 
                                             de chat integrable en                  
                                             la pagina de intranet                  
                                             UPT con diseño                         
                                             responsivo y accesible                 

  RF002   NLP Core          Comprensión de   El sistema debe        Usuario Final   Crítica
                            Lenguaje Natural procesar consultas en                  
                                             español peruano,                       
                                             reconocer expresiones                  
                                             coloquiales                            
                                             universitarias,                        
                                             abreviaciones                          
                                             académicas y                           
                                             terminología técnica                   
                                             específica de la UPT                   

  RF003   Conocimiento      Base de Datos de El sistema debe        Administrador   Crítica
                            FAQ UPT          mantener una base de                   
                                             conocimiento con                       
                                             preguntas frecuentes                   
                                             categorizadas por:                     
                                             Académico, Técnico,                    
                                             Administrativo,                        
                                             Biblioteca                             

  RF004   Seguridad         Validación por   El sistema debe        Usuario Final   Crítica
                            Correo Personal  validar la identidad                   
                                             del usuario mediante                   
                                             correo personal                        
                                             registrado para                        
                                             resolver problemas de                  
                                             contraseñas y temas                    
                                             sensibles                              

  RF005   Escalamiento      Transferencia a  Cuando el nivel de     Sistema         Crítica
                            Soporte Humano   confianza de respuesta                 
                                             sea menor al 70%, el                   
                                             sistema debe crear un                  
                                             ticket automático con                  
                                             contexto completo para                 
                                             el equipo de TI                        

  RF006   Analytics         Dashboard de     El sistema debe        Administrador   Alta
                            Métricas         mostrar en tiempo                      
                                             real: consultas por                    
                                             hora, tipos de                         
                                             problemas más                          
                                             frecuentes, tasa de                    
                                             resolución automática,                 
                                             satisfacción del                       
                                             usuario                                

  RF007   Integración       Conexión con     El sistema debe        Sistema         Alta
                            Sistema          consultar información                  
                            Académico        desde el Sistema                       
                                             Académico UPT para                     
                                             brindar respuestas                     
                                             personalizadas                         

  RF008   Búsqueda          Motor de         El sistema debe        Sistema         Alta
                            Búsqueda         encontrar información                  
                            Semántica        relevante incluso                      
                                             cuando la consulta no                  
                                             coincida exactamente                   
                                             con las palabras clave                 
                                             almacenadas                            

  RF009   Personalización   Historial de     El sistema debe        Sistema         Media
                            Casos por Ticket mantener historial de                  
                                             consultas por número                   
                                             de ticket/caso para                    
                                             realizar seguimiento y                 
                                             proporcionar contexto                  

  RF010   Comunicación      Notificaciones   El sistema debe enviar Sistema         Media
                            por Email        resúmenes de                           
                                             conversación al correo                 
                                             institucional del                      
                                             usuario cuando se                      
                                             escale a soporte                       
                                             humano                                 

  RF011   Aprendizaje       Mejora Continua  El sistema debe        Sistema         Media
                                             registrar feedback de                  
                                             usuarios para mejorar                  
                                             la precisión de                        
                                             respuestas futuras                     
                                             mediante aprendizaje                   
                                             supervisado                            

  RF012   Reportes          Exportación de   Los administradores    Administrador   Baja
                            Datos            deben poder exportar                   
                                             reportes en formatos                   
                                             PDF y Excel para                       
                                             realizar análisis                      
                                             gerencial                              
  ---------------------------------------------------------------------------------------------

**Fuente:** Elaboración propia.

> **Descripción:** Especificación detallada de los 12 requerimientos
> funcionales principales (RF001-RF012) organizados por módulo, con
> descripción técnica completa, actores involucrados y nivel de
> prioridad (Crítica/Alta/Media/Baja).

 d) Reglas de Negocio

-   **RN001 - Escalamiento Automático** Las consultas con baja confianza
    > deben escalar automáticamente. Cuando el nivel de confianza es
    > menor al 70%, se debe crear ticket automático para soporte humano.

-   **RN002 - Horario de Atención** El chatbot debe indicar horarios de
    > atención para consultas presenciales. Cuando hay consulta fuera de
    > horario laboral, se debe mostrar horarios y canales alternativos.

-   **RN003 - Información Personalizada** Las respuestas deben adaptarse
    > al tipo de usuario.

-   **RN004 - Límite de Intentos** Máximo 3 intentos de reformular
    > consulta antes de escalar. Cuando el usuario no obtiene respuesta
    > satisfactoria, se debe escalar a soporte después del 3er intento.

-   **RN005 - Confidencialidad de Datos** No mostrar información
    > académica personal de otros usuarios. Cuando hay consulta sobre
    > datos de terceros, se debe mostrar solo información pública
    > general.

-   **RN006 - Validación de Contenido** Solo administradores autorizados
    > pueden modificar la base de conocimiento. Cuando hay intento de
    > edición de contenido, se debe verificar permisos de administrador.

-   **RN007 - Backup de Conversaciones** Todas las conversaciones deben
    > respaldarse por motivos de auditoría. Al finalizar cada
    > conversación, se debe almacenar en base de datos con timestamp.

**V. Fase de Desarrollo\
**  1. Perfiles de Usuario

> 1.1 Estudiante universitario

### Información General

-   Rol: Usuario final primario

-   Población: 7,000-7,500 estudiantes activos

-   Edad: 17-35 años (mayoría 18-24 años)

-   Nivel Tecnológico: Intermedio a avanzado

-   Dispositivos: Móviles o de Comunicación (99%)

### Características del Usuario

> Perfil Demográfico:

-   Estudiantes de pregrado y posgrado

-   Modalidades: Presencial

-   Horarios variables: diurno, vespertino, fines de semana

> Nivel de Experiencia Tecnológica:

-   Nativos digitales en su mayoría

-   Familiarizados con chats y aplicaciones móviles

-   Uso frecuente de redes sociales y plataformas digitales

-   Expectativas de respuesta inmediata

### Necesidades y Objetivos

> Principales Consultas:

-   Estado de matrícula y notas

-   Horarios de clases y cambios de aula

-   Fechas de exámenes y entregas

-   Problemas de acceso al Campus Virtual

-   Información sobre trámites académicos

-   Consultas sobre becas y beneficios estudiantiles

-   Soporte técnico para plataformas educativas

> Objetivos al usar el sistema:

-   Resolver consultas rápidamente (menos de 2 minutos)

-   Acceder a información personalizada 24/7

-   Obtener respuestas precisas sin esperar horarios de oficina

-   Evitar desplazamientos innecesarios a oficinas administrativas

### Comportamiento y Preferencias

> Patrones de Uso:

-   Horarios pico: 8:00-10:00 AM, 2:00-4:00 PM, 8:00-10:00 PM

-   Uso intensivo durante períodos de matrícula y exámenes

-   Preferencia por comunicación informal y directa

-   Uso de jergas estudiantiles y abreviaciones

> Expectativas:

-   Respuestas en lenguaje sencillo y claro

-   Información actualizada y precisa

-   Interfaz móvil amigable

-   Capacidad de seguimiento de consultas previas

### Frustraciones y Barreras

-   Tiempos de espera prolongados en soporte actual

-   Inconsistencia en respuestas de diferentes operadores

-   Limitaciones de horario de atención presencial

-   Dificultad para acceder a información personalizada

-   Procesos burocráticos complejos

> 1.2 Docente universitario

### Información General

-   Rol: Usuario final especializado

-   Población: \~250 docentes (tiempo completo y parcial)

-   Edad: 28-65 años

-   Nivel Tecnológico: Intermedio (variable por generación)

-   Dispositivos: Laptops (85%), PC escritorio (70%), móviles (60%)

### Características del Usuario

> Perfil Demográfico:

-   Docentes ordinarios, contratados y catedráticos

-   Diferentes regímenes: tiempo completo, parcial, por horas

-   Formación: Maestría (60%), Doctorado (25%), Licenciatura (15%)

-   Experiencia docente: 1-30+ años

> Nivel de Experiencia Tecnológica:

-   Heterogéneo según edad y especialidad

-   Docentes jóvenes: alto dominio tecnológico

-   Docentes senior: nivel básico a intermedio

-   Uso frecuente de herramientas educativas digitales

### Necesidades y Objetivos

> Principales Consultas:

-   Gestión de aulas virtuales y contenido educativo

-   Problemas técnicos con plataformas de enseñanza

-   Información sobre horarios y asignación de aulas

-   Consultas sobre procesos administrativos docentes

-   Soporte para herramientas de evaluación digital

-   Información sobre capacitaciones y actualizaciones

-   Gestión de calificaciones y registros académicos

> Objetivos al usar el sistema:

-   Resolver problemas técnicos sin interrumpir clases

-   Acceder a información administrativa rápidamente

-   Obtener soporte para herramientas educativas

-   Consultar procedimientos institucionales

### Comportamiento y Preferencias

> Patrones de Uso:

-   Horarios laborales: 7:00 AM - 6:00 PM

-   Uso intensivo durante inicio de semestres

-   Preferencia por comunicación formal pero eficiente

-   Necesidad de documentación detallada

> Expectativas:

-   Respuestas técnicamente precisas

-   Soluciones paso a paso

-   Enlaces a documentación oficial

-   Escalamiento rápido a soporte especializado

### Frustraciones y Barreras

-   Interrupciones durante clases por problemas técnicos

-   Falta de soporte técnico inmediato

-   Complejidad de algunos procedimientos administrativos

-   Variabilidad en el nivel de soporte recibido

> 1.3 Personal administrativo

### Información General

-   **Rol:** Usuario final operativo

-   **Población:** \~150 empleados administrativos

-   **Edad:** 25-60 años

-   **Nivel Tecnológico:** Básico a intermedio

-   **Dispositivos:** PC escritorio (90%), laptops (40%), móviles (50%)

### Características del Usuario

> **Perfil Demográfico:**

-   Personal de oficinas académicas y administrativas

-   Secretarias, asistentes, coordinadores

-   Personal de servicios estudiantiles

-   Trabajadores de diferentes áreas: admisión, registros, biblioteca,
    > TI

> **Nivel de Experiencia Tecnológica:**

-   Usuarios de sistemas específicos de su área

-   Conocimiento operativo de herramientas de oficina

-   Nivel variable según generación y área de trabajo

### Necesidades y Objetivos

> **Principales Consultas:**

-   Procedimientos internos y políticas institucionales

-   Soporte técnico para sistemas administrativos

-   Información sobre procesos interdepartamentales

-   Consultas sobre herramientas de trabajo

-   Acceso a formularios y documentación oficial

> **Objetivos al usar el sistema:**

-   Resolver dudas operativas rápidamente

-   Obtener información precisa sobre procedimientos

-   Acceder a recursos de trabajo de forma eficiente

-   Mejorar la atención al usuario final

### Comportamiento y Preferencias

> **Patrones de Uso:**

-   Horarios de oficina: 8:00 AM - 5:00 PM

-   Uso constante durante el día laboral

-   Preferencia por información estructurada y oficial

-   Necesidad de confirmación y referencias

> **Expectativas:**

-   Respuestas basadas en normativas oficiales

-   Información actualizada sobre procedimientos

-   Enlaces a documentos y formularios

-   Soporte para atención al público

> 1.4 Administrador del sistema

### Información General

-   **Rol:** Usuario administrador

-   **Población:** 3-5 administradores especializados

-   **Edad:** 25-45 años

-   **Nivel Tecnológico:** Avanzado a experto

-   **Dispositivos:** Workstations, laptops, acceso móvil de emergencia

### Características del Usuario

> **Perfil Demográfico:**

-   Personal de TI especializado

-   Administradores de sistemas y bases de datos

-   Analistas de soporte y coordinadores técnicos

-   Formación técnica especializada

> **Nivel de Experiencia Tecnológica:**

-   Experto en tecnologías de información

-   Conocimiento profundo de sistemas universitarios

-   Experiencia en administración de servicios digitales

### Necesidades y Objetivos

> **Principales Funciones:**

-   Gestión de la base de conocimiento

-   Monitoreo del rendimiento del sistema

-   Análisis de métricas y generación de reportes

-   Configuración y mantenimiento del agente

-   Gestión de escalamientos y casos complejos

> **Objetivos al usar el sistema:**

-   Mantener alta disponibilidad del servicio

-   Optimizar el rendimiento y precisión del agente

-   Gestionar el contenido de forma eficiente

-   Analizar tendencias y patrones de uso

### Comportamiento y Preferencias

> **Patrones de Uso:**

-   Acceso administrativo permanente

-   Monitoreo proactivo del sistema

-   Intervención en casos de escalamiento

-   Análisis periódico de métricas

> **Expectativas:**

-   Herramientas de administración intuitivas

-   Dashboards con métricas en tiempo real

-   Capacidades de configuración avanzada

-   Alertas automatizadas

2\. Modelo Conceptual\
  a) Diagrama de Paquetes

![](media/image24.png){width="5.525in" height="2.9895833333333335in"}

**Fuente:** Elaboración propia.

> **Descripción:** Este diagrama de paquetes muestra la organización
> modular del sistema de agente interactivo basado en procesamiento de
> lenguaje natural. El paquete central NLP Core gestiona el
> procesamiento inteligente de consultas y se comunica con todos los
> demás componentes del sistema. Los paquetes incluyen: Interfaz de
> Usuario para la interacción con los usuarios, Analytics y Reportes
> para métricas y seguimiento, Seguridad y Autenticación para control de
> acceso, Gestión de Conocimiento para almacenamiento de información,
> Escalamiento y Tickets para derivación de casos complejos, e
> Integración con Sistemas para conectividad con plataformas existentes.
> Las dependencias entre paquetes permiten un diseño modular y escalable
> que facilita el mantenimiento y la evolución del sistema.

  b) Diagrama de Casos de Uso

![](media/image6.png){width="5.905216535433071in"
height="3.638888888888889in"}

***Fuente:** Elaboración propia.*

> **Descripción:** Este diagrama de casos de uso presenta las
> funcionalidades del sistema de agente interactivo y las interacciones
> entre los diferentes actores. Los actores incluyen: Usuario Final,
> Administrador, y sistemas externos como API NLP, Sistema Intranet y
> Sistema de ML. El núcleo del sistema (NLP Core) gestiona casos de uso
> como Búsqueda Semántica Inteligente y Procesamiento de Consulta NLP.
> Los módulos principales incluyen: Interfaz de Usuario con Widget de
> Chat, Analytics y Reportes con exportación de datos y métricas en
> tiempo real, Escalamiento y Tickets para gestión de historiales,
> Seguridad y Autenticación para validación de usuarios, Gestión de
> Conocimiento con base de datos FAQ, e Integración con Sistemas para
> conexión académica. El sistema permite una gestión integral de
> consultas con capacidades de inteligencia artificial y escalamiento
> automático.
>
> c\) Escenarios de Caso de Uso (Narrativa)

**CU001 - Widget de Chat**

  -----------------------------------------------------------------------
  **Referencia**             **RF001**
  -------------------------- --------------------------------------------
  Tipo                       Obligatorio

  Autor(es)                  Angel Gadiel Hernandez Cruz

  Actores                    Usuario Final, API NLP, Sistema Intranet

  Descripción.               El caso de uso se inicia cuando el usuario
                             final accede a una página de la intranet UPT
                             dónde está integrado el widget de chat. El
                             usuario puede interactuar directamente con
                             el chatbot para resolver sus consultas sin
                             necesidad de contactar telefónicamente a la
                             mesa de ayuda.

  Precondiciones             La API NLP debe estar disponible. La página
                             de intranet debe tener el widget integrado.
                             La página de la intranet debe estar
                             funcionando.
  -----------------------------------------------------------------------

> Narrativa del caso de uso\
> Escenario Principal: Usuario sin Autenticar

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El usuario final entra 2\. El sistema Intranet carga
  a la página de la intranet automáticamente el widget .
  UPT.                       

  3\. El usuario hace clic   4\. La API NLP retorna la configuración del
  en el widget para iniciar  widget: Interfaz del chat, categorías
  una conversación           disponibles, opciones de consulta y estado
                             operativo

  5\. El usuario puede       6\. El widget queda completamente funcional
  escribir su consulta       y listo para recibir consultas del usuario
  directamente en el chat    
  -----------------------------------------------------------------------

> Escenario Alternativo: Usuario Autenticado

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El usuario final entra 
  a la página de la intranet 
  UPT.                       

  2\. El usuario final se    
  loguea con su cuenta en la 
  página de la intranet.     

  3\. El usuario final       4\. El Sistema Intranet carga
  navega por la intranet UPT automáticamente el widget
  y ve el widget de chat     
  disponible                 

  5\. El usuario hace clic   6\. La API NLP retorna la configuración del
  en el widget para iniciar  widget: Interfaz del chat, categorías
  una conversación           disponibles, opciones de consulta y estado
                             operativo

  7\. El usuario puede       8\. El widget queda completamente funcional
  escribir su consulta       y listo para recibir consultas del usuario
  directamente en el chat    
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas describen las interacciones que
> permiten a los usuarios finales acceder y utilizar el widget de chat
> integrado en la intranet de la UPT. Incluye tanto escenarios para
> usuarios autenticados como no autenticados, mostrando cómo el sistema
> carga automáticamente el widget y establece la conexión con la API NLP
> para brindar funcionalidad completa. El objetivo es proporcionar una
> interfaz accesible y funcional para que los usuarios puedan resolver
> sus consultas sin necesidad de contactar telefónicamente a la mesa de
> ayuda.

**CU002 - Procesamiento de Consulta NLP**

  -----------------------------------------------------------------------
  **Referencia**             **RF002**
  -------------------------- --------------------------------------------
  Tipo                       Obligatorio

  Autor(es)                  Angel Gadiel Hernandez Cruz

  Actores                    Usuario Final, API NLP

  Descripción.               El caso de uso se inicia cuando un usuario
                             final interactúa directamente con el API NLP
                             a través de la interfaz web. El usuario
                             ingresa su consulta en lenguaje natural y el
                             sistema debe procesar para brindar una
                             respuesta precisa y contextualizada.

  Precondiciones             El sistema API NLP debe estar operativo y
                             conectado a la base de conocimiento. El
                             usuario debe tener acceso a la interfaz web
                             del API NLP.
  -----------------------------------------------------------------------

> Narrativa del caso de uso\
> Flujo Principal:

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El usuario final       2\. El API NLP recibe la consulta y procesa
  accede a la interfaz del   si es válida para su resolución con la
  API NLP e ingresa su       información actual
  consulta en lenguaje       
  natural                    

                             3\. La API NLP devuelve una respuesta con
                             las instrucciones necesarias para resolver
                             el problema, incluyendo opción de feedback

  4\. El usuario final sigue 5\. La API NLP retorna respuestas
  las instrucciones          estructuradas con información relevante,
  proporcionadas o hace      incluyendo opción de feedback
  consultas adicionales      

  6\. El usuario final       7\. El API NLP registra la consulta,
  termina de aclarar sus     respuesta y feedback para mejora continua
  dudas y envía feedback     
  -----------------------------------------------------------------------

**Flujo Alternativo A1 - Consulta Inválida:**

-   **Punto de inserción: Después del paso 2**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A1.1. El API NLP determina que la consulta
                             no es válida o no puede ser resuelta con la
                             información actual

                             A1.2. El API NLP devuelve un mensaje
                             solicitando al usuario reformular su
                             pregunta con más detalles o claridad

  A1.3. El usuario reformula 
  su consulta                

  **Regresa al paso 1 del    
  flujo principal**          
  -----------------------------------------------------------------------

**Flujo Alternativo A2 - Sin Feedback:**

-   **Punto de inserción: Paso 6**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  A2.1. El usuario final     A2.2. El API NLP registra la consulta,
  termina de aclarar sus     respuesta y la ausencia de feedback
  dudas pero no envía        
  feedback                   

  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas ilustran el proceso central de
> interpretación y respuesta a consultas en lenguaje natural. Muestran
> cómo la API NLP recibe, procesa y responde a las consultas de los
> usuarios, incluyendo la validación de consultas, generación de
> respuestas estructuradas y recopilación de feedback. Los sistemas
> están diseñados para manejar tanto consultas válidas como inválidas,
> proporcionando mecanismos de reformulación y mejora continua del
> servicio.

**CU003 - Base de Datos de FAQ UPT**

  -----------------------------------------------------------------------
  **Referencia**             **RF003**
  -------------------------- --------------------------------------------
  Tipo                       Obligatorio

  Autor(es)                  Angel Gadiel Hernandez Cruz

  Actores                    Administrador, Sistema de Gestión del NLP

  Descripción.               El caso de uso se inicia cuando el
                             administrador necesita gestionar la base de
                             conocimiento de FAQ, apropiadamente para
                             mejorar la efectividad del sistema.

  Precondiciones             El administrador debe tener credenciales
                             válidas con permisos de gestión. La base de
                             datos debe estar operativa y accesible.
  -----------------------------------------------------------------------

> Narrativa del caso de uso

  ------------------------------------------------------------------------
  **Acción del actor**        **Respuesta del sistema**
  --------------------------- --------------------------------------------
  1\. El administrador inicia 2\. El Sistema de Gestión del NLP muestra
  sesión y navega a la        las opciones del gestor del modelo
  sección de gestión del NLP  

  3\. El administrador entra  2\. El Sistema de Gestión del NLP muestra
  a la opción de gestión de   una lista completa de todas las preguntas
  FAQ                         frecuentes, incluyendo su estado
                              (habilitada/deshabilitada) y su nombre.

  3\. El administrador        4\. El Sistema de Gestión del NLP carga la
  selecciona una FAQ para     FAQ seleccionada y presenta opciones para
  editarla.                   modificar su nombre (la pregunta) o cambiar
                              su estado.

  5\. El administrador        6\. El Sistema de Gestión del NLP valida los
  modifica el nombre de la    cambios. Si el nuevo nombre no está
  pregunta o cambia el estado duplicado y el estado es válido, procede a
  (habilitar/deshabilitar).   actualizar la FAQ en la base de datos.

                              7\. El Sistema de Gestión del NLP guarda los
                              cambios y actualiza el registro de la FAQ.

                              8\. El Sistema de Gestión del NLP muestra un
                              mensaje de confirmación de éxito y actualiza
                              la lista en pantalla para reflejar los
                              cambios realizados.
  ------------------------------------------------------------------------

**Flujo Alternativo A1 - Validación de Cambios Fallida:**

-   **Punto de inserción: Después del paso 6**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A1.1. Sistema de Gestión del NLP detecta que
                             el nuevo nombre de la FAQ ya existe en la
                             base de datos o que los datos ingresados no
                             cumplen con los criterios de validación
                             establecidos

                             A1.2. El Sistema de Gestión del NLP muestra
                             un mensaje de error específico indicando la
                             razón del rechazo

  A1.3. El administrador     
  revisa el mensaje de error 
  y corrige los datos        
  ingresados                 

  Regresa al paso 6 del      
  flujo principal            
  -----------------------------------------------------------------------

**Flujo Alternativo A2 - Administrador Cancela la Operación:**

-   **Punto de inserción: Después del paso A1.2**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  A2.1. El administrador     A2.2. El Sistema de Gestión del NLP descarta
  decide cancelar la         los cambios realizados y regresa a la lista
  operación de edición       completa de FAQ sin guardar modificaciones

                             A2.3. El Sistema de Gestión del NLP muestra
                             un mensaje informativo: \"Operación
                             cancelada. No se guardaron cambios\"
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas presentan las funcionalidades de
> gestión administrativa de la base de conocimiento de preguntas
> frecuentes. Permiten a los administradores mantener actualizada la
> información del sistema mediante la edición, habilitación y
> deshabilitación de FAQ. Incluyen validaciones para evitar duplicados y
> mantener la integridad de los datos, asegurando que la base de
> conocimiento permanezca consistente y útil para los usuarios finales.

**CU004 - Validación de Usuario por Información Personal**

  -----------------------------------------------------------------------
  **Referencia**             **RF004**
  -------------------------- --------------------------------------------
  Tipo                       Obligatorio

  Autor(es)                  Angel Gadiel Hernandez Cruz

  Actores                    Usuario Final, API NLP

  Descripción.               El caso de uso se inicia cuando un usuario
                             final necesita asistencia con temas
                             sensibles que requieren validación de
                             identidad. El usuario debe validar su
                             identidad mediante correo personal
                             registrado antes de que el sistema proceda
                             con acciones que comprometan la seguridad.

  Precondiciones             El usuario debe tener registrado un correo
                             personal en el sistema UPT. La base de datos
                             de usuarios debe estar actualizada y
                             accesible. El sistema debe detectar
                             consultas sensibles.
  -----------------------------------------------------------------------

> Narrativa del caso de uso

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El Usuario Final       2\. El API NLP detecta que es una consulta
  solicita ayuda con un tema sensible y solicita validación de identidad
  sensible a través del      
  chatbot                    

  3\. El Usuario Final       4\. La API NLP verifica la información
  brinda la información      mediante la base de datos
  actual conocida            

  5\. El Usuario Final       6\. La API NLP otorga una serie de pasos
  recibe confirmación de     para solucionar su problema
  identidad validada         

  7\. El Usuario Final puede 8\. La API NLP registra la validación
  proceder con las acciones  exitosa y habilita las funciones
  autorizadas según su       correspondientes
  validación                 
  -----------------------------------------------------------------------

**Flujo Alternativo A1 - Validación de Identidad Fallida:**

-   **Punto de inserción: Después del paso 4**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A1.1. La API NLP no puede verificar la
                             información proporcionada o detecta
                             inconsistencias con los datos registrados en
                             la base de datos

                             A1.2. La API NLP muestra un mensaje de
                             error: \"Los datos proporcionados no
                             coinciden con nuestros registros. Por favor,
                             verifique la información e inténtelo
                             nuevamente\"

  A1.3. El Usuario Final     
  revisa y corrige la        
  información personal       
  proporcionada              

  Regresa al paso 4 del      
  flujo principal            
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas describen el proceso de autenticación
> y validación de identidad para consultas sensibles que requieren
> verificación del usuario. Los sistemas solicitan y verifican
> información personal registrada antes de proporcionar acceso a
> funciones que comprometen la seguridad. Incluyen mecanismos de
> validación robustos y manejo de errores para casos donde la
> información proporcionada no coincide con los registros del sistema.

**CU005 - Escalamiento a Soporte Humano Especializado**

  -----------------------------------------------------------------------
  **Referencia**             **RF005**
  -------------------------- --------------------------------------------
  Tipo                       Obligatorio

  Autor(es)                  Angel Gadiel Hernandez Cruz

  Actores                    Usuario Final, API NLP

  Descripción.               El caso de uso se inicia automáticamente
                             cuando la API NLP determina que una consulta
                             es demasiado compleja o específica, con un
                             nivel de confianza menor al 70%. El sistema
                             debe crear un ticket automático y derivar el
                             caso al especialista correspondiente.

  Precondiciones             El sistema de tickets debe estar integrado y
                             operativo. Los especialistas deben estar
                             registrados por áreas de expertise. El motor
                             NLP debe estar calculando niveles de
                             confianza.
  -----------------------------------------------------------------------

> Narrativa del caso de uso

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El Usuario Final       2\. La API NLP procesa la consulta y
  ingresa una consulta       determina nivel de confianza menor al umbral
  compleja en el chatbot     establecido (70%)

  3\. El Usuario Final       4\. La API NLP identifica automáticamente el
  recibe notificación de que área especializada y crea ticket para un
  el caso será derivado a un soporte humano
  especialista               

  5\. El Usuario Final       6\. La API NLP retorna el número de ticket
  proporciona información    generado y notifica automáticamente al
  adicional si es requerida  especialista correspondiente
  por el sistema             

  7\. El Usuario Final       8\. La API NLP actualiza el estado del
  recibe confirmación de que ticket y programa seguimiento automático
  será contactado por un     
  especialista               
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas muestran el proceso automatizado de
> derivación de consultas complejas al soporte humano especializado.
> Cuando la API NLP determina que una consulta tiene un nivel de
> confianza inferior al 70%, los sistemas crean automáticamente un
> ticket y lo asignan al especialista correspondiente. El objetivo es
> asegurar que los usuarios reciban atención adecuada incluso para
> problemas que superan las capacidades del sistema automatizado.

**CU006 - Dashboard de Métricas en Tiempo Real**

  -----------------------------------------------------------------------
  **Referencia**             **RF006**
  -------------------------- --------------------------------------------
  Tipo                       Obligatorio

  Autor(es)                  Piero Alexander Paja de la Cruz

  Actores                    Administrador, Sistema de Gestión del NLP

  Descripción.               El caso de uso se inicia cuando el
                             administrador necesita monitorear el
                             rendimiento del sistema de chatbot en tiempo
                             real, visualizando métricas clave para tomar
                             decisiones operativas.

  Precondiciones             El sistema de analytics debe estar
                             recopilando datos. La base de datos de
                             métricas debe estar actualizada. El
                             dashboard debe tener conectividad con la
                             API.
  -----------------------------------------------------------------------

> Narrativa del caso de uso

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El administrador       2\. El Sistema de Gestión del NLP muestra
  inicia sesión y navega a   las opciones del gestor del modelo
  la sección de gestión del  
  NLP                        

  3\. El administrador       4\. El Sistema de Gestión del NLP solicita
  accede al dashboard y      métricas actuales.
  selecciona el período de   
  tiempo a analizar          

  5\. El administrador       6\. El Sistema de Gestión del NLP calcula y
  visualiza gráficos         retorna métricas en tiempo real con datos
  actualizados de consultas  actualizados
  y categorías               

  7\. El administrador       8\. Sistema de Gestión del NLP muestra
  identifica patrones y      detalles de problemas frecuentes y permite
  tendencias en las          análisis específico
  consultas                  

  9\. El administrador puede 10\. Sistema de Gestión del NLP actualiza el
  exportar las métricas o    dashboard periódicamente y mantiene
  configurar alertas         histórico para tendencias
  -----------------------------------------------------------------------

**Flujo Alternativo A1 - Error en Conectividad con la API:**

-   **Punto de inserción: Después del paso 4**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A1.1. El Sistema de Gestión del NLP no puede
                             establecer conexión con la base de datos de
                             métricas no está disponible

                             A1.2. El Sistema de Gestión del NLP muestra
                             un mensaje de error: \"No se pueden cargar
                             las métricas en tiempo real. Verifique la
                             conectividad del sistema\"

  A1.3. El administrador     
  puede reintentar la        
  conexión o revisar         
  métricas en caché          

  **Regresa al paso 4 del    
  flujo principal**          
  -----------------------------------------------------------------------

**Flujo Alternativo A2 - Datos Insuficientes para el Período
Seleccionado:**

-   **Punto de inserción: Después del paso 6**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A2.1. EL Sistema de Dashboard determina que
                             no hay suficientes datos para el período de
                             tiempo seleccionado

                             A2.2. El Sistema de Dashboard muestra:
                             \"Datos insuficientes para el período
                             seleccionado. Se muestran datos disponibles
                             con indicadores de períodos sin
                             información\"

  A2.3. El administrador     
  ajusta el rango de fechas  
  o acepta visualizar datos  
  parciales                  

  **Regresa al paso 6 del    
  flujo principal**          
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas presentan las funcionalidades de
> monitoreo y análisis del rendimiento del sistema de chatbot. Permiten
> a los administradores visualizar métricas clave en tiempo real,
> identificar patrones y tendencias, y tomar decisiones operativas
> informadas. Incluyen capacidades de exportación de datos y
> configuración de alertas, así como manejo de errores de conectividad y
> períodos con datos insuficientes.

**CU007 -** Conexión con Sistema Académico

+-------------------------+--------------------------------------------+
| **Referencia**          | **RF007**                                  |
+=========================+============================================+
| Tipo                    | Obligatorio                                |
+-------------------------+--------------------------------------------+
| Autor(es)               | Piero Alexander Paja de la Cruz            |
+-------------------------+--------------------------------------------+
| Actores                 | Usuario Final, API NLP                     |
+-------------------------+--------------------------------------------+
| Descripción.            | El caso de uso se inicia cuando el usuario |
|                         | final realiza una consulta que requiere    |
|                         | información desde la base de datos de UPT. |
|                         | El sistema debe conectarse automáticamente |
|                         | con la base de datos de UPT para brindar   |
|                         | respuestas basadas en la información       |
|                         | oficial de la universidad.                 |
+-------------------------+--------------------------------------------+
| Precondiciones          | La base de datos de UPT debe estar         |
|                         | disponible y operativa                     |
|                         |                                            |
|                         | Las APIs de integración deben estar        |
|                         | configuradas correctamente                 |
|                         |                                            |
|                         | El usuario debe estar autenticado en el    |
|                         | sistema                                    |
|                         |                                            |
|                         | Los servicios de consulta deben tener      |
|                         | permisos de acceso                         |
+-------------------------+--------------------------------------------+

> Narrativa del caso de uso

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El usuario final       2\. La API NLP detecta que requiere
  realiza una consulta       información de la base de datos de UPT

  3\. El usuario final       4\. La API NLP se conecta con la base de
  espera la respuesta        datos de UPT

  5\. El usuario continúa    6\. La API NLP obtiene la información desde
  esperando                  la base de datos de UPT

  7\. El usuario recibe la   8\. La API NLP presenta la información
  respuesta basada en        obtenida de la base de datos de UPT
  información de la base de  
  datos de UPT               
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas describen las interacciones que
> permiten a los usuarios finales acceder y utilizar el widget de chat
> integrado en la intranet de la UPT. Incluye tanto escenarios para
> usuarios autenticados como no autenticados, mostrando cómo el sistema
> carga automáticamente el widget y establece la conexión con la API NLP
> para brindar funcionalidad completa. El objetivo es proporcionar una
> interfaz accesible y funcional para que los usuarios puedan resolver
> sus consultas sin necesidad de contactar telefónicamente a la mesa de
> ayuda.
>
> **CU008 - Búsqueda Semántica Inteligente**

  -----------------------------------------------------------------------
  **Referencia**             **RF008**
  -------------------------- --------------------------------------------
  Tipo                       Obligatorio

  Autor(es)                  Piero Alexander Paja de la Cruz

  Actores                    API NLP, Usuario Final

  Descripción.               El caso de uso se inicia cuando el sistema
                             recibe una consulta que no coincide
                             exactamente con la base de conocimiento. El
                             motor debe interpretar la intención del
                             usuario y encontrar información relevante.

  Precondiciones             El motor de NLP debe estar entrenado. La
                             base de conocimiento debe estar indexada
                             semánticamente. El sistema de embeddings
                             debe estar operativo.
  -----------------------------------------------------------------------

> Narrativa del caso de uso

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El usuario final       2\. La API NLP procesa los términos y los
  ingresa una consulta       interpreta usando sinónimos y contexto
  utilizando expresiones     
  coloquiales                

  3\. El usuario final       4\. La API NLP encuentra una respuesta
  recibe respuesta relevante adecuada y la presenta
  a pesar de usar            
  terminología no estándar   

  5\. El usuario final       6\. La API NLP aprende la nueva expresión y
  confirma que la respuesta  actualiza el modelo semántico
  fue útil y relevante       

  7\. El usuario final puede 8.La API NLP registra la consulta
  continuar la conversación  exitosamente resuelta para mejorar el modelo
  con confianza              
  -----------------------------------------------------------------------

**Flujo Alternativo A1 - NLP No Puede Interpretar la Consulta:**

-   **Punto de inserción: Después del paso 2**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A1.1.La API NLP no puede procesar o
                             interpretar adecuadamente las expresiones
                             coloquiales utilizadas

                             A1.2.La API NLP muestra un mensaje: \"No
                             pude entender completamente tu consulta.
                             ¿Podrías explicarme de otra manera o usar
                             términos más específicos?\"

  A1.3. El usuario final     
  reformula su consulta      
  usando términos más claros 
  o estándar                 

  Regresa al paso 2 del      
  flujo principal            
  -----------------------------------------------------------------------

**Flujo Alternativo A2 - Múltiples Intentos de Reformulación Fallidos:**

-   **Punto de inserción: Después del paso A1.2**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  A2.1. El usuario final ha  A2.2. La API NLP ofrece opciones
  reformulado la consulta    predefinidas: \"Parece que estoy teniendo
  múltiples veces sin éxito  dificultades para entender. ¿Tu consulta se
                             relaciona con alguno de estos temas?\" y
                             muestra categorías principales

  A2.3. El usuario final     
  selecciona una categoría   
  disponible                 

  Continúa con flujo de      
  categorías específicas     
  -----------------------------------------------------------------------

**Flujo Alternativo A3 - Fracaso Total en Interpretación:**

-   **Punto de inserción: Después del paso A2.2**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  A3.1. El Usuario FInal no  A3.2. La API NLP muestra: \"Lamento no poder
  encuentra su consulta en   ayudarte en este momento. Te recomiendo
  las categorías mostradas o contactar a nuestro soporte técnico para
  continúa sin ser entendido recibir asistencia personalizada\" y
                             proporciona información de contacto

  A3.3. El usuario final     
  puede optar por contactar  
  soporte humano o finalizar 
  la sesión                  
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas ilustran las capacidades avanzadas de
> interpretación de lenguaje natural del sistema. Muestran cómo la API
> NLP procesa consultas utilizando expresiones coloquiales y encuentra
> información relevante mediante análisis semántico. Incluyen mecanismos
> de aprendizaje continuo y alternativas de escalamiento cuando los
> sistemas no pueden interpretar adecuadamente las consultas de los
> usuarios.
>
> **CU009 - Gestión de Historial por Ticket**

  -----------------------------------------------------------------------
  **Referencia**             **RF009**
  -------------------------- --------------------------------------------
  Tipo                       Obligatorio

  Autor(es)                  Piero Alexander Paja de la Cruz

  Actores                    Usuario Final, API NLP

  Descripción.               El caso de uso se inicia cuando un usuario
                             realiza una consulta de seguimiento sobre un
                             problema previamente reportado. El sistema
                             debe poder acceder al historial completo
                             para brindar continuidad en la atención.

  Precondiciones             El sistema de tickets debe estar operativo.
                             Cada caso debe tener un número único. El
                             historial debe estar almacenado y accesible.
  -----------------------------------------------------------------------

> Narrativa del caso de uso

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El usuario final       2\. La API NLP muestra el historial de
  realiza una consulta de    tickets asociados únicamente al usuario y
  seguimiento sobre un       solicita seleccionar uno específico
  problema reportado         

  3\. El usuario final       4\. La API NLP retorna el historial completo
  selecciona un ticket del   del ticket seleccionado con todas las
  historial mostrado o       interacciones previas
  proporciona un número de   
  ticket específico          

  5\. El usuario final puede 6\. La API NLP presenta el estado actual del
  revisar el contexto        caso y las acciones realizadas
  anterior y continuar desde 
  donde quedó                

  7\. El usuario final       8\. La API NLP registra automáticamente la
  proporciona información    nueva interacción y actualiza el historial
  adicional o solicita       
  actualizaciones            
  -----------------------------------------------------------------------

**Flujo Alternativo A1 - Ticket No Encontrado:**

-   **Punto de inserción: Después del paso 4**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A1.1. La API NLP no encuentra el número de
                             ticket proporcionado en los registros del
                             usuario o el ticket no pertenece al usuario
                             actual

                             A1.2. La API NLP: \"El número de ticket
                             proporcionado no fue encontrado en su
                             historial. Verifique el número o seleccione
                             uno de sus tickets disponibles\" y muestra
                             nuevamente la lista de tickets del usuario

  A1.3. El Usuario final     
  revisa sus tickets         
  disponibles y selecciona   
  uno válido                 

  Regresa al paso 4 del      
  flujo principal            
  -----------------------------------------------------------------------

**Flujo Alternativo A2 - Usuario Sin Historial de Tickets:**

-   **Punto de inserción: Después del paso 2**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A2.1. LA API NLP determina que el usuario no
                             tiene tickets registrados en su historial

                             A2.2. La API NLP muestra: \"No se
                             encontraron tickets asociados a su usuario.
                             ¿Desea crear un nuevo reporte o consulta?\"

  A2.3. El usuario final     
  decide crear un nuevo      
  ticket o finalizar la      
  sesión                     

  Continúa con flujo de      
  creación de nuevo ticket   
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas presentan el sistema de seguimiento y
> continuidad de casos mediante tickets únicos. Permiten a los usuarios
> realizar consultas de seguimiento sobre problemas previamente
> reportados, manteniendo el contexto completo de las interacciones
> anteriores. Los sistemas aseguran que cada usuario solo pueda acceder
> a su propio historial y proporcionan mecanismos para casos donde no se
> encuentran tickets o usuarios sin historial previo.

**CU010 - Envío de Notificaciones por Email**

  -----------------------------------------------------------------------
  **Referencia**             **RF010**
  -------------------------- --------------------------------------------
  Tipo                       Obligatorio

  Autor(es)                  Piero Alexander Paja de la Cruz

  Actores                    API NLP, Usuario Final

  Descripción.               El caso de uso se inicia cuando un caso es
                             escalado o resuelto. El sistema debe enviar
                             automáticamente un resumen de la
                             conversación al correo del usuario para que
                             tenga registro de la atención recibida.

  Precondiciones             El sistema de correo debe estar configurado.
                             El usuario debe tener correo registrado. Los
                             templates de email deben estar definidos.
  -----------------------------------------------------------------------

> Narrativa del caso de uso

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El usuario final       2\. LA API NLP detecta automáticamente el
  completa una interacción   cambio de estado del ticket
  que requiere escalamiento  
  o resolución               

  3\. El usuario final debe  4\. La API NLP genera resumen del caso con
  recibir notificación sobre toda la conversación
  el estado de su consulta   

  5\. El usuario final       6\. La API NLP envía correo formateado con
  recibe email con resumen   información del ticket
  completo y próximos pasos  

  7\. El usuario final tiene 8\. La API NLP confirma entrega del email y
  registro permanente de la  registra la notificación
  atención recibida          
  -----------------------------------------------------------------------

**Flujo Alternativo A1 - Correo del Usuario No Válido:**

-   **Punto de inserción: Después del paso 4**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A1.1. La API NLP detecta que el correo
                             registrado del usuario no es válido o está
                             inactivo

                             A1.2. El sistema marca la notificación como
                             no entregada y registra: \"Correo del
                             usuario no válido. Notificación no enviada\"

                             A1.3. La API NLP actualiza el estado del
                             usuario para requerir verificación de correo
                             en próxima sesión

  El caso de uso finaliza    
  sin envío de notificación  
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas describen el sistema automatizado de
> notificaciones por correo electrónico para mantener a los usuarios
> informados sobre el estado de sus consultas. Generan resúmenes
> completos de las conversaciones y los envían automáticamente cuando un
> caso es escalado o resuelto. Incluyen validación de direcciones de
> correo y manejo de errores para casos donde el correo del usuario no
> es válido o está inactivo.
>
> **CU011 - Mejora Continua por Feedback**

  -----------------------------------------------------------------------
  **Referencia**             **RF0011**
  -------------------------- --------------------------------------------
  Tipo                       Obligatorio

  Autor(es)                  Piero Alexander Paja de la Cruz

  Actores                    Usuario Final, Sistema de ML

  Descripción.               El caso de uso se inicia cuando se completa
                             una interacción con el usuario. El sistema
                             debe recopilar feedback sobre la utilidad de
                             las respuestas para entrenar continuamente
                             el modelo y mejorar la experiencia futura.

  Precondiciones             El sistema de ML debe estar configurado. La
                             base de datos de feedback debe estar
                             operativa. Los usuarios deben poder evaluar
                             las respuestas.
  -----------------------------------------------------------------------

> Narrativa del caso de uso

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El usuario final       2\. El Sistema de ML presenta
  completa una interacción   automáticamente opciones de calificación y
  exitosa con el chatbot     comentarios

  3\. El usuario final       4\. El Sistema de ML registra el feedback
  proporciona feedback sobre asociando la calificación con la consulta
  la utilidad de la          específica
  respuesta recibida         

  5\. El usuario final puede 6\. El sistema de ML procesa el feedback
  agregar comentarios        para identificar patrones y mejoras
  adicionales sobre su       
  experiencia                

  7\. El usuario final       8\. El Sistema de ML actualiza los
  confirma el envío de su    algoritmos basándose en el aprendizaje
  evaluación                 continuo
  -----------------------------------------------------------------------

**Flujo Alternativo A1 - Usuario No Proporciona Feedback:**

-   **Punto de inserción: Después del paso 2**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  A1.1. El usuario final     
  ignora o cierra las        
  opciones de calificación   
  sin proporcionar feedback  

                             A1.2. El Sistema de ML registra la
                             interacción como \"sin feedback\" y mantiene
                             estadísticas de participación

                             A1.3. El Sistema de ML guarda la consulta y
                             respuesta para análisis posterior sin
                             calificación asociada

  El caso de uso finaliza    
  sin actualización del      
  modelo                     
  -----------------------------------------------------------------------

**Flujo Alternativo A2 - Feedback Negativo Recurrente:**

-   **Punto de inserción: Después del paso 4**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A2.1. El Sistema de ML detecta patrones de
                             feedback negativo recurrente para tipos
                             específicos de consultas

                             A2.2. El Sistema de ML genera alerta
                             automática: \"Patrón de feedback negativo
                             detectado. Se requiere revisión del modelo
                             para este tipo de consultas\"

  A2.3. El usuario final     
  puede continuar            
  proporcionando comentarios 
  adicionales                

  Continúa en el paso 5 del  
  flujo principal            
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas muestran el sistema de recopilación y
> procesamiento de retroalimentación de los usuarios para la mejora
> continua del modelo de machine learning. Permiten a los usuarios
> calificar la utilidad de las respuestas recibidas y proporcionar
> comentarios adicionales. Los sistemas utilizan este feedback para
> entrenar y mejorar continuamente los algoritmos, incluyendo detección
> de patrones negativos recurrentes que requieren atención especial.
>
> **CU012 - Exportación de Datos**

+-------------------------+--------------------------------------------+
| **Referencia**          | **RF0012**                                 |
+=========================+============================================+
| Tipo                    | Obligatorio                                |
+-------------------------+--------------------------------------------+
| Autor(es)               | Piero Alexander Paja de la Cruz            |
+-------------------------+--------------------------------------------+
| Actores                 | Administrador, Sistema de Gestión del NLP  |
+-------------------------+--------------------------------------------+
| Descripción.            | El caso de uso se inicia cuando un         |
|                         | administrador del sistema necesita         |
|                         | exportar reportes con datos analíticos del |
|                         | chatbot para realizar análisis gerencial.  |
|                         | El Sistema de Gestión del NLP debe generar |
|                         | reportes en formatos PDF y Excel con       |
|                         | información relevante sobre el uso y       |
|                         | rendimiento del sistema.                   |
+-------------------------+--------------------------------------------+
| Precondiciones          | El administrador debe tener credenciales   |
|                         | válidas con permisos de administración     |
|                         |                                            |
|                         | El Sistema de Gestión del NLP de analytics |
|                         | debe estar recopilando datos               |
|                         |                                            |
|                         | Las librerías de exportación (PDF y Excel) |
|                         | deben estar instaladas y configuradas      |
|                         |                                            |
|                         | Debe existir información suficiente en la  |
|                         | base de datos para generar reportes        |
+-------------------------+--------------------------------------------+

> Narrativa del caso de uso

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  1\. El administrador       2.El Sistema de Gestión del NLP presenta la
  inicia sesión y navega a   interfaz de generación de reportes con
  la sección de reportes     opciones de configuración

  3\. El administrador       4\. El Sistema de Gestión del NLP valida los
  selecciona el período de   parámetros seleccionados y muestra vista
  tiempo y tipos de datos a  previa de datos disponibles
  incluir en el reporte      

  5\. El administrador elige 6\. El Sistema de Gestión del NLP solicita
  el formato de exportación  confirmación de los parámetros y formato
  (PDF o Excel)              seleccionado

  7\. El administrador       8\. El Sistema de Gestión del NLP inicia el
  confirma la generación del proceso de generación consultando la base de
  reporte                    datos analytics

  9\. El administrador       10\. El Sistema de Gestión del NLP compila
  espera mientras se procesa los datos, aplica formato según el tipo
  la exportación             seleccionado y genera el archivo

  11\. El administrador      12\. El Sistema de Gestión del NLP presenta
  recibe notificación de que opciones para descargar el archivo o
  el reporte está listo      enviarlo por correo

  13\. El administrador      14\. El Sistema de Gestión del NLP registra
  descarga el reporte        la exportación realizada
  generado                   

  15\. El administrador      
  puede utilizar el reporte  
  para análisis gerencial    
  -----------------------------------------------------------------------

**Flujo Alternativo A1 - Error en Generación del Reporte:**

-   **Punto de inserción: Después del paso 10**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A1.1. El Sistema de Gestión del NLP
                             encuentra errores durante la compilación de
                             datos o falla en la generación del archivo

                             A1.2. El Sistema de Gestión del NLP muestra
                             un mensaje de error: \"Error al generar el
                             reporte. Por favor, verifique los parámetros
                             seleccionados e inténtelo nuevamente\"

  A1.3. El administrador     
  revisa los parámetros y    
  ajusta la configuración    
  del reporte                

  Regresa al paso 4 del      
  flujo principal            
  -----------------------------------------------------------------------

**Flujo Alternativo A2 - Datos Insuficientes para el Período
Seleccionado:**

-   **Punto de inserción: Después del paso 4**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
                             A2.1. El Sistema de Gestión del NLP
                             determina que no existen datos suficientes
                             para el período de tiempo seleccionado

                             A2.2. El Sistema de Gestión del NLP muestra
                             advertencia: \"Datos insuficientes para el
                             período seleccionado. Seleccione un rango de
                             fechas diferente o incluya menos filtros
                             específicos\"

  A2.3. El administrador     
  modifica el período de     
  tiempo o ajusta los        
  filtros de datos           

  Regresa al paso 3 del      
  flujo principal            
  -----------------------------------------------------------------------

**Flujo Alternativo A3 - Administrador Cancela el Proceso:**

-   **Punto de inserción: Después del paso 6**

  -----------------------------------------------------------------------
  **Acción del actor**       **Respuesta del sistema**
  -------------------------- --------------------------------------------
  A3.1. El administrador     A3.2. El Sistema de Gestión del NLP cancela
  decide cancelar la         el proceso y muestra: \"Generación de
  generación del reporte     reporte cancelada. No se creó ningún
                             archivo\"

                             A3.3. El Sistema de Gestión del NLPregresa a
                             la interfaz principal de generación de
                             reportes sin guardar cambios

  Regresa al paso 2 del      
  flujo principal            
  -----------------------------------------------------------------------

> **Fuente:** Elaboración propia.
>
> **Descripción:** Estos diagramas presentan las funcionalidades de
> generación y exportación de reportes analíticos para uso gerencial.
> Permiten a los administradores configurar y exportar datos en formatos
> PDF y Excel, incluyendo parámetros personalizables de período de
> tiempo y tipos de información. Los sistemas incluyen validaciones de
> datos suficientes, manejo de errores en la generación y opciones
> flexibles de entrega de los reportes generados.

 3. Modelo Lógico

a\) Análisis de Objetos

-   RF001 Comprensión de Lenguaje Natural

  -----------------------------------------------------------------------
  **Tipo**                **Objeto**              **Responsabilidad**
  ----------------------- ----------------------- -----------------------
  **Boundary**            InterfazUsuario         Capturar consultas del
                                                  usuario

  **Boundary**            InterfazNLP             Comunicar con servicios
                                                  de procesamiento

  **Control**             ProcesadorConsulta      Analizar mensaje y
                                                  detectar intención

  **Control**             CalculadorConfianza     Determinar nivel de
                                                  confianza de respuesta

  **Entity**              Consulta                Almacenar texto de
                                                  consulta y metadatos

  **Entity**              RespuestaNLP            Contener respuesta
                                                  procesada y confianza
  -----------------------------------------------------------------------

> ![](media/image27.png){width="4.7822922134733155in"
> height="2.977211286089239in"}

-   RF002 Chat Widget

  ------------------------------------------------------------------------
  **Tipo**                **Objeto**               **Responsabilidad**
  ----------------------- ------------------------ -----------------------
  **Boundary**            InterfazAdministracion   Panel de gestión de FAQ

  **Boundary**            APIConsultaFAQ           Endpoint para consultar
                                                   FAQ

  **Control**             GestorFAQ                Administrar CRUD de FAQ

  **Control**             ValidadorContenido       Validar contenido de
                                                   FAQ

  **Entity**              FAQ                      Almacenar pregunta,
                                                   respuesta y metadatos

  **Entity**              CategoriaFAQ             Organizar FAQ por
                                                   categorías
  ------------------------------------------------------------------------

> ![](media/image7.png){width="4.9697922134733155in"
> height="2.989795494313211in"}

-   RF003 Base de Datos de FAQ UPT

  ------------------------------------------------------------------------
  **Tipo**                **Objeto**               **Responsabilidad**
  ----------------------- ------------------------ -----------------------
  **Boundary**            InterfazAdministracion   Panel de gestión de FAQ

  **Boundary**            APIConsultaFAQ           Endpoint para consultar
                                                   FAQ

  **Control**             GestorFAQ                Administrar CRUD de FAQ

  **Control**             ValidadorContenido       Validar contenido de
                                                   FAQ

  **Entity**              FAQ                      Almacenar pregunta,
                                                   respuesta y metadatos

  **Entity**              CategoriaFAQ             Organizar FAQ por
                                                   categorías
  ------------------------------------------------------------------------

> ![](media/image29.png){width="4.959375546806649in"
> height="2.8633377077865267in"}

-   RF004 Validación por Correo Personal

  -----------------------------------------------------------------------
  **Tipo**                **Objeto**              **Responsabilidad**
  ----------------------- ----------------------- -----------------------
  **Boundary**            FormularioValidacion    Capturar datos para
                                                  validación

  **Boundary**            ServicioEmail           Enviar tokens de
                                                  validación

  **Control**             ValidadorIdentidad      Verificar información
                                                  personal

  **Control**             GeneradorToken          Crear tokens temporales

  **Entity**              DatosPersonales         Almacenar información
                                                  del usuario

  **Entity**              TokenValidacion         Contener token y tiempo
                                                  expiración
  -----------------------------------------------------------------------

> ![](media/image11.png){width="4.855208880139982in"
> height="3.0674759405074368in"}

-   RF005 Transferencia a Soporte Humano

  -----------------------------------------------------------------------
  **Tipo**                **Objeto**              **Responsabilidad**
  ----------------------- ----------------------- -----------------------
  **Boundary**            InterfaceEscalamiento   Notificar escalamiento
                                                  al usuario

  **Boundary**            SistemaTickets          Integrar con sistema de
                                                  tickets

  **Control**             DetectorEscalamiento    Identificar necesidad
                                                  de escalamiento

  **Control**             AsignadorTickets        Asignar tickets a
                                                  especialistas

  **Entity**              Ticket                  Almacenar información
                                                  del caso

  **Entity**              ContextoConversacion    Mantener historial
                                                  completo
  -----------------------------------------------------------------------

> ![](media/image3.png){width="4.761458880139982in"
> height="2.7155905511811023in"}

-   RF006 Dashboard de Métricas

  -----------------------------------------------------------------------
  **Tipo**                **Objeto**              **Responsabilidad**
  ----------------------- ----------------------- -----------------------
  **Boundary**            PanelDashboard          Mostrar métricas
                                                  visuales

  **Boundary**            APIAnalytics            Endpoint para consultar
                                                  métricas

  **Control**             ColectorMetricas        Recopilar datos del
                                                  sistema

  **Control**             GeneradorGraficos       Crear visualizaciones

  **Entity**              MetricasGenerales       Almacenar estadísticas
                                                  del sistema

  **Entity**              IndicadorRendimiento    Contener KPIs
                                                  calculados
  -----------------------------------------------------------------------

> ![](media/image21.png){width="5.0322922134733155in"
> height="2.8503937007874014in"}

-   RF007 Conexión con Sistema Académico

  -----------------------------------------------------------------------
  **Tipo**                **Objeto**              **Responsabilidad**
  ----------------------- ----------------------- -----------------------
  **Boundary**            InterfazConsulta        Mostrar información
                                                  académica

  **Boundary**            APIAcademica            Conectar con sistema
                                                  académico UPT

  **Control**             ConectorAcademico       Gestionar consultas
                                                  académicas

  **Control**             ValidadorAcceso         Verificar permisos de
                                                  acceso

  **Entity**              DatosAcademicos         Almacenar información
                                                  estudiantil

  **Entity**              PerfilEstudiantil       Contener datos del
                                                  estudiante
  -----------------------------------------------------------------------

> ![](media/image18.png){width="4.9697922134733155in"
> height="2.9313648293963253in"}

-   RF008 Motor de Búsqueda Semántica

  -----------------------------------------------------------------------
  **Tipo**                **Objeto**              **Responsabilidad**
  ----------------------- ----------------------- -----------------------
  **Boundary**            InterfazBusqueda        Capturar consultas de
                                                  búsqueda

  **Boundary**            ServicioBusqueda        Interfaz con motor de
                                                  búsqueda

  **Control**             ProcesadorSemantico     Procesar consultas
                                                  semánticamente

  **Control**             RankeadorResultados     Ordenar resultados por
                                                  relevancia

  **Entity**              IndiceSemantico         Almacenar índices
                                                  vectoriales

  **Entity**              ResultadoBusqueda       Contener resultados
                                                  encontrados
  -----------------------------------------------------------------------

> ![](media/image2.png){width="4.646875546806649in"
> height="2.8392497812773403in"}

-   RF009 Historial de Casos por Ticket

  -----------------------------------------------------------------------
  **Tipo**                **Objeto**              **Responsabilidad**
  ----------------------- ----------------------- -----------------------
  **Boundary**            InterfazHistorial       Mostrar historial de
                                                  casos

  **Boundary**            RepositorioTickets      Acceder a base datos de
                                                  tickets

  **Control**             GestorHistorial         Administrar historial
                                                  de casos

  **Control**             BuscadorTickets         Localizar tickets
                                                  específicos

  **Entity**              HistorialTicket         Almacenar secuencia de
                                                  interacciones

  **Entity**              InteraccionUsuario      Contener detalles de
                                                  cada interacción
  -----------------------------------------------------------------------

> ![](media/image1.png){width="4.7510422134733155in"
> height="2.913682195975503in"}

-   RF010 Notificaciones por Email

  -----------------------------------------------------------------------
  **Tipo**                **Objeto**              **Responsabilidad**
  ----------------------- ----------------------- -----------------------
  **Boundary**            InterfazNotificacion    Configurar
                                                  notificaciones

  **Boundary**            ServicioSMTP            Enviar correos
                                                  electrónicos

  **Control**             GestorNotificaciones    Administrar envío de
                                                  notificaciones

  **Control**             FormateadorEmail        Crear plantillas de
                                                  correo

  **Entity**              ConfiguracionEmail      Almacenar parámetros de
                                                  correo

  **Entity**              RegistroEnvio           Contener log de emails
                                                  enviados
  -----------------------------------------------------------------------

> ![](media/image8.png){width="4.709375546806649in"
> height="2.9121237970253717in"}

-   RF011 Mejora Continua

  -----------------------------------------------------------------------
  **Tipo**                **Objeto**              **Responsabilidad**
  ----------------------- ----------------------- -----------------------
  **Boundary**            InterfazFeedback        Capturar evaluaciones
                                                  del usuario

  **Boundary**            ServicioML              Integrar con servicios
                                                  de ML

  **Control**             ColectorFeedback        Recopilar
                                                  retroalimentación

  **Control**             ProcesadorAprendizaje   Procesar datos para
                                                  mejoras

  **Entity**              FeedbackUsuario         Almacenar
                                                  calificaciones y
                                                  comentarios

  **Entity**              ModeloAprendizaje       Contener parámetros del
                                                  modelo
  -----------------------------------------------------------------------

> ![](media/image30.png){width="5.1260422134733155in"
> height="2.8822244094488187in"}

-   RF012 Exportación de Datos

  -----------------------------------------------------------------------
  **Tipo**                **Objeto**              **Responsabilidad**
  ----------------------- ----------------------- -----------------------
  **Boundary**            PanelExportacion        Interfaz para
                                                  configurar exportación

  **Boundary**            GeneradorArchivos       Crear archivos
                                                  PDF/Excel

  **Control**             GestorExportacion       Administrar proceso de
                                                  exportación

  **Control**             ValidadorFormato        Verificar formato y
                                                  parámetros

  **Entity**              ConfiguracionReporte    Almacenar parámetros
                                                  del reporte

  **Entity**              DatosExportacion        Contener datos a
                                                  exportar
  -----------------------------------------------------------------------

> ![](media/image4.png){width="4.9072922134733155in"
> height="2.7705369641294837in"}

b\) Diagrama de Actividades con Objetos

> ![](media/image14.png){width="5.905216535433071in" height="3.875in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama describe el proceso automatizado que sigue un agente
> virtual (chatbot) para gestionar las consultas de los usuarios en un
> portal corporativo. Comienza con el acceso del usuario y la recepción
> de la consulta, donde el agente analiza la intención del mensaje.
> Luego, consulta una base de conocimiento para generar una respuesta
> potencial, calcula un nivel de confianza y, si este es igual o
> superior al 70%, muestra la respuesta al usuario de inmediato. Si la
> confianza es menor, deriva el caso a un agente humano, quien revisa la
> información, responde al usuario por correo o chat y posteriormente
> valida la respuesta para enriquecer la base de conocimiento. El
> proceso incluye el registro de métricas, la captación de feedback y la
> actualización de la base de conocimiento para mejorar las respuestas
> futuras.

c\) Diagrama de Secuencia

-   RF001 Comprensión de Lenguaje Natural

> ![](media/image23.png){width="5.905216535433071in"
> height="3.2083333333333335in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama muestra el proceso de cómo el sistema procesa una
> consulta en lenguaje natural de un usuario. El Agente Virtual recibe
> la consulta, la API de NLP analiza la intención y consulta la Base de
> Conocimiento. Luego, genera una respuesta con un nivel de confianza,
> se muestra al usuario y se registra su feedback para mejorar el
> sistema.

-   RF002 Chat Widget

> ![](media/image22.png){width="5.905216535433071in"
> height="4.388888888888889in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama describe la interacción del usuario con el widget de
> chat integrado en la intranet UPT. El proceso inicia cuando el usuario
> accede al portal y hace clic en el widget, el cual se carga
> automáticamente con su configuración (interfaz, categorías y estado).
> Al escribir una consulta, el Agente Virtual la procesa y muestra la
> respuesta al usuario, garantizando una experiencia fluida y funcional.

-   RF003 Base de Datos de FAQ UPT

> ![](media/image16.png){width="5.905216535433071in"
> height="4.652777777777778in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama ilustra el flujo que sigue un administrador para
> gestionar las preguntas frecuentes (FAQ) del sistema. Tras iniciar
> sesión, el administrador consulta, selecciona y modifica las FAQ
> (nombre o estado), con validaciones que aseguran la correcta
> actualización en la base de datos o muestran mensajes de error si
> falla la validación.

-   RF004 Validación por Correo Personal

> ![](media/image28.png){width="5.905216535433071in"
> height="3.986111111111111in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama detalla el proceso de validación de identidad para
> consultas sensibles. Cuando un usuario solicita ayuda con un tema
> delicado, el sistema activa una validación mediante correo personal.
> El usuario proporciona información, que se verifica en la base de
> datos. Si es exitosa, se le otorgan pasos para resolver su problema;
> si falla, se muestra un mensaje de error.

-   RF005 Transferencia a Soporte Humano

> ![](media/image31.png){width="5.905216535433071in"
> height="3.5277777777777777in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama muestra el proceso de derivación a soporte humano cuando
> el nivel de confianza de una respuesta es inferior al 70%. El sistema
> crea un ticket, notifica al coordinador de soporte, programa
> seguimientos automáticos y garantiza que el especialista reciba toda
> la información contextual del usuario para brindar una atención
> efectiva.

-   RF006 Dashboard de Métricas

> ![](media/image12.png){width="5.905216535433071in"
> height="3.236111111111111in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama describe cómo los administradores acceden y utilizan el
> dashboard de métricas. El sistema calcula y muestra en tiempo real
> gráficos de consultas, categorías, problemas frecuentes y tendencias
> históricas, permitiendo exportar datos y configurar alertas para un
> análisis continuo del desempeño del agente virtual.

-   RF007 Conexión con Sistema Académico

> ![](media/image5.png){width="5.905216535433071in"
> height="2.5277777777777777in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama ilustra la integración del agente virtual con el sistema
> académico UPT. Cuando un usuario realiza una consulta que requiere
> datos institucionales, el sistema se conecta automáticamente a la base
> de datos UPT, obtiene la información necesaria y la presenta al
> usuario de manera coherente y precisa.

-   RF008 Motor de Búsqueda Semántica

> ![](media/image13.png){width="5.905216535433071in"
> height="2.6805555555555554in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama describe el funcionamiento del motor de búsqueda
> semántica que interpreta consultas con lenguaje coloquial. El sistema
> procesa términos usando sinónimos, calcula puntajes de similitud para
> encontrar documentos relevantes y muestra respuestas adaptadas.
> Además, aprende de nuevas expresiones para mejorar continuamente su
> modelo semántico.

-   RF009 Historial de Casos por Ticket

> ![](media/image10.png){width="5.905216535433071in"
> height="3.5555555555555554in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama muestra cómo los usuarios consultan el historial de sus
> problemas reportados, ya sea mediante identificación automática del
> sistema o proporcionando un número de ticket. El sistema presenta el
> estado actual, acciones realizadas y el contexto completo de
> interacciones previas, actualizando automáticamente el historial con
> cada nueva consulta.

-   RF010 Notificaciones por Email

> ![](media/image25.png){width="5.905216535433071in"
> height="2.861111111111111in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama ilustra el proceso de notificaciones automáticas por
> email cuando un ticket cambia de estado. El sistema genera y envía un
> correo con un resumen completo del caso, los próximos pasos y el
> historial de la conversación, proporcionando al usuario un registro
> permanente de la atención recibida.

-   RF011 Mejora Continua

> ![](media/image9.png){width="5.905216535433071in"
> height="3.0555555555555554in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama muestra el proceso de mejora continua del sistema
> mediante feedback de usuarios. Tras una interacción exitosa, el
> usuario califica la utilidad de la respuesta y puede agregar
> comentarios. El sistema registra este feedback, lo asocia con la
> consulta específica y lo utiliza para identificar patrones de mejora y
> actualizar sus algoritmos de machine learning.

-   RF012 Exportación de Datos

> ![](media/image20.png){width="5.905216535433071in"
> height="3.9166666666666665in"}
>
> **Fuente:** Elaboración propia.
>
> Este diagrama describe el flujo para que un administrador genere y
> exporte reportes personalizados. El proceso incluye la selección de
> períodos, tipos de datos y formato (PDF/Excel), la validación de
> parámetros, la generación del archivo y su descarga, manteniendo un
> registro de todas las exportaciones realizadas.

d\) Diagrama de Clases

> ![](media/image32.png){width="5.858333333333333in"
> height="3.0416666666666665in"}\
> **Fuente:** Elaboración propia.
>
> **Descripción:**Este diagrama describe la arquitectura de clases del
> sistema API que permite gestionar un agente virtual con procesamiento
> de lenguaje natural para soporte técnico universitario. Incluye la
> estructuración de controladores para chat, validación, escalamiento y
> métricas, así como servicios especializados en NLP, base de
> conocimiento e integración con sistemas UPT. Las entidades principales
> gestionan sesiones de conversación, mensajes de usuarios y respuestas
> automatizadas, mientras que los repositorios manejan la persistencia
> de FAQ, métricas y sesiones. El sistema integra componentes externos
> como la base de datos UPT, sistema de tickets y servidor de email,
> manteniendo una separación clara entre recursos propios de la API y
> servicios externos consumidos. El objetivo es proporcionar una
> arquitectura modular y escalable que permita procesamiento inteligente
> de consultas universitarias con capacidades de escalamiento automático
> y mejora continua del servicio.

**CONCLUSIONES**

> El desarrollo del agente interactivo con procesamiento de lenguaje
> natural para la Universidad Privada de Tacna representa una solución
> integral y estratégica que aborda efectivamente los desafíos actuales
> del soporte técnico universitario. A través del análisis detallado
> realizado.
>
> **1. Viabilidad del Proyecto** El proyecto presenta una alta
> viabilidad técnica, económica y operativa, con una inversión inicial
> de S/ 17,200 y un retorno de inversión proyectado del 18.7% TIR. La
> infraestructura tecnológica existente en la UPT es adecuada para
> soportar la implementación del sistema propuesto.
>
> **2. Impacto en la Eficiencia Operativa** La implementación del agente
> interactivo permitirá reducir significativamente los tiempos de
> respuesta de 6-12 horas promedio a menos de 60 segundos para consultas
> frecuentes, mejorando sustancialmente la experiencia del usuario y
> liberando recursos del personal de TI para atender problemas más
> complejos.
>
> **3. Cobertura de Servicios 24/7** El sistema solucionará la
> limitación crítica de horarios de atención restringidos,
> proporcionando soporte continuo a estudiantes, docentes y personal
> administrativo, especialmente beneficioso para programas de educación
> continua.
>
> **4. Integración Sistémica Efectiva** Los requerimientos funcionales
> definidos garantizan una integración robusta con los sistemas
> universitarios existentes, manteniendo la coherencia de datos y
> procesos.
>
> **5. Personalización y Contextualización** La capacidad del sistema
> para proporcionar respuestas personalizadas según el perfil del
> usuario (estudiante/docente/administrativo) y mantener contexto
> conversacional mejorará significativamente la calidad del soporte
> brindado.
>
> **6. Escalamiento Inteligente** La implementación de reglas de negocio
> para escalamiento automático cuando la confianza es menor al 70%
> asegura que los casos complejos reciban atención humana especializada,
> manteniendo la calidad del servicio.
>
> **7. Aprendizaje Continuo** El sistema de retroalimentación y métricas
> permitirá la mejora continua del agente, incrementando gradualmente su
> precisión y efectividad en la resolución de consultas.

**\
RECOMENDACIONES**

> Para garantizar el éxito del proyecto y maximizar los beneficios
> esperados, se formulan las siguientes recomendaciones estratégicas y
> técnicas:
>
> Recomendaciones de Implementación:
>
> 1\. Fase de Desarrollo Incremental

-   Implementar el proyecto en fases incrementales, comenzando con un
    > piloto para el módulo de soporte técnico básico

-   Expandir gradualmente a módulos académicos y administrativos después
    > de validar la funcionalidad core

-   Establecer métricas claras para cada fase y criterios de aceptación
    > antes de proceder a la siguiente

> 2\. Capacitación del Personal

-   Crear manuales de usuario detallados y videos tutoriales para la
    > comunidad universitaria

> 3\. Gestión del Cambio

-   Implementar una estrategia de comunicación proactiva para informar a
    > la comunidad universitaria sobre los beneficios del nuevo sistema

-   Realizar sesiones de demostración y feedback temprano con grupos
    > representativos de usuarios

-   Mantener canales de soporte paralelos durante el período de
    > transición

> Recomendaciones Técnicas:
>
> 4\. Arquitectura y Seguridad

-   Implementar arquitectura de microservicios para facilitar el
    > mantenimiento y escalamiento futuro

-   Establecer protocolos robustos de seguridad y cumplimiento de
    > normativas de protección de datos

-   Implementar sistemas de monitoreo proactivo y alertas automatizadas

> 5\. Base de Conocimiento

-   Iniciar con un conjunto robusto de FAQs bien categorizadas y
    > validadas

-   Establecer un proceso formal de revisión y actualización de
    > contenido cada 3 meses

-   Implementar versionado automático y trazabilidad de cambios en la
    > base de conocimiento

> 6\. Optimización del NLP

-   Entrenar modelos específicos con jerga y terminología universitaria
    > peruana

-   Implementar técnicas de procesamiento semántico avanzado para
    > mejorar la comprensión de consultas

-   Establecer un pipeline de mejora continua basado en feedback de
    > usuarios

> Recomendaciones de Gestión:
>
> 7\. Métricas y KPIs

-   Establecer un dashboard ejecutivo con métricas clave actualizadas en
    > tiempo real

-   Definir SLAs específicos para diferentes tipos de consultas y
    > usuarios

-   Implementar encuestas de satisfacción post-interacción para medir la
    > calidad del servicio

> 8\. Sostenibilidad del Proyecto

-   Asegurar presupuesto para mantenimiento continuo y actualizaciones
    > del sistema

-   Establecer un equipo dedicado para la gestión y evolución del agente
    > interactivo

-   Planificar actualizaciones regulares de tecnología y modelos de NLP

> 9\. Expansión Futura

-   Considerar la integración con plataformas de redes sociales
    > institucionales

-   Evaluar la implementación de capacidades multimodales (voz,
    > imágenes)

-   Explorar la extensión del sistema a servicios estudiantiles
    > adicionales (biblioteca, bienestar, etc.)

> 10\. Contingencia y Respaldo

-   Desarrollar planes de contingencia para fallos del sistema

-   Implementar sistemas de respaldo automático y recuperación ante
    > desastres

-   Mantener procedimientos manuales como respaldo durante
    > actualizaciones críticas

**\
** **BIBLIOGRAFÍA\
** **WEBGRAFÍA**
