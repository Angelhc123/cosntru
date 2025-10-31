# 🔐 GUÍA COMPLETA DE INTEGRACIÓN RF004
## Recuperación de Contraseña por Email Personal

**Fecha:** 2024  
**Proyecto:** UPT Chat System + ProyectoTest  
**Arquitectura:** Microservicios con NestJS + PHP + DialogFlow  

---

## 📋 ÍNDICE

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Implementados](#componentes-implementados)
4. [Flujo Completo RF004](#flujo-completo-rf004)
5. [Endpoints API](#endpoints-api)
6. [Configuración](#configuración)
7. [Pruebas](#pruebas)
8. [Siguientes Pasos](#siguientes-pasos)

---

## 🎯 DESCRIPCIÓN GENERAL

**RF004** permite a los usuarios recuperar su contraseña mediante validación de email personal:

1. Usuario inicia conversación con el chatbot
2. DialogFlow detecta intención "forgot password"
3. Chatbot solicita email personal
4. Sistema valida email contra base de datos UPT
5. Si existe, genera nueva contraseña y envía por email
6. Usuario puede acceder con nueva contraseña

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────┐
│   DialogFlow    │
│   (NLP Cloud)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────┐
│              NLP SERVICE (Python/FastAPI)           │
│  - Puerto: 8001                                     │
│  - Detecta intención: password_reset                │
│  - Extrae email personal del mensaje                │
└────────┬────────────────────────────────────────────┘
         │ HTTP POST
         ▼
┌─────────────────────────────────────────────────────┐
│           API GATEWAY (NestJS/TypeScript)           │
│  - Puerto: 3000                                     │
│  - Endpoints:                                       │
│    • POST /api/v1/password-reset/verify-email       │
│    • POST /api/v1/password-reset/initiate           │
│    • GET  /api/v1/password-reset/status/:sessionId  │
└────────┬─────────────────────┬──────────────────────┘
         │                     │
         │ HTTP                │ HTTP
         ▼                     ▼
┌────────────────────┐  ┌────────────────────────┐
│  PROYECTOTEST PHP  │  │ NOTIFICATION SERVICE   │
│  - Puerto: 8000    │  │ - Puerto: 3005         │
│  - MySQL Clever    │  │ - Gmail SMTP           │
│  - Endpoints:      │  │ - Nodemailer           │
│    • verify-email  │  └────────────────────────┘
│    • update-pass   │
└────────────────────┘
```

---

## 🧩 COMPONENTES IMPLEMENTADOS

### 1. **ProyectoTest - PHP Backend**

#### `api_verify_email.php`
```php
POST /public/api_verify_email.php
Body: { "email_personal": "juan.perez@gmail.com" }

Response (SUCCESS):
{
  "success": true,
  "data": {
    "usuario": "2020068376",
    "nombre_completo": "Juan Pérez García",
    "email": "juan.perez@upt.pe",
    "email_personal": "juan.perez@gmail.com",
    "codigo_universitario": "2020068376"
  }
}

Response (NOT FOUND):
{
  "success": false,
  "message": "Email personal no encontrado"
}
```

#### `api_update_password.php`
```php
POST /public/api_update_password.php
Body: {
  "usuario": "2020068376",
  "new_password": "NewSecurePass123!"
}

Response:
{
  "success": true,
  "message": "Contraseña actualizada correctamente"
}
```

#### Base de Datos
```sql
-- Tabla: usuarios
-- Columnas clave para RF004:
usuario VARCHAR(50) PRIMARY KEY
email_personal VARCHAR(100) UNIQUE NOT NULL
codigo_universitario VARCHAR(20)
nombre_completo VARCHAR(100)
password VARCHAR(255) -- Hasheado con password_hash()
```

**Usuarios de Prueba:**
| Usuario | Email Personal | Password | Tipo |
|---------|---------------|----------|------|
| demo | demo@test.com | demo123 | Admin |
| 2020068376 | juan.perez@gmail.com | password123 | Estudiante |
| prof001 | maria.rodriguez@gmail.com | password123 | Docente |

---

### 2. **API Gateway - NestJS**

#### `MySQLConnectionService`
```typescript
// services/api-gateway/src/infrastructure/services/mysql-connection.service.ts

async verifyEmailPersonal(emailPersonal: string): Promise<{
  exists: boolean;
  usuario?: string;
  nombreCompleto?: string;
  email?: string;
  codigoUniversitario?: string;
}>

async updateUserPassword(usuario: string, newPassword: string): Promise<boolean>
```

#### `PasswordResetService`
```typescript
// services/api-gateway/src/application/services/password-reset.service.ts

async verifyEmailPersonal(emailPersonal: string)
async initiatePasswordReset(email: string, sessionId: string)
async confirmPasswordReset(token: string)
async getResetStatus(sessionId: string)
```

#### `PasswordResetController`
```typescript
// services/api-gateway/src/presentation/controllers/password-reset.controller.ts

@Post('verify-email')
async verifyEmail(@Body() body: { emailPersonal: string })

@Post('initiate')
async initiateReset(@Body() body: { emailPersonal: string; sessionId: string })

@Get('status/:sessionId')
async getStatus(@Param('sessionId') sessionId: string)
```

---

## 🔄 FLUJO COMPLETO RF004

### **FASE 1: Detección de Intención**
```
Usuario: "Olvidé mi contraseña"
         ↓
DialogFlow: Detecta intent "password_reset"
         ↓
NLP Service: Confirma intención sensible
         ↓
Chatbot: "Por favor, proporciona tu email personal"
```

### **FASE 2: Validación de Email**
```
Usuario: "juan.perez@gmail.com"
         ↓
NLP Service: POST /api/v1/password-reset/verify-email
         ↓
API Gateway: mysqlService.verifyEmailPersonal()
         ↓
ProyectoTest PHP: SELECT FROM usuarios WHERE email_personal = ?
         ↓
Response: { exists: true, usuario: "2020068376", ... }
```

### **FASE 3: Generación y Envío**
```
API Gateway: POST /api/v1/password-reset/initiate
         ↓
Password Reset Service:
  1. Genera contraseña segura aleatoria
  2. Llama updateUserPassword(usuario, newPass)
         ↓
ProyectoTest PHP: UPDATE usuarios SET password = password_hash(?)
         ↓
Notification Service: Envía email con nueva contraseña
         ↓
Usuario: Recibe email en juan.perez@gmail.com
```

---

## 🔌 ENDPOINTS API

### **API Gateway (Puerto 3000)**

#### 1. Verificar Email Personal
```bash
POST http://localhost:3000/api/v1/password-reset/verify-email
Content-Type: application/json

{
  "emailPersonal": "juan.perez@gmail.com"
}
```

**Response:**
```json
{
  "exists": true,
  "usuario": "2020068376",
  "nombreCompleto": "Juan Pérez García",
  "email": "juan.perez@upt.pe",
  "codigoUniversitario": "2020068376"
}
```

#### 2. Iniciar Recuperación
```bash
POST http://localhost:3000/api/v1/password-reset/initiate
Content-Type: application/json

{
  "emailPersonal": "juan.perez@gmail.com",
  "sessionId": "chatbot-session-12345"
}
```

**Response:**
```json
{
  "success": true,
  "token": "a3f5e7d9...",
  "message": "Email de confirmación enviado"
}
```

#### 3. Consultar Estado
```bash
GET http://localhost:3000/api/v1/password-reset/status/chatbot-session-12345
```

**Response:**
```json
{
  "status": "confirmed",
  "message": "Contraseña actualizada exitosamente",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### **ProyectoTest PHP (Puerto 8000)**

#### 1. Verificar Email
```bash
POST http://localhost:8000/public/api_verify_email.php
Content-Type: application/json

{
  "email_personal": "juan.perez@gmail.com"
}
```

#### 2. Actualizar Password
```bash
POST http://localhost:8000/public/api_update_password.php
Content-Type: application/json

{
  "usuario": "2020068376",
  "new_password": "NewSecurePass123!"
}
```

---

## ⚙️ CONFIGURACIÓN

### **1. Variables de Entorno**

#### API Gateway `.env`
```bash
# ProyectoTest PHP API
PHP_API_BASE_URL=http://localhost:8000/public

# Notification Service
NOTIFICATION_SERVICE_URL=http://localhost:3005

# API Gateway URL (para confirmación de emails)
API_GATEWAY_URL=http://localhost:3000

# MongoDB para tokens
MONGODB_URI=mongodb://localhost:27017/upt-chat-system

# JWT
JWT_SECRET=your-secret-key
```

#### ProyectoTest `config/database.php`
```php
<?php
return [
    'host' => 'bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com',
    'port' => '3306',
    'database' => 'bj7lnbakskgcgngpmtma',
    'username' => 'u7imxhdxstbw6uuy',
    'password' => 'uaBOXOPi5TD9PEpIy8Uc',
    'charset' => 'utf8mb4'
];
```

#### NLP Service `.env`
```bash
API_GATEWAY_URL=http://localhost:3000
DIALOGFLOW_PROJECT_ID=your-project-id
DIALOGFLOW_LANGUAGE=es
```

---

### **2. Iniciar Servicios**

```bash
# Terminal 1: ProyectoTest PHP
cd /home/desci/Documentos/constru/proyectotest
php -S localhost:8000

# Terminal 2: API Gateway
cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway
npm install
npm run start:dev

# Terminal 3: NLP Service
cd /home/desci/Documentos/constru/upt-chat-system/services/nlp-service
pip install -r requirements.txt
python main.py

# Terminal 4: Notification Service
cd /home/desci/Documentos/constru/upt-chat-system/services/notification-service
npm install
npm run start:dev
```

---

## 🧪 PRUEBAS

### **Test 1: Verificar Email Existente**
```bash
curl -X POST http://localhost:3000/api/v1/password-reset/verify-email \
  -H "Content-Type: application/json" \
  -d '{"emailPersonal": "juan.perez@gmail.com"}'
```

**Resultado Esperado:**
```json
{
  "exists": true,
  "usuario": "2020068376",
  "nombreCompleto": "Juan Pérez García"
}
```

---

### **Test 2: Email No Existente**
```bash
curl -X POST http://localhost:3000/api/v1/password-reset/verify-email \
  -H "Content-Type: application/json" \
  -d '{"emailPersonal": "noexiste@gmail.com"}'
```

**Resultado Esperado:**
```json
{
  "exists": false
}
```

---

### **Test 3: Flujo Completo de Recuperación**
```bash
# Paso 1: Iniciar recuperación
curl -X POST http://localhost:3000/api/v1/password-reset/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "emailPersonal": "juan.perez@gmail.com",
    "sessionId": "test-session-001"
  }'

# Paso 2: Verificar estado
curl http://localhost:3000/api/v1/password-reset/status/test-session-001

# Paso 3: Probar login con nueva contraseña
# (Usar la contraseña recibida por email)
```

---

### **Test 4: Verificación Directa PHP**
```bash
# Verificar email
curl -X POST http://localhost:8000/public/api_verify_email.php \
  -H "Content-Type: application/json" \
  -d '{"email_personal": "juan.perez@gmail.com"}'

# Actualizar contraseña
curl -X POST http://localhost:8000/public/api_update_password.php \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "2020068376",
    "new_password": "TestPassword123!"
  }'
```

---

## 🚀 SIGUIENTES PASOS

### **PRIORIDAD ALTA** ⚠️

1. **Integrar NLP Service con API Gateway**
   - Actualizar cliente de NLP para llamar endpoints del API Gateway
   - Implementar manejo de respuestas del chatbot
   - Archivo: `services/nlp-service/app/clients/api_gateway_client.py`

2. **Configurar Notification Service**
   - Crear endpoint `/api/notifications/email/new-password`
   - Configurar credenciales Gmail SMTP
   - Archivo: `services/notification-service/src/controllers/email.controller.ts`

3. **Pruebas End-to-End**
   - Probar flujo completo desde DialogFlow hasta email
   - Validar generación de contraseñas seguras
   - Verificar actualización en base de datos

---

### **PRIORIDAD MEDIA** 📊

4. **Implementar Logging y Monitoring**
   - Agregar logs estructurados en todos los servicios
   - Implementar tracking de sesiones
   - Crear dashboard de métricas

5. **Seguridad**
   - Agregar rate limiting en endpoints
   - Implementar CAPTCHA en frontend
   - Auditoría de intentos de recuperación

6. **Mejoras UX**
   - Templates HTML para emails
   - Mensajes más descriptivos en chatbot
   - Confirmación de recepción de email

---

### **FUTURAS MEJORAS** 🎯

7. **Tokens de Confirmación**
   - Implementar flujo de confirmación por enlace
   - Tokens JWT con expiración de 15 minutos
   - Almacenamiento en MongoDB

8. **Multi-canal**
   - Recuperación por SMS
   - Recuperación por preguntas de seguridad
   - Integración con autenticación biométrica

9. **Analítica**
   - Dashboard de intentos de recuperación
   - Detección de patrones sospechosos
   - Reportes de uso

---

## 📁 ESTRUCTURA DE ARCHIVOS

```
constru/
├── proyectotest/
│   ├── config/
│   │   └── database.php                    ✅ Configurado
│   ├── public/
│   │   ├── api_verify_email.php            ✅ Implementado
│   │   └── api_update_password.php         ✅ Implementado
│   ├── app/models/
│   │   └── User.php                        ✅ Métodos RF004
│   └── database_setup.sql                  ✅ Schema actualizado
│
└── upt-chat-system/
    └── services/
        ├── api-gateway/
        │   ├── src/
        │   │   ├── application/services/
        │   │   │   └── password-reset.service.ts      ✅ Implementado
        │   │   ├── infrastructure/services/
        │   │   │   └── mysql-connection.service.ts    ✅ Actualizado
        │   │   └── presentation/controllers/
        │   │       └── password-reset.controller.ts   ✅ Implementado
        │   └── .env                                   ⚠️ Configurar
        │
        ├── nlp-service/
        │   ├── app/clients/
        │   │   └── api_gateway_client.py              🔄 Pendiente
        │   └── .env                                   ⚠️ Configurar
        │
        └── notification-service/
            ├── src/controllers/
            │   └── email.controller.ts                 🔄 Pendiente
            └── .env                                   ⚠️ Configurar
```

**Leyenda:**
- ✅ Completado y funcional
- ⚠️ Creado pero necesita configuración
- 🔄 Pendiente de implementación

---

## 📝 NOTAS IMPORTANTES

### **Seguridad**
- Las contraseñas se hashean con `password_hash()` en PHP (bcrypt)
- Tokens de confirmación expiran en 1 hora
- Rate limiting recomendado: 3 intentos por hora por IP

### **Base de Datos**
- Usar Clever Cloud MySQL para producción
- Email personal debe ser UNIQUE en la BD
- Mantener logs de intentos de recuperación

### **Email**
- Configurar Gmail con "App Password" para SMTP
- Templates personalizables en Notification Service
- Incluir enlace de soporte en emails

---

## 🆘 TROUBLESHOOTING

### Problema: "Email personal no encontrado"
**Solución:**
1. Verificar que el email existe en BD: `SELECT * FROM usuarios WHERE email_personal = ?`
2. Verificar conexión a Clever Cloud MySQL
3. Verificar formato del email (trim, lowercase)

### Problema: "Error al actualizar contraseña"
**Solución:**
1. Verificar logs de PHP: `tail -f /var/log/php-errors.log`
2. Verificar que el usuario existe en BD
3. Verificar permisos de UPDATE en tabla usuarios

### Problema: "Email no enviado"
**Solución:**
1. Verificar configuración SMTP en Notification Service
2. Verificar Gmail App Password
3. Verificar logs: `docker logs notification-service`

---

## 📞 CONTACTO Y SOPORTE

**Documentación Adicional:**
- `/constru/docs/FD04-EPIS-Informe_SAD_ACTUALIZADO_v2.md`
- `/constru/ARQUITECTURA_MICROSERVICIOS_RF004.md`
- `/constru/proyectotest/RESUMEN_FINAL_BD.md`

**Logs y Debugging:**
```bash
# Ver logs API Gateway
docker logs api-gateway --tail 100 -f

# Ver logs NLP Service
docker logs nlp-service --tail 100 -f

# Ver logs PHP
tail -f /var/log/apache2/error.log
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] Base de datos actualizada con `email_personal`
- [x] 19 usuarios de prueba insertados
- [x] PHP API endpoints creados y funcionales
- [x] MySQLConnectionService actualizado
- [x] PasswordResetService implementado
- [x] PasswordResetController creado
- [ ] NLP Service integrado con API Gateway
- [ ] Notification Service endpoint de email
- [ ] Pruebas end-to-end completadas
- [ ] Variables de entorno configuradas
- [ ] Documentación de deployment

---

**Última actualización:** 2024  
**Versión:** 1.0  
**Estado:** 🟡 EN DESARROLLO (70% completo)
