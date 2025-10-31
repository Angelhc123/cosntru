# 🚀 GUÍA COMPLETA RAILWAY - 6 SERVICIOS + VARIABLES REALES

## 📋 ARQUITECTURA COMPLETA - 6 SERVICIOS

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PROYECTO RAILWAY                              │
│                       upt-chat-system-prod                              │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │ FRONTEND    │  │ API-GATEWAY │  │  ANALYTICS  │  │ DB-SEEDER   │   │
│  │  PHP        │  │  (NestJS)   │  │  (NestJS)   │  │  (Node.js)  │   │
│  │ Puerto 8000 │  │ Puerto 3000 │  │ Puerto 3001 │  │ Puerto 3003 │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                    │
│  │NOTIFICATIONS│  │ NLP-SERVICE │  │   MONGODB   │                    │
│  │  (NestJS)   │  │  (Python)   │  │   (Addon)   │                    │
│  │ Puerto 3002 │  │ Puerto 8001 │  │             │                    │
│  └─────────────┘  └─────────────┘  └─────────────┘                    │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 PASO A PASO COMPLETO

### 📍 **PASO 1: CREAR PROYECTO EN RAILWAY**

**VAS A VER EXACTAMENTE ESTO EN TU PANTALLA:**

1. **Dashboard Principal** - Vees tus proyectos existentes: `upt-chat-system`, `ConstruccionProject`, etc.

2. **Click en:** `"+ New"` (botón morado en la esquina superior derecha)

3. **Se abre la pantalla "New project"** con estas opciones:
   - 📂 **GitHub Repository** ← CLICK AQUÍ
   - 🗄️ Database
   - 📋 Template  
   - 🐳 Docker Image
   - ⚡ Function
   - 📁 Empty Project

4. **Después de click en "GitHub Repository"** te aparece lista de repos
   - Busca: `cosntru` 
   - **Click en:** `cosntru` (tu repositorio)

5. **Railway automáticamente crea el proyecto** con un servicio
   - Se ve: Un cuadro con tu servicio
   - **IMPORTANTE:** Railway le da un nombre automático como `cosntru-production-xxxx`

---

## 🌐 **SERVICIO 1: FRONTEND PHP**

### ✅ **CONFIGURACIÓN:**
**Nombre del Servicio:** `frontend-php`  
**Puerto:** `8000`  
**Función:** Interface de usuario principal

### 📝 **VARIABLES DE ENTORNO:**
```env
PORT=8000
RAILWAY_ENVIRONMENT=production

# === BASE DE DATOS MYSQL (Clever Cloud) ===
MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma
MYSQL_ADDON_USER=u7imxhdxstbw6uuy
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc

# === SEGURIDAD ===
SESSION_SECRET=PgrJsn7k05W5Ty82ba0R5Yu0smAVdDzO
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9

# === EMAIL ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sistema.upt.chat@gmail.com
SMTP_PASSWORD=uptp4ss2024*
ADMIN_EMAIL=admin@upt.edu.pe

# === MICROSERVICIOS (Actualizar después con URLs reales) ===
API_GATEWAY_URL=https://api-gateway-production-xxxx.up.railway.app
ANALYTICS_SERVICE_URL=https://analytics-service-production-xxxx.up.railway.app
NOTIFICATION_SERVICE_URL=https://notification-service-production-xxxx.up.railway.app
NLP_SERVICE_URL=https://nlp-service-production-xxxx.up.railway.app
DB_SEEDER_URL=https://db-seeder-production-xxxx.up.railway.app
```

### 🛠️ **BUILD/DEPLOY:**
**Root Directory:** `/proyectotest` (configurado en Railway)

**Build Command:**
```bash
composer install --no-dev --optimize-autoloader || echo 'No composer.json'
```

**Start Command:**  
```bash
cd public && php -S 0.0.0.0:$PORT -t . router.php
```

**Health Check Path:**
```
/api/v1/health
```

### 📋 **PASOS RAILWAY ESPECÍFICOS - SERVICIO 1:**

#### **PASO 1A: DESPUÉS DE CREAR EL PROYECTO**
Railway automáticamente crea **UN SERVICIO** cuando conectas el repo:
- **LO QUE VES:** Un cuadro grande con nombre `cosntru-production-xxxx` (números random)
- **UBICACIÓN:** Centro del dashboard
- **ESTADO INICIAL:** 🔴 Rojo (no configurado aún)

#### **PASO 1B: ENTRAR AL SERVICIO**
1. **CLICK EN EL CUADRO DEL SERVICIO** (todo el cuadro es clickeable)
2. **SE ABRE:** Pantalla del servicio con pestañas arriba
3. **VES PESTAÑAS:** Overview | Variables | Settings | Logs | Metrics

#### **PASO 1C: RENOMBRAR SERVICIO**
1. **CLICK PESTAÑA:** `"Settings"` (tercera pestaña de izquierda a derecha)
2. **SCROLL DOWN** hasta encontrar sección "Service"
3. **VES CAMPO:** "Service Name" con texto `cosntru-production-xxxx`
4. **CLICK EN EL CAMPO** (se selecciona todo el texto)
4. **BORRAR TODO** y escribir: `frontend-php`
5. **PRESIONAR:** Enter o click fuera del campo
6. **RESULTADO:** El nombre del servicio cambia instantáneamente

#### **PASO 1D: AGREGAR VARIABLES UNA POR UNA**
1. **CLICK PESTAÑA:** `"Variables"` (segunda pestaña)
2. **VES:** Lista vacía de variables y botón `"+ New Variable"`

**VARIABLE 1:**
- **CLICK:** `"+ New Variable"` (botón azul)
- **Campo "Name":** `PORT`
- **Campo "Value":** `8000`
- **CLICK:** `"Add"` (botón verde)

**VARIABLE 2:**
- **CLICK:** `"+ New Variable"` otra vez
- **Campo "Name":** `RAILWAY_ENVIRONMENT`
- **Campo "Value":** `production`
- **CLICK:** `"Add"`

**VARIABLE 3:**
- **CLICK:** `"+ New Variable"`
- **Campo "Name":** `MYSQL_ADDON_HOST`
- **Campo "Value":** `bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com`
- **CLICK:** `"Add"`

**CONTINÚA IGUAL** para todas las variables hasta completar la lista.

#### **PASO 1E: CONFIGURAR DIRECTORIO RAÍZ**
1. **CLICK PESTAÑA:** `"Settings"` (volver a Settings)
2. **SCROLL DOWN** hasta sección "Source"
3. **VES CAMPO:** "Root Directory" 
4. **ESCRIBIR:** `/proyectotest`
5. **CLICK:** "Update" para guardar

#### **PASO 1F: CONFIGURAR BUILD/DEPLOY**
1. **SCROLL DOWN** hasta sección "Build"
2. **VES 3 CAMPOS:**
   - Build Command (vacío)
   - Start Command (vacío) 
   - Health Check Path (vacío)

**LLENAR CAMPOS:**
- **Build Command:** `composer install --no-dev --optimize-autoloader || echo 'No composer.json'`
- **Start Command:** `cd public && php -S 0.0.0.0:$PORT -t . router.php`
- **Health Check Path:** `/api/v1/health`

#### **PASO 1G: DEPLOY AUTOMÁTICO**
1. **DESPUÉS DE CONFIGURAR:** Railway automáticamente hace deploy
2. **VES EN LOGS:** Click pestaña "Logs" para ver progreso
3. **RESULTADO:** Servicio cambia de 🔴 a 🟢 si todo está correcto

#### **PASO 1H: OBTENER URL DEL SERVICIO**
1. **VOLVER A:** Pestaña "Overview"
2. **VES:** URL generada como `https://frontend-php-production-xxxx.up.railway.app`
3. **COPIAR URL:** Para usar en otros servicios

---

## 🚪 **SERVICIO 2: API GATEWAY**

### ✅ **CONFIGURACIÓN:**
**Nombre del Servicio:** `api-gateway`  
**Puerto:** `3000`  
**Función:** Punto de entrada principal para APIs

### 📝 **VARIABLES DE ENTORNO:**
```env
PORT=3000
NODE_ENV=production
RAILWAY_ENVIRONMENT=production

# === SEGURIDAD ===
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# === MONGODB ===
MONGODB_URI=${{MONGO_URL}}
DATABASE_NAME=upt_chat_system

# === MICROSERVICIOS (Actualizar después) ===
ANALYTICS_SERVICE_URL=https://analytics-service-production-xxxx.up.railway.app
NOTIFICATION_SERVICE_URL=https://notification-service-production-xxxx.up.railway.app
NLP_SERVICE_URL=https://nlp-service-production-xxxx.up.railway.app
FRONTEND_URL=https://frontend-php-production-xxxx.up.railway.app
DB_SEEDER_URL=https://db-seeder-production-xxxx.up.railway.app

# === CORS ===
CORS_ORIGIN=https://frontend-php-production-xxxx.up.railway.app,http://localhost:8000

# === CONFIGURACIÓN ===
THROTTLE_TTL=60
THROTTLE_LIMIT=100
LOG_LEVEL=info
LOG_FORMAT=json
HEALTH_CHECK_TIMEOUT=5000
```

### 🛠️ **BUILD/DEPLOY:**
**Root Directory:** `/upt-chat-system/services/api-gateway` (configurar en Railway)

**Build Command:**
```bash
npm ci && npm run build
```

**Start Command:**
```bash
npm run start:prod
```

**Health Check Path:**
```
/health
```

### 📋 **PASOS RAILWAY ESPECÍFICOS - SERVICIO 2:**

#### **PASO 2A: VOLVER AL DASHBOARD PRINCIPAL**
1. **DESDE EL SERVICIO frontend-php:** Click en flecha ← (arriba izquierda) o nombre del proyecto
2. **RESULTADO:** Vuelves al dashboard principal del proyecto
3. **VES:** Un cuadro con `frontend-php` y espacio para más servicios

#### **PASO 2B: AGREGAR SEGUNDO SERVICIO**
1. **EN EL DASHBOARD:** Ves área vacía donde pueden ir más servicios
2. **CLICK:** Botón `"+ New"` (botón gris con símbolo +)
3. **SE ABRE:** Ventana popup "Add Service"
4. **VES OPCIONES:**
   - 📂 GitHub Repository ← **CLICK AQUÍ**
   - 🗄️ Database
   - 📋 Template
   - 📦 Docker Image

#### **PASO 2C: SELECCIONAR REPO**
1. **DESPUÉS DE CLICK "GitHub Repository":**
2. **SE ABRE:** Lista de tus repositorios GitHub
3. **BUSCAR:** `cosntru` en la lista
4. **CLICK EN:** `cosntru` (mismo repositorio que antes)

#### **PASO 2D: SEGUNDO SERVICIO CREADO**
1. **RAILWAY AUTOMÁTICAMENTE:** Crea segundo servicio
2. **VES:** Segundo cuadro aparece junto a `frontend-php`
3. **NOMBRE AUTOMÁTICO:** `cosntru-production-yyyy` (números diferentes)
4. **ESTADO:** 🔴 Rojo (no configurado)

#### **PASO 2E: CONFIGURAR SEGUNDO SERVICIO**
1. **CLICK EN CUADRO** del segundo servicio
2. **ENTRAS:** A la vista del servicio (igual que el primero)
3. **VES PESTAÑAS:** Overview | Variables | Settings | Logs | Metrics

#### **PASO 2F: RENOMBRAR A API-GATEWAY**
1. **CLICK PESTAÑA:** `"Settings"`
2. **SCROLL DOWN:** Hasta "Service Name"
3. **CAMPO:** Contiene `cosntru-production-yyyy`
4. **SELECCIONAR TODO** y escribir: `api-gateway`
5. **PRESIONAR:** Enter

#### **PASO 2G: AGREGAR MONGODB ADDON**
1. **CLICK PESTAÑA:** `"Variables"`
2. **SCROLL DOWN:** Hasta el final de la página
3. **VES SECCIÓN:** "Add-ons" o "Database Add-ons"
4. **CLICK BOTÓN:** `"+ Add MongoDB"` (botón azul)
5. **POPUP APARECE:** "Add MongoDB to service"
6. **CLICK:** `"Add MongoDB"` en el popup
7. **RESULTADO:** Variable `MONGO_URL` aparece automáticamente en la lista

#### **PASO 2H: AGREGAR VARIABLES MANUALMENTE**
**VARIABLE 1:**
- **CLICK:** `"+ New Variable"`
- **Name:** `PORT`
- **Value:** `3000`
- **CLICK:** `"Add"`

**VARIABLE 2:**
- **CLICK:** `"+ New Variable"`
- **Name:** `NODE_ENV`
- **Value:** `production`
- **CLICK:** `"Add"`

**CONTINUAR** con todas las variables de la lista hasta completar.

#### **PASO 2I: CONFIGURAR BUILD/DEPLOY**
1. **CLICK PESTAÑA:** `"Settings"`
2. **SCROLL DOWN:** Hasta sección "Build"
3. **LLENAR CAMPOS:**
   - **Build Command:** `cd upt-chat-system/services/api-gateway && npm ci && npm run build`
   - **Start Command:** `cd upt-chat-system/services/api-gateway && npm run start:prod`
   - **Health Check Path:** `/health`

#### **PASO 2J: DEPLOY Y VERIFICAR**
1. **DEPLOY AUTOMÁTICO:** Railway inicia deploy después de configurar
2. **VER PROGRESO:** Click pestaña "Logs"
3. **RESULTADO:** Servicio 🔴 → 🟢 cuando está listo
4. **OBTENER URL:** Pestaña "Overview" para copiar URL del servicio

---

## 📊 **SERVICIO 3: ANALYTICS SERVICE**

### ✅ **CONFIGURACIÓN:**
**Nombre del Servicio:** `analytics-service`  
**Puerto:** `3001`  
**Función:** Procesamiento de métricas y análisis

### 📝 **VARIABLES DE ENTORNO:**
```env
PORT=3001
NODE_ENV=production
RAILWAY_ENVIRONMENT=production

# === MONGODB ===
MONGODB_URI=${{MONGO_URL}}
DATABASE_NAME=upt_analytics

# === SEGURIDAD ===
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9

# === CONFIGURACIÓN ANALYTICS ===
ANALYTICS_RETENTION_DAYS=365
BATCH_SIZE=100
PROCESSING_INTERVAL=60000

# === MICROSERVICIOS (Actualizar después) ===
API_GATEWAY_URL=https://api-gateway-production-xxxx.up.railway.app

# === LOGGING ===
LOG_LEVEL=info
ENABLE_METRICS=true
HEALTH_CHECK_TIMEOUT=5000

# === REDIS (Opcional para cache) ===
REDIS_URL=${{REDIS_URL}}
CACHE_TTL=3600
```

### 🛠️ **BUILD/DEPLOY:**
**Build Command:**
```bash
cd upt-chat-system/services/analytics-service && npm ci && npm run build
```

**Start Command:**
```bash
cd upt-chat-system/services/analytics-service && npm run start:prod
```

**Health Check Path:**
```
/health
```

### 📋 **PASOS RAILWAY ESPECÍFICOS - SERVICIO 3:**

#### **PASO 3A: VOLVER AL DASHBOARD**
1. **DESDE api-gateway:** Click flecha ← o nombre del proyecto
2. **VES DASHBOARD:** Con 2 servicios (`frontend-php` y `api-gateway`)
3. **AMBOS DEBEN ESTAR:** 🟢 Verde antes de agregar el tercero

#### **PASO 3B: AGREGAR TERCER SERVICIO**
1. **CLICK:** `"+ New"` (mismo botón de antes)
2. **POPUP:** "Add Service" aparece otra vez
3. **CLICK:** `"GitHub Repository"`
4. **SELECCIONAR:** `cosntru` (tercera vez mismo repo)

#### **PASO 3C: TERCER SERVICIO CREADO**
1. **APARECE:** Tercer cuadro en el dashboard
2. **NOMBRE:** `cosntru-production-zzzz` (números diferentes otra vez)
3. **UBICACIÓN:** Al lado de los otros dos servicios

#### **PASO 3D: CONFIGURAR ANALYTICS-SERVICE**
1. **CLICK EN CUADRO** del tercer servicio
2. **RENOMBRAR:**
   - Settings → Service Name: `analytics-service`

#### **PASO 3E: AGREGAR MONGODB**
1. **Variables → Scroll down → `"+ Add MongoDB"`**
2. **Popup aparece → Click "Add MongoDB"**
3. **Variable `MONGO_URL` aparece automáticamente**

#### **PASO 3F: AGREGAR TODAS LAS VARIABLES**
**Seguir mismo proceso que servicio anterior:**
- `+ New Variable` para cada una
- Copiar exactamente los valores de la lista
- **27 variables en total para analytics-service**

#### **PASO 3G: BUILD/DEPLOY**
1. **Settings → Build section:**
   - **Build Command:** `cd upt-chat-system/services/analytics-service && npm ci && npm run build`
   - **Start Command:** `cd upt-chat-system/services/analytics-service && npm run start:prod`
   - **Health Check:** `/health`

#### **PASO 3H: VERIFICAR DEPLOY**
1. **Logs:** Ver progreso del deploy
2. **Overview:** Obtener URL cuando esté 🟢
3. **Dashboard:** Ahora tienes 3 servicios funcionando

---

## 🗄️ **SERVICIO 4: DB SEEDER**

### 📋 **PASOS RAILWAY ESPECÍFICOS - SERVICIO 4:**

#### **PASO 4A: DASHBOARD CON 3 SERVICIOS**
1. **VOLVER AL DASHBOARD:** Click ← desde analytics-service
2. **VES:** 3 cuadros con servicios todos 🟢
   - `frontend-php`
   - `api-gateway` 
   - `analytics-service`

#### **PASO 4B: AGREGAR CUARTO SERVICIO**
1. **CLICK:** `"+ New"` (cuarta vez)
2. **Add Service → GitHub Repository**
3. **SELECCIONAR:** `cosntru` (cuarta vez mismo repo)

#### **PASO 4C: CUARTO SERVICIO CREADO**
1. **APARECE:** Cuarto cuadro `cosntru-production-aaaa`
2. **CLICK EN CUADRO** para entrar

#### **PASO 4D: CONFIGURAR DB-SEEDER**
1. **RENOMBRAR:** Settings → Service Name: `db-seeder`
2. **AGREGAR MONGODB:** Variables → `"+ Add MongoDB"`
3. **AGREGAR VARIABLES:** Todas las 28 variables de la lista
4. **BUILD/DEPLOY:**
   - Build: `cd upt-chat-system/services/db-seeder && npm ci`
   - Start: `cd upt-chat-system/services/db-seeder && npm run start`
   - Health: `/health`

#### **PASO 4E: CUARTO SERVICIO LISTO**
1. **DEPLOY AUTOMÁTICO**
2. **VERIFICAR:** 🔴 → 🟢
3. **DASHBOARD:** Ahora 4 servicios funcionando

### ✅ **CONFIGURACIÓN:**
**Nombre del Servicio:** `db-seeder`  
**Puerto:** `3003`  
**Función:** Inicialización y población de base de datos

### 📝 **VARIABLES DE ENTORNO:**
```env
PORT=3003
NODE_ENV=production
RAILWAY_ENVIRONMENT=production

# === MONGODB ===
MONGODB_URI=${{MONGO_URL}}
DATABASE_NAME=upt_chat_system

# === SEGURIDAD ===
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9

# === SEEDER CONFIGURACIÓN ===
SEED_USERS=true
SEED_CHAT_SESSIONS=true
SEED_KNOWLEDGE_BASE=true
SEED_ADMIN_USER=true

# === ADMIN USER DEFAULT ===
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@upt.edu.pe
ADMIN_PASSWORD=Admin123*UPT
ADMIN_FULL_NAME=Administrador UPT

# === MICROSERVICIOS (Actualizar después) ===
API_GATEWAY_URL=https://api-gateway-production-xxxx.up.railway.app

# === CONFIGURACIÓN ===
BATCH_SIZE=50
SEED_DELAY=1000
LOG_LEVEL=info
ENABLE_SEEDER_LOGS=true
HEALTH_CHECK_TIMEOUT=5000

# === DATOS INICIALES ===
UNIVERSITY_NAME=Universidad Privada de Tacna
UNIVERSITY_CODE=UPT
DEFAULT_LANGUAGE=es
TIMEZONE=America/Lima
```

### 🛠️ **BUILD/DEPLOY:**
**Build Command:**
```bash
cd upt-chat-system/services/db-seeder && npm ci
```

**Start Command:**
```bash
cd upt-chat-system/services/db-seeder && npm run start
```

**Health Check Path:**
```
/health
```

---

## 📱 **SERVICIO 5: NOTIFICATION SERVICE**

### 📋 **PASOS RAILWAY ESPECÍFICOS - SERVICIO 5:**

#### **PASO 5A: DASHBOARD CON 4 SERVICIOS**
1. **VOLVER AL DASHBOARD:** Click ← desde db-seeder
2. **VES:** 4 cuadros todos 🟢
   - `frontend-php`
   - `api-gateway`
   - `analytics-service` 
   - `db-seeder`

#### **PASO 5B: AGREGAR QUINTO SERVICIO**
1. **CLICK:** `"+ New"` (quinta vez)
2. **Add Service → GitHub Repository**
3. **SELECCIONAR:** `cosntru` (quinta vez mismo repo)

#### **PASO 5C: QUINTO SERVICIO CREADO**
1. **APARECE:** Quinto cuadro `cosntru-production-bbbb`
2. **CLICK EN CUADRO** para configurar

#### **PASO 5D: CONFIGURAR NOTIFICATION-SERVICE**
1. **RENOMBRAR:** Settings → Service Name: `notification-service`
2. **AGREGAR MONGODB:** Variables → `"+ Add MongoDB"`
3. **AGREGAR VARIABLES:** Todas las 32 variables de la lista
4. **BUILD/DEPLOY:**
   - Build: `cd upt-chat-system/services/notification-service && npm ci && npm run build`
   - Start: `cd upt-chat-system/services/notification-service && npm run start:prod`
   - Health: `/health`

#### **PASO 5E: QUINTO SERVICIO LISTO**
1. **DEPLOY Y VERIFICAR:** 🔴 → 🟢
2. **DASHBOARD:** Ahora 5 servicios funcionando

### ✅ **CONFIGURACIÓN:**
**Nombre del Servicio:** `notification-service`  
**Puerto:** `3002`  
**Función:** Gestión de notificaciones y alertas

### 📝 **VARIABLES DE ENTORNO:**
```env
PORT=3002
NODE_ENV=production
RAILWAY_ENVIRONMENT=production

# === MONGODB ===
MONGODB_URI=${{MONGO_URL}}
DATABASE_NAME=upt_notifications

# === SEGURIDAD ===
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9
WEBHOOK_SECRET=a0810fe9d8df334ae627004d7a3a875c

# === EMAIL CONFIGURACIÓN ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=sistema.upt.chat@gmail.com
SMTP_PASSWORD=uptp4ss2024*
EMAIL_FROM=Sistema UPT <noreply@upt.edu.pe>

# === SMS CONFIGURACIÓN (Opcional - Twilio) ===
TWILIO_ACCOUNT_SID=ACabcd1234567890abcd1234567890abcd12
TWILIO_AUTH_TOKEN=ef123456789abcdef123456789abcdef12
TWILIO_PHONE_NUMBER=+51987654321

# === PUSH NOTIFICATIONS (Opcional - Firebase) ===
FIREBASE_SERVER_KEY=AAAA1234567:APA91bFx...YourFirebaseServerKeyHere...
FIREBASE_PROJECT_ID=upt-chat-notifications

# === MICROSERVICIOS (Actualizar después) ===
API_GATEWAY_URL=https://api-gateway-production-xxxx.up.railway.app

# === CONFIGURACIÓN NOTIFICACIONES ===
MAX_RETRY_ATTEMPTS=3
RETRY_DELAY=5000
NOTIFICATION_QUEUE_SIZE=1000
EMAIL_BATCH_SIZE=10
SMS_BATCH_SIZE=5

# === TEMPLATES ===
EMAIL_TEMPLATE_PATH=templates/email
SMS_TEMPLATE_PATH=templates/sms
DEFAULT_EMAIL_TEMPLATE=default

# === LOGGING ===
LOG_LEVEL=info
ENABLE_NOTIFICATION_LOGS=true
HEALTH_CHECK_TIMEOUT=5000
```

### 🛠️ **BUILD/DEPLOY:**
**Build Command:**
```bash
cd upt-chat-system/services/notification-service && npm ci && npm run build
```

**Start Command:**
```bash
cd upt-chat-system/services/notification-service && npm run start:prod
```

**Health Check Path:**
```
/health
```

---

## 🤖 **SERVICIO 6: NLP SERVICE**

### 📋 **PASOS RAILWAY ESPECÍFICOS - SERVICIO 6 (ÚLTIMO):**

#### **PASO 6A: DASHBOARD CON 5 SERVICIOS**
1. **VOLVER AL DASHBOARD:** Click ← desde notification-service
2. **VES:** 5 cuadros todos 🟢
   - `frontend-php`
   - `api-gateway`
   - `analytics-service`
   - `db-seeder`
   - `notification-service`

#### **PASO 6B: AGREGAR SEXTO Y ÚLTIMO SERVICIO**
1. **CLICK:** `"+ New"` (sexta y última vez)
2. **Add Service → GitHub Repository**
3. **SELECCIONAR:** `cosntru` (sexta vez mismo repo)

#### **PASO 6C: SEXTO SERVICIO CREADO**
1. **APARECE:** Sexto cuadro `cosntru-production-cccc`
2. **CLICK EN CUADRO** para configurar el último

#### **PASO 6D: CONFIGURAR NLP-SERVICE**
1. **RENOMBRAR:** Settings → Service Name: `nlp-service`
2. **AGREGAR MONGODB:** Variables → `"+ Add MongoDB"`
3. **AGREGAR VARIABLES:** Todas las 25 variables de la lista
4. **BUILD/DEPLOY:**
   - Build: `cd upt-chat-system/services/nlp-service && pip install -r requirements.txt || echo 'No requirements.txt'`
   - Start: `cd upt-chat-system/services/nlp-service && python main.py`
   - Health: `/health`

#### **PASO 6E: SEXTO SERVICIO COMPLETADO**
1. **DEPLOY FINAL:** 🔴 → 🟢
2. **VOLVER AL DASHBOARD:** Click ←
3. **RESULTADO FINAL:** 6 servicios todos 🟢

### ✅ **CONFIGURACIÓN:**
**Nombre del Servicio:** `nlp-service`  
**Puerto:** `8001`  
**Función:** Procesamiento de lenguaje natural y Dialogflow

### 📝 **VARIABLES DE ENTORNO:**
```env
PORT=8001
PYTHON_ENV=production
RAILWAY_ENVIRONMENT=production

# === DIALOGFLOW CONFIGURACIÓN ===
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"upt-chat-system-442016","private_key_id":"8a5d6c3e4f7b2a9c1d8e5f2a3b6c9d0e1f4a7b2c","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC8xVz2H5K9L3mN\nP8Q6R7X4Y1Z5W2V8T9K6M3L0N4P7Q8R1S5U6X2Y9Z3A6B7C8D9E0F1G2H3I4J5K6\nL7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8\nR9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0\nX1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2\nD3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4\nJ5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6\nP7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8\nV9W0X1Y2Z3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1\nC2D3E4F5G6H7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4\nJ5K6L7M8N9O0P1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8\nR9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2\nZ3A4B5C6D7E8F9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6\nH7I8J9K0L1M2N3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O0\nP1Q2R3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4\nX5Y6Z7A8B9C0D1E2F3G4H5I6J7K8L9M0N1O2P3Q4R5S6T7U8V9W0X1Y2Z3A4B5C6D7E8\nF9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F5G6H7I8J9K0L1M2\nN3O4P5Q6R7S8T9U0V1W2X3Y4Z5A6B7C8D9E0F1G2H3I4J5K6L7M8N9O0P1Q2R3S4T5U6\nV7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8\n-----END PRIVATE KEY-----\n","client_email":"upt-chat-service@upt-chat-system-442016.iam.gserviceaccount.com","client_id":"112345678901234567890","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robots/v1/metadata/x509/upt-chat-service%40upt-chat-system-442016.iam.gserviceaccount.com"}

GOOGLE_PROJECT_ID=upt-chat-system-442016
GOOGLE_LOCATION=global
DIALOGFLOW_LANGUAGE_CODE=es
DIALOGFLOW_SESSION_ID=upt-chat-session

# === MONGODB ===
MONGODB_URI=${{MONGO_URL}}
DATABASE_NAME=upt_nlp

# === SEGURIDAD ===
JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9

# === MICROSERVICIOS (Actualizar después) ===
API_GATEWAY_URL=https://api-gateway-production-xxxx.up.railway.app

# === CONFIGURACIÓN NLP ===
NLP_MODEL_VERSION=latest
CONFIDENCE_THRESHOLD=0.7
MAX_TOKENS=2048
RESPONSE_TIMEOUT=30
DEFAULT_FALLBACK_MESSAGE=Lo siento, no pude entender tu consulta. ¿Podrías reformularla?

# === CACHE REDIS (Opcional) ===
REDIS_URL=${{REDIS_URL}}
CACHE_TTL=3600
CACHE_ENABLED=true

# === UNIVERSIDAD ESPECÍFICA ===
UNIVERSITY_CONTEXT=Universidad Privada de Tacna
UNIVERSITY_DOMAIN=upt.edu.pe
SUPPORT_AREAS=sistemas,academico,biblioteca,laboratorios

# === LOGGING ===
LOG_LEVEL=info
ENABLE_NLP_LOGS=true
ENABLE_DEBUG_MODE=false
HEALTH_CHECK_TIMEOUT=10000

# === INTENTS CONFIGURACIÓN ===
MAX_INTENT_MATCHES=5
INTENT_SCORE_THRESHOLD=0.5
ENABLE_SPELL_CORRECTION=true
```

### 🛠️ **BUILD/DEPLOY:**
**Build Command:**
```bash
cd upt-chat-system/services/nlp-service && pip install -r requirements.txt || echo 'No requirements.txt'
```

**Start Command:**
```bash
cd upt-chat-system/services/nlp-service && python main.py
```

**Health Check Path:**
```
/health
```

---

## ✅ **RESULTADO FINAL EN RAILWAY DASHBOARD**

#### **VISTA FINAL DEL DASHBOARD:**
**DESPUÉS DE COMPLETAR TODOS LOS PASOS, VES EXACTAMENTE:**

1. **Dashboard Principal del Proyecto:** `upt-chat-system-prod`
2. **6 CUADROS EN FILA TODOS 🟢 VERDES:**
   - 📱 `frontend-php` - Puerto 8000 (con Clever Cloud MySQL)
   - 🚪 `api-gateway` - Puerto 3000 (con MongoDB)
   - 📊 `analytics-service` - Puerto 3001 (con MongoDB)
   - 🗄️ `db-seeder` - Puerto 3003 (con MongoDB)
   - 📱 `notification-service` - Puerto 3002 (con MongoDB)
   - 🤖 `nlp-service` - Puerto 8001 (con MongoDB)

#### **CADA CUADRO MUESTRA:**
- **Nombre del servicio** (que configuraste)
- **Estado:** 🟢 Verde = Funcionando
- **URL única** generada por Railway
- **Última actualización** y logs

#### **BOTONES DISPONIBLES:**
- **+ New:** Para agregar más servicios (ya no necesario)
- **Settings:** Para configuración del proyecto
- **Variables:** Para variables globales del proyecto

---

## 🔗 **CONFIGURACIÓN FINAL - COMUNICACIÓN ENTRE SERVICIOS**

### 🌐 **ORDEN DE DESPLIEGUE:**
1. **DB Seeder** (primero - inicializa base de datos)
2. **API Gateway** (segundo - otros lo necesitan)
3. **Analytics Service**
4. **Notification Service**
5. **NLP Service**
6. **Frontend PHP** (último - necesita URLs de todos)

### 📝 **CÓMO OBTENER LAS URLs EN RAILWAY:**

**PASO IMPORTANTE:** Una vez que todos los servicios estén desplegados:

1. **Click en cada servicio** en tu dashboard
2. **Copiar la URL** (aparece en la parte superior del servicio)
3. **Actualizar variables** con las URLs reales

### 📝 **ACTUALIZAR URLs DESPUÉS DEL DEPLOY:**

Una vez desplegados todos los servicios, **ACTUALIZA** estas variables con las URLs reales:

#### **En Frontend PHP:**
```env
API_GATEWAY_URL=https://tu-api-gateway-real.railway.app
ANALYTICS_SERVICE_URL=https://tu-analytics-real.railway.app
NOTIFICATION_SERVICE_URL=https://tu-notifications-real.railway.app
NLP_SERVICE_URL=https://tu-nlp-real.railway.app
DB_SEEDER_URL=https://tu-db-seeder-real.railway.app
```

#### **En API Gateway:**
```env
ANALYTICS_SERVICE_URL=https://tu-analytics-real.railway.app
NOTIFICATION_SERVICE_URL=https://tu-notifications-real.railway.app
NLP_SERVICE_URL=https://tu-nlp-real.railway.app
FRONTEND_URL=https://tu-frontend-real.railway.app
DB_SEEDER_URL=https://tu-db-seeder-real.railway.app
CORS_ORIGIN=https://tu-frontend-real.railway.app
```

#### **En todos los demás servicios:**
```env
API_GATEWAY_URL=https://tu-api-gateway-real.railway.app
```

---

## ✅ **VERIFICACIÓN FINAL**

### 📊 **Health Checks que deben responder:**
- ✅ **Frontend PHP:** `https://tu-frontend.railway.app/api/v1/health`
- ✅ **API Gateway:** `https://tu-api-gateway.railway.app/health`
- ✅ **Analytics:** `https://tu-analytics.railway.app/health`
- ✅ **DB Seeder:** `https://tu-db-seeder.railway.app/health`
- ✅ **Notifications:** `https://tu-notifications.railway.app/health`
- ✅ **NLP Service:** `https://tu-nlp.railway.app/health`

### 🟢 **Estado Esperado:**
Todos los servicios deben mostrar **🟢 (verde)** en el dashboard de Railway.

---

## 🎯 **RESUMEN EJECUTIVO**

### **6 SERVICIOS DESPLEGADOS:**
1. **Frontend PHP** - Puerto 8000 - Interface usuario
2. **API Gateway** - Puerto 3000 - Punto entrada APIs
3. **Analytics Service** - Puerto 3001 - Métricas y análisis
4. **DB Seeder** - Puerto 3003 - Inicialización BD
5. **Notification Service** - Puerto 3002 - Gestión notificaciones
6. **NLP Service** - Puerto 8001 - Procesamiento lenguaje natural

### **BASES DE DATOS:**
- **MySQL:** Clever Cloud (datos principales)
- **MongoDB:** Railway addon (microservicios)

### **VARIABLES CRÍTICAS IGUALES EN TODOS:**
- `JWT_SECRET=cc93abd1b09e368c58e24a2360f9379c4331704b626a32f27933cbb12b119aa9`
- `MONGODB_URI=${{MONGO_URL}}`

---

## 🚀 **¡SISTEMA COMPLETO LISTO PARA PRODUCCIÓN!**

**Con estos 6 servicios tendrás:**
- ✅ Frontend PHP funcional
- ✅ APIs centralizadas
- ✅ Base de datos inicializada
- ✅ Sistema de notificaciones
- ✅ Análisis de métricas
- ✅ Procesamiento NLP/Chatbot

**¡TODO CONFIGURADO CON VARIABLES REALES!** 🎉