# 🚀 GUÍA DE DESPLIEGUE EN RAILWAY

## 📋 Requisitos Previos

1. **Cuenta de Railway**: [railway.app](https://railway.app)
2. **MongoDB Atlas**: [cloud.mongodb.com](https://cloud.mongodb.com)
3. **Repositorio Git**: Tu código debe estar en GitHub/GitLab

## 🗄️ Configurar MongoDB Atlas

1. **Crear Cluster**:
   - Accede a MongoDB Atlas
   - Crea un nuevo cluster (FREE tier disponible)
   - Configura usuario y contraseña
   - Whitelist IP: `0.0.0.0/0` (para Railway)

2. **Obtener Connection String**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/upt_chat_system?retryWrites=true&w=majority
   ```

## 🚄 Desplegar DB Seeder en Railway

### Opción 1: Desde el Dashboard de Railway

1. **Nuevo Proyecto**:
   - Ve a [railway.app](https://railway.app)
   - Click "New Project" > "Deploy from GitHub repo"
   - Selecciona tu repositorio

2. **Configurar Servicio**:
   - Root Directory: `/services/db-seeder`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Variables de Entorno**:
   ```bash
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/upt_chat_system
   NODE_ENV=production
   PORT=3001
   ```

### Opción 2: Con Railway CLI

```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navegar al proyecto
cd services/db-seeder

# Inicializar Railway
railway init

# Configurar variables de entorno
railway variables set MONGODB_URI="tu-connection-string"
railway variables set NODE_ENV="production"

# Desplegar
railway up
```

## 📊 Verificar Despliegue

1. **Health Check**:
   ```bash
   curl https://tu-app.railway.app/health
   ```

2. **Poblar Base de Datos**:
   ```bash
   curl -X POST https://tu-app.railway.app/db/seed
   ```

3. **Verificar Estadísticas**:
   ```bash
   curl https://tu-app.railway.app/db/stats
   ```

## 🔧 Desplegar API Gateway

1. **Segundo Servicio en Railway**:
   - Agregar nuevo servicio al mismo proyecto
   - Root Directory: `/services/api-gateway`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

2. **Variables de Entorno API Gateway**:
   ```bash
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/upt_chat_system
   NODE_ENV=production
   JWT_SECRET=tu-jwt-secret-super-seguro
   ALLOWED_ORIGINS=https://tu-frontend.com
   ```

## 📋 Endpoints Disponibles

Una vez desplegado, tendrás disponible:

### DB Seeder Service:
```
GET  /health                    # Estado del servicio
GET  /db/status                 # Estado de la BD
POST /db/seed                   # Poblar toda la BD
POST /db/seed/users            # Solo usuarios
POST /db/clear                 # Limpiar BD
GET  /db/stats                 # Estadísticas
```

### API Gateway:
```
POST /api/v1/users/register    # Registro
POST /api/v1/users/login       # Login
GET  /api/v1/users/profile     # Perfil
GET  /api/v1/chat-sessions     # Sesiones
```

## 🔍 Monitoreo

Railway provee automáticamente:
- ✅ Logs en tiempo real
- ✅ Métricas de CPU/RAM
- ✅ Health checks automáticos
- ✅ SSL/HTTPS automático
- ✅ Auto-deploy desde Git

## ⚡ Comandos Útiles

```bash
# Ver logs en tiempo real
railway logs

# Ver servicios
railway status

# Conectar a la BD remotamente
railway connect

# Variables de entorno
railway variables

# Redeploy
railway up --detach
```

## 🚨 Troubleshooting

**Error de conexión a MongoDB**:
- Verificar connection string
- Verificar whitelist de IPs en Atlas
- Verificar usuario y contraseña

**Error de build**:
- Verificar que package.json esté correcto
- Verificar root directory
- Ver logs de build en Railway

**Error de salud del servicio**:
- Verificar que el puerto sea correcto
- Verificar healthcheck endpoint
- Ver logs de la aplicación