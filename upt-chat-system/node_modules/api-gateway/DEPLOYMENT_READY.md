# 🚀 GUÍA RÁPIDA - API GATEWAY PRODUCTION READY

## ✅ **LO QUE SE IMPLEMENTÓ (Avance 6)**

### **1. Autenticación JWT Completa** 🔐
```bash
# Login obtiene token
POST /api/v1/users/login
{ "email": "usuario@upt.edu.pe", "password": "xxx" }

# Respuesta
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": "7d"
}

# Usar token en endpoints protegidos
GET /api/v1/users/profile/123
Headers: { "Authorization": "Bearer <token>" }
```

### **2. Winston Logger** 📝
```typescript
// Logs estructurados en todos los servicios
this.logger.log('Usuario autenticado exitosamente');
this.logger.error('Error al conectar MongoDB', trace);
this.logger.warn('Intento de login fallido');
```

### **3. Health Check** 🏥
```bash
# Verificar estado del sistema
GET /api/v1/health

# Para Docker healthcheck
GET /api/v1/health/ping
```

### **4. Exception Filters** 🚨
Todos los errores tienen formato consistente:
```json
{
  "statusCode": 404,
  "timestamp": "2025-10-04T10:30:00.000Z",
  "path": "/api/v1/users/123",
  "method": "GET",
  "message": "Usuario no encontrado",
  "error": "Not Found"
}
```

---

## 🏃 **INICIO RÁPIDO**

### **1. Instalar dependencias:**
```bash
cd services/api-gateway
npm install
```

### **2. Configurar variables de entorno:**
```bash
cp .env.example .env

# Editar .env con tus valores:
# - MONGODB_URI (tu MongoDB)
# - JWT_SECRET (generar con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

### **3. Iniciar en desarrollo:**
```bash
npm run start:dev
```

### **4. Verificar que funciona:**
```bash
# Health check
curl http://localhost:3000/api/v1/health

# Swagger docs
open http://localhost:3000/api/docs
```

---

## 📚 **ENDPOINTS PRINCIPALES**

### **Públicos (sin autenticación):**
```
POST /api/v1/users/login          - Autenticar usuario
GET  /api/v1/health                - Health check completo
GET  /api/v1/health/ping           - Health check rápido
GET  /api/docs                     - Documentación Swagger
```

### **Protegidos (requieren JWT):**
```
GET  /api/v1/users/profile/:id         - Obtener perfil
GET  /api/v1/users/validate-for-chat/:id - Validar permisos chat
GET  /api/v1/users/by-type/:type       - Listar usuarios por tipo
GET  /api/v1/chat-sessions/*           - Todos los endpoints de chat
```

---

## 🔒 **SEGURIDAD IMPLEMENTADA**

✅ JWT Authentication (tokens firmados)  
✅ JWT Guards (protección de endpoints)  
✅ Helmet (headers de seguridad)  
✅ CORS (orígenes permitidos)  
✅ Rate Limiting (100 req/min)  
✅ Input Validation (class-validator)  
✅ Error sanitization (no expone internals)

---

## 🐳 **DEPLOYMENT**

### **Variables de entorno en producción:**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://user:pass@host:27017/db?ssl=true
JWT_SECRET=<64_caracteres_aleatorios>
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://tu-frontend.com
LOG_LEVEL=warn
```

### **Docker Healthcheck:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health/ping || exit 1
```

### **Railway:**
1. Conectar repositorio
2. Configurar variables de entorno en dashboard
3. Deploy automático ✅

---

## 📖 **DOCUMENTACIÓN COMPLETA**

- **Avance 6 completo:** `docs/avances/AVANCE_6_README.md`
- **Todos los avances:** `docs/avances/README.md`
- **Swagger en vivo:** `/api/docs`

---

## 🧪 **TESTING**

### **Compilar:**
```bash
npm run build
```

### **Test de login:**
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"estudiante@upt.edu.pe","password":"password123"}'
```

### **Test de endpoint protegido:**
```bash
# Sin token (debe fallar 401)
curl http://localhost:3000/api/v1/users/profile/123

# Con token (debe funcionar)
curl http://localhost:3000/api/v1/users/profile/123 \
  -H "Authorization: Bearer <tu_token>"
```

---

## 📊 **ESTRUCTURA DE ARCHIVOS NUEVOS**

```
services/api-gateway/src/
├── infrastructure/
│   ├── auth/
│   │   ├── strategies/jwt.strategy.ts
│   │   ├── guards/jwt-auth.guard.ts
│   │   └── decorators/current-user.decorator.ts
│   ├── logging/
│   │   ├── winston.config.ts
│   │   └── logger.service.ts
│   └── filters/
│       ├── http-exception.filter.ts
│       └── all-exceptions.filter.ts
├── presentation/controllers/
│   └── health.controller.ts
└── application/use-cases/
    └── health.use-cases.ts

.env.example              - Template desarrollo
.env.production.example   - Template producción
.dockerignore            - Optimización Docker
```

---

## 🎯 **PRÓXIMOS PASOS**

1. **Tests automatizados** - Jest + Supertest
2. **Integración UPT real** - LDAP + BD académica
3. **Chat Service** - WebSockets + Socket.io
4. **NLP Service** - Python + DialogFlow
5. **Frontend** - React + TypeScript

---

## 💡 **TIPS IMPORTANTES**

### **Generar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **Ver logs en producción:**
```bash
# Logs estructurados en JSON
grep '"level":"error"' logs/combined.log
```

### **Usar JWT en Swagger:**
1. Login en `/api/v1/users/login`
2. Copiar `access_token`
3. Click "Authorize" 🔓
4. Pegar token
5. Click "Authorize"
6. Todos los endpoints protegidos funcionarán

---

## ✅ **ESTADO ACTUAL**

```
✅ API Gateway - PRODUCTION READY
✅ JWT Authentication - Implementado
✅ Winston Logging - Implementado
✅ Health Checks - Implementado
✅ Exception Handling - Implementado
✅ Swagger Docs - Actualizado
✅ Compilación - 0 errores
🚀 LISTO PARA DEPLOYMENT
```

---

**Última actualización:** 4 de Octubre, 2025  
**Progreso del proyecto:** 70%  
**Documentación completa:** `docs/avances/AVANCE_6_README.md`
