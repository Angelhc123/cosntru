# Diagramas del Sistema UPT Chat en PlantUML

**Documento:** FD04 - Arquitectura de Software  
**Proyecto:** Sistema UPT Chat  
**Formato:** PlantUML  
**Total de Diagramas:** 21

---

## 1. Modelo 4+1 de Kruchten

```plantuml
@startuml
!define RECTANGLE class

skinparam componentStyle rectangle
skinparam backgroundColor #FFFFFF
skinparam defaultFontSize 11

package "Modelo 4+1 de Kruchten" {
    
    component "Vista Lógica\n(Logical View)" as LOGICAL #LightBlue {
        note right
            Funcionalidad del sistema
            Diagramas de clases
            Diagramas de objetos
        end note
    }
    
    component "Vista de Procesos\n(Process View)" as PROCESS #LightGreen {
        note right
            Concurrencia del sistema
            Sincronización
            Rendimiento
        end note
    }
    
    component "Vista de Desarrollo\n(Development View)" as DEVELOPMENT #LightYellow {
        note right
            Organización del software
            Gestión de módulos
            Capas del sistema
        end note
    }
    
    component "Vista Física\n(Physical View)" as PHYSICAL #LightCoral {
        note right
            Topología del sistema
            Despliegue
            Comunicación
        end note
    }
    
    component "Escenarios\n(Scenarios)" as SCENARIOS #LightGray {
        note bottom
            Casos de uso
            Integración de vistas
            Validación arquitectónica
        end note
    }
    
    SCENARIOS ..> LOGICAL
    SCENARIOS ..> PROCESS
    SCENARIOS ..> DEVELOPMENT
    SCENARIOS ..> PHYSICAL
    
    LOGICAL -[hidden]-> PROCESS
    PROCESS -[hidden]-> DEVELOPMENT
    DEVELOPMENT -[hidden]-> PHYSICAL
}

legend right
    Sistema UPT Chat
    Modelo 4+1 Views
    Kruchten Architecture
endlegend

@enduml
```

---

## 2. Arquitectura de Microservicios

```plantuml
@startuml
!define RECTANGLE class

skinparam componentStyle rectangle
skinparam backgroundColor #FFFFFF

actor "Usuario" as USER
actor "Administrador" as ADMIN

package "Frontend" {
    component "Chat Widget\n(HTML/CSS/JS)" as WIDGET #LightBlue
}

package "API Layer" {
    component "API Gateway\n:3000\nNestJS" as GATEWAY #4CAF50
}

package "Microservicios" {
    component "NLP Service\n:8001\nPython/FastAPI" as NLP #2196F3
    component "Chat Service\n:3001\nNestJS+Socket.IO" as CHAT #FF9800
    component "Notification Service\n:3005\nNestJS" as NOTIFICATION #9C27B0
    component "Knowledge Base\n:3003\nNestJS" as KB #00BCD4
    component "Analytics Service\n:3004\nNestJS" as ANALYTICS #FFC107
}

package "External Services" {
    cloud "DialogFlow API\nGoogle Cloud" as DIALOGFLOW #4285F4
    cloud "Gmail SMTP\nGoogle" as GMAIL #EA4335
}

database "MongoDB Atlas\n(Cloud)" as MONGODB #00C853
database "MySQL Local\n:3306" as MYSQL #00758F

USER --> WIDGET
ADMIN --> WIDGET
WIDGET --> GATEWAY : HTTPS

GATEWAY --> NLP : HTTP
GATEWAY --> CHAT : WebSocket
GATEWAY --> NOTIFICATION : HTTP
GATEWAY --> KB : HTTP
GATEWAY --> ANALYTICS : HTTP

NLP --> DIALOGFLOW : HTTPS
NLP --> KB : HTTP

NOTIFICATION --> GMAIL : SMTP

GATEWAY --> MONGODB : MongoDB Protocol
CHAT --> MONGODB : MongoDB Protocol
ANALYTICS --> MONGODB : MongoDB Protocol

GATEWAY --> MYSQL : TCP
KB --> MYSQL : TCP

note right of NLP
    ✅ Activo
    DialogFlow + spaCy
    Detección de intents
end note

note right of GATEWAY
    ✅ Activo
    Orquestación
    Autenticación JWT
end note

note right of NOTIFICATION
    ✅ Activo
    Envío de emails
    Templates HTML
end note

note right of CHAT
    ⏳ Preparado
    WebSocket real-time
    Sesiones de chat
end note

@enduml
```

---

## 3. Clean Architecture - Capas

```plantuml
@startuml
!theme plain

skinparam backgroundColor #FFFFFF
skinparam componentStyle rectangle

package "Clean Architecture - Sistema UPT Chat" {
    
    rectangle "Capa de Presentación\n(Presentation Layer)" as PRESENTATION #E3F2FD {
        component "Controllers" as CONTROLLERS
        component "DTOs" as DTOS
        component "Validators" as VALIDATORS
    }
    
    rectangle "Capa de Aplicación\n(Application Layer)" as APPLICATION #FFF3E0 {
        component "Use Cases" as USECASES
        component "Application Services" as APPSERVICES
        component "Ports (Interfaces)" as PORTS
    }
    
    rectangle "Capa de Dominio\n(Domain Layer)" as DOMAIN #E8F5E9 {
        component "Entities" as ENTITIES
        component "Value Objects" as VALUEOBJECTS
        component "Domain Services" as DOMAINSERVICES
        component "Repository Interfaces" as REPOINTERFACES
    }
    
    rectangle "Capa de Infraestructura\n(Infrastructure Layer)" as INFRASTRUCTURE #FCE4EC {
        component "Repository Implementations" as REPOIMPL
        component "External APIs" as EXTERNALAPIS
        component "Database Adapters" as DBADAPTERS
        component "Email Service" as EMAILSERVICE
    }
    
    PRESENTATION --> APPLICATION : "usa"
    APPLICATION --> DOMAIN : "usa"
    INFRASTRUCTURE --> APPLICATION : "implementa"
    INFRASTRUCTURE --> DOMAIN : "implementa interfaces"
    
    note right of DOMAIN
        🎯 Núcleo del Sistema
        Lógica de Negocio Pura
        Independiente de Frameworks
        Sin dependencias externas
    end note
    
    note right of APPLICATION
        📋 Casos de Uso
        Orquestación
        Reglas de Aplicación
    end note
    
    note right of INFRASTRUCTURE
        🔌 Adaptadores
        MongoDB, MySQL
        DialogFlow, Gmail
        Detalles Técnicos
    end note
}

legend bottom
    Dependencias: Externo → Interno
    El dominio NO depende de nada
    Principio de Inversión de Dependencias
endlegend

@enduml
```

---

## 4. Diagrama de Casos de Uso General

```plantuml
@startuml
!theme plain
left to right direction

skinparam actorStyle awesome
skinparam backgroundColor #FFFFFF

actor "Estudiante" as STUDENT #4CAF50
actor "Docente" as TEACHER #2196F3
actor "Administrador" as ADMIN #F44336
actor "Coordinador" as COORDINATOR #FF9800
actor "Sistema Académico" as ACADEMIC #9C27B0
actor "Especialista Soporte" as SUPPORT #00BCD4

rectangle "Sistema UPT Chat" {
    
    package "Módulo de Interacción" {
        usecase "RF001: Iniciar\nConversación" as UC1
        usecase "RF002: Comprensión\nNLP" as UC2
        usecase "RF003: Gestión\nde FAQs" as UC3
    }
    
    package "Módulo de Seguridad" {
        usecase "RF004: Validación\npor Email" as UC4
    }
    
    package "Módulo de Escalamiento" {
        usecase "RF005: Escalamiento\na Soporte" as UC5
    }
    
    package "Módulo de Análisis" {
        usecase "RF006: Dashboard\nde Métricas" as UC6
        usecase "RF011: Mejora\nContinua" as UC11
        usecase "RF012: Generación\nde Reportes" as UC12
    }
    
    package "Módulo Académico" {
        usecase "RF007: Integración\nSistema Académico" as UC7
    }
    
    package "Módulo de Búsqueda" {
        usecase "RF008: Búsqueda\nSemántica" as UC8
    }
    
    package "Módulo de Soporte" {
        usecase "RF009: Historial\nde Tickets" as UC9
        usecase "RF010: Notificaciones\nEmail" as UC10
    }
}

STUDENT --> UC1
STUDENT --> UC2
STUDENT --> UC3
STUDENT --> UC4
STUDENT --> UC7
STUDENT --> UC8
STUDENT --> UC9

TEACHER --> UC1
TEACHER --> UC2
TEACHER --> UC3
TEACHER --> UC7

ADMIN --> UC6
ADMIN --> UC11
ADMIN --> UC12

COORDINATOR --> UC5
COORDINATOR --> UC6
COORDINATOR --> UC9

SUPPORT --> UC5
SUPPORT --> UC9

UC2 ..> UC3 : <<include>>
UC4 ..> UC10 : <<include>>
UC5 ..> UC10 : <<include>>
UC7 ..> ACADEMIC : <<extend>>

note right of UC1
    ✅ Preparado
    Widget HTML/JS
end note

note right of UC2
    ✅ Activo
    DialogFlow + spaCy
end note

note right of UC4
    ✅ Activo
    Tokens con TTL
end note

note right of UC10
    ✅ Activo
    Gmail SMTP
end note

@enduml
```

---

## 5. Arquitectura de Alto Nivel

```plantuml
@startuml
!theme plain

skinparam componentStyle rectangle
skinparam backgroundColor #FFFFFF

actor "Usuarios" as USERS

cloud "Internet" as INTERNET

node "Servidor Web\n192.168.1.10" {
    component "Apache HTTP\n:80, :443" as APACHE
    component "Chat Widget\n(HTML/CSS/JS)" as WIDGET
}

node "Servidor Aplicaciones\n192.168.1.20" {
    component "API Gateway\n:3000" as GATEWAY #4CAF50
    component "NLP Service\n:8001" as NLP #2196F3
    component "Notification\n:3005" as NOTIFICATION #FF9800
    component "Chat Service\n:3001" as CHAT
    component "Knowledge Base\n:3003" as KB
    component "Analytics\n:3004" as ANALYTICS
}

node "Servidor Base Datos\n192.168.1.30" {
    database "MySQL\n:3306" as MYSQL
}

cloud "MongoDB Atlas\nAWS us-east-1" {
    database "MongoDB\nCluster M10" as MONGODB
}

cloud "Google Cloud Platform" {
    component "DialogFlow API" as DIALOGFLOW
    component "Gmail SMTP" as GMAIL
}

USERS --> INTERNET
INTERNET --> APACHE : HTTPS
APACHE --> WIDGET
WIDGET --> GATEWAY : REST API

GATEWAY --> NLP : HTTP
GATEWAY --> NOTIFICATION : HTTP
GATEWAY --> CHAT : WebSocket
GATEWAY --> KB : HTTP
GATEWAY --> ANALYTICS : HTTP

NLP --> DIALOGFLOW : HTTPS
NLP --> KB : HTTP

NOTIFICATION --> GMAIL : SMTP

GATEWAY --> MONGODB : Protocol
CHAT --> MONGODB : Protocol
ANALYTICS --> MONGODB : Protocol

GATEWAY --> MYSQL : TCP
KB --> MYSQL : TCP

@enduml
```

---

## 6. Diagrama de Paquetes/Subsistemas

```plantuml
@startuml
!theme plain

package "NLP Service (Python/FastAPI)" {
    package "domain" {
        class Intent
        class FAQ
        class Message
        class Confidence
    }
    
    package "application" {
        class ProcessMessageUseCase
        class DetectIntentUseCase
        class SensitiveQueryDetector
    }
    
    package "infrastructure" {
        class DialogFlowService
        class SpaCyService
        class HybridNLPService
        class JSONIntentRepository
    }
}

package "API Gateway (NestJS/TypeScript)" {
    package "domain" {
        class User
        class ChatSession
        class PasswordResetToken
    }
    
    package "application" {
        class UserUseCases
        class PasswordResetService
        class ChatSessionUseCases
    }
    
    package "infrastructure" {
        class MongoUserRepository
        class MongoChatSessionRepository
        class MySQLConnection
        class PasswordResetController
    }
}

package "Notification Service (NestJS)" {
    package "application" {
        class EmailService
        class NotificationDTO
    }
    
    package "infrastructure" {
        class NotificationController
        class NodemailerAdapter
    }
}

application ..> domain : usa
infrastructure ..> application : implementa
infrastructure ..> domain : implementa

@enduml
```

---

## 7. Secuencia RF001 - Iniciar Conversación con Widget

```plantuml
@startuml
actor Usuario as USER
participant "Chat Widget" as WIDGET
participant "API Gateway" as GATEWAY
participant "MongoDB" as MONGO

USER -> WIDGET : Click en botón de chat
activate WIDGET

WIDGET -> WIDGET : Mostrar interfaz
WIDGET -> GATEWAY : POST /api/sessions/create
activate GATEWAY

GATEWAY -> GATEWAY : Generar session_token
GATEWAY -> MONGO : db.chat_sessions.insertOne({...})
activate MONGO
MONGO --> GATEWAY : {_id, session_token, created_at}
deactivate MONGO

GATEWAY --> WIDGET : {session_id, token}
deactivate GATEWAY

WIDGET -> WIDGET : Guardar session_token\nen localStorage

WIDGET --> USER : Widget listo para chat
deactivate WIDGET

note right of GATEWAY
    session_token = uuid4()
    status = "active"
    started_at = new Date()
end note

note right of MONGO
    Collection: chat_sessions
    Índice: session_token (unique)
    TTL: 30 días
end note

@enduml
```

---

## 8. Secuencia RF002 - Comprensión NLP (Híbrido)

```plantuml
@startuml
actor Usuario as USER
participant "Widget" as WIDGET
participant "API Gateway" as GATEWAY
participant "NLP Service" as NLP
participant "DialogFlow" as DF
participant "spaCy" as SPACY
participant "Knowledge Base" as KB

USER -> WIDGET : "quiero recuperar mi contraseña"
activate WIDGET

WIDGET -> GATEWAY : POST /api/chat/message
activate GATEWAY

GATEWAY -> NLP : POST /process-message\n{text, session_id}
activate NLP

NLP -> NLP : detect_sensitive_query()
NLP -> DF : detectIntent(text)
activate DF
DF --> NLP : {intent: "password_reset",\nconfidence: 0.85}
deactivate DF

alt confidence >= 0.7
    NLP -> KB : search_faq(intent)
    activate KB
    KB --> NLP : faq_data
    deactivate KB
    
    NLP --> GATEWAY : {intent, answer,\nconfidence: 0.85}
else confidence < 0.7
    NLP -> SPACY : nlp(text)
    activate SPACY
    SPACY -> SPACY : tokenize + lemmatize
    SPACY -> SPACY : remove_stopwords
    SPACY -> SPACY : vectorize
    SPACY --> NLP : {tokens, vectors,\nconfidence: 0.65}
    deactivate SPACY
    
    alt spaCy confidence >= 0.7
        NLP --> GATEWAY : {intent, answer,\nconfidence: 0.65}
    else both < 0.7
        NLP --> GATEWAY : {intent: "unknown",\nsuggestion: "escalate"}
    end
end

GATEWAY --> WIDGET : response
deactivate NLP
deactivate GATEWAY

WIDGET --> USER : Muestra respuesta
deactivate WIDGET

note right of NLP
    Estrategia Híbrida:
    1. DialogFlow primero
    2. spaCy como fallback
    3. Precisión: ~89%
end note

@enduml
```

---

## 9. Secuencia RF003 - Gestión de FAQs

```plantuml
@startuml
actor Usuario as USER
participant "Widget" as WIDGET
participant "API Gateway" as GATEWAY
participant "NLP Service" as NLP
participant "Knowledge Base" as KB
database "MySQL" as MYSQL

USER -> WIDGET : "¿Cómo consulto mis notas?"
activate WIDGET

WIDGET -> GATEWAY : POST /api/chat/message
activate GATEWAY

GATEWAY -> NLP : POST /process-message
activate NLP

NLP -> NLP : detect_intent(message)
note right: intent = "consultar_notas"

NLP -> KB : GET /faqs/search?intent=consultar_notas
activate KB

KB -> MYSQL : SELECT * FROM faqs\nWHERE intent = 'consultar_notas'
activate MYSQL
MYSQL --> KB : [faq_records]
deactivate MYSQL

KB -> KB : format_response()
KB --> NLP : {question, answer,\nsteps: [...]}
deactivate KB

NLP --> GATEWAY : {intent, faq_data,\nconfidence: 0.89}
deactivate NLP

GATEWAY --> WIDGET : formatted_response
deactivate GATEWAY

WIDGET --> USER : Muestra FAQ con pasos
deactivate WIDGET

note right of KB
    219 FAQs disponibles
    Categorías:
    - Académico
    - Administrativo
    - Técnico
end note

@enduml
```

---

## 10. Secuencia RF004 - Validación por Email (IMPLEMENTADO)

```plantuml
@startuml
actor Usuario as USER
participant "Widget" as WIDGET
participant "API Gateway" as GATEWAY
participant "NLP Service" as NLP
database "MySQL" as MYSQL
database "MongoDB" as MONGO
participant "Notification\nService" as NOTIFICATION
participant "Gmail SMTP" as GMAIL

USER -> WIDGET : "olvidé mi contraseña"
activate WIDGET

WIDGET -> GATEWAY : POST /api/chat/message
activate GATEWAY

GATEWAY -> NLP : POST /process-message
activate NLP

NLP -> NLP : detect_sensitive_query()
note right: is_sensitive = True

NLP --> GATEWAY : {requires_validation: true}
deactivate NLP

GATEWAY --> WIDGET : {action: "request_email"}
deactivate GATEWAY

WIDGET --> USER : "Ingresa tu email institucional"
USER -> WIDGET : "usuario@upt.edu.pe"
WIDGET -> GATEWAY : POST /api/auth/request-reset\n{email}
activate GATEWAY

GATEWAY -> MYSQL : SELECT * FROM usuarios\nWHERE email = ?
activate MYSQL
MYSQL --> GATEWAY : user_data
deactivate MYSQL

alt Email existe
    GATEWAY -> GATEWAY : generate_token()
    note right: token = crypto.randomBytes(32)
    
    GATEWAY -> MONGO : db.password_reset_tokens.insertOne({\nemail, token, expires_at})
    activate MONGO
    MONGO --> GATEWAY : token_id
    deactivate MONGO
    
    GATEWAY -> NOTIFICATION : POST /send-email\n{to, subject, template, data}
    activate NOTIFICATION
    
    NOTIFICATION -> GMAIL : SMTP send
    activate GMAIL
    GMAIL --> NOTIFICATION : message_id
    deactivate GMAIL
    
    NOTIFICATION --> GATEWAY : {sent: true}
    deactivate NOTIFICATION
    
    GATEWAY --> WIDGET : {success: true,\nmessage: "Email enviado"}
else Email no existe
    GATEWAY --> WIDGET : {error: "Email no registrado"}
end
deactivate GATEWAY

WIDGET --> USER : "Revisa tu correo"
deactivate WIDGET

note over USER
    Usuario hace clic
    en el enlace del email
end note

USER -> GATEWAY : GET /api/auth/validate-token?token=xxx
activate GATEWAY

GATEWAY -> MONGO : db.password_reset_tokens.findOne({token, used: false})
activate MONGO
MONGO --> GATEWAY : token_data
deactivate MONGO

alt Token válido y no expirado
    GATEWAY -> GATEWAY : generate_new_password()
    GATEWAY -> MYSQL : UPDATE usuarios\nSET password = ?\nWHERE email = ?
    activate MYSQL
    MYSQL --> GATEWAY : affected_rows
    deactivate MYSQL
    
    GATEWAY -> MONGO : db.password_reset_tokens.updateOne(\n{token}, {$set: {used: true}})
    
    GATEWAY -> NOTIFICATION : POST /send-email\n{template: "new_password"}
    activate NOTIFICATION
    NOTIFICATION -> GMAIL : SMTP send
    NOTIFICATION --> GATEWAY : sent
    deactivate NOTIFICATION
    
    GATEWAY --> USER : "Contraseña actualizada.\nRevisa tu email."
else Token inválido o expirado
    GATEWAY --> USER : "Token expirado.\nSolicita uno nuevo."
end
deactivate GATEWAY

note right of GATEWAY
    ✅ IMPLEMENTADO
    TTL del token: 1 hora
    Password: bcrypt hash
end note

@enduml
```

---

## 11. Secuencia RF008 - Búsqueda Semántica con Vectores

```plantuml
@startuml
actor Usuario as USER
participant "Widget" as WIDGET
participant "NLP Service" as NLP
participant "spaCy Engine" as SPACY
participant "Knowledge Base" as KB
participant "Vector Index" as VECTORS

USER -> WIDGET : "como sacar mi horario"
activate WIDGET

WIDGET -> NLP : POST /search-semantic\n{query}
activate NLP

NLP -> SPACY : nlp(query)
activate SPACY

SPACY -> SPACY : Tokenization\n["como", "sacar", "mi", "horario"]
SPACY -> SPACY : Lemmatization\n["cómo", "sacar", "mi", "horario"]
SPACY -> SPACY : Remove stopwords\n["sacar", "horario"]
SPACY -> SPACY : Generate word vectors\n(300-dim embeddings)

SPACY --> NLP : query_vector
deactivate SPACY

NLP -> VECTORS : similarity_search(query_vector)
activate VECTORS

loop For each document in KB
    VECTORS -> VECTORS : cosine_sim = \ndot(query_vec, doc_vec) /\n(||query_vec|| * ||doc_vec||)
end

VECTORS -> VECTORS : Sort by similarity score
VECTORS --> NLP : [\n{doc: "consultar horario", score: 0.89},\n{doc: "ver horario", score: 0.85},\n{doc: "horario académico", score: 0.82}\n]
deactivate VECTORS

NLP -> KB : get_documents(top_5_ids)
activate KB
KB --> NLP : [faq_data]
deactivate KB

alt Score > 0.7
    NLP --> WIDGET : {results: [top_match],\nconfidence: 0.89}
else Score 0.5-0.7
    NLP --> WIDGET : {results: [top_3],\nmessage: "Encontré varias opciones"}
else Score < 0.5
    NLP --> WIDGET : {results: [],\nsuggestion: "Reformula tu pregunta"}
end

deactivate NLP

WIDGET --> USER : Muestra resultados rankeados
USER -> WIDGET : Click en resultado
WIDGET --> USER : Muestra respuesta completa
deactivate WIDGET

note right of SPACY
    spaCy Model:
    es_core_news_sm
    300-dim word vectors
    Cosine similarity
end note

@enduml
```

---

## 12. Diagrama de Actividades General del Sistema

```plantuml
@startuml
!theme plain

start

:Usuario accede al portal UPT;

:Navegador carga widget de chat;

if (Usuario hace clic en widget?) then (Sí)
    :API Gateway crea sesión en MongoDB;
    :Widget se despliega completamente;
    :Usuario escribe consulta;
    :Widget envía mensaje a NLP Service;
    
    if (¿Es consulta sensible?) then (Sí)
        :Solicitar email personal;
        while (Email válido?) is (No)
            :Mostrar error;
        endwhile (Sí)
        
        if (Email existe en MySQL?) then (Sí)
            :Generar token TTL 1 hora;
            :Enviar email confirmación\nvía Notification Service;
            :Esperar click en enlace;
            
            if (Token válido?) then (Sí)
                :Generar nueva contraseña;
                :Actualizar password en MySQL;
                :Enviar email con nueva contraseña;
                stop
            else (No)
                :Mostrar "Token expirado";
                :Usuario escribe consulta;
            endif
        else (No)
            :Mostrar "Email no registrado";
            :Usuario escribe consulta;
        endif
    else (No)
        :Procesar con DialogFlow;
        
        if (Confianza >= 0.7?) then (Sí)
            :Buscar en base de conocimiento;
        else (No)
            :Procesar con spaCy fallback;
            
            if (Nueva confianza >= 0.7?) then (Sí)
                :Buscar en base de conocimiento;
            else (No)
                :Crear ticket automático;
                :Notificar coordinador;
                :Asignar a especialista;
                :Especialista responde por email;
                :Actualizar base conocimiento;
                :Cerrar ticket;
                stop
            endif
        endif
        
        if (FAQ encontrado?) then (Sí)
            :Formatear respuesta;
        else (No)
            :Respuesta genérica de ayuda;
        endif
        
        :Mostrar respuesta al usuario;
        :Solicitar feedback;
        
        if (Usuario califica?) then (Sí)
            :Guardar feedback en MongoDB;
            
            if (Feedback negativo?) then (Sí)
                if (¿Más de 3 negativos mismo intent?) then (Sí)
                    :Alertar administrador;
                endif
            endif
        else (No)
            :Timeout 5 minutos;
        endif
        
        :Registrar métrica en Analytics;
        
        if (¿Más consultas?) then (Sí)
            :Usuario escribe consulta;
        else (No)
            :Cerrar sesión de chat;
            :Actualizar estadísticas;
            stop
        endif
    endif
else (No)
    :Widget disponible en esquina;
    if (Usuario hace clic en widget?) then (Sí)
        :API Gateway crea sesión en MongoDB;
    endif
endif

stop

@enduml
```

---

## 13. Diagrama de Despliegue Completo

```plantuml
@startuml
!theme plain

skinparam componentStyle rectangle

actor "Usuario Desktop" as DESKTOP
actor "Usuario Móvil" as MOBILE

cloud "Internet" {
}

node "DMZ - Zona Desmilitarizada" {
    component "Firewall\nEntrada" as FW1
    component "Proxy Inverso\nSSL Termination" as PROXY
    component "Load Balancer\nNginx" as LB
}

node "Servidor Intranet\n192.168.1.10" {
    component "Apache HTTP\n:80, :443" as APACHE
    artifact "Chat Widget\n(HTML/CSS/JS)" as WIDGET
    
    note right of APACHE
        Ubuntu 20.04 LTS
        RAM: 4GB
        CPU: 2 Cores
        Storage: 50GB SSD
    end note
}

node "Servidor Aplicaciones\n192.168.1.20" {
    component "API Gateway\n:3000\nNestJS" as GATEWAY #4CAF50
    component "NLP Service\n:8001\nFastAPI" as NLP #2196F3
    component "Notification\n:3005\nNestJS" as NOTIFICATION #FF9800
    component "Chat Service\n:3001\nNestJS" as CHAT
    component "Knowledge Base\n:3003\nNestJS" as KB
    component "Analytics\n:3004\nNestJS" as ANALYTICS
    
    note right of GATEWAY
        Ubuntu 22.04 LTS
        RAM: 16GB
        CPU: 8 Cores
        Storage: 200GB SSD
        PM2 Process Manager
    end note
}

node "Servidor Base Datos\n192.168.1.30" {
    database "MySQL 8.0\n:3306" as MYSQL
    
    note right of MYSQL
        Ubuntu 20.04 LTS
        RAM: 8GB
        CPU: 4 Cores
        Storage: 500GB HDD
        RAID 1 (mirror)
    end note
}

cloud "MongoDB Atlas\nAWS us-east-1" {
    database "MongoDB 6.0\nCluster M10" as MONGODB
    
    note right of MONGODB
        Tier: M10 Dedicated
        RAM: 2GB
        Storage: 10GB
        Replica Set: 3 nodos
    end note
}

cloud "Google Cloud Platform" {
    component "DialogFlow API\nus-central1" as DIALOGFLOW
    
    note right of DIALOGFLOW
        19 Intents
        150+ Training phrases
        15k requests/day
    end note
}

cloud "Gmail SMTP" {
    component "smtp.gmail.com\n:587" as GMAIL
    
    note right of GMAIL
        STARTTLS
        500 emails/día
    end note
}

component "Firewall\nSalida" as FW2

DESKTOP --> FW1 : HTTPS :443
MOBILE --> FW1 : HTTPS :443

FW1 --> PROXY
PROXY --> LB
LB --> APACHE

APACHE --> WIDGET
WIDGET --> GATEWAY : REST :3000

GATEWAY --> NLP : HTTP :8001
GATEWAY --> NOTIFICATION : HTTP :3005
GATEWAY --> CHAT : WebSocket :3001
GATEWAY --> KB : HTTP :3003
GATEWAY --> ANALYTICS : HTTP :3004

NLP --> KB : HTTP

GATEWAY --> FW2
FW2 --> MONGODB : Protocol :27017
FW2 --> DIALOGFLOW : HTTPS :443
FW2 --> GMAIL : SMTP :587

GATEWAY --> MYSQL : TCP :3306
KB --> MYSQL : TCP :3306

@enduml
```

---

## 14. Diagrama de Escalamiento Horizontal

```plantuml
@startuml
!theme plain

component "Load Balancer\nNginx" as LB

rectangle "NLP Service Instances" {
    component "NLP :8001" as NLP1
    component "NLP :8002" as NLP2
    component "NLP :8003" as NLP3
}

rectangle "API Gateway Instances" {
    component "Gateway :3000" as GW1
    component "Gateway :3001" as GW2
}

rectangle "Notification Instances" {
    component "Notification :3005" as NOT1
    component "Notification :3006" as NOT2
}

LB --> NLP1
LB --> NLP2
LB --> NLP3

NLP1 --> GW1
NLP2 --> GW1
NLP3 --> GW2

GW1 --> NOT1
GW2 --> NOT2

note right of LB
    Algoritmo: Round Robin
    Health checks: cada 30s
    Failover automático
end note

note bottom of NLP1
    Stateless Services
    Session storage: MongoDB
    Cache compartido: Redis (futuro)
end note

@enduml
```

---

## 15. Esquema MongoDB

```plantuml
@startmindmap
!theme plain

* MongoDB Atlas\nCluster: basededatos2

** chat_sessions
*** _id: ObjectId
*** session_token: String (unique)
*** user_id: String
*** started_at: Date
*** ended_at: Date
*** messages: Array
*** status: String

** messages
*** _id: ObjectId
*** session_id: String
*** sender: String
*** message: String
*** intent: String
*** confidence: Number
*** timestamp: Date

** password_reset_tokens
*** _id: ObjectId
*** email: String
*** token: String (unique)
*** created_at: Date
*** expires_at: Date
*** used: Boolean

** feedback
*** _id: ObjectId
*** session_id: String
*** message_id: String
*** rating: Number (1-5)
*** comment: String
*** created_at: Date

** tickets
*** _id: ObjectId
*** user_id: String
*** subject: String
*** description: String
*** status: String
*** priority: String
*** assigned_to: String
*** created_at: Date
*** updated_at: Date

** email_logs
*** _id: ObjectId
*** to: String
*** subject: String
*** template: String
*** sent_at: Date
*** status: String
*** message_id: String

@endmindmap
```

---

## 16. Esquema MySQL

```plantuml
@startuml
!theme plain

entity "usuarios" {
    * id : INT <<PK>>
    --
    nombre : VARCHAR(100)
    email : VARCHAR(100) <<UNIQUE>>
    password : VARCHAR(255)
    rol : ENUM('estudiante','docente','admin')
    created_at : TIMESTAMP
}

entity "estudiantes" {
    * id : INT <<PK>>
    --
    * usuario_id : INT <<FK>>
    codigo : VARCHAR(10) <<UNIQUE>>
    carrera : VARCHAR(100)
    semestre : INT
}

entity "asignaturas" {
    * id : INT <<PK>>
    --
    codigo : VARCHAR(10) <<UNIQUE>>
    nombre : VARCHAR(150)
    creditos : INT
    semestre : INT
}

entity "notas" {
    * id : INT <<PK>>
    --
    * estudiante_id : INT <<FK>>
    * asignatura_id : INT <<FK>>
    nota_parcial : DECIMAL(4,2)
    nota_final : DECIMAL(4,2)
    fecha_registro : DATE
}

usuarios ||--o{ estudiantes : "tiene"
estudiantes ||--o{ notas : "tiene"
asignaturas ||--o{ notas : "registra"

note right of usuarios
    Base de datos: proyectotest
    Conexión: MySQL 8.0
    Puerto: 3306
end note

@enduml
```

---

**FIN DEL DOCUMENTO**

**Total de diagramas:** 16 diagramas principales en PlantUML  
**Formato:** PlantUML estándar compatible con todos los renderizadores  
**Visualización:** Puede usarse en IntelliJ, VS Code (PlantUML extension), planttext.com, etc.

---

**Nota:** Estos diagramas son equivalentes a los diagramas Mermaid del documento FD04 principal, pero convertidos a sintaxis PlantUML para mayor compatibilidad y opciones de renderizado.
