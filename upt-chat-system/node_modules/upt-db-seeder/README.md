# 🗄️ DB Seeder Service - UPT Chat System

Aplicación Node.js específica para desplegar y poblar la base de datos MongoDB en Railway.

## 🎯 Propósito

Este servicio está diseñado para:
- ✅ Conectar a MongoDB Atlas en Railway
- ✅ Inicializar la estructura de la base de datos
- ✅ Poblar con datos iniciales de UPT
- ✅ Proporcionar endpoints de salud y monitoreo
- ✅ Ejecutar seeders desde Railway

## 🚀 Despliegue en Railway

### Variables de entorno requeridas:
```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/upt_chat_system
NODE_ENV=production
PORT=3001
```

### Comandos disponibles:
```bash
npm start              # Inicia el servidor
npm run seed           # Ejecuta todos los seeders
npm run seed:users     # Solo poblar usuarios
npm run clear          # Limpiar base de datos
npm run health         # Verificar salud de la BD
```

## 📊 Endpoints Disponibles

```
GET  /health           # Estado de la aplicación
GET  /db/status        # Estado de la base de datos
POST /db/seed          # Ejecutar seeders completos
POST /db/seed/users    # Poblar solo usuarios
POST /db/clear         # Limpiar base de datos
GET  /db/stats         # Estadísticas de la BD
```

## 🗃️ Datos que se insertan

### Usuarios UPT:
- 👨‍🎓 **Estudiantes**: 15 usuarios con emails @upt.edu.pe
- 👨‍🏫 **Docentes**: 8 profesores con emails @upt.pe
- 👨‍💼 **Administrativos**: 5 staff con roles específicos
- 🔧 **Administradores**: 2 admin del sistema

### Sesiones de Chat:
- 💬 25+ sesiones de ejemplo con diferentes estados
- 📊 Conversaciones con métricas de satisfacción
- 🕒 Timestamps realistas distribuidos

### Base de Conocimiento:
- ❓ FAQ específicas de UPT
- 📚 Procedimientos administrativos
- 🎓 Información académica
- 🏛️ Datos institucionales

## 🔧 Uso Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar seeders
npm run seed

# Iniciar servidor de monitoreo
npm run dev
```

## 📈 Monitoreo

El servicio expone métricas sobre:
- Estado de conexión a MongoDB
- Cantidad de documentos por colección
- Tiempo de respuesta de queries
- Logs de operaciones de seeding