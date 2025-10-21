# 🚀 GUÍA RÁPIDA - Aplicar Cambios a Clever Cloud

## ✅ Credenciales Configuradas

Ya tienes las credenciales de Clever Cloud configuradas en `.env`:

```
Host: bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
Database: bj7lnbakskgcgngpmtma
User: u7imxhdxstbw6uuy
Port: 3306
```

---

## 🔧 Pasos para Aplicar los Cambios

### **Paso 1: Verificar Conexión**

Primero, verifica que puedes conectarte a la base de datos:

```bash
cd /home/desci/Documentos/constru/proyectotest
./verify_connection.sh
```

**Deberías ver:**
```
✅ CONEXIÓN EXITOSA
✅ Tabla 'usuarios' existe (o se creará)
✅ TODO LISTO PARA APLICAR CAMBIOS
```

### **Paso 2: Aplicar Cambios**

Ejecuta el script que creará/actualizará la tabla y agregará los usuarios de prueba:

```bash
./apply_database_changes.sh
```

**Confirmación:**
- Se te pedirá confirmar antes de aplicar los cambios
- Presiona `s` para continuar

**Resultado esperado:**
```
✅ ¡Cambios aplicados exitosamente!
Total de usuarios en la base de datos: 18+
```

### **Paso 3: Verificar Usuarios Insertados**

```bash
# Conectarse directamente a MySQL
mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \
      -P 3306 \
      -u u7imxhdxstbw6uuy \
      -puaBOXOPi5TD9PEpIy8Uc \
      bj7lnbakskgcgngpmtma

# Dentro de MySQL, ejecutar:
SELECT usuario, nombre_completo, email, email_personal, tipo_usuario 
FROM usuarios 
LIMIT 10;
```

---

## 🧪 Probar los Endpoints API

### **Paso 4: Iniciar Servidor PHP**

```bash
cd /home/desci/Documentos/constru/proyectotest
php -S localhost:8000 -t public/
```

### **Paso 5: Probar API**

En otra terminal:

```bash
cd /home/desci/Documentos/constru/proyectotest
./test_api_email.sh
```

O prueba manualmente:

```bash
# Verificar email personal
curl -X POST http://localhost:8000/public/api_verify_email.php \
  -H "Content-Type: application/json" \
  -d '{"email_personal": "juanperez@gmail.com"}'

# Respuesta esperada:
{
  "success": true,
  "message": "Email personal encontrado",
  "data": {
    "usuario": "2020068376",
    "nombre_completo": "Juan Carlos Pérez Mamani",
    "email": "2020068376@upt.edu.pe",
    "email_personal": "juanperez@gmail.com"
  }
}
```

---

## 👥 Usuarios de Prueba Disponibles

Después de aplicar los cambios, tendrás estos usuarios:

### **Estudiantes:**
| Usuario | Contraseña | Email Personal |
|---------|------------|----------------|
| 2020068376 | password123 | juanperez@gmail.com |
| 2021054832 | password123 | mariaflores@outlook.com |
| 2019073245 | password123 | carlosfernandez@hotmail.com |

### **Docentes:**
| Usuario | Contraseña | Email Personal |
|---------|------------|----------------|
| prof001 | password123 | josemendoza@gmail.com |
| prof002 | password123 | patriciahuaman@outlook.com |

### **Administrativos:**
| Usuario | Contraseña | Email Personal |
|---------|------------|----------------|
| admin001 | password123 | carmenlopez@gmail.com |
| admin002 | password123 | migueltorres@outlook.com |

---

## 🔗 Integración con API Gateway

### **Paso 6: Actualizar API Gateway**

Edita el archivo `.env` del API Gateway:

```bash
nano /home/desci/Documentos/constru/upt-chat-system/services/api-gateway/.env
```

Agrega/actualiza estas líneas:

```env
# MySQL UPT (Proyecto Test - Clever Cloud)
MYSQL_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
MYSQL_PORT=3306
MYSQL_USER=u7imxhdxstbw6uuy
MYSQL_PASSWORD=uaBOXOPi5TD9PEpIy8Uc
MYSQL_DATABASE=bj7lnbakskgcgngpmtma

# URL del Proyecto Test (para endpoints API)
PHP_API_BASE_URL=http://localhost:8000/public
```

### **Paso 7: Probar Flujo Completo RF004**

1. **Iniciar todos los servicios:**
   ```bash
   # Terminal 1: Proyecto Test
   cd /home/desci/Documentos/constru/proyectotest
   php -S localhost:8000 -t public/
   
   # Terminal 2: NLP Service
   cd /home/desci/Documentos/constru/upt-chat-system/services/nlp-service
   python main.py
   
   # Terminal 3: API Gateway
   cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway
   npm run start:dev
   
   # Terminal 4: Notification Service
   cd /home/desci/Documentos/constru/upt-chat-system/services/notification-service
   npm run start:dev
   ```

2. **Probar consulta sensible:**
   ```bash
   curl -X POST http://localhost:8001/api/v1/nlp/process-message \
     -H "Content-Type: application/json" \
     -d '{
       "message": "¿Cuáles son mis notas?",
       "user_id": "test_user",
       "session_id": "test_session"
     }'
   ```

---

## 📝 Comandos Útiles

### **Ver estructura de la tabla:**
```bash
mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \
      -P 3306 \
      -u u7imxhdxstbw6uuy \
      -puaBOXOPi5TD9PEpIy8Uc \
      bj7lnbakskgcgngpmtma \
      -e "DESCRIBE usuarios;"
```

### **Contar usuarios por tipo:**
```bash
mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \
      -P 3306 \
      -u u7imxhdxstbw6uuy \
      -puaBOXOPi5TD9PEpIy8Uc \
      bj7lnbakskgcgngpmtma \
      -e "SELECT tipo_usuario, COUNT(*) as total FROM usuarios GROUP BY tipo_usuario;"
```

### **Buscar usuario por email personal:**
```bash
mysql -h bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com \
      -P 3306 \
      -u u7imxhdxstbw6uuy \
      -puaBOXOPi5TD9PEpIy8Uc \
      bj7lnbakskgcgngpmtma \
      -e "SELECT * FROM usuarios WHERE email_personal = 'juanperez@gmail.com';"
```

---

## ⚠️ Solución de Problemas

### **Error: mysql: command not found**
```bash
sudo apt-get update
sudo apt-get install mysql-client
```

### **Error: Access denied**
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que no haya espacios extra en el archivo `.env`

### **Error: Can't connect to MySQL server**
- Verifica tu conexión a Internet
- Comprueba que Clever Cloud esté funcionando
- Verifica que tu IP esté permitida en el firewall de Clever Cloud

### **Campo email_personal no existe**
- Ejecuta: `./apply_database_changes.sh` para crear los nuevos campos

---

## ✅ Checklist

- [ ] Verificar conexión: `./verify_connection.sh`
- [ ] Aplicar cambios: `./apply_database_changes.sh`
- [ ] Iniciar servidor PHP: `php -S localhost:8000 -t public/`
- [ ] Probar endpoints: `./test_api_email.sh`
- [ ] Actualizar .env del API Gateway
- [ ] Probar login en: `http://localhost:8000/login.php`
- [ ] Probar flujo RF004 completo

---

**Fecha**: 20 de octubre de 2025  
**Estado**: ✅ Listo para usar con Clever Cloud
