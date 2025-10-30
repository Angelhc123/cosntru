# 🚀 Guía de Migración - UPT Chat System

## 📁 Estructura del Proyecto

```
constru/
├── proyectotest/                    # Frontend PHP
├── upt-chat-system/                 # Backend Microservicios
│   └── services/
│       ├── api-gateway/             # Puerto 3000
│       ├── nlp-service/             # Puerto 8001
│       ├── notification-service/    # Puerto 3005
│       └── analytics-service/       # Puerto 3006
├── start_all.sh                     # Script de inicio
├── stop_all.sh                      # Script de parada
└── status.sh                        # Verificar estado
```

## 🔑 Variables de Entorno

### 1. Frontend PHP - `/proyectotest/.env`
```env
# Base de datos MySQL - Clever Cloud (REALES)
MYSQL_ADDON_HOST=bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com
MYSQL_ADDON_DB=bj7lnbakskgcgngpmtma
MYSQL_ADDON_USER=u7imxhdxstbw6uuy
MYSQL_ADDON_PORT=3306
MYSQL_ADDON_PASSWORD=uaBOXOPi5TD9PEpIy8Uc
MYSQL_ADDON_URI=mysql://u7imxhdxstbw6uuy:uaBOXOPi5TD9PEpIy8Uc@bj7lnbakskgcgngpmtma-mysql.services.clever-cloud.com:3306/bj7lnbakskgcgngpmtma

# Configuración de la aplicación
APP_ENV=production
APP_DEBUG=false
```

### 2. API Gateway - `/upt-chat-system/services/api-gateway/.env`
```env
# Puerto del servicio
PORT=3000

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/upt_chat_system

# URLs de microservicios
NLP_SERVICE_URL=http://localhost:8001
NOTIFICATION_SERVICE_URL=http://localhost:3005
ANALYTICS_SERVICE_URL=http://localhost:3006

# Configuración de CORS
CORS_ORIGIN=*

# JWT Secret
JWT_SECRET=upt-chat-system-jwt-secret-2024-super-secure-key

# Node Environment
NODE_ENV=production
```

### 3. NLP Service - `/upt-chat-system/services/nlp-service/.env`
```env
# Puerto del servicio
PORT=8001

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/upt_chat_system

# Configuración de FastAPI
ENVIRONMENT=production
DEBUG=False

# Configuración de CORS
CORS_ORIGINS=["*"]

# Configuración del modelo NLP
MODEL_CONFIDENCE_THRESHOLD=0.7
MAX_TOKENS=512

# Dialogflow Configuration (REALES)
DIALOGFLOW_PROJECT_ID=upt-chat-fhps
DIALOGFLOW_CREDENTIALS_PATH=./credentials/dialogflow-credentials.json
DIALOGFLOW_LANGUAGE_CODE=es-ES
```

### 4. Notification Service - `/upt-chat-system/services/notification-service/.env`
```env
# Puerto del servicio
PORT=3005

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/upt_chat_system

# Configuración de email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_app_password

# Node Environment
NODE_ENV=development
```

### 5. Analytics Service - `/upt-chat-system/services/analytics-service/.env`
```env
# Puerto del servicio
PORT=3006

# Base de datos MongoDB
MONGODB_URI=mongodb://localhost:27017/upt_chat_system

# Node Environment
NODE_ENV=development
```

## 🗄️ Base de Datos MySQL - Estructura

### Archivo: `/proyectotest/database_setup.sql`
```sql
-- Crear base de datos
CREATE DATABASE IF NOT EXISTS upt_chat_system;
USE upt_chat_system;

-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertar usuario admin por defecto
INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@upt.edu.pe', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Contraseña: password

-- Tabla de FAQs
CREATE TABLE faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    usage_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- FAQs de ejemplo
INSERT INTO faqs (question, answer, category) VALUES
('¿Cuáles son los requisitos de matrícula?', 'Los requisitos de matrícula incluyen: certificado de estudios, DNI, recibo de pago...', 'matricula'),
('¿Cuál es el horario de atención?', 'El horario de atención es de lunes a viernes de 8:00 AM a 6:00 PM', 'horarios'),
('¿Cómo puedo consultar mis notas?', 'Puedes consultar tus notas en el portal estudiantil con tu usuario y contraseña', 'academico');
```

## 🤖 Configuración Dialogflow

### Archivo de Credenciales Dialogflow (REAL)
**Ubicación:** `/upt-chat-system/services/nlp-service/credentials/dialogflow-credentials.json`

```json
{
  "type": "service_account",
  "project_id": "upt-chat-fhps",
  "private_key_id": "112fa0e6fc0ca74f4ab9754a3d0f7a2e94229445",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDH8qOZStlIAEPX\n/DDSm4O/OWra4U9ovgeUmTaXyDzyABD+EdZaF0arI+lzvTlfsREVUUG4Hmq90j5j\nP0j05tx/+dPDpiSW+dr9vqaVvUiWSaeKaTXptBhdKSfAOexCCF+Danv9ZEXFDWhM\nbvAunLL1mO/8wHHR6Oh4eQjqEQCsNY648RCYGQE/i7UG96cBINMa+NtjrTvcMq0f\nCLZGdJzLwRuw8oqYUN7ZbsE3uFsbmDkjlv3WwURPCXBIu9Ev5DDcnTtjCoJBT1f/\nCiwBY8nkgEs2pVyaNfZTqYjs/8kkSKHbiZ08H8vvTUAlVpxjBGZgO6sBLKzpWnu7\n00sExsr5AgMBAAECggEAB7egQ97lMwe7lp8HvWE+PQe4zZjrqTXIch5Vwpb6bza8\ncSn8FX8XfayFqq9vgveBGssHl9UotoniWY9MQBOXCCN63m7Ps7oSD0AoCtiC8DYI\njumPqKUIWbQoch1qNoQ/N4HJJlcT8E6bq3OOtqXarGsKPD2rRvhP3LKDOxGL7pmT\nGeh/AH/o015XujReVNqI9mv2y2/FEQylg9ov9RTVInJ4Tio47yZVZYO6XuxwIv9x\ndS0mF6oqmw8+DAeNSQPdVmMU1PtBN/xD9p/aJCqB28aQNAZ6tUCE/kjU6Ce1Oyp4\naFN8OpLiZsziJATF9UzDawZaEoFaQbh76FExqahd2QKBgQDvgVPa46OLalN0vG0n\nHgm1un9ba7IT0o8mVQ33CqDjNRyYbpdNTLDA0mh/GHMeQR+Qmfsmfcqv0SGke6O7\nS/OiOt7xNSqIU9mAZHddJue+GRI3yC54kHl4MntEc8FsXUQQWySyCJT0TLVGtJ7q\n8Zqgl022LKyABFo0/Ktkdbl/NQKBgQDVt+HwBnHIsTlazWPvv2DPp7scI6UUn9tv\nqeBz6M8ZJiRPYKorfwLJyfwZRTD9jkFamNRWYS9uKZ3NzDlMvLUQJlTCtXtbhChF\n7eJuGVF8j1JZAGJ5ZPNFUolIXxH+xSAJziGPjbSKpkJCUYEYT7BxWaBfUCGScnZe\n2pKF3ydBNQKBgHezGSfCsZAR+dfT/HGab5vls5ULRBroFyc/RxV6uGIVv07nprK5\na3VTM2qh25b5UT9B1eWs5MnuKXQ9Xt1S3lbsOVQwECvGTGQA0i86LIQzn4lFgQQ8\noJjUEgtqFveDvWq3QqW/6EIYvFi0GOCvE2rDc9FijmwEwNjOlxJETAspAoGAZ75E\nQeSO9VH6Ona7TVUEJKkSLf2rk9Bpj9HRr9JSPa4DMDkHQef8rYGMC6RHvL2CQf0w\nDeJNSNeQz6aUJgjwh69js8Su5eTIO/HW2YUWxjU4TxXdt3nmkT8YfvYPYTHFdJ0I\nM4whGLDONy0jUm7UgqF0NPBL66/+f9rwB2YkwwUCgYAtoixy+mOwIWdJ0MVOgNsG\nGNI8Ck7ZfMdxCDxeivBcGhmVoF/it/gtulwTxgw7bVAbkKZbck0Tc77anWD8e+t/\nGyUyhc7FrBPMwIlfOcOnXnAmI5wuVlBroS3WjMKWh4t68eMS77gO3DnyXJ1FcdPM\nB0fTyUh45kRIG39RnoG7Jg==\n-----END PRIVATE KEY-----\n",
  "client_email": "dialogflow-client@upt-chat-fhps.iam.gserviceaccount.com",
  "client_id": "106936197559669141182",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dialogflow-client%40upt-chat-fhps.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

### Script ngrok para Webhook
**Ubicación:** `/get_ngrok_url.sh`
```bash
#!/bin/bash
# Script para obtener la URL de ngrok
echo "🔍 Obteniendo URL de ngrok..."
sleep 2

# Obtener la URL HTTPS de ngrok
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | jq -r '.tunnels[0].public_url' 2>/dev/null)

if [ -z "$NGROK_URL" ] || [ "$NGROK_URL" = "null" ]; then
    echo "❌ No se pudo obtener la URL de ngrok"
    echo "Verifica que ngrok esté corriendo: ps aux | grep ngrok"
    echo "Si no está corriendo, inícialo con: ngrok http 8001"
else
    echo "✅ URL de ngrok obtenida:"
    echo ""
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║  🔐 URL WEBHOOK PARA DIALOGFLOW:                      ║"
    echo "╠════════════════════════════════════════════════════════╣"
    echo "║  $NGROK_URL/webhook                                    ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "🔗 Copia esta URL al Fulfillment de Dialogflow"
fi
```

### Configuración Dialogflow en NLP Service
**Archivo:** `/upt-chat-system/services/nlp-service/app/config/dialogflow_config.py`
```python
import os
from google.cloud import dialogflow

# Configuración del proyecto
PROJECT_ID = "tu-project-id"
SESSION_ID = "default-session"
LANGUAGE_CODE = "es-ES"

# Ruta a las credenciales
CREDENTIALS_PATH = os.path.join(
    os.path.dirname(__file__), 
    "..", "..", "credentials", "dialogflow-credentials.json"
)

# Cliente de Dialogflow
def get_dialogflow_client():
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = CREDENTIALS_PATH
    return dialogflow.SessionsClient()
```

## 📦 Archivos package.json

### API Gateway - `/upt-chat-system/services/api-gateway/package.json`
```json
{
  "name": "api-gateway",
  "version": "1.0.0",
  "description": "API Gateway for UPT Chat System",
  "main": "dist/main.js",
  "scripts": {
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "build": "nest build",
    "test": "jest"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/mongoose": "^10.0.1",
    "@nestjs/jwt": "^10.1.1",
    "@nestjs/passport": "^10.0.1",
    "mongoose": "^7.5.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.1",
    "bcryptjs": "^2.4.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/node": "^20.3.1",
    "typescript": "^5.1.3"
  }
}
```

### NLP Service - `/upt-chat-system/services/nlp-service/requirements.txt`
```txt
fastapi==0.104.1
uvicorn==0.24.0
pymongo==4.6.0
google-cloud-dialogflow==2.23.0
python-dotenv==1.0.0
pydantic==2.5.0
httpx==0.25.2
```

### Analytics Service - `/upt-chat-system/services/analytics-service/package.json`
```json
{
  "name": "analytics-service",
  "version": "1.0.0",
  "description": "Analytics Service for UPT Chat System",
  "main": "dist/main.js",
  "scripts": {
    "start": "node dist/main.js",
    "start:dev": "nest start --watch",
    "build": "nest build"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/mongoose": "^10.0.1",
    "mongoose": "^7.5.0",
    "exceljs": "^4.3.0",
    "pdfkit": "^0.13.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "typescript": "^5.1.3"
  }
}
```

## 🌐 Configuración PHP

### Archivo: `/proyectotest/config/database.php`
```php
<?php
$host = $_ENV['MYSQL_ADDON_HOST'] ?? 'localhost';
$port = $_ENV['MYSQL_ADDON_PORT'] ?? 3306;
$dbname = $_ENV['MYSQL_ADDON_DB'] ?? 'upt_chat_system';
$username = $_ENV['MYSQL_ADDON_USER'] ?? 'root';
$password = $_ENV['MYSQL_ADDON_PASSWORD'] ?? '';

try {
    $pdo = new PDO(
        "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>
```

## 🚀 Scripts de Despliegue

### Script de Inicio - `/start_all.sh`
```bash
#!/bin/bash
# Ver contenido completo del archivo actual
```

### Script de Parada - `/stop_all.sh`
```bash
#!/bin/bash
# Ver contenido completo del archivo actual
```

## 🔧 Pasos de Instalación en Nueva Computadora

### 1. Requisitos del Sistema
```bash
# Node.js v18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python 3.9+
sudo apt install python3 python3-pip

# MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org

# PHP 8.1+
sudo apt install php8.1 php8.1-mysql php8.1-mbstring php8.1-curl

# jq (para scripts de ngrok)
sudo apt install jq

# Ngrok (descargar desde https://ngrok.com/download)
# O usar snap: sudo snap install ngrok
```

### 2. Clonar y Configurar
```bash
# 1. Clonar repositorio
git clone https://github.com/Angelhc123/cosntru.git
cd cosntru

# 2. Crear archivo .env principal
cp proyectotest/.env.example proyectotest/.env
# Editar con los valores reales de MySQL mostrados arriba

# 3. Instalar dependencias Backend
cd upt-chat-system/services/api-gateway && npm install && npm run build
cd ../analytics-service && npm install && npm run build
cd ../notification-service && npm install && npm run build
cd ../nlp-service && pip install -r requirements.txt

# 4. Configurar MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# 5. CRÍTICO: Agregar credenciales de Dialogflow
mkdir -p upt-chat-system/services/nlp-service/credentials
# Crear archivo: dialogflow-credentials.json con el contenido real

# 6. Dar permisos de ejecución
chmod +x *.sh

# 7. Configurar ngrok (si no tienes cuenta, crear en ngrok.com)
ngrok config add-authtoken TU_TOKEN_DE_NGROK

# 8. Iniciar sistema completo
./start_all.sh
```

### 3. Verificar Instalación
```bash
# Verificar servicios
./status.sh

# URLs a probar:
# Frontend: http://localhost:8000
# API Gateway: http://localhost:3000/api/v1/health
# NLP Service: http://localhost:8001/health
# Analytics: http://localhost:3006/api/v1/analytics/health
```

## 🔐 Credenciales por Defecto

- **Admin Panel:** admin / password
- **MySQL Root:** root / (configurar password)
- **MongoDB:** Sin autenticación por defecto

## 📋 Lista de Verificación

- [ ] Archivos .env creados y configurados
- [ ] Credenciales de Dialogflow agregadas
- [ ] Base de datos MySQL configurada
- [ ] MongoDB instalado y corriendo
- [ ] Dependencias instaladas (npm install, pip install)
- [ ] Permisos de ejecución en scripts
- [ ] Puertos disponibles (3000, 3005, 3006, 8000, 8001)
- [ ] Sistema iniciado con ./start_all.sh
- [ ] URLs respondiendo correctamente

---

**🚨 IMPORTANTE:** 
- Cambiar todas las contraseñas por defecto
- Generar nuevo JWT_SECRET 
- Configurar credenciales reales de Dialogflow
- Revisar configuración de CORS para producción