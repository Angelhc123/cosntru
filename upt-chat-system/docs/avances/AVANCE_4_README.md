# 🗄️ AVANCE 4 - DB SEEDER SERVICE
## 🗓️ **Fecha:** 30 de Septiembre 2025
## 👥 **Desarrolladores:** Piero Alexander Paja de la Cruz, Angel Gadiel Hernandez Cruz

---

## 🎯 **OBJETIVOS DEL AVANCE 4**
- ✅ Crear servicio de inicialización de base de datos
- ✅ Implementar seeders para datos de UPT
- ✅ Conectar a MongoDB Atlas en Railway
- ✅ Proporcionar API REST para gestión de BD
- ✅ Poblar base de datos con datos realistas

---

## 🏗️ **COMPONENTES IMPLEMENTADOS**

### **Estructura del DB Seeder:**
```
services/db-seeder/
├── 📄 src/
│   ├── index.js ✅              # Servidor Express principal
│   ├── models/ ✅               # Modelos de MongoDB
│   │   ├── User.js              # Modelo de usuarios UPT
│   │   └── ChatSession.js       # Modelo de sesiones de chat
│   ├── seeders/ ✅              # Scripts de población
│   │   ├── seed-users.js        # Seeder de usuarios
│   │   ├── seed-chat-sessions.js # Seeder de sesiones
│   │   └── seed-knowledge-base.js # Seeder de FAQ
│   └── routes/ ✅               # API REST
│       ├── health-routes.js     # Endpoints de salud
│       └── db-routes.js         # Endpoints de BD
├── package.json ✅              # Dependencias Node.js
├── Dockerfile ✅                # Contenedor para Railway
├── .env.example ✅              # Variables de entorno
└── README.md ✅                 # Documentación completa
```

**Total líneas de código:** 1,176 líneas JavaScript

---

## 📊 **FUNCIONALIDADES IMPLEMENTADAS**

### **1. Servidor Express (index.js - 87 líneas)**

#### **Características principales:**
```javascript
// Middlewares de seguridad
- helmet()      // Protección HTTP headers
- cors()        // CORS configurado
- express.json() // Parseo JSON

// Conexión MongoDB Atlas
const mongoURI = process.env.MONGODB_URI;
await mongoose.connect(mongoURI);
```

#### **Endpoints disponibles:**
- `GET /` - Información del servicio
- `GET /health` - Estado de salud
- `GET /db/status` - Estado de la base de datos
- `POST /db/seed` - Ejecutar todos los seeders
- `POST /db/seed/users` - Poblar solo usuarios
- `POST /db/clear` - Limpiar base de datos
- `GET /db/stats` - Estadísticas de colecciones

---

### **2. Modelos de Datos**

#### **User.js - Modelo de Usuarios UPT**
```javascript
const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    index: true 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userType: { 
    type: String, 
    enum: ['STUDENT', 'TEACHER', 'ADMIN', 'STAFF'],
    required: true,
    index: true
  },
  isActive: { type: Boolean, default: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Índices para optimización
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ userType: 1, isActive: 1 });
UserSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });
```

#### **ChatSession.js - Modelo de Sesiones**
```javascript
const ChatSessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  sessionToken: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  isActive: { type: Boolean, default: true, index: true },
  totalMessages: { type: Number, default: 0 },
  satisfactionScore: { type: Number, min: 1, max: 5 },
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceType: String
  }
}, { timestamps: true });

// Índices optimizados
ChatSessionSchema.index({ userId: 1, isActive: 1 });
ChatSessionSchema.index({ sessionToken: 1 }, { unique: true });
ChatSessionSchema.index({ startTime: -1 });
```

---

### **3. Seeders de Datos**

#### **A. Seed Users (seed-users.js)**

**Datos insertados:**
```javascript
👨‍🎓 ESTUDIANTES (15 usuarios)
- alejandro.torres@upt.edu.pe
- maria.gonzales@upt.edu.pe
- carlos.mendoza@upt.edu.pe
... [15 estudiantes total]

👨‍🏫 DOCENTES (8 profesores)
- juan.rodriguez@upt.pe
- ana.sanchez@upt.pe
- roberto.fernandez@upt.pe
... [8 docentes total]

👨‍💼 STAFF (5 administrativos)
- lucia.ramirez@admin.upt.pe
- miguel.castro@admin.upt.pe
... [5 staff total]

🔧 ADMINS (2 administradores)
- admin@upt.pe
- superadmin@upt.pe
```

**Total usuarios insertados:** 30 usuarios

#### **B. Seed Chat Sessions (seed-chat-sessions.js)**

**Sesiones generadas:**
```javascript
Estado de sesiones:
- 💬 15 sesiones activas
- ✅ 10 sesiones completadas con satisfacción alta (4-5★)
- 😐 3 sesiones con satisfacción media (3★)
- 😞 2 sesiones con satisfacción baja (1-2★)

Métricas de sesiones:
- Promedio de mensajes: 8-15 por sesión
- Duración promedio: 10-30 minutos
- Dispositivos: 60% Mobile, 40% Desktop
```

**Total sesiones insertadas:** 30 sesiones

#### **C. Seed Knowledge Base (seed-knowledge-base.js)**

**Base de conocimiento:**
```javascript
Categorías de FAQ:
- 📚 ACADÉMICO (10 preguntas)
  * Proceso de matrícula
  * Horarios de clases
  * Sistema de calificaciones
  * Requisitos de titulación

- 🏛️ ADMINISTRATIVO (8 preguntas)
  * Trámites documentarios
  * Certificados y constancias
  * Pagos y finanzas

- 🎓 SERVICIOS (7 preguntas)
  * Biblioteca virtual
  * Laboratorios
  * Soporte técnico
```

**Total FAQ insertadas:** 25+ preguntas frecuentes

---

### **4. API Routes**

#### **Health Routes (health-routes.js)**
```javascript
// GET /health
{
  status: 'healthy',
  timestamp: '2025-09-30T10:30:00Z',
  uptime: 3600,
  database: {
    status: 'connected',
    name: 'upt_chat_system',
    collections: 3
  }
}
```

#### **DB Routes (db-routes.js)**
```javascript
// POST /db/seed
{
  success: true,
  message: 'Base de datos poblada exitosamente',
  data: {
    users: 30,
    chatSessions: 30,
    knowledgeBase: 25
  }
}

// GET /db/stats
{
  collections: {
    users: { count: 30, indexes: 7 },
    chatsessions: { count: 30, indexes: 5 },
    knowledgebase: { count: 25, indexes: 3 }
  },
  totalDocuments: 85,
  databaseSize: '2.5 MB'
}
```

---

## 🚀 **DESPLIEGUE EN RAILWAY**

### **Configuración implementada:**

#### **1. Variables de entorno:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/upt_chat_system
NODE_ENV=production
PORT=3001
```

#### **2. Dockerfile optimizado:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "src/index.js"]
```

#### **3. Scripts NPM:**
```json
{
  "start": "node src/index.js",
  "dev": "nodemon src/index.js",
  "seed": "node src/seeders/seed-users.js && ...",
  "seed:users": "node src/seeders/seed-users.js",
  "clear": "node scripts/clear-db.js",
  "health": "curl http://localhost:3001/health"
}
```

---

## 📈 **MÉTRICAS Y ESTADÍSTICAS**

### **Datos poblados correctamente:**

| Colección | Documentos | Índices | Tamaño |
|-----------|------------|---------|--------|
| Users | 30 | 7 | ~15 KB |
| ChatSessions | 30 | 5 | ~20 KB |
| KnowledgeBase | 25 | 3 | ~10 KB |
| **TOTAL** | **85** | **15** | **~45 KB** |

### **Distribución de usuarios:**
- 👨‍🎓 Estudiantes: 50% (15 usuarios)
- 👨‍🏫 Docentes: 27% (8 usuarios)
- 👨‍💼 Staff: 17% (5 usuarios)
- 🔧 Admins: 6% (2 usuarios)

### **Estado de sesiones:**
- 💬 Activas: 50% (15 sesiones)
- ✅ Completadas: 50% (15 sesiones)
- ⭐ Satisfacción promedio: 3.8/5

---

## 🔧 **DEPENDENCIAS INSTALADAS**

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## ✅ **LOGROS DEL AVANCE 4**

### **Funcionalidad completa:**
1. ✅ Servidor Express funcionando
2. ✅ Conexión a MongoDB Atlas establecida
3. ✅ 30 usuarios UPT poblados correctamente
4. ✅ 30 sesiones de chat con métricas realistas
5. ✅ 25+ FAQ de base de conocimiento
6. ✅ API REST con 7 endpoints operativos
7. ✅ Dockerfile preparado para Railway
8. ✅ Scripts NPM para gestión de BD
9. ✅ Índices optimizados en todas las colecciones
10. ✅ Documentación completa del servicio

### **Calidad del código:**
- ✅ 1,176 líneas de JavaScript limpio
- ✅ Modelos con validaciones robustas
- ✅ Seeders con datos realistas de UPT
- ✅ Manejo de errores en todas las rutas
- ✅ Logs informativos de operaciones
- ✅ Configuración de seguridad (Helmet, CORS)

---

## 🎯 **CASOS DE USO IMPLEMENTADOS**

### **1. Población inicial de base de datos**
```bash
curl -X POST http://localhost:3001/db/seed
# Inserta todos los datos de prueba
```

### **2. Verificación de salud del servicio**
```bash
curl http://localhost:3001/health
# Verifica estado de conexión MongoDB
```

### **3. Consulta de estadísticas**
```bash
curl http://localhost:3001/db/stats
# Muestra métricas de colecciones
```

### **4. Limpieza de base de datos**
```bash
curl -X POST http://localhost:3001/db/clear
# Elimina todos los documentos (cuidado)
```

---

## 📝 **LECCIONES APRENDIDAS**

### **Desafíos superados:**
1. **Conexión a MongoDB Atlas:** Configuración correcta de credenciales y whitelist de IPs
2. **Seeders idempotentes:** Evitar duplicados al ejecutar múltiples veces
3. **Índices optimizados:** Mejorar performance de queries comunes
4. **Datos realistas:** Generar información coherente con el contexto UPT

### **Mejores prácticas aplicadas:**
- ✅ Uso de variables de entorno para credenciales
- ✅ Modelos con validaciones de Mongoose
- ✅ Índices compuestos para queries frecuentes
- ✅ Timestamps automáticos con `{ timestamps: true }`
- ✅ Referencias entre colecciones con `ref`
- ✅ Manejo de errores con try-catch
- ✅ Logs descriptivos de operaciones

---

## 🔜 **PRÓXIMOS PASOS**

Para el **Avance 5** se continuará con:
1. Corrección de arquitectura del API Gateway
2. Refactorización de casos de uso
3. Eliminación de lógica de creación de usuarios
4. Implementación de integración con BD UPT existente

---

## 📚 **DOCUMENTACIÓN ADICIONAL**

- [README del DB Seeder](../../services/db-seeder/README.md)
- [Variables de entorno](.env.example)
- [Dockerfile de despliegue](../../services/db-seeder/Dockerfile)

---

## 👨‍💻 **DESARROLLADO POR**
- **Piero Alexander Paja de la Cruz**
- **Angel Gadiel Hernandez Cruz**

**Universidad Privada de Tacna**  
**Ingeniería de Sistemas**  
**2025**

---

**Estado del Avance 4:** ✅ **COMPLETADO AL 100%**  
**Fecha de finalización:** 30 de Septiembre 2025
