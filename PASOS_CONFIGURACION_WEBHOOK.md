# 🔧 CONFIGURACIÓN PASO A PASO - DIALOGFLOW WEBHOOK

## ✅ CAMBIOS REALIZADOS EN EL CÓDIGO

### **Archivo Nuevo: `webhook_controller.py`**
✅ Creado en: `services/nlp-service/presentation/controllers/webhook_controller.py`

**Funcionalidad:**
- Endpoint `/webhook` que recibe requests de DialogFlow
- Maneja el intent "Contraseña Olvidada"
- Extrae el parámetro `email` del request
- Llama al API Gateway para verificar y procesar
- Retorna respuesta apropiada a DialogFlow

### **Archivo Modificado: `main.py`**
✅ Actualizado el archivo principal del NLP Service

**Cambios:**
- Importado `webhook_router`
- Registrado el router en la aplicación FastAPI
- Ahora el endpoint `/webhook` está disponible

---

## 📋 PASOS EN DIALOGFLOW (Console Web)

### **PASO 1: Configurar URL del Webhook Global**

1. En DialogFlow Console, ve al menú izquierdo
2. Click en **"Fulfillment"** (el ícono del rayo ⚡)
3. Activa el toggle **"Webhook"** (debe quedar en ENABLED / azul)
4. En el campo **"URL"**, ingresa:

   **Si es local (para desarrollo):**
   ```
   http://TU-IP-LOCAL:8001/webhook
   ```
   Ejemplo: `http://192.168.1.100:8001/webhook`

   **Si está en servidor:**
   ```
   https://tu-dominio.com/webhook
   ```

5. (Opcional) Si necesitas autenticación, configura **HEADERS** o **BASIC AUTH**
6. Click en **"SAVE"** al final de la página

---

### **PASO 2: Configurar el Intent "Contraseña Olvidada"**

#### **2.1 Training Phrases**
Asegúrate que tenga frases SIN emails:

```
✅ "Olvidé mi contraseña"
✅ "Resetear password"
✅ "Recuperar contraseña"
✅ "No puedo acceder"
✅ "Ayuda con mi contraseña"

❌ NO incluir: "Mi email es xxx@gmail.com"
```

#### **2.2 Action and Parameters**

En la sección **"Action and parameters"**:

| REQUIRED | PARAMETER NAME | ENTITY | VALUE | IS LIST |
|----------|----------------|--------|-------|---------|
| ☑ (Activado) | `email` | `@sys.email` | `$email` | ☐ |

**Prompts para "email":**
- "Por favor, proporciona tu correo personal registrado"
- "¿Cuál es tu email personal?"

#### **2.3 Fulfillment**

Al final del intent, en la sección **"Fulfillment"**:

```
☑ Enable webhook call for this intent
☐ Enable webhook call for slot filling
```

**IMPORTANTE:** Activa solo el primer checkbox.

#### **2.4 Guardar**
Click en **"SAVE"** (botón azul arriba a la derecha)

---

## 🧪 PRUEBAS EN DIALOGFLOW CONSOLE

### **Test 1: Activar Intent**
1. En DialogFlow Console, click en **"Try it now"** (panel derecho)
2. Escribe: `Olvidé mi contraseña`
3. **Resultado esperado:**
   ```
   Intent matched: Contraseña Olvidada
   DialogFlow responde: "Por favor, proporciona tu correo personal registrado"
   ```

### **Test 2: Proporcionar Email Válido**
1. Escribe: `juan.perez@gmail.com`
2. **Resultado esperado:**
   ```
   Intent: Contraseña Olvidada
   Parameter email: juan.perez@gmail.com
   DialogFlow llama al webhook
   Respuesta: "Perfecto, Juan Pérez García. He enviado un correo a..."
   ```

### **Test 3: Email No Existente**
1. Nueva conversación: `Olvidé mi contraseña`
2. Responde: `noexiste@gmail.com`
3. **Resultado esperado:**
   ```
   Respuesta: "Lo siento, el correo electrónico noexiste@gmail.com 
              no está registrado en nuestro sistema..."
   ```

### **Test 4: Email Sin Intent (NO debe activar)**
1. Nueva conversación
2. Escribe directamente: `Mi email es juan.perez@gmail.com`
3. **Resultado esperado:**
   ```
   Intent: Default Fallback (u otro)
   NO debe detectar "Contraseña Olvidada"
   Respuesta normal del chatbot
   ```

---

## 🚀 INICIAR SERVICIOS

### **Terminal 1: ProyectoTest PHP**
```bash
cd /home/desci/Documentos/constru/proyectotest
php -S localhost:8000
```

### **Terminal 2: API Gateway**
```bash
cd /home/desci/Documentos/constru/upt-chat-system/services/api-gateway
npm run start:dev
```

### **Terminal 3: NLP Service (con webhook)**
```bash
cd /home/desci/Documentos/constru/upt-chat-system/services/nlp-service
python main.py
```

**Verificar que diga:**
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8001
```

---

## 🔍 VERIFICAR WEBHOOK FUNCIONA

### **Test Local del Webhook**
```bash
curl -X POST http://localhost:8001/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "responseId": "test-123",
    "queryResult": {
      "queryText": "juan.perez@gmail.com",
      "intent": {
        "name": "projects/test/agent/intents/12345",
        "displayName": "Contraseña Olvidada"
      },
      "parameters": {
        "email": "juan.perez@gmail.com"
      },
      "allRequiredParamsPresent": true,
      "intentDetectionConfidence": 0.95,
      "languageCode": "es"
    },
    "session": "projects/test/agent/sessions/test-session-001"
  }' | jq
```

**Respuesta esperada:**
```json
{
  "fulfillmentText": "Perfecto, Juan Pérez García. He enviado un correo electrónico a juan.perez@gmail.com con las instrucciones para recuperar tu contraseña..."
}
```

### **Test Health del Webhook**
```bash
curl http://localhost:8001/webhook/health | jq
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "service": "nlp-service-webhook",
  "api_gateway_url": "http://localhost:3000"
}
```

---

## 🌐 EXPONER WEBHOOK A INTERNET (Para DialogFlow)

DialogFlow necesita acceder a tu webhook. Si estás desarrollando localmente, tienes 2 opciones:

### **Opción 1: ngrok (Recomendado para desarrollo)**

1. Instalar ngrok:
   ```bash
   # Descargar de https://ngrok.com/download
   # O con snap:
   sudo snap install ngrok
   ```

2. Exponer puerto 8001:
   ```bash
   ngrok http 8001
   ```

3. ngrok te dará una URL pública:
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:8001
   ```

4. En DialogFlow Fulfillment, usa:
   ```
   https://abc123.ngrok.io/webhook
   ```

### **Opción 2: Servidor con IP Pública**

Si tienes un servidor (DigitalOcean, AWS, etc.):

1. Asegúrate que el puerto 8001 esté abierto en el firewall
2. En DialogFlow Fulfillment, usa:
   ```
   http://TU-IP-PUBLICA:8001/webhook
   ```

---

## 📊 LOGS Y DEBUGGING

### **Ver logs del NLP Service en tiempo real:**
```bash
tail -f /home/desci/Documentos/constru/upt-chat-system/services/nlp-service/logs/*.log
```

### **Buscar logs de webhook:**
```bash
grep "webhook" /home/desci/Documentos/constru/upt-chat-system/services/nlp-service/logs/app.log
```

### **Verificar requests de DialogFlow:**
```bash
# En la terminal donde corre el NLP Service, verás:
INFO:     📨 Webhook recibido de DialogFlow
INFO:     🎯 Intent detectado: Contraseña Olvidada
INFO:     📋 Parámetros: {'email': 'juan.perez@gmail.com'}
INFO:     🔍 Verificando email personal: juan.perez@gmail.com
INFO:     ✅ Email encontrado - Usuario: 2020068376
INFO:     ✅ Proceso de recuperación iniciado exitosamente
```

---

## 🎯 FLUJO COMPLETO VISUAL

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO (Messenger/Web)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ "Olvidé mi contraseña"
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              DIALOGFLOW (Google Cloud)                      │
│  - Detecta intent: "Contraseña Olvidada"                   │
│  - Parámetros: {} (vacío, falta email)                     │
│  - Prompt: "¿Cuál es tu email personal?"                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ Usuario: "juan.perez@gmail.com"
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              DIALOGFLOW (captura parámetro)                 │
│  - Intent: "Contraseña Olvidada"                            │
│  - Parámetros: { email: "juan.perez@gmail.com" }           │
│  - allRequiredParamsPresent: true                           │
│  - Webhook call: ✅ ENABLED                                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ POST /webhook
                           │ {intent, parameters, session}
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         NLP SERVICE (FastAPI - Port 8001)                   │
│  /webhook                                                   │
│  - Recibe request de DialogFlow                             │
│  - Extrae intent y email                                    │
│  - Llama a handle_password_recovery()                       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ POST /api/v1/password-reset/verify-email
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         API GATEWAY (NestJS - Port 3000)                    │
│  - PasswordResetController                                  │
│  - PasswordResetService                                     │
│  - MySQLConnectionService                                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ POST /public/api_verify_email.php
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         PROYECTOTEST PHP (Port 8000)                        │
│  - Verifica email en MySQL                                  │
│  - Retorna datos del usuario                                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ {exists: true, usuario: "2020068376"}
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         NLP SERVICE                                         │
│  POST /api/v1/password-reset/initiate                       │
│  - Genera nueva contraseña                                  │
│  - Actualiza en BD                                          │
│  - Envía email                                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ {fulfillmentText: "Perfecto, Juan..."}
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              DIALOGFLOW                                     │
│  - Recibe respuesta del webhook                             │
│  - Envía fulfillmentText al usuario                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ "Perfecto, Juan Pérez García..."
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO                                  │
│  Recibe mensaje de confirmación                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ CHECKLIST FINAL

### En DialogFlow:
- [ ] Webhook global activado en Fulfillment
- [ ] URL del webhook configurada (`http://tu-ip:8001/webhook`)
- [ ] Intent "Contraseña Olvidada" creado
- [ ] Parámetro `email` configurado como REQUIRED
- [ ] Prompts para solicitar email agregados
- [ ] Checkbox "Enable webhook call for this intent" activado
- [ ] Intent guardado (botón SAVE)

### En el Código:
- [x] `webhook_controller.py` creado
- [x] Router registrado en `main.py`
- [x] API Gateway funcionando (port 3000)
- [x] ProyectoTest PHP funcionando (port 8000)

### Pruebas:
- [ ] Test en DialogFlow Console (Try it now)
- [ ] Test con curl al webhook local
- [ ] Test end-to-end con email válido
- [ ] Test con email inválido
- [ ] Verificar logs del NLP Service

---

## 📞 TROUBLESHOOTING

### **Problema: "Webhook call failed"**
**Solución:**
1. Verificar que el NLP Service esté corriendo: `curl http://localhost:8001/health`
2. Verificar que el webhook sea accesible: `curl http://localhost:8001/webhook/health`
3. Si es local, usar ngrok para exponer el puerto
4. Revisar logs: `tail -f logs/app.log`

### **Problema: "Email no encontrado" pero existe en BD**
**Solución:**
1. Verificar API Gateway: `curl -X POST http://localhost:3000/api/v1/password-reset/verify-email -H "Content-Type: application/json" -d '{"emailPersonal":"juan.perez@gmail.com"}'`
2. Verificar ProyectoTest PHP: `curl -X POST http://localhost:8000/public/api_verify_email.php -H "Content-Type: application/json" -d '{"email_personal":"juan.perez@gmail.com"}'`

### **Problema: DialogFlow no captura el parámetro email**
**Solución:**
1. Verificar que el parámetro esté marcado como REQUIRED
2. Verificar que los prompts estén configurados
3. Probar en "Try it now" para ver qué parámetros captura
4. Revisar los logs de diagnóstico de DialogFlow

---

**¿Listo para probarlo? Recuerda configurar el webhook URL en DialogFlow Fulfillment!**
