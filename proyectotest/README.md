# Sistema de Login PHP con MVC

Este proyecto implementa un sistema de login en PHP usando el patrón MVC (Modelo-Vista-Controlador) con una interfaz similar a la intranet universitaria.

## Características

- ✅ Arquitectura MVC
- ✅ Sistema de autenticación con base de datos
- ✅ Interfaz similar a la intranet de la UPT
- ✅ Captcha matemático para seguridad
- ✅ Dashboard con múltiples secciones (Académico, Administrativo, Presupuesto)
- ✅ Diseño responsive
- ✅ Sesiones de usuario seguras

## Estructura del Proyecto

```
proyectotest/
├── app/
│   ├── controllers/
│   │   └── AuthController.php
│   ├── models/
│   │   └── User.php
│   └── views/
│       ├── login.php
│       └── dashboard.php
├── config/
│   └── database.php
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   ├── index.php
│   ├── login.php
│   ├── login_process.php
│   ├── dashboard.php
│   ├── logout.php
│   └── set_captcha.php
└── README.md
```

## Configuración de Base de Datos

### 🔧 Base de Datos en Clever Cloud (MySQL)

El proyecto ahora usa **Clever Cloud** para el hosting de la base de datos MySQL.

#### Configuración Inicial

1. **Copiar el archivo de ejemplo de variables de entorno:**
   ```bash
   cp .env.example .env
   ```

2. **Editar el archivo `.env` con tus credenciales de Clever Cloud:**
   ```env
   MYSQL_ADDON_HOST=tu-host.clever-cloud.com
   MYSQL_ADDON_DB=tu_database
   MYSQL_ADDON_USER=tu_usuario
   MYSQL_ADDON_PORT=3306
   MYSQL_ADDON_PASSWORD=tu_password
   ```

3. **Probar la conexión:**
   ```bash
   php test_connection.php
   ```

4. **Configurar las tablas (opcional - ejecutar script SQL):**
   ```bash
   ./setup_database.sh
   ```
   O manualmente:
   ```bash
   mysql -h TU_HOST -P 3306 -u TU_USER -p TU_DATABASE < database_setup.sql
   ```

#### 🔒 Seguridad

⚠️ **IMPORTANTE:** El archivo `.env` contiene credenciales sensibles y **NO debe subirse a Git**.

- ✅ Ya está incluido en `.gitignore`
- ✅ Usa `.env.example` como plantilla
- ✅ Las credenciales se cargan automáticamente desde `config/database.php`

---

## Instalación

1. **Clonar el proyecto**
   ```bash
   git clone <tu-repo>
   cd proyectotest
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Edita .env con tus credenciales reales
   ```

3. **Probar conexión a la base de datos**
   ```bash
   php test_connection.php
   ```

4. **Configurar servidor web**
   - Configurar Apache/Nginx para que apunte a la carpeta `public/`
   - O usar el servidor de desarrollo de PHP:
   ```bash
   cd public
   php -S localhost:8000
   ```

5. **Configurar las tablas de la base de datos**
   ```bash
   ./setup_database.sh
   ```

## 🆕 Actualización: Email Personal (RF004)

**Fecha**: 19 de octubre de 2025

Se ha actualizado la base de datos para soportar el **RF004 (Validación por Correo Personal)** del sistema UPT Chat.

### Nuevos Campos en la Tabla `usuarios`:
- ✅ `email_personal` - Email personal para recuperación de contraseña
- ✅ `tipo_usuario` - Tipo de usuario (estudiante, docente, administrativo)
- ✅ `codigo_universitario` - Código único UPT
- ✅ `carrera` - Carrera o departamento
- ✅ `estado` - Estado del usuario (activo, inactivo, egresado)

### Nuevos Endpoints API:
- ✅ `POST /public/api_verify_email.php` - Verificar email personal
- ✅ `POST /public/api_update_password.php` - Actualizar contraseña

📚 **Ver documentación completa**: [ACTUALIZACION_EMAIL_PERSONAL.md](./ACTUALIZACION_EMAIL_PERSONAL.md)

## Usuarios de Prueba

### Usuario Demo Original
- **Usuario:** demo
- **Contraseña:** password123
- **Email Personal:** demo.personal@gmail.com

### Estudiantes UPT (20 usuarios de prueba)
| Usuario | Nombre | Contraseña | Email Personal |
|---------|--------|------------|----------------|
| 2020068376 | Juan Carlos Pérez Mamani | password123 | juanperez@gmail.com |
| 2021054832 | María Elena Flores Quispe | password123 | mariaflores@outlook.com |
| 2019073245 | Carlos Alberto Fernández | password123 | carlosfernandez@hotmail.com |

### Docentes UPT
| Usuario | Nombre | Contraseña | Email Personal |
|---------|--------|------------|----------------|
| prof001 | Dr. José Antonio Mendoza | password123 | josemendoza@gmail.com |
| prof002 | Mg. Patricia Elena Huamán | password123 | patriciahuaman@outlook.com |

📝 **Nota**: Todos los usuarios de prueba usan la contraseña `password123`

## Funcionalidades

### Sistema de Login
- Validación de usuario y contraseña
- Captcha matemático para seguridad
- Mensajes de error informativos
- Teclado numérico virtual

### Dashboard
- **Sección Académica:** Información académica, calendarios, información económica
- **Sección Administrativa:** Gestión de usuarios, académica, configuración
- **Sección Presupuesto:** Control presupuestario, gastos, análisis financiero

### Seguridad
- Contraseñas hasheadas con `password_hash()`
- Sesiones seguras
- Validación de captcha
- Protección contra acceso no autorizado

## Tecnologías Utilizadas

- **PHP 7.4+**
- **MySQL/MariaDB**
- **PDO** para conexión a base de datos
- **CSS3** para estilos responsive
- **JavaScript** para interactividad
- **Patrón MVC** para arquitectura

## Personalización

### Agregar Nuevas Funcionalidades
1. Crear nuevo controlador en `app/controllers/`
2. Crear modelo correspondiente en `app/models/`
3. Agregar vistas en `app/views/`
4. Crear rutas públicas en `public/`

### Modificar Estilos
Los estilos están en `public/css/style.css` y utilizan:
- Flexbox y Grid para layout responsive
- Colores del tema universitario (#1e3c72, #2a5298)
- Efectos de hover y transiciones

### Agregar Nuevas Secciones al Dashboard
1. Modificar `app/views/dashboard.php`
2. Agregar estilos en `public/css/style.css`
3. Implementar funcionalidad JavaScript en `public/js/script.js`

## Notas de Desarrollo

- El sistema crea automáticamente un usuario demo la primera vez
- Las tablas de base de datos se crean automáticamente
- El captcha se regenera en cada acceso
- Las sesiones expiran al cerrar el navegador

## Pruebas de API

Ejecutar script de pruebas automatizado:
```bash
chmod +x test_api_email.sh
./test_api_email.sh
```

Probar endpoints manualmente:
```bash
# Verificar email personal
curl -X POST http://localhost:8000/public/api_verify_email.php \
  -H "Content-Type: application/json" \
  -d '{"email_personal": "juanperez@gmail.com"}'

# Actualizar contraseña
curl -X POST http://localhost:8000/public/api_update_password.php \
  -H "Content-Type: application/json" \
  -d '{"usuario": "2020068376", "new_password": "nuevaPassword123"}'
```

## Integración con UPT Chat System

Este proyecto simula la base de datos intranet de la UPT y se integra con el **API Gateway** del sistema de chat para:

1. ✅ Verificar emails personales de usuarios
2. ✅ Actualizar contraseñas desde el chatbot
3. ✅ Validación de identidad para consultas sensibles (RF004)

**Arquitectura de integración:**
```
NLP Service → API Gateway → Proyecto Test (MySQL) → Respuesta
```

## Próximas Mejoras

- [x] ✅ Sistema de recuperación de contraseñas (RF004)
- [x] ✅ API REST para funcionalidades
- [x] ✅ Integración con sistema UPT Chat
- [ ] Registro de nuevos usuarios desde interfaz
- [ ] Logs de acceso mejorados
- [ ] Panel administrativo completo
- [ ] Integración con más sistemas externos