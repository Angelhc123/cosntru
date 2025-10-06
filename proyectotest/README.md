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

La configuración de la base de datos está en `config/database.php`:

```php
Host: sql10.freesqldatabase.com
Database: sql10801643
User: sql10801643
Password: E78UeVmJ2g
Port: 3306
```

## Instalación

1. **Descargar el proyecto**
   ```bash
   cd /home/desci/Documentos/constru/proyectotest
   ```

2. **Configurar servidor web**
   - Configurar Apache/Nginx para que apunte a la carpeta `public/`
   - O usar el servidor de desarrollo de PHP:
   ```bash
   cd public
   php -S localhost:8000
   ```

3. **Crear tabla de usuarios**
   La tabla se crea automáticamente al acceder por primera vez al sistema.

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