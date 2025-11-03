# 🚀 Solución al Error de Healthcheck en Railway

## ❌ Problema Original

```
Healthcheck failed!
Path: /api/v1/health
Retry window: 1m0s
Attempt #1-4 failed with service unavailable
1/1 replicas never became healthy!
```

## 🔍 Causa Raíz

1. **Endpoint healthcheck incorrecto**: `/api/v1/health` tenía rutas relativas mal configuradas
2. **Intentaba acceder a microservicios**: Que no existen en el frontend
3. **Timeout muy corto**: 60 segundos no era suficiente
4. **Mod_rewrite mal configurado**: Las reglas del `.htaccess` no estaban optimizadas

## ✅ Soluciones Implementadas

### 1. **Healthcheck Simplificado** 
Creado `/public/health.php` super simple:
```php
<?php
header('Content-Type: application/json');
http_response_code(200);
echo json_encode(['status' => 'ok']);
?>
```

### 2. **Railway.json Actualizado**
```json
{
  "deploy": {
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 3. **Dockerfile Mejorado**
- ✅ Habilitado `AllowOverride All` para `.htaccess`
- ✅ Limpieza de caché apt
- ✅ Puerto 8000 expuesto explícitamente
- ✅ CMD con `apache2-foreground`

### 4. **.htaccess Optimizado**
```apache
RewriteEngine On
RewriteRule ^health$ health.php [L]
RewriteRule ^api/v1/health$ api/v1/health.php [L]
```

### 5. **health.php Simplificado**
- Sin dependencias de BD
- Sin verificación de microservicios
- Respuesta inmediata con código 200

## 📋 Archivos Modificados

### Creados:
- ✅ `.dockerignore` - Optimizar build
- ✅ `public/test.php` - Endpoint de prueba
- ✅ `apache-config.conf` - Configuración Apache

### Modificados:
- ✅ `dockerfile` - Mejorado y optimizado
- ✅ `railway.json` - Healthcheck path y timeout
- ✅ `public/.htaccess` - Reglas de rewrite
- ✅ `public/health.php` - Simplificado completamente
- ✅ `public/api/v1/health.php` - Rutas absolutas corregidas

## 🧪 Testing Local

### Probar con Docker:
```bash
# Build
docker build -t frontend-php .

# Run
docker run -p 8000:8000 frontend-php

# Test healthcheck
curl http://localhost:8000/health
```

### Probar endpoints:
```bash
# Healthcheck simple
curl http://localhost:8000/health

# Healthcheck completo
curl http://localhost:8000/api/v1/health

# Test Apache
curl http://localhost:8000/test.php
```

## 🚀 Deploy a Railway

### Paso 1: Commit y Push
```bash
git add .
git commit -m "fix: Healthcheck optimizado para Railway"
git push origin front
```

### Paso 2: Variables de Entorno en Railway
```env
MYSQL_ADDON_HOST=tu-host.clever-cloud.com
MYSQL_ADDON_DB=tu_database
MYSQL_ADDON_USER=tu_usuario
MYSQL_ADDON_PASSWORD=tu_password
MYSQL_ADDON_PORT=3306
```

### Paso 3: Verificar Deployment
1. Railway detecta el push
2. Build con Dockerfile (~53 segundos)
3. Healthcheck en `/health` (debe ser 200 OK)
4. Servicio activo ✅

## 📊 Logs Esperados

### Build Logs (✅ Correcto):
```
=========================
Using Detected Dockerfile
=========================
[1-9] Steps completed
Build time: ~50-60 seconds
```

### Deploy Logs (✅ Correcto):
```
====================
Starting Healthcheck
====================
Path: /health
✅ Healthcheck passed!
Apache/2.4.65 configured -- resuming normal operations
```

## ⚠️ Troubleshooting

### Si sigue fallando el healthcheck:

1. **Verificar el endpoint manualmente:**
   ```bash
   curl https://tu-app.railway.app/health
   ```

2. **Revisar logs de Apache:**
   - Ir a Railway Dashboard
   - Ver "Deploy Logs"
   - Buscar errores 404 o 500

3. **Probar con healthcheck deshabilitado temporalmente:**
   ```json
   {
     "deploy": {
       "healthcheckPath": null
     }
   }
   ```

4. **Verificar que Apache esté escuchando:**
   ```bash
   # En Railway console
   ps aux | grep apache
   netstat -tuln | grep 8000
   ```

## 🎯 Próximos Pasos

Una vez desplegado:
1. ✅ Verificar `/health` responde
2. ✅ Verificar `/api/v1/health` responde
3. ✅ Probar login en `/login.php`
4. ✅ Conectar con base de datos MySQL
5. ✅ Integrar con API Gateway

## 📞 Soporte

Si el problema persiste:
- Revisar Railway logs en tiempo real
- Verificar que el puerto 8000 esté expuesto
- Comprobar variables de entorno en Railway

---

**Estado:** ✅ LISTO PARA DEPLOY
**Fecha:** 3 de noviembre de 2025
