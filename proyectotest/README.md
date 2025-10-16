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

## Usuario Demo

Para probar el sistema, usa estas credenciales:
- **Usuario:** demo
- **Contraseña:** demo123

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

## Próximas Mejoras

- [ ] Sistema de recuperación de contraseñas
- [ ] Registro de nuevos usuarios
- [ ] Logs de acceso
- [ ] API REST para funcionalidades
- [ ] Integración con sistemas externos