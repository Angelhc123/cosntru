# 🚀 Despliegue en Railway - UPT Chat System

## ✅ Archivos de Configuración Creados

- `railway.json` - Configuración principal de Railway
- `nixpacks.toml` - Configuración de build
- `setup_railway.sh` - Script de instalación
- `start_railway.sh` - Script de inicio
- `Procfile` - Definición de proceso
- `.railwayignore` - Archivos a ignorar
- `railway.env` - Variables de entorno (plantilla)

## 📋 Pasos para Desplegar

### 1. Instalar Railway CLI
```bash
# Opción 1: Usando curl
curl -fsSL https://railway.app/install.sh | sh

# Opción 2: Usando npm
npm install -g @railway/cli
```

### 2. Autenticarse en Railway
```bash
railway login
```

### 3. Crear Proyecto
```bash
railway init
```
- Selecciona "Empty Project"
- Nombre: `upt-chat-system`

### 4. Agregar MongoDB
En Railway Dashboard:
1. Click en tu proyecto
2. Click "+ New"
3. Selecciona "Database" > "Add MongoDB"
4. Copia la variable `MONGO_URL`

### 5. Configurar Variables de Entorno
En Railway Dashboard > Variables, pega TODAS las variables del archivo `railway.env`

**Variables Críticas:**
- `MONGODB_URI` = `${{MONGO_URL}}` (referencia al addon de MongoDB)
- `MYSQL_ADDON_HOST` = Ya configurado en railway.env
- `MYSQL_ADDON_PASSWORD` = Ya configurado en railway.env
- `DIALOGFLOW_PROJECT_ID` = Ya configurado en railway.env

### 6. Conectar GitHub (Recomendado)
En Railway Dashboard:
1. Settings > Service
2. Connect Repo
3. Selecciona `Angelhc123/cosntru`
4. Branch: `main`

### 7. Desplegar
```bash
# Commit y push
git add .
git commit -m "🚀 Configuración Railway lista"
git push origin main

# O deploy directo
railway up
```

### 8. Ver Logs
```bash
railway logs
```

### 9. Obtener URL
En Railway Dashboard verás la URL pública:
```
https://upt-chat-system-production.up.railway.app
```

## 🔧 Comandos Útiles

```bash
# Ver estado
railway status

# Abrir dashboard
railway open

# Ver variables
railway variables

# Ejecutar comando en Railway
railway run <comando>

# Reiniciar servicio
railway restart
```

## 📊 Servicios Desplegados

- ✅ Frontend PHP (Puerto principal)
- ✅ API Gateway (Puerto 3000)
- ✅ NLP Service (Puerto 8001)
- ✅ Notification Service (Puerto 3005)
- ✅ Analytics Service (Puerto 3006)

## 🗄️ Bases de Datos

- **MySQL**: Clever Cloud (ya configurado)
- **MongoDB**: Railway Addon (agregar manualmente)

## ⚠️ Notas Importantes

1. **MongoDB**: Debes agregar el addon de MongoDB en Railway Dashboard
2. **Dialogflow**: Las credenciales ya están en el proyecto
3. **Puertos**: Railway asigna un puerto dinámico, los internos son fijos
4. **Logs**: Disponibles en `logs/` de cada servicio

## 🆘 Troubleshooting

### Build falla
```bash
railway logs
```
Verifica que todas las dependencias se instalaron correctamente.

### Servicio no responde
Verifica las variables de entorno en Railway Dashboard.

### MongoDB no conecta
Asegúrate de haber agregado el addon MongoDB y configurado `MONGODB_URI=${{MONGO_URL}}`.

## 📞 Soporte

- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Project Issues: https://github.com/Angelhc123/cosntru/issues
