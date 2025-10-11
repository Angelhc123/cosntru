# 🤖 GUÍA COMPLETA DE DIALOGFLOW PARA UPT CHAT SYSTEM

## 📋 ÍNDICE
1. [¿Qué es DialogFlow?](#qué-es-dialogflow)
2. [Configuración Inicial](#configuración-inicial)
3. [Integración con el Proyecto](#integración-con-el-proyecto)
4. [Uso Híbrido](#uso-híbrido)
5. [Testing y Validación](#testing-y-validación)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 ¿QUÉ ES DIALOGFLOW?

**DialogFlow** es la plataforma de Google para crear interfaces conversacionales usando machine learning. Ofrece:

### ✅ **Ventajas:**
- **NLP Avanzado**: Mejor comprensión de intenciones
- **Multi-idioma**: Soporte nativo para español
- **ML Automático**: Aprende de las conversaciones
- **Escalabilidad**: Maneja miles de consultas simultáneas
- **Integración**: APIs bien documentadas

### ❌ **Desventajas:**
- **Costo**: Después de cierto límite de uso
- **Dependencia**: Requiere conexión a internet
- **Complejidad**: Configuración inicial más compleja

---

## 🛠️ CONFIGURACIÓN INICIAL

### **PASO 1: Crear Proyecto Google Cloud**

```bash
# 1. Instalar Google Cloud CLI
# Descarga desde: https://cloud.google.com/sdk/docs/install

# 2. Autenticarse
gcloud auth login

# 3. Crear proyecto
gcloud projects create upt-chat-system-nlp \
    --name="UPT Chat System NLP"

# 4. Configurar proyecto activo
gcloud config set project upt-chat-system-nlp

# 5. Habilitar APIs
gcloud services enable dialogflow.googleapis.com
```

### **PASO 2: Crear Service Account**

```bash
# 1. Crear service account
gcloud iam service-accounts create dialogflow-service \
    --display-name="DialogFlow Service Account"

# 2. Asignar permisos
gcloud projects add-iam-policy-binding upt-chat-system-nlp \
    --member="serviceAccount:dialogflow-service@upt-chat-system-nlp.iam.gserviceaccount.com" \
    --role="roles/dialogflow.admin"

# 3. Crear clave JSON
gcloud iam service-accounts keys create ./credentials/dialogflow-credentials.json \
    --iam-account=dialogflow-service@upt-chat-system-nlp.iam.gserviceaccount.com
```

### **PASO 3: Configurar DialogFlow Console**

1. Ve a [DialogFlow Console](https://dialogflow.cloud.google.com/)
2. Selecciona tu proyecto `upt-chat-system-nlp`
3. Crea un nuevo agente
4. Configura idioma: **Español - es**
5. Zona horaria: **Lima (GMT-5)**

---

## 🔧 INTEGRACIÓN CON EL PROYECTO

### **PASO 1: Instalar Dependencias**

```bash
cd services/nlp-service

# Instalar dependencias
pip install -r requirements.txt

# Instalar modelo spaCy
python -m spacy download es_core_news_sm

# Ejecutar script de instalación
bash install-dialogflow.sh
```

### **PASO 2: Configurar Variables de Entorno**

```bash
# Copiar y editar .env
cp .env.example .env
```

Editar `.env`:
```bash
# DialogFlow Configuration
USE_DIALOGFLOW=True
GOOGLE_PROJECT_ID=upt-chat-system-nlp
GOOGLE_CREDENTIALS_PATH=credentials/dialogflow-credentials.json
DIALOGFLOW_LANGUAGE_CODE=es
DIALOGFLOW_CONFIDENCE_THRESHOLD=0.7
```

### **PASO 3: Colocar Credenciales**

```bash
# Copiar tu archivo de credenciales
cp /path/to/your/credentials.json credentials/dialogflow-credentials.json
```

### **PASO 4: Crear Intents en DialogFlow**

Puedes crear intents desde código o desde la consola:

#### **Desde Código (API):**
```python
# POST /api/v1/dialogflow/intents
{
    "intent_name": "matricula.consulta",
    "training_phrases": [
        "¿Cómo me matriculo?",
        "Necesito información sobre matrícula",
        "Proceso de inscripción",
        "¿Cuándo son las matrículas?"
    ],
    "response": "Para matricularte, ingresa al campus virtual con tus credenciales UPT..."
}
```

#### **Desde DialogFlow Console:**
1. Ve a **Intents** → **Create Intent**
2. Nombre: `matricula.consulta`
3. **Training phrases**: Agregar frases de ejemplo
4. **Responses**: Configurar respuesta
5. **Save**

---

## 🤝 USO HÍBRIDO

El sistema está configurado para usar **DialogFlow primero** y **NLP local como fallback**:

### **Flujo de Procesamiento:**

```
Usuario envía mensaje
        ↓
    ¿DialogFlow disponible?
        ↓                ↓
       SÍ               NO
        ↓                ↓
   Procesar con     Procesar con
   DialogFlow        NLP Local
        ↓                ↓
   ¿Confianza > 70%?     ↓
        ↓                ↓
   SÍ    →    NO         ↓
   ↓          ↓          ↓
Devolver  Procesar con   ↓
respuesta  NLP Local     ↓
        ↓          ↓     ↓
        →  Devolver respuesta
```

### **Configuración del Comportamiento:**

```python
# En .env
USE_DIALOGFLOW=True              # Usar DialogFlow como primario
DIALOGFLOW_CONFIDENCE_THRESHOLD=0.7  # Umbral mínimo para DialogFlow

# En código
hybrid_service = HybridNLPService(
    dialogflow_service=dialogflow_service,
    nlp_engine=local_nlp_engine,
    use_dialogflow=True
)
```

---

## 🧪 TESTING Y VALIDACIÓN

### **PASO 1: Verificar Estado**

```bash
curl http://localhost:8001/api/v1/dialogflow/status
```

Respuesta esperada:
```json
{
    "available": true,
    "project_id": "upt-chat-system-nlp",
    "language_code": "es",
    "credentials_configured": true
}
```

### **PASO 2: Probar Detección de Intención**

```bash
curl -X POST http://localhost:8001/api/v1/dialogflow/detect-intent \
-H "Content-Type: application/json" \
-d '{
    "session_id": "test-session-123",
    "message": "¿Cómo puedo matricularme?"
}'
```

### **PASO 3: Probar Servicio Híbrido**

```bash
curl -X POST http://localhost:8001/api/v1/nlp/process-message \
-H "Content-Type: application/json" \
-d '{
    "session_id": "test-session-123",
    "message": "Necesito ayuda con la matrícula",
    "user_type": "student"
}'
```

### **PASO 4: Verificar Logs**

```bash
tail -f logs/nlp-service.log
```

Buscar líneas como:
```
✅ DialogFlow success: matricula.consulta (0.85)
⚠️ DialogFlow low confidence (0.60), trying local NLP...
❌ DialogFlow failed: <error>, trying local NLP...
```

---

## 🚀 DEPLOYMENT

### **Desarrollo Local:**

```bash
# Ejecutar servicio
python main.py

# Con auto-reload
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

### **Docker:**

```dockerfile
# El Dockerfile ya está configurado
docker build -t upt-nlp-service .
docker run -p 8001:8001 --env-file .env upt-nlp-service
```

### **Producción:**

```bash
# Configurar variables de producción
ENVIRONMENT=production
DEBUG=False
USE_DIALOGFLOW=True

# Usar gunicorn para producción
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

---

## ❗ TROUBLESHOOTING

### **Error: "DialogFlow service not configured"**

**Solución:**
```bash
# Verificar archivo de credenciales
ls -la credentials/dialogflow-credentials.json

# Verificar variables de entorno
echo $GOOGLE_PROJECT_ID
echo $GOOGLE_CREDENTIALS_PATH

# Verificar permisos del service account
gcloud iam service-accounts get-iam-policy dialogflow-service@upt-chat-system-nlp.iam.gserviceaccount.com
```

### **Error: "spaCy model not found"**

**Solución:**
```bash
python -m spacy download es_core_news_sm
python -c "import spacy; nlp = spacy.load('es_core_news_sm'); print('✅ Modelo cargado')"
```

### **Error: "google.cloud.dialogflow not found"**

**Solución:**
```bash
pip install google-cloud-dialogflow google-auth
```

### **DialogFlow devuelve baja confianza**

**Posibles causas:**
1. **Pocas frases de entrenamiento**: Agregar más ejemplos
2. **Intent muy genérico**: Crear intents más específicos
3. **Modelo no entrenado**: Ejecutar training

**Solución:**
```bash
# Entrenar agente
curl -X POST http://localhost:8001/api/v1/dialogflow/train

# Agregar más training phrases
curl -X POST http://localhost:8001/api/v1/dialogflow/intents \
-d '{"intent_name": "...", "training_phrases": [...], ...}'
```

### **Límites de Cuota Excedidos**

DialogFlow tiene límites gratuitos:
- **15,000 peticiones/mes** gratis
- **Después**: $0.002 por petición

**Solución:**
1. Configurar `USE_DIALOGFLOW=False` temporalmente
2. Optimizar uso con cache
3. Considerar plan de pago

---

## 📊 MÉTRICAS Y MONITOREO

### **Endpoints de Estado:**

```bash
# Estado general del servicio
GET /api/v1/nlp/health

# Estado específico de DialogFlow
GET /api/v1/dialogflow/status

# Listar intents creados
GET /api/v1/dialogflow/intents
```

### **Logs Importantes:**

```bash
# Filtrar logs de DialogFlow
grep "DialogFlow" logs/nlp-service.log

# Ver errores
grep "❌" logs/nlp-service.log

# Ver métricas de confianza
grep "confidence" logs/nlp-service.log
```

---

## 🎯 PRÓXIMOS PASOS

1. **✅ Configurar proyecto Google Cloud**
2. **✅ Instalar dependencias**
3. **✅ Crear credenciales**
4. **📋 Crear intents básicos UPT**
5. **🧪 Probar integración**
6. **🚀 Desplegar en desarrollo**
7. **📊 Monitorear métricas**
8. **🔄 Entrenar modelo con datos reales**

---

## 📞 SOPORTE

Si encuentras problemas:

1. **Revisar logs**: `tail -f logs/nlp-service.log`
2. **Verificar estado**: `GET /api/v1/dialogflow/status`
3. **Consultar documentación**: [DialogFlow Docs](https://cloud.google.com/dialogflow/docs)
4. **Contactar equipo**: Angel & Piero

---

**✅ Con esta guía, tendrás DialogFlow completamente integrado con el sistema UPT Chat System!**