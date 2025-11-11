# 🏗️ ARQUITECTURA UPT CHAT SYSTEM - GUÍA COMPLETA

## 📋 **INTRODUCCIÓN**

El **UPT Chat System** está construido siguiendo los principios de **Domain-Driven Design (DDD)** y **Arquitectura Hexagonal (Clean Architecture)**. Esta estructura nos permite separar claramente las responsabilidades, facilitar el mantenimiento y garantizar la escalabilidad del sistema.

---

## 🧩 **CAPAS DE LA ARQUITECTURA**

### **1. 🎯 APPLICATION LAYER (Capa de Aplicación)**

La capa de aplicación es el **punto de entrada** de los casos de uso del negocio. Esta capa orquesta las operaciones sin contener lógica de negocio.

#### **📁 Estructura:**
```
src/application/
├── use-cases/          # Casos de uso del sistema
│   ├── user.use-cases.ts
│   └── chat-session.use-cases.ts
├── services/          # Servicios de aplicación
│   ├── analytics.service.ts
│   ├── dialogflow.service.ts
│   ├── nlp.service.ts
│   ├── password-reset.service.ts
│   ├── support.service.ts
│   └── tickets.service.ts    # ✨ REUBICADO desde tickets/
└── dtos/              # Objetos de transferencia de datos
    ├── user.dto.ts
    ├── chat-session.dto.ts
    ├── faq.dto.ts
    └── password-reset.dto.ts
```

#### **🎯 Propósito de los Use Cases:**

Los **Use Cases** representan las **intenciones específicas** de los usuarios del sistema. Cada use case es una operación completa que el sistema puede realizar.

##### **User Use Cases:**
- **`CreateUserUseCase`**: Registra nuevos usuarios en el sistema
- **`AuthenticateUserUseCase`**: Valida credenciales y genera tokens
- **`GetUserProfileUseCase`**: Obtiene información del perfil de usuario
- **`ValidateUserForChatUseCase`**: Verifica si un usuario puede usar el chat
- **`GetUsersByTypeUseCase`**: Lista usuarios filtrados por tipo

##### **Chat Session Use Cases:**
- **`StartChatSessionUseCase`**: Inicia una nueva sesión de chat
- **`GetActiveChatSessionUseCase`**: Obtiene la sesión activa de un usuario
- **`EndChatSessionUseCase`**: Finaliza una sesión de chat
- **`ValidateSessionTokenUseCase`**: Valida tokens de sesión
- **`SetSessionSatisfactionUseCase`**: Registra la satisfacción del usuario
- **`GetSessionAnalyticsUseCase`**: Obtiene métricas de las sesiones

#### **💡 Características de los Use Cases:**
- ✅ **Sin lógica de negocio**: Solo orquestan operaciones
- ✅ **Transaccionales**: Cada use case es una operación completa
- ✅ **Testeable**: Fáciles de probar de manera aislada
- ✅ **Reutilizable**: Pueden ser llamados desde diferentes controladores

#### **📝 Ejemplo de Use Case:**
```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userDomainService: UserDomainService) {}

  async execute(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // 1. Generar ID único
    const userId = this.generateUserId();
    
    // 2. Delegar la lógica de negocio al Domain Service
    const user = await this.userDomainService.createNewUser({
      id: userId,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      userType: createUserDto.userType
    });

    // 3. Convertir a DTO de respuesta
    return UserResponseDto.fromDomain(user);
  }
}
```

---

### **2. 🧠 DOMAIN LAYER (Capa de Dominio)**

La capa de dominio contiene la **lógica de negocio central** y las reglas empresariales. Es el corazón del sistema.

#### **📁 Estructura:**
```
src/domain/
├── entities/              # Entidades del dominio
│   ├── user.entity.ts
│   └── chat-session.entity.ts
├── services/              # Servicios de dominio
│   ├── user-domain.service.ts
│   └── chat-session-domain.service.ts
├── value-objects/         # Objetos de valor
│   ├── email.vo.ts
│   └── user-full-name.vo.ts
└── repositories/          # Interfaces de repositorios
    ├── user.repository.interface.ts
    └── chat-session.repository.interface.ts
```

#### **🏢 ENTITIES (Entidades)**

Las **Entidades** representan conceptos importantes del negocio que tienen **identidad única** y **ciclo de vida**.

##### **Características de las Entidades:**
- ✅ **Identidad única**: Cada entidad tiene un ID que la distingue
- ✅ **Estado mutable**: Su estado puede cambiar a lo largo del tiempo
- ✅ **Comportamiento**: Contienen métodos que implementan reglas de negocio
- ✅ **Consistencia**: Mantienen su invariantes internas

##### **User Entity:**
```typescript
export class User {
  // Propiedades inmutables
  private readonly _id: string;
  private readonly _email: string;
  
  // Propiedades mutables
  private _isActive: boolean;
  private _updatedAt: Date;

  // Métodos de negocio
  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  // Métodos de validación
  isStudent(): boolean {
    return this._userType === UserType.STUDENT;
  }
}
```

##### **ChatSession Entity:**
```typescript
export class ChatSession {
  // Gestiona el ciclo de vida de una conversación
  endSession(): void {
    this._isActive = false;
    this._endedAt = new Date();
  }

  // Valida reglas de negocio
  isExpired(maxDurationMs: number): boolean {
    const now = new Date().getTime();
    const elapsed = now - this._startedAt.getTime();
    return elapsed > maxDurationMs;
  }
}
```

#### **⚙️ DOMAIN SERVICES (Servicios de Dominio)**

Los **Servicios de Dominio** contienen lógica de negocio que **no pertenece naturalmente** a una sola entidad.

##### **Cuándo usar Domain Services:**
- 🔄 **Operaciones complejas** que involucran múltiples entidades
- 🔍 **Validaciones** que requieren acceso a repositorios
- 🧮 **Cálculos** que usan datos externos
- 🔐 **Políticas de negocio** complejas

##### **UserDomainService:**
```typescript
export class UserDomainService {
  async createNewUser(userData: CreateUserData): Promise<User> {
    // 1. Validar que el email no exista
    const emailExists = await this.userRepository.existsByEmail(userData.email);
    if (emailExists) {
      throw new Error('El email ya está registrado en el sistema');
    }

    // 2. Aplicar reglas de negocio UPT
    const emailVO = new Email(userData.email);
    if ((userData.userType === UserType.STUDENT || userData.userType === UserType.TEACHER) 
        && !emailVO.isUptEmail()) {
      throw new Error('Los estudiantes y docentes deben usar email institucional');
    }

    // 3. Crear y persistir usuario
    const user = User.create(userData);
    return await this.userRepository.create(user);
  }
}
```

#### **💎 VALUE OBJECTS (Objetos de Valor)**

Los **Value Objects** representan conceptos que **no tienen identidad** y son **inmutables**.

##### **Características de los Value Objects:**
- ✅ **Sin identidad**: Se identifican por su valor, no por ID
- ✅ **Inmutables**: No pueden cambiar después de creados
- ✅ **Intercambiables**: Dos VOs con el mismo valor son equivalentes
- ✅ **Validación**: Garantizan que siempre están en estado válido

##### **Email Value Object:**
```typescript
export class Email {
  private readonly _value: string;

  constructor(email: string) {
    // Validación en la construcción
    if (!this.isValid(email)) {
      throw new Error('Formato de email inválido');
    }
    // Normalización
    this._value = email.toLowerCase().trim();
  }

  // Reglas de negocio específicas de UPT
  isUptEmail(): boolean {
    return this._value.endsWith('@upt.pe') || this._value.endsWith('@upt.edu.pe');
  }

  // Comparación por valor
  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
```

##### **Beneficios de los Value Objects:**
- 🛡️ **Validación centralizada**: Un email siempre es válido
- 🔄 **Reutilización**: Se pueden usar en múltiples entidades
- 🧪 **Testeable**: Fáciles de probar de manera aislada
- 📝 **Expresivo**: El código es más legible y comprensible

---

### **3. 🌐 PRESENTATION LAYER (Capa de Presentación)**

La capa de presentación maneja la **comunicación con el exterior** (HTTP, WebSockets, etc.).

#### **📁 Estructura:**
```
src/presentation/
├── controllers/          # Controladores HTTP
│   ├── users.controller.ts
│   ├── chat-sessions.controller.ts
│   ├── analytics.controller.ts
│   ├── dialogflow.controller.ts
│   ├── faqs.controller.ts
│   ├── health.controller.ts
│   ├── nlp.controller.ts
│   ├── password-reset.controller.ts
│   ├── support.controller.ts
│   └── tickets.controller.ts    # ✨ REUBICADO desde application/tickets/
└── modules/             # Módulos de NestJS
    └── tickets.module.ts       # ✨ REUBICADO desde application/tickets/
```

#### **🎮 CONTROLLERS:**

Los **Controladores** son el punto de entrada HTTP. Su responsabilidad es:
- 📥 **Recibir requests** HTTP
- ✅ **Validar entrada** usando DTOs
- 🎯 **Llamar use cases** apropiados
- 📤 **Formatear respuestas** HTTP

---

### **4. 🏗️ INFRASTRUCTURE LAYER (Capa de Infraestructura)**

La capa de infraestructura implementa los **detalles técnicos** y **adaptadores externos**.

#### **📁 Estructura:**
```
src/infrastructure/
└── database/
    ├── repositories/      # Implementaciones de repositorios
    │   ├── mongo-user.repository.ts
    │   └── mongo-chat-session.repository.ts
    └── schemas/          # Esquemas de base de datos
        ├── user.schema.ts
        └── chat-session.schema.ts
```

---

## 🔄 **FLUJO DE DATOS COMPLETO**

### **📊 Ejemplo: Crear un nuevo usuario**

```
1. 🌐 HTTP Request → UsersController.register()
   ↓
2. 🎯 Controller → CreateUserUseCase.execute()
   ↓
3. 🧠 Use Case → UserDomainService.createNewUser()
   ↓
4. 💎 Domain Service → Email.constructor() (validación)
   ↓
5. 🏢 Domain Service → User.create() (entidad)
   ↓
6. 🗄️ Domain Service → UserRepository.create() (persistencia)
   ↓
7. 📤 Response ← UserResponseDto.fromDomain()
```

---

## 🎯 **VENTAJAS DE ESTA ARQUITECTURA**

### **✅ BENEFICIOS:**

1. **🧪 Testabilidad**:
   - Cada capa se puede probar independientemente
   - Mocking fácil de dependencias
   - Tests unitarios enfocados

2. **🔧 Mantenibilidad**:
   - Separación clara de responsabilidades
   - Cambios localizados en capas específicas
   - Código más legible y comprensible

3. **📈 Escalabilidad**:
   - Fácil agregar nuevos use cases
   - Extensible sin modificar código existente
   - Microservicios ready

4. **🔒 Robustez**:
   - Validaciones centralizadas
   - Reglas de negocio encapsuladas
   - Consistencia de datos garantizada

### **🎨 PRINCIPIOS APLICADOS:**

- **📦 Single Responsibility**: Cada clase tiene una sola razón para cambiar
- **🔓 Open/Closed**: Abierto para extensión, cerrado para modificación
- **🔄 Dependency Inversion**: Dependencias hacia abstracciones
- **🧩 Separation of Concerns**: Cada capa tiene su propósito específico

---

## 🚀 **CASOS DE USO IMPLEMENTADOS**

### **👥 Gestión de Usuarios:**
- ✅ Registro con validación de emails UPT
- ✅ Autenticación y generación de tokens
- ✅ Consulta de perfiles de usuario
- ✅ Validación para acceso al chat
- ✅ Filtrado por tipos de usuario

### **💬 Gestión de Sesiones de Chat:**
- ✅ Inicio de sesiones con metadata
- ✅ Gestión de sesiones activas
- ✅ Validación de tokens de sesión
- ✅ Finalización y cleanup automático
- ✅ Métricas y analytics de conversaciones

---

## 🔮 **EXTENSIBILIDAD FUTURA**

Esta arquitectura permite fácilmente:

- 🤖 **Agregar nuevos tipos de agentes** (NLP, ML)
- 📊 **Implementar analytics avanzados**
- 🔔 **Añadir notificaciones en tiempo real**
- 🌍 **Crear interfaces web/mobile**
- 📈 **Escalar a microservicios**
- 🔐 **Integrar sistemas de autenticación externos**

---

## � **REFACTORING RECIENTE: MÓDULO TICKETS**

### **Problema Identificado:**
El módulo `tickets` estaba ubicado incorrectamente en `src/application/tickets/` como una carpeta independiente, violando los principios de Clean Architecture + DDD de 4 capas.

### **Solución Implementada:**

#### **✨ Archivos Movidos:**

**Controller (Capa de Presentación):**
```
ANTES: src/application/tickets/tickets.controller.ts
DESPUÉS: src/presentation/controllers/tickets.controller.ts
```

**Service (Capa de Aplicación):**
```
ANTES: src/application/tickets/tickets.service.ts
DESPUÉS: src/application/services/tickets.service.ts
```

**Module (Organización en Presentación):**
```
ANTES: src/application/tickets/tickets.module.ts
DESPUÉS: src/presentation/modules/tickets.module.ts
```

#### **🔧 Cambios de Imports:**

- **TicketsController**: Actualizado para importar `TicketsService` desde `../../application/services/tickets.service`
- **TicketsModule**: Reconfigurado para usar el controlador desde `../controllers/tickets.controller`
- **AppModule**: Actualizado para importar desde `./presentation/modules/tickets.module`

#### **📋 Archivos Legacy:**
Los archivos antiguos en `src/application/tickets/` fueron reemplazados por stubs de depreciación para evitar conflictos durante la migración.

### **✅ Resultado:**
Ahora el módulo `tickets` respeta correctamente la arquitectura de 4 capas:
- **Presentation**: `tickets.controller.ts`, `tickets.module.ts`
- **Application**: `tickets.service.ts`
- **Domain**: (usando schemas existentes)
- **Infrastructure**: (usando schemas y repositorios MongoDB existentes)

---

## �📚 **CONCLUSIÓN**

El **UPT Chat System** utiliza una arquitectura robusta que:

- 🎯 **Separa las preocupaciones** en capas bien definidas
- 🧠 **Centraliza la lógica de negocio** en el dominio
- 🔧 **Facilita el mantenimiento** y las pruebas
- 📈 **Permite el crecimiento** ordenado del sistema

Cada componente tiene un **propósito específico** y trabaja en conjunto para crear un sistema **mantenible**, **testeable** y **escalable** que satisface las necesidades específicas de la **Universidad Privada de Tacna**.

¡Esta arquitectura garantiza que el sistema pueda evolucionar y crecer junto con las necesidades de la universidad! 🎓✨